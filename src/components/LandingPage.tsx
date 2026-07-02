import React, { useEffect, useState } from "react";
import { PageType } from "../types";
import { Trophy, Coins, Sparkles, Flame, UserCheck, ShieldCheck, ArrowRight, Star } from "lucide-react";

interface LandingPageProps {
  setCurrentPage: (page: PageType) => void;
  currentUser: any;
}

export default function LandingPage({ setCurrentPage, currentUser }: LandingPageProps) {
  const [tickerIndex, setTickerIndex] = useState(0);

  const winners = [
    { name: "John D.", prize: "$100.00 CASH", time: "2 mins ago", icon: "🏆", color: "text-amber-400" },
    { name: "Melissa P.", prize: "500 COINS", time: "5 mins ago", icon: "🪙", color: "text-cyan-400" },
    { name: "Alex K.", prize: "$1.00 CASH", time: "8 mins ago", icon: "💵", color: "text-emerald-400" },
    { name: "Rizky F.", prize: "100 COINS", time: "11 mins ago", icon: "🪙", color: "text-blue-400" },
    { name: "Sarah L.", prize: "500 COINS", time: "15 mins ago", icon: "🪙", color: "text-purple-400" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % winners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCtaClick = () => {
    if (currentUser) {
      setCurrentPage("DASHBOARD");
    } else {
      setCurrentPage("REGISTER");
    }
  };

  return (
    <div className="w-full text-white">
      
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center pt-20 pb-16 px-4 text-center max-w-5xl mx-auto overflow-hidden">
        
        {/* Decorative ambient glowing grids */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 -translate-y-1/2 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Dynamic Winner Ticker */}
        <div className="inline-flex items-center gap-2 bg-purple-950/40 border border-purple-500/30 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold backdrop-blur-md animate-bounce">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
          </span>
          <span className="text-purple-300 font-mono text-[11px] tracking-wide">
            LIVE WINNER: <span className="text-white font-extrabold">{winners[tickerIndex].name}</span> just won{" "}
            <span className={`${winners[tickerIndex].color} font-black`}>
              {winners[tickerIndex].prize} {winners[tickerIndex].icon}
            </span>{" "}
            ({winners[tickerIndex].time})
          </span>
        </div>

        {/* Big Catchy Heading */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] mb-6 font-sans">
          SPIN & WIN INSTANT{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">
            EPIC REWARDS
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8">
          Welcome to <span className="text-purple-400 font-bold">Game Vault</span>. Take your daily free spin and win guaranteed virtual prizes like high-value coins, cash tokens, or unlock luxury gift cards. 100% fair, transparent, and built for ultimate gaming fans!
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <button
            onClick={handleCtaClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-black tracking-wider uppercase bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:via-pink-500 hover:to-amber-400 text-white shadow-[0_0_30px_rgba(219,39,119,0.5)] hover:shadow-[0_0_40px_rgba(219,39,119,0.7)] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 animate-spin" />
            Spin the Wheel Free
            <ArrowRight className="w-4 h-4" />
          </button>
          
          {!currentUser && (
            <button
              onClick={() => setCurrentPage("LOGIN")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
            >
              Sign In to Account
            </button>
          )}
        </div>

        {/* Quick Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-12 text-zinc-500 text-xs font-mono">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Fair Odds Verified</span>
          </div>
          <div className="flex items-center gap-1">
            <UserCheck className="w-4 h-4 text-purple-500" />
            <span>18+ US Promotion Only</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-500" />
            <span>4.9 Support Score</span>
          </div>
        </div>

      </section>

      {/* Showcase of Top Prizes on the Wheel */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Available Rewards on the Wheel
          </h2>
          <p className="text-xs text-zinc-500 mt-2">
            No entry fees required. Every spin is authenticated with state-of-the-art secure randomizers.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card $100 Cash */}
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/20 shadow-lg text-center relative overflow-hidden group hover:border-amber-400 transition-all hover:-translate-y-1">
            <div className="absolute top-0 right-0 bg-amber-500/10 text-amber-300 font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-bl-lg">
              Grand Prize
            </div>
            <div className="w-12 h-12 bg-amber-500/15 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl border border-amber-500/30">
              🏆
            </div>
            <h3 className="text-lg font-black text-amber-300">$100.00 CASH</h3>
            <p className="text-[11px] text-zinc-500 mt-2">The ultimate vault payout! Direct transfer tokens redeemable instantly.</p>
          </div>

          {/* Card 500 Coins */}
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-purple-500/20 shadow-lg text-center relative overflow-hidden group hover:border-purple-400 transition-all hover:-translate-y-1">
            <div className="absolute top-0 right-0 bg-purple-500/10 text-purple-300 font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-bl-lg">
              Epic
            </div>
            <div className="w-12 h-12 bg-purple-500/15 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl border border-purple-500/30">
              🪙
            </div>
            <h3 className="text-lg font-black text-purple-300">500 COINS</h3>
            <p className="text-[11px] text-zinc-500 mt-2">Huge score! Multiply your wallet holdings to trade for gift cards.</p>
          </div>

          {/* Card $1 Cash */}
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-emerald-500/20 shadow-lg text-center relative overflow-hidden group hover:border-emerald-400 transition-all hover:-translate-y-1">
            <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-300 font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-bl-lg">
              Rare
            </div>
            <div className="w-12 h-12 bg-emerald-500/15 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl border border-emerald-500/30">
              💵
            </div>
            <h3 className="text-lg font-black text-emerald-300">$1.00 CASH</h3>
            <p className="text-[11px] text-zinc-500 mt-2">Cold-hard credit applied immediately to your active USD balance.</p>
          </div>

          {/* Card 100 Coins */}
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-cyan-500/20 shadow-lg text-center relative overflow-hidden group hover:border-cyan-400 transition-all hover:-translate-y-1">
            <div className="absolute top-0 right-0 bg-cyan-500/10 text-cyan-300 font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-bl-lg">
              Common
            </div>
            <div className="w-12 h-12 bg-cyan-500/15 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl border border-cyan-500/30">
              🪙
            </div>
            <h3 className="text-lg font-black text-cyan-300">100 COINS</h3>
            <p className="text-[11px] text-zinc-500 mt-2">Solid multiplier! Boost your coin balance and climb up the player ranks.</p>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-zinc-950/60 border-y border-zinc-900 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">How to Claim Your Rewards</h2>
            <p className="text-sm text-zinc-400 mt-2 max-w-xl mx-auto">
              Follow these simple, transparent steps to spin the wheel of fortune and redeem coins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex gap-4 items-start p-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-black text-white text-sm shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                1
              </div>
              <div>
                <h3 className="text-md font-bold text-white uppercase tracking-wide">Register Account</h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Fill in your registration details in 10 seconds. No credit card or deposit is ever required. Unlocks 1 Free Daily Spin instantly.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 items-start p-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-black text-white text-sm shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                2
              </div>
              <div>
                <h3 className="text-md font-bold text-white uppercase tracking-wide">Spin the Neon Wheel</h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Trigger the wheel with a single click. The secure server computes the result based on strict transparent odds, sending you a certified win.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 items-start p-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-black text-white text-sm shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                3
              </div>
              <div>
                <h3 className="text-md font-bold text-white uppercase tracking-wide">Instant Claim Wallet</h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Your coins and cash will be immediately deposited into your player vault. Convert coins to high-value gift cards or cash-out easily.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic F.A.Q Section */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Frequently Asked Questions</h2>
          <p className="text-xs text-zinc-500 mt-2">Have questions? We have clear and fast answers for you.</p>
        </div>

        <div className="space-y-4">
          <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-xl">
            <h4 className="text-sm font-bold text-purple-300">Is this game completely free?</h4>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Yes, 100% free! This is an entertainment reward promotional platform. We never ask for any deposits or payment details. You earn free daily spins and bonus coins simply by logging into your account.
            </p>
          </div>
          
          <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-xl">
            <h4 className="text-sm font-bold text-purple-300">How are the spin results calculated?</h4>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Every spin result is computed using an secure randomizer algorithm on the server side (Server-Side Logic) to guarantee complete fairness. The winning odds are programmed transparently and are fully certified.
            </p>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-xl">
            <h4 className="text-sm font-bold text-purple-300">How do I redeem my coins?</h4>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              The coins you accumulate can be redeemed on the "Claim Prizes" tab in your dashboard. You can trade your virtual coins for digital Amazon/Steam gift cards or withdraw cash directly to your PayPal account.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
