import React, { useState, useEffect, useRef } from "react";
import { Coins, Trophy, Bomb, Frown, DollarSign, Play, Volume2, VolumeX } from "lucide-react";
import { gameAudio } from "../utils/audio";

interface Prize {
  id: string;
  type: "bomb" | "zonk" | "coins" | "cash";
  value: number;
  label: string;
  icon: string;
  color: string;
  index: number;
}

interface SpinWheelProps {
  onSpinStart: () => Promise<{ prizeIndex: number; success: boolean }>;
  onSpinComplete: (prizeIndex: number) => void;
  isSpinning: boolean;
  setIsSpinning: (state: boolean) => void;
  freeSpinAvailable: boolean;
}

const PRIZES_LIST = [
  { label: "$0.5 CASH", icon: "💵", color: "from-teal-600 to-teal-950", border: "border-teal-500", text: "text-teal-200" },
  { label: "500 COINS", icon: "🪙", color: "from-cyan-600 to-cyan-950", border: "border-cyan-500", text: "text-cyan-200" },
  { label: "ZONK", icon: "💨", color: "from-slate-600 to-slate-900", border: "border-slate-500", text: "text-slate-200" },
  { label: "$1 CASH", icon: "💵", color: "from-emerald-600 to-emerald-950", border: "border-emerald-500", text: "text-emerald-200" },
  { label: "$5 CASH", icon: "💵", color: "from-indigo-600 to-indigo-950", border: "border-indigo-500", text: "text-indigo-200" },
  { label: "100 COINS", icon: "🪙", color: "from-blue-600 to-blue-950", border: "border-blue-500", text: "text-blue-200" },
  { label: "$10 CASH", icon: "💵", color: "from-purple-600 to-purple-950", border: "border-purple-500", text: "text-purple-200" },
  { label: "$100 CASH", icon: "🏆", color: "from-amber-500 to-amber-950", border: "border-amber-400", text: "text-amber-100" },
  { label: "10 COINS", icon: "🪙", color: "from-blue-500 to-blue-900", border: "border-blue-400", text: "text-blue-100" },
  { label: "20 COINS", icon: "🪙", color: "from-indigo-500 to-indigo-900", border: "border-indigo-400", text: "text-indigo-100" },
  { label: "50 COINS", icon: "🪙", color: "from-purple-500 to-purple-900", border: "border-purple-400", text: "text-purple-100" },
  { label: "200 COINS", icon: "🪙", color: "from-pink-500 to-pink-900", border: "border-pink-400", text: "text-pink-100" },
];

export default function SpinWheel({
  onSpinStart,
  onSpinComplete,
  isSpinning,
  setIsSpinning,
  freeSpinAvailable,
}: SpinWheelProps) {
  const [rotation, setRotation] = useState<number>(0);
  const [indicatorActive, setIndicatorActive] = useState<boolean>(false);
  const [showInternalError, setShowInternalError] = useState<string | null>(null);
  const [isMuted, setIsMutedState] = useState<boolean>(gameAudio.getMuteState());
  
  const currentAngleRef = useRef<number>(0);
  const lastBoundaryRef = useRef<number>(0);

  // Math utility for drawing perfect SVG Pie Wedges
  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const handleMuteToggle = () => {
    const nextMute = gameAudio.toggleMute();
    setIsMutedState(nextMute);
  };

  const handleSpinClick = async () => {
    if (isSpinning) return;
    setShowInternalError(null);

    // Warm up the Audio Context for compliant browser audio playing
    gameAudio.init();

    setIsSpinning(true);

    try {
      const response = await onSpinStart();
      if (!response || !response.success) {
        setIsSpinning(false);
        setShowInternalError("Failed to initiate the spin. Please try again in a moment.");
        return;
      }

      const winIndex = response.prizeIndex;

      // Animate rotation using requestAnimationFrame for super smooth physical decay
      const numRotations = 8 + Math.floor(Math.random() * 4); // 8-11 complete spins
      // Formula to align the pointer at the top (270 degrees) to the won segment:
      // Segment size is dynamic. Center of segment is (winIndex * segmentSize) + halfSegment
      // Clockwise rotation R satisfies: 270 - R = CenterAngle -> R = 270 - CenterAngle
      const segmentSize = 360 / PRIZES_LIST.length;
      const halfSegment = segmentSize / 2;
      const baseTargetAngle = 270 - (winIndex * segmentSize + halfSegment);
      const finalTargetRotation = numRotations * 360 + baseTargetAngle;

      const duration = 5500; // 5.5 seconds spin
      const startTime = performance.now();
      const startRotation = currentAngleRef.current % 360;

      const animateWheel = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        if (elapsed < duration) {
          // Easing function: Cubic easeOut for elegant momentum reduction
          const progress = elapsed / duration;
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentRotation = startRotation + (finalTargetRotation - startRotation) * easeOut;
          
          setRotation(currentRotation);
          currentAngleRef.current = currentRotation;

          // Detect tick boundaries to trigger physical vibration feedback
          const boundaryCheck = Math.floor((currentRotation + halfSegment) / segmentSize);
          if (boundaryCheck !== lastBoundaryRef.current) {
            lastBoundaryRef.current = boundaryCheck;
            setIndicatorActive(true);
            gameAudio.playTick();
            setTimeout(() => setIndicatorActive(false), 80);
          }

          requestAnimationFrame(animateWheel);
        } else {
          // Finished spinning
          setRotation(finalTargetRotation);
          currentAngleRef.current = finalTargetRotation;
          setIsSpinning(false);

          // Audio chime based on the exact prize result
          const finalPrize = PRIZES_LIST[winIndex];
          if (finalPrize.label === "BOMB!" || finalPrize.label === "ZONK") {
            gameAudio.playZonk();
          } else {
            gameAudio.playWin();
          }

          onSpinComplete(winIndex);
        }
      };

      requestAnimationFrame(animateWheel);
    } catch (err) {
      console.error(err);
      setIsSpinning(false);
      setShowInternalError("Network connection error. Please try again.");
    }
  };

  // Neon Light Bulbs decoration on outer circle (percent-based and responsive)
  const renderLedBulbs = () => {
    return [...Array(24)].map((_, i) => {
      const angleRad = (i * 15 * Math.PI) / 180;
      // Position bulbs at 47.8% from the center
      const x = 50 + 47.8 * Math.cos(angleRad);
      const y = 50 + 47.8 * Math.sin(angleRad);
      
      const isLit = isSpinning 
        ? (i % 3 === Math.floor(rotation / 12) % 3)
        : freeSpinAvailable;

      // Premium casino neon colors: Gold, Coral Pink, Cyan
      const colors = ["#F59E0B", "#EC4899", "#06B6D4"];
      const bulbColor = isLit 
        ? colors[i % 3] 
        : "#27272A"; // dark gray when inactive

      const glowShadow = isLit 
        ? `0 0 10px ${colors[i % 3]}, 0 0 3px ${colors[i % 3]}` 
        : "none";

      return (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            backgroundColor: bulbColor,
            boxShadow: glowShadow,
            border: "1px solid rgba(0,0,0,0.5)"
          }}
        />
      );
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-2">
      {/* Visual Ticker Indicator Pointer at Top */}
      <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
        
        {/* Glowing Halo Backdrop */}
        <div className={`absolute inset-0 rounded-full transition-all duration-1000 ${
          isSpinning 
            ? "bg-purple-600/35 blur-3xl scale-110" 
            : freeSpinAvailable 
              ? "bg-emerald-500/20 blur-2xl scale-100 animate-pulse" 
              : "bg-slate-700/5 blur-xl"
        }`} />

        {/* Outer Steel/Neon Rim */}
        <div className={`relative w-full h-full rounded-full border-8 bg-zinc-950 p-2.5 shadow-[0_0_50px_rgba(139,92,246,0.35)] transition-all duration-300 ${
          isSpinning ? "border-purple-500" : freeSpinAvailable ? "border-emerald-500" : "border-zinc-800"
        }`}>
          
          {/* Neon Light Bulbs decoration */}
          <div className="absolute inset-0 rounded-full pointer-events-none">
            {renderLedBulbs()}
          </div>

          {/* Rotating Wheel Container */}
          <div
            className="w-full h-full rounded-full overflow-hidden relative select-none cursor-default border-2 border-black/80"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? "none" : "transform 0.1s ease-out",
            }}
          >
            {/* SVG segment wheels */}
            <svg viewBox="0 0 500 500" className="w-full h-full">
              {PRIZES_LIST.map((prize, i) => {
                const segmentSize = 360 / PRIZES_LIST.length;
                const angleStart = i * segmentSize;
                const angleEnd = (i + 1) * segmentSize;
                const radStart = (angleStart * Math.PI) / 180;
                const radEnd = (angleEnd * Math.PI) / 180;

                const cx = 250;
                const cy = 250;
                const r = 244; // outer radius of the color slices
                
                const x1 = cx + r * Math.cos(radStart);
                const y1 = cy + r * Math.sin(radStart);
                const x2 = cx + r * Math.cos(radEnd);
                const y2 = cy + r * Math.sin(radEnd);

                const pathData = [
                  `M ${cx} ${cy}`,
                  `L ${x1} ${y1}`,
                  `A ${r} ${r} 0 0 1 ${x2} ${y2}`,
                  `Z`
                ].join(" ");

                // Vibrant, high-end casino colors for each prize wedge
                const PRIZE_COLORS = [
                  "#0D9488", // $0.5 CASH (Teal)
                  "#06B6D4", // 500 COINS (Cyan)
                  "#475569", // ZONK (Slate)
                  "#10B981", // $1 CASH (Emerald)
                  "#4F46E5", // $5 CASH (Indigo)
                  "#2563EB", // 100 COINS (Blue)
                  "#9333EA", // $10 CASH (Purple)
                  "#D97706", // $100 CASH (Amber)
                  "#3B82F6", // 10 COINS (Blue)
                  "#6366F1", // 20 COINS (Indigo)
                  "#8B5CF6", // 50 COINS (Purple)
                  "#EC4899", // 200 COINS (Pink)
                ];

                const fillCol = PRIZE_COLORS[i % PRIZE_COLORS.length];
                const angleCenter = i * segmentSize + (segmentSize / 2);

                return (
                  <g key={i}>
                    {/* Segment wedge path */}
                    <path
                      d={pathData}
                      fill={fillCol}
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      strokeOpacity="0.45"
                    />

                    {/* Mathematically aligned labels inside SVG. Centers text and rotates 90 degrees */}
                    <g transform={`rotate(${angleCenter} 250 250) translate(368, 250) rotate(90)`}>
                      
                      {/* Icon */}
                      <text
                        x="0"
                        y="-10"
                        textAnchor="middle"
                        fontSize="22"
                        className="select-none pointer-events-none"
                        style={{
                          filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.95))",
                        }}
                      >
                        {prize.icon}
                      </text>

                      {/* Label text */}
                      <text
                        x="0"
                        y="14"
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="900"
                        fontFamily="'Inter', system-ui, sans-serif"
                        fill="#FFFFFF"
                        className="select-none pointer-events-none tracking-wider uppercase"
                        style={{
                          filter: "drop-shadow(0px 2px 3px rgba(0,0,0,1)) drop-shadow(0px 4px 6px rgba(0,0,0,1))",
                        }}
                      >
                        {prize.label}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Concentric Wireframe Accents for Luxurious Metallic Finish */}
              <circle cx="250" cy="250" r="236" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.12" />
              <circle cx="250" cy="250" r="175" fill="none" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.08" />
              <circle cx="250" cy="250" r="110" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.05" />
            </svg>

          </div>

          {/* Center Vault Logo Hub / Click Button */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <button
              onClick={handleSpinClick}
              disabled={isSpinning}
              className={`w-22 h-22 sm:w-24 sm:h-24 rounded-full border-4 flex flex-col items-center justify-center font-bold tracking-wider select-none shadow-[0_0_25px_rgba(0,0,0,0.85)] transition-all duration-300 group ${
                isSpinning
                  ? "bg-zinc-800 border-zinc-700 text-zinc-500 scale-95 cursor-not-allowed"
                  : freeSpinAvailable
                    ? "bg-gradient-to-br from-emerald-500 to-teal-700 hover:from-emerald-400 hover:to-teal-600 border-emerald-300 text-white hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_30px_rgba(16,185,129,0.55)]"
                    : "bg-gradient-to-br from-purple-600 to-indigo-800 hover:from-purple-500 hover:to-indigo-700 border-purple-400 text-white hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_30px_rgba(139,92,246,0.55)]"
              }`}
            >
              <Play className={`w-6 h-6 mb-0.5 fill-current transition-transform duration-300 group-hover:scale-110 ${isSpinning ? "animate-ping" : ""}`} />
              <span className="text-[11px] font-black uppercase tracking-widest leading-none">SPIN</span>
            </button>
          </div>

        </div>

        {/* Physical Mechanical Pointer at the top (stationary pointer pointing down) */}
        <div
          className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20 transition-transform duration-70 ${
            indicatorActive ? "scale-y-75 translate-y-0.5 rotate-12" : "scale-y-100"
          }`}
        >
          <div className="w-6 h-8 bg-gradient-to-b from-purple-500 via-pink-500 to-white clip-pointer shadow-lg filter drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)] border-t border-purple-400" 
               style={{
                 clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)"
               }}
          />
          {/* Pointer Hub Dot */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-white border border-purple-500 shadow-sm" />
        </div>

      </div>

      {showInternalError && (
        <div className="mt-4 p-2 rounded-lg bg-red-900/40 border border-red-500/50 text-red-200 text-xs text-center font-medium max-w-[300px]">
          {showInternalError}
        </div>
      )}

      {/* Sound Toggle */}
      <button
        onClick={handleMuteToggle}
        className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-[10px] font-mono tracking-wider transition-all duration-200"
      >
        {isMuted ? (
          <>
            <VolumeX className="w-3.5 h-3.5 text-red-400" />
            <span>SOUND: MUTED</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>SOUND: ACTIVE</span>
          </>
        )}
      </button>

      {/* Helper Odds info displayed transparently */}
      <div className="mt-3 text-center">
        <p className="text-[11px] text-zinc-500 font-mono tracking-wider uppercase">
          🎡 Server Verified • Real-Time Odds Active
        </p>
      </div>
    </div>
  );
}
