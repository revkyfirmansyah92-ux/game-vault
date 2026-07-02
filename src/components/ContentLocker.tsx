import { useState, useEffect, useRef } from "react";
import { Lock, X } from "lucide-react";

interface ContentLockerProps {
  rewardText: string;
  onUnlock: () => void;
  show: boolean;
}

export default function ContentLocker({ rewardText, onUnlock, show }: ContentLockerProps) {
  const [dismissed, setDismissed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (!show || dismissed || scriptLoaded.current) return;

    // Load OGAds script dynamically
    const script = document.createElement("script");
    script.src = "https://appsave.space/cl/i/pqr454";
    script.async = true;
    script.onload = () => {
      scriptLoaded.current = true;
    };
    document.body.appendChild(script);

    // Poll for locker completion (OGAds removes elements when done)
    const interval = setInterval(() => {
      // Check if user completed the offer
      const ogElements = document.querySelectorAll('[id*="og_"], [class*="og-"], [class*="content-locker"]');
      if (ogElements.length === 0 && scriptLoaded.current) {
        // OGAds removed = completed
        clearInterval(interval);
        onUnlock();
      }
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [show, dismissed, onUnlock]);

  if (!show || dismissed) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative w-full max-w-md mx-auto">
        <div className="bg-zinc-950/95 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 shadow-[0_0_60px_rgba(139,92,246,0.2)]">
          {/* Close button */}
          <button
            onClick={() => {
              setDismissed(true);
              onUnlock(); // Unlock anyway on close
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center">
            {/* Icon */}
            <div className="inline-flex p-4 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.4)] mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">
              🎰 Unlock Your Reward!
            </h2>

            {/* Description */}
            <p className="text-sm text-zinc-400 mb-3">
              Complete <span className="text-purple-400 font-bold">ONE quick offer</span> below to unlock:
            </p>

            {/* Reward Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-xl mb-4">
              <span className="text-green-300 font-bold text-sm">{rewardText}</span>
            </div>

            {/* OGAds Locker Container */}
            <div ref={containerRef} id="og-locker-container" className="min-h-[180px] mb-4 rounded-xl overflow-hidden" />

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-600">
              <span>🔒 Secure</span>
              <span>•</span>
              <span>✅ Verified Offers</span>
              <span>•</span>
              <span>⚡ Instant Unlock</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
