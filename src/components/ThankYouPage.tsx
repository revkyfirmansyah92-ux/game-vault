import React, { useState } from "react";
import { PageType, User } from "../types";
import { Sparkles, Trophy, Gift, ArrowRight, Coins, Lock } from "lucide-react";
import ContentLocker from "./ContentLocker";

interface ThankYouPageProps {
  setCurrentPage: (page: PageType) => void;
  currentUser: User | null;
}

export default function ThankYouPage({ setCurrentPage, currentUser }: ThankYouPageProps) {
  const [showLocker, setShowLocker] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="w-full max-w-lg mx-auto my-12 px-4 z-10 text-center">
      
      {/* Content Locker - only shows when user clicks */}
      <ContentLocker
        show={showLocker && !unlocked}
        rewardText="100 Coins + 10 Free Spins"
        onUnlock={() => { setUnlocked(true); setShowLocker(false); }}
      />
      
      {/* Animated Greeting Container */}
      <div className="bg-zinc-950/70 backdrop-blur-xl border border-purple-500/20 p-8 sm:p-10 rounded-3xl shadow-[0_0_50px_rgba(139,92,246,0.25)] relative overflow-hidden">
        
        {/* Colorful backdrop flashes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          
          {/* Animated Ribbon Logo */}
          <div className="relative w-20 h-20 bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(219,39,119,0.5)] mb-6 animate-bounce">
            <Gift className="w-10 h-10 text-white animate-pulse" />
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-300 animate-spin" style={{ animationDuration: "3s" }} />
          </div>

          <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2 leading-none">
            Welcome to the Vault!
          </h1>
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 uppercase tracking-widest font-mono text-xs mb-6">
            Vault Account Activated Successfully
          </h2>

          <p className="text-sm text-zinc-300 max-w-sm mb-8 leading-relaxed">
            Thank you for registering at <span className="text-purple-400 font-bold">Game Vault</span>, {currentUser?.username || "Player"}! As our appreciation, a special welcome package has been credited to your Player Vault:
          </p>

          {/* Reward Badges Grid */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-8">
            
            {/* Coins Bonus */}
            <div className="bg-zinc-900/60 border border-zinc-850 p-4 rounded-2xl flex flex-col items-center justify-center">
              <Coins className="w-8 h-8 text-cyan-400 animate-bounce mb-2" style={{ animationDuration: "2.5s" }} />
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Welcome Bonus</span>
              <span className="text-lg font-black text-white font-mono mt-0.5">100 Coins</span>
            </div>

            {/* Free Spin Bonus */}
            <div className="bg-zinc-900/60 border border-zinc-850 p-4 rounded-2xl flex flex-col items-center justify-center">
              <Trophy className="w-8 h-8 text-amber-400 animate-pulse mb-2" />
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Daily Token</span>
              <span className="text-lg font-black text-white mt-0.5">10 Free Spins</span>
            </div>

          </div>

          <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-2xl mb-4 max-w-xs w-full">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              Ready to Spin Now!
            </span>
          </div>

          {/* Unlock Bonus Button */}
          {!unlocked && (
            <button
              onClick={() => setShowLocker(true)}
              className="w-full py-3 mb-3 rounded-xl text-xs font-black uppercase tracking-widest bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              Unlock Bonus Reward
            </button>
          )}

          {unlocked && (
            <div className="w-full py-3 mb-3 rounded-xl text-xs font-black uppercase tracking-widest bg-green-500/20 border border-green-500/30 text-green-400 flex items-center justify-center gap-2">
              ✅ Bonus Unlocked!
            </div>
          )}

          <button
            onClick={() => setCurrentPage("DASHBOARD")}
            className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:via-pink-500 hover:to-amber-400 text-white shadow-[0_0_25px_rgba(219,39,119,0.4)] hover:shadow-[0_0_35px_rgba(219,39,119,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-105 active:scale-95"
          >
            Go to Dashboard & Spin
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
}
