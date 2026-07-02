import React, { useState, useEffect } from "react";
import { PageType, User } from "../types";
import { Sparkles, Trophy, Gift, ArrowRight, Coins, ExternalLink } from "lucide-react";

interface ThankYouPageProps {
  setCurrentPage: (page: PageType) => void;
  currentUser: User | null;
}

const OGADS_LINK = "https://appsave.space/cl/i/pqr454";

export default function ThankYouPage({ setCurrentPage, currentUser }: ThankYouPageProps) {
  const [offerCompleted, setOfferCompleted] = useState(false);

  // Check if user returned from OGAds (via URL param)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("og_unlocked") === "1") {
      setOfferCompleted(true);
      localStorage.setItem("gv_offer_done", "1");
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
    }
    // Check localStorage
    if (localStorage.getItem("gv_offer_done") === "1") {
      setOfferCompleted(true);
    }
  }, []);

  const handleUnlockClick = () => {
    // Save current page so OGAds can redirect back
    localStorage.setItem("gv_return_page", "THANK_YOU");
    // Redirect to OGAds
    window.location.href = OGADS_LINK;
  };

  return (
    <div className="w-full max-w-lg mx-auto my-12 px-4 z-10 text-center">
      
      <div className="bg-zinc-950/70 backdrop-blur-xl border border-purple-500/20 p-8 sm:p-10 rounded-3xl shadow-[0_0_50px_rgba(139,92,246,0.25)] relative overflow-hidden">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          
          <div className="relative w-20 h-20 bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(219,39,119,0.5)] mb-6 animate-bounce">
            <Gift className="w-10 h-10 text-white animate-pulse" />
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-300 animate-spin" style={{ animationDuration: "3s" }} />
          </div>

          <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2 leading-none">
            Welcome to the Vault!
          </h1>
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 uppercase tracking-widest font-mono text-xs mb-6">
            Account Activated Successfully
          </h2>

          <p className="text-sm text-zinc-300 max-w-sm mb-8 leading-relaxed">
            Thank you for registering, <span className="text-purple-400 font-bold">{currentUser?.username || "Player"}</span>! Your welcome package has been credited:
          </p>

          {/* Reward Badges */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-8">
            <div className="bg-zinc-900/60 border border-zinc-850 p-4 rounded-2xl flex flex-col items-center justify-center">
              <Coins className="w-8 h-8 text-cyan-400 animate-bounce mb-2" style={{ animationDuration: "2.5s" }} />
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Welcome Bonus</span>
              <span className="text-lg font-black text-white font-mono mt-0.5">100 Coins</span>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-850 p-4 rounded-2xl flex flex-col items-center justify-center">
              <Trophy className="w-8 h-8 text-amber-400 animate-pulse mb-2" />
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Free Spins</span>
              <span className="text-lg font-black text-white mt-0.5">10 Spins</span>
            </div>
          </div>

          {/* CTA - Redirect to OGAds */}
          {!offerCompleted ? (
            <button
              onClick={handleUnlockClick}
              className="w-full py-4 mb-3 rounded-xl text-sm font-black uppercase tracking-widest bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:via-orange-400 hover:to-red-400 text-white shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-105 active:scale-95 animate-pulse"
            >
              <ExternalLink className="w-5 h-5" />
              🔓 CLAIM YOUR BONUS NOW
            </button>
          ) : (
            <div className="w-full py-4 mb-3 rounded-xl text-sm font-black uppercase tracking-widest bg-green-500/20 border border-green-500/30 text-green-400 flex items-center justify-center gap-2">
              ✅ Bonus Claimed Successfully!
            </div>
          )}

          <p className="text-[10px] text-zinc-600 mb-4">
            Complete a quick offer to verify your account & unlock bonus rewards
          </p>

          <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-2xl mb-6 max-w-xs w-full">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              Ready to Spin Now!
            </span>
          </div>

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
