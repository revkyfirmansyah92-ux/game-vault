import React, { useState, useEffect } from "react";
import { PageType, User, Prize, SpinResult } from "../types";
import SpinWheel from "./SpinWheel";
import ContentLocker from "./ContentLocker";
import { 
  Coins, Trophy, Share2, Sparkles, User as UserIcon, Lock, Mail, 
  HelpCircle, Calendar, RefreshCw, Flame, ExternalLink, CheckCircle2, 
  Wallet, AlertTriangle, ArrowRight, Clipboard, Trash2
} from "lucide-react";

interface DashboardPageProps {
  currentUser: User | null;
  onUpdateUser: (updatedUser: User) => void;
  setCurrentPage: (page: PageType) => void;
  triggerConfetti: () => void;
}

const PRIZES: Prize[] = [
  { id: "bomb_1", type: "bomb", value: 0, label: "BOMB!", icon: "💣", color: "#EF4444", index: 0 },
  { id: "coins_50", type: "coins", value: 50, label: "50 COINS", icon: "🪙", color: "#06B6D4", index: 1 },
  { id: "zonk_1", type: "zonk", value: 0, label: "ZONK", icon: "💨", color: "#64748B", index: 2 },
  { id: "cash_1", type: "cash", value: 1, label: "$1 CASH", icon: "💵", color: "#10B981", index: 3 },
  { id: "bomb_2", type: "bomb", value: 0, label: "BOMB!", icon: "💣", color: "#DC2626", index: 4 },
  { id: "coins_100", type: "coins", value: 100, label: "100 COINS", icon: "🪙", color: "#3B82F6", index: 5 },
  { id: "coins_200", type: "coins", value: 200, label: "200 COINS", icon: "🪙", color: "#8B5CF6", index: 6 },
  { id: "cash_100", type: "cash", value: 100, label: "$100 CASH!", icon: "🏆", color: "#F59E0B", index: 7 },
];

export default function DashboardPage({
  currentUser,
  onUpdateUser,
  setCurrentPage,
  triggerConfetti,
}: DashboardPageProps) {
  if (!currentUser) return null;

  // Spin States
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeTab, setActiveTab] = useState<"SPIN" | "ACCOUNT" | "WALLET" | "HISTORY">("SPIN");
  
  // Results Display
  const [spinCompleted, setSpinCompleted] = useState(false);
  const [showSpinLocker, setShowSpinLocker] = useState(false);
  const [spinUnlocked, setSpinUnlocked] = useState(false);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [pendingUpdatedUser, setPendingUpdatedUser] = useState<User | null>(null);

  // Profile Edit fields
  const [editEmail, setEditEmail] = useState(currentUser.email);
  const [editPassword, setEditPassword] = useState("••••••••");
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Invite Copier Alert
  const [showInviteAlert, setShowInviteAlert] = useState(false);

  // Wallet Cashout states
  const [cashoutAmount, setCashoutAmount] = useState("");
  const [cashoutEmail, setCashoutEmail] = useState("");
  const [cashoutMethod, setCashoutMethod] = useState("PAYPAL");
  const [cashoutSuccess, setCashoutSuccess] = useState<string | null>(null);
  const [cashoutError, setCashoutError] = useState<string | null>(null);

  // Countdown Daily Spin states
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [freeSpinAvailable, setFreeSpinAvailable] = useState<boolean>(true);

  // Calculate if Free Spin is available (once per 24 hours check, or if they have welcome free spins)
  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (currentUser.freeSpinsLeft > 0) {
        setFreeSpinAvailable(true);
        setTimeLeft("");
        return;
      }

      if (!currentUser.lastSpinTime) {
        setFreeSpinAvailable(true);
        setTimeLeft("");
        return;
      }

      const lastSpin = new Date(currentUser.lastSpinTime).getTime();
      const now = new Date().getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      const difference = lastSpin + twentyFourHours - now;

      if (difference <= 0) {
        setFreeSpinAvailable(true);
        setTimeLeft("");
      } else {
        setFreeSpinAvailable(false);
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [currentUser.lastSpinTime]);

  // Daily Login Bonus States
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [isClaimingDaily, setIsClaimingDaily] = useState(false);
  const [dailyBonusAvailable, setDailyBonusAvailable] = useState(false);
  const [dailyBonusTimeLeft, setDailyBonusTimeLeft] = useState("");
  const [dailyClaimSuccess, setDailyClaimSuccess] = useState(false);

  // Calculate if Daily Login Bonus is available (once per 24 hours check)
  useEffect(() => {
    const calculateDailyBonusTime = () => {
      if (!currentUser.lastDailyLoginTime) {
        setDailyBonusAvailable(true);
        setDailyBonusTimeLeft("");
        return;
      }

      const lastClaim = new Date(currentUser.lastDailyLoginTime).getTime();
      const now = new Date().getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      const difference = lastClaim + twentyFourHours - now;

      if (difference <= 0) {
        setDailyBonusAvailable(true);
        setDailyBonusTimeLeft("");
      } else {
        setDailyBonusAvailable(false);
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setDailyBonusTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    calculateDailyBonusTime();
    const interval = setInterval(calculateDailyBonusTime, 1000);
    return () => clearInterval(interval);
  }, [currentUser.lastDailyLoginTime]);

  // Trigger modal display when visiting the dashboard and bonus is available
  useEffect(() => {
    if (dailyBonusAvailable && !dailyClaimSuccess) {
      setShowDailyModal(true);
    }
  }, [dailyBonusAvailable]);

  // Handle the Daily Login claim API call
  const handleClaimDailyBonus = () => {
    if (isClaimingDaily) return;
    setIsClaimingDaily(true);
    const token = localStorage.getItem("gamevault_token");

    fetch("/api/auth?action=claim-daily-bonus", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to claim daily bonus.");
      return data;
    })
    .then(data => {
      setIsClaimingDaily(false);
      setDailyClaimSuccess(true);
      onUpdateUser(data.user);
      triggerConfetti();
    })
    .catch(err => {
      setIsClaimingDaily(false);
      alert(err.message || "Failed to claim daily bonus.");
    });
  };

  // Reset daily login timer for review
  const handleBypassDailyTimer = () => {
    const token = localStorage.getItem("gamevault_token");
    fetch("/api/auth?action=bypass-daily-timer", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    })
    .then(data => {
      onUpdateUser(data.user);
      setDailyClaimSuccess(false);
      setDailyBonusAvailable(true);
      setShowDailyModal(true);
    })
    .catch(err => {
      console.error("Failed to bypass daily timer:", err);
    });
  };

  // Handle the server-side API call for spinning the wheel securely
  const onSpinStart = async (): Promise<{ prizeIndex: number; success: boolean }> => {
    // Show content locker if not unlocked yet
    if (!spinUnlocked) {
      setShowSpinLocker(true);
      return { prizeIndex: 0, success: false };
    }

    try {
      const token = localStorage.getItem("gamevault_token");
      const res = await fetch("/api/auth?action=spin", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || "Failed to execute the spin.");
        return { prizeIndex: 0, success: false };
      }

      if (data.success && data.prize) {
        // Cache won prize data and the updated user from the server
        setWonPrize(data.prize);
        setPendingUpdatedUser(data.updatedUser);
        return { prizeIndex: data.prize.index, success: true };
      }
    } catch (err) {
      console.error("Failed to request secure spin server-side:", err);
    }
    return { prizeIndex: 0, success: false };
  };

  // Called when the physics animation has completed
  const onSpinComplete = (index: number) => {
    if (!wonPrize) return;

    setSpinCompleted(true);

    if (wonPrize.type === "coins" || wonPrize.type === "cash") {
      triggerConfetti();
    }

    if (pendingUpdatedUser) {
      onUpdateUser(pendingUpdatedUser);
      setPendingUpdatedUser(null);
    }
  };

  // Close Prize modal
  const handleClosePrizeModal = () => {
    setSpinCompleted(false);
    setWonPrize(null);
  };

  // Profile Save changes handler
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg(null);
    const token = localStorage.getItem("gamevault_token");
    
    fetch("/api/auth?action=update-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        email: editEmail,
        password: editPassword === "••••••••" ? "" : editPassword
      })
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile.");
      return data;
    })
    .then(data => {
      onUpdateUser(data.user);
      setProfileSuccessMsg("Your Vault credentials have been updated successfully!");
      if (editPassword !== "••••••••") {
        setEditPassword("••••••••");
      }
      setTimeout(() => setProfileSuccessMsg(null), 3500);
    })
    .catch(err => {
      alert(err.message || "Failed to update profile.");
    });
  };

  // Copy referral invite code simulator
  const handleCopyInvite = () => {
    const textToCopy = `${window.location.origin}/?ref=${currentUser.username.toLowerCase()}`;
    navigator.clipboard.writeText(textToCopy);
    setShowInviteAlert(true);
    setTimeout(() => setShowInviteAlert(false), 3000);
  };

  // Reset/Bypass Daily timer for reviewers
  const handleBypassTimer = () => {
    const token = localStorage.getItem("gamevault_token");
    fetch("/api/auth?action=bypass-timer", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    })
    .then(data => {
      onUpdateUser(data.user);
    })
    .catch(err => {
      console.error("Failed to bypass timer:", err);
    });
  };

  // Clear Game Spin History logs
  const handleClearHistory = () => {
    const token = localStorage.getItem("gamevault_token");
    fetch("/api/auth?action=clear-history", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    })
    .then(data => {
      onUpdateUser(data.user);
    })
    .catch(err => {
      console.error("Failed to clear history:", err);
    });
  };

  // Cashout submission simulation
  const handleCashoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCashoutSuccess(null);
    setCashoutError(null);

    const amount = parseFloat(cashoutAmount);

    if (isNaN(amount) || amount <= 0) {
      setCashoutError("Invalid cashout amount.");
      return;
    }

    const token = localStorage.getItem("gamevault_token");
    fetch("/api/auth?action=cashout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        amount,
        method: cashoutMethod,
        email: cashoutEmail || currentUser.email
      })
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process withdrawal.");
      return data;
    })
    .then(data => {
      onUpdateUser(data.user);
      setCashoutSuccess(data.message);
      setCashoutAmount("");
      setCashoutEmail("");
    })
    .catch(err => {
      setCashoutError(err.message || "Failed to process withdrawal.");
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-6 px-4 z-10 flex flex-col gap-6">
      
      {/* Content Locker for Spin - shows when user tries to spin */}
      <ContentLocker
        show={showSpinLocker && !spinUnlocked}
        rewardText="🔓 Unlock to Spin the Wheel!"
        onUnlock={() => { setSpinUnlocked(true); setShowSpinLocker(false); }}
      />
      
      {/* ================== USER HEADER HUD PANEL ================== */}
      <section className="bg-zinc-950/70 backdrop-blur-xl border border-zinc-900 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden">
        
        {/* Glow accent decoration */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />

        {/* Welcome information */}
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg animate-pulse">
            🎮
          </div>
          <div>
            <h2 className="text-xl font-black text-white leading-none">
              Welcome back, {currentUser.username}!
            </h2>
            <p className="text-xs text-zinc-400 mt-2 font-mono flex items-center gap-1.5 justify-center md:justify-start">
              <span className="h-2 w-2 rounded-full bg-purple-500 animate-ping" />
              PLAYER VAULT ACTIVATED • RANK #1
            </p>
          </div>
        </div>

        {/* Coin & Cash Balance Displays */}
        <div className="flex flex-wrap justify-center gap-4">
          
          {/* Coins Display */}
          <div className="bg-gradient-to-r from-cyan-950 to-blue-950 p-4 rounded-2xl border border-cyan-500/30 flex items-center gap-3 min-w-[140px] shadow-md hover:scale-[1.02] transition-transform">
            <div className="p-2 bg-cyan-900/40 rounded-xl border border-cyan-500/20 text-cyan-400">
              <Coins className="w-5 h-5 animate-spin" style={{ animationDuration: "8s" }} />
            </div>
            <div>
              <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider block">Your Balance</span>
              <span className="text-xl font-black text-white font-mono leading-none mt-1 block">
                {currentUser.balanceCoins} <span className="text-[10px] text-cyan-300">Coins</span>
              </span>
            </div>
          </div>

          {/* Cash Dollar Balance */}
          <div className="bg-gradient-to-r from-emerald-950 to-green-950 p-4 rounded-2xl border border-emerald-500/30 flex items-center gap-3 min-w-[140px] shadow-md hover:scale-[1.02] transition-transform">
            <div className="p-2 bg-emerald-900/40 rounded-xl border border-emerald-500/20 text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider block">Cash Balance</span>
              <span className="text-xl font-black text-white font-mono leading-none mt-1 block">
                ${currentUser.balanceCash.toFixed(2)} <span className="text-[10px] text-emerald-300">USD</span>
              </span>
            </div>
          </div>

        </div>

      </section>

      {/* ================== DAILY LOGIN BONUS WIDGET ================== */}
      <div className="bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_30px_rgba(139,92,246,0.15)] relative overflow-hidden">
        {/* Abstract background flare */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
          <div className="w-12 h-12 bg-purple-900/40 border border-purple-500/30 rounded-xl flex items-center justify-center text-2xl text-purple-400">
            🎁
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wide flex items-center gap-1.5 justify-center sm:justify-start">
              Daily Login Reward
              <span className="text-[10px] bg-purple-500/20 text-purple-300 font-mono font-bold px-2 py-0.5 rounded-full border border-purple-500/10">
                +25 Coins
              </span>
            </h3>
            <p className="text-xs text-zinc-300 mt-1">
              {dailyBonusAvailable 
                ? "Your daily coin chest is ready! Claim your free bonus coins right now." 
                : `Next daily reward available in: ${dailyBonusTimeLeft || "calculating..."}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {dailyBonusAvailable ? (
            <button
              onClick={handleClaimDailyBonus}
              disabled={isClaimingDaily}
              className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/20 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: "5s" }} />
              {isClaimingDaily ? "Claiming..." : "Claim Daily Bonus"}
            </button>
          ) : (
            <div className="flex flex-col items-end gap-1">
              <span className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-500 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-zinc-650" />
                Claimed Today
              </span>
              <button
                onClick={handleBypassDailyTimer}
                className="text-[9px] text-purple-400 hover:text-purple-300 underline font-mono tracking-wider cursor-pointer"
              >
                ⚙️ [Dev Bypass] Reset Daily Login
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================== SUB NAVIGATION BAR tabs ================== */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
        
        <button
          onClick={() => setActiveTab("SPIN")}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer border ${
            activeTab === "SPIN"
              ? "bg-purple-600/20 border-purple-500/40 text-white shadow-lg"
              : "bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Trophy className="w-4 h-4 text-purple-400" />
          Spin Wheel
        </button>

        <button
          onClick={() => setActiveTab("WALLET")}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer border ${
            activeTab === "WALLET"
              ? "bg-purple-600/20 border-purple-500/40 text-white shadow-lg"
              : "bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Wallet className="w-4 h-4 text-emerald-400" />
          Claim Prizes
        </button>

        <button
          onClick={() => setActiveTab("ACCOUNT")}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer border ${
            activeTab === "ACCOUNT"
              ? "bg-purple-600/20 border-purple-500/40 text-white shadow-lg"
              : "bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <UserIcon className="w-4 h-4 text-cyan-400" />
          Account settings
        </button>

        <button
          onClick={() => setActiveTab("HISTORY")}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer border ${
            activeTab === "HISTORY"
              ? "bg-purple-600/20 border-purple-500/40 text-white shadow-lg"
              : "bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-400" />
          Spin history
        </button>

      </div>

      {/* ================== TAB VIEW CONTENT FLOWS ================== */}
      
      {activeTab === "SPIN" && (
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-8 w-full animate-fade-in">
          
          {/* MAIN INTERACTIVE AREA: Centered Full-Width Spin Box */}
          <div className="w-full bg-zinc-950/80 border border-zinc-900 p-6 sm:p-10 rounded-3xl flex flex-col items-center justify-center relative min-h-[520px] shadow-2xl overflow-hidden">
            
            {/* Soft decorative background glowing halo */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Spin indicator floating header */}
            <div className="flex items-center justify-center w-full mb-8 z-10">
              {currentUser.freeSpinsLeft > 0 ? (
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/40 rounded-full text-[11px] font-black uppercase tracking-widest text-purple-300 shadow-[0_0_20px_rgba(139,92,246,0.3)] animate-pulse">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
                  Free Spins Remaining: {currentUser.freeSpinsLeft}x
                </div>
              ) : freeSpinAvailable ? (
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-950/40 border border-emerald-500/40 rounded-full text-[11px] font-black uppercase tracking-widest text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  Daily Free Spin Available
                </div>
              ) : (
                <div className="inline-flex flex-col items-center gap-1.5">
                  <div className="inline-flex items-center gap-2 px-5 py-2 bg-zinc-900/90 border border-zinc-800 rounded-full text-[11px] font-black uppercase tracking-widest text-zinc-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-500" />
                    Come back tomorrow
                  </div>
                  <span className="text-xs text-purple-400 font-mono mt-1 font-bold tracking-wider">
                    Next Spin resets in: {timeLeft}
                  </span>
                </div>
              )}
            </div>

            {/* Core Spin Wheel component mount (now larger and robust) */}
            <div className="w-full flex justify-center py-2 z-10">
              <SpinWheel
                onSpinStart={onSpinStart}
                onSpinComplete={onSpinComplete}
                isSpinning={isSpinning}
                setIsSpinning={setIsSpinning}
                freeSpinAvailable={freeSpinAvailable}
              />
            </div>

            {/* Reviewer Shortcut timer bypass link */}
            {!freeSpinAvailable && (
              <button
                onClick={handleBypassTimer}
                className="mt-6 z-10 text-[10px] text-purple-400 hover:text-purple-300 underline font-semibold font-mono tracking-wider cursor-pointer"
              >
                ⚙️ [Dev Bypass] Reset 24H Daily Spin Timer for review
              </button>
            )}

          </div>

          {/* LOWER GRID: Transparent Odds Overview, Recent Wins, and Referral Copier */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full mt-2">
            
            {/* Quick Action card 1: Invite Friends */}
            <div className="bg-zinc-950/70 border border-zinc-900 p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-pink-500/5 rounded-full blur-xl" />
              
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-pink-950/50 rounded-2xl border border-pink-500/20 text-pink-400 flex-shrink-0">
                  <Share2 className="w-5 h-5 animate-bounce" style={{ animationDuration: "3s" }} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Invite Friends</h3>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                    Share your referral link and get an extra <span className="text-cyan-400 font-extrabold">50 Coins</span> for free when your friends sign up!
                  </p>
                </div>
              </div>

              {/* Referral copier box */}
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/?ref=${currentUser.username.toLowerCase()}`}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-900 text-[10px] font-mono text-zinc-400 overflow-ellipsis"
                  />
                  <button
                    onClick={handleCopyInvite}
                    title="Copy Invite Link"
                    className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all cursor-pointer flex-shrink-0"
                  >
                    <Clipboard className="w-4 h-4" />
                  </button>
                </div>

                {showInviteAlert && (
                  <div className="mt-2 p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[9px] text-center font-bold animate-pulse">
                    Referral link copied!
                  </div>
                )}
              </div>

            </div>

            {/* Quick Action card 2: Recent Wins */}
            <div className="bg-zinc-950/70 border border-zinc-900 p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-purple-500/5 rounded-full blur-xl" />
              
              <div>
                <div className="flex gap-4 items-start mb-4">
                  <div className="p-3 bg-purple-950/50 rounded-2xl border border-purple-500/20 text-purple-400 flex-shrink-0">
                    <Trophy className="w-5 h-5 text-purple-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">Recent Wins</h3>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      Your latest 5 spin rewards. Spin the daily wheel to win coins and real cash!
                    </p>
                  </div>
                </div>

                {/* Scrollable list of last 5 spin results */}
                <div className="overflow-y-auto max-h-[160px] pr-1 space-y-2 mt-2 scrollbar-thin">
                  {currentUser.spinHistory && currentUser.spinHistory.length > 0 ? (
                    currentUser.spinHistory.slice(0, 5).map((item) => (
                      <div 
                        key={item.id} 
                        className="flex justify-between items-center bg-zinc-900/30 border border-zinc-900/60 rounded-xl p-2.5 hover:bg-zinc-900/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm flex-shrink-0">{item.prizeIcon}</span>
                          <span className="font-extrabold text-white text-[11px] font-mono tracking-wide">{item.prizeLabel}</span>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                          <span className={`text-[9px] font-black uppercase font-mono ${
                            item.prizeType === 'coins' ? 'text-cyan-400' :
                            item.prizeType === 'cash' ? 'text-emerald-400' :
                            item.prizeType === 'bomb' ? 'text-red-500' : 'text-slate-500'
                          }`}>
                            {item.prizeType === 'coins' && `+${item.prizeValue}`}
                            {item.prizeType === 'cash' && `+$${item.prizeValue.toFixed(2)}`}
                            {item.prizeType === 'bomb' && `-15%`}
                            {item.prizeType === 'zonk' && `Zonk`}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-[11px] text-zinc-500 flex flex-col items-center justify-center gap-1">
                      <Sparkles className="w-5 h-5 text-zinc-700 animate-pulse" />
                      <span>No spin history recorded yet.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Action card 3: Certified Server Odds */}
            <div className="bg-zinc-950/70 border border-zinc-900 p-6 rounded-3xl">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-4 font-mono">
                Certified Server Odds
              </h3>
              
              <div className="space-y-2">
                {[
                  { name: "🏆 Grand Prize $100 CASH", odds: "0.01%", color: "text-amber-400 font-extrabold animate-pulse" },
                  { name: "💵 $10 CASH Premium", odds: "10.0%", color: "text-purple-400 font-bold" },
                  { name: "💵 $5 CASH Special", odds: "3.99%", color: "text-indigo-400" },
                  { name: "💵 $1 CASH Standard", odds: "5.0%", color: "text-emerald-400" },
                  { name: "💵 $0.5 CASH Starter", odds: "5.0%", color: "text-teal-400" },
                  { name: "🪙 500 COINS Legend", odds: "3.0%", color: "text-cyan-400" },
                  { name: "🪙 200 COINS Mega", odds: "8.0%", color: "text-pink-400" },
                  { name: "🪙 100 COINS Common", odds: "10.0%", color: "text-blue-400" },
                  { name: "🪙 50 COINS Uncommon", odds: "10.0%", color: "text-purple-300" },
                  { name: "🪙 20 COINS Starter", odds: "15.0%", color: "text-indigo-300" },
                  { name: "🪙 10 COINS Basic", odds: "15.0%", color: "text-blue-300" },
                  { name: "💨 Zonk (Try Again)", odds: "15.0%", color: "text-slate-500" },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[11px] py-1 border-b border-zinc-900/60 last:border-0">
                    <span className={item.color}>{item.name}</span>
                    <span className="font-mono text-zinc-400 font-bold">{item.odds}</span>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ================== TAB: ACCOUNT DETAILS SETTINGS ================== */}
      {activeTab === "ACCOUNT" && (
        <div className="bg-zinc-950/70 border border-zinc-900 p-6 sm:p-8 rounded-3xl max-w-xl mx-auto w-full animate-fade-in">
          <div className="flex items-center gap-3 border-b border-zinc-900 pb-4 mb-6">
            <div className="p-2 bg-cyan-950/50 rounded-xl border border-cyan-500/20 text-cyan-400">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-md font-black uppercase text-white">Player Account Info</h3>
              <p className="text-[10px] text-zinc-500 font-mono uppercase">Manage password and email security</p>
            </div>
          </div>

          {profileSuccessMsg && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="font-semibold">{profileSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleProfileSave} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Player Username (Uneditable)
              </label>
              <input
                type="text"
                disabled
                value={currentUser.username}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/20 border border-zinc-850 text-zinc-500 text-xs font-bold font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Update Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800 focus:border-purple-500 focus:outline-none text-xs text-white font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Update Security Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800 focus:border-purple-500 focus:outline-none text-xs text-white font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.35)] active:scale-95 transition-all cursor-pointer"
            >
              Save Changes
            </button>

          </form>
        </div>
      )}

      {/* ================== TAB: CLAIM REWARDS / WALLET WALLET ================== */}
      {activeTab === "WALLET" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start animate-fade-in">
          
          {/* LEFT COLUMN: Claim withdrawal form */}
          <div className="md:col-span-7 bg-zinc-950/70 border border-zinc-900 p-6 sm:p-8 rounded-3xl">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-4 mb-6">
              <div className="p-2 bg-emerald-950/50 rounded-xl border border-emerald-500/20 text-emerald-400">
                <Wallet className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-md font-black uppercase text-white">Redeem Claim Center</h3>
                <p className="text-[10px] text-zinc-500 font-mono uppercase">Convert Coins or withdraw cash balances</p>
              </div>
            </div>

            {cashoutSuccess && (
              <div className="mb-5 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5 animate-bounce" />
                <span className="leading-relaxed font-semibold">{cashoutSuccess}</span>
              </div>
            )}

            {cashoutError && (
              <div className="mb-5 p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed font-semibold">{cashoutError}</span>
              </div>
            )}

            <form onSubmit={handleCashoutSubmit} className="space-y-4">
              
              {/* Method choice */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Redemption Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCashoutMethod("PAYPAL");
                      setCashoutError(null);
                    }}
                    className={`p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                      cashoutMethod === "PAYPAL"
                        ? "bg-purple-600/10 border-purple-500/50 text-white"
                        : "bg-zinc-900/40 border-zinc-850 text-zinc-400 hover:bg-zinc-900/70"
                    }`}
                  >
                    🎁 Amazon/Steam Gift Card (Trade Coins)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCashoutMethod("USD_PAYPAL");
                      setCashoutError(null);
                    }}
                    className={`p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                      cashoutMethod === "USD_PAYPAL"
                        ? "bg-purple-600/10 border-purple-500/50 text-white"
                        : "bg-zinc-900/40 border-zinc-850 text-zinc-400 hover:bg-zinc-900/70"
                    }`}
                  >
                    💵 PayPal Cash Withdrawal (USD Balance)
                  </button>
                </div>
              </div>

              {/* Dynamic conversion info label */}
              <div className="p-3 bg-zinc-900/20 border border-zinc-850 rounded-xl text-[11px] text-zinc-500 italic">
                {cashoutMethod === "PAYPAL" ? (
                  <span>Exchange Rate: <strong>10 Coins = $1.00 USD Gift Card Voucher</strong>. Voucher is automatically sent to your registered email address within 24 hours.</span>
                ) : (
                  <span>PayPal Cash withdrawals are processed directly to your PayPal account. Minimum withdrawal amount is <strong>$10.00 CASH</strong>.</span>
                )}
              </div>

              {/* Amount field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  {cashoutMethod === "PAYPAL" ? "Nominal Gift Card ($ USD)" : "Amount to Withdraw ($ USD)"}
                </label>
                <select
                  value={cashoutAmount}
                  onChange={(e) => setCashoutAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-white font-medium focus:border-purple-500 focus:outline-none"
                  required
                >
                  <option value="">-- Select value --</option>
                  <option value="5">$5.00 Value (Requires 50 Coins for Gift Cards)</option>
                  <option value="10">$10.00 Value (Requires 100 Coins / $10 Cash)</option>
                  <option value="25">$25.00 Value (Requires 250 Coins / $25 Cash)</option>
                  <option value="100">$100.00 Value (Requires 1000 Coins / $100 Cash)</option>
                </select>
              </div>

              {/* PayPal email (only if USD_PAYPAL is selected) */}
              {cashoutMethod === "USD_PAYPAL" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Your PayPal Email Address
                  </label>
                  <input
                    type="email"
                    value={cashoutEmail}
                    onChange={(e) => setCashoutEmail(e.target.value)}
                    placeholder="paypal-recipient@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-white font-medium focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 text-white shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Submit Claim
              </button>

            </form>
          </div>

          {/* RIGHT COLUMN: Instructions/Faq */}
          <div className="md:col-span-5 bg-zinc-950/70 border border-zinc-900 p-6 rounded-3xl space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 font-mono">Redeem FAQ</h4>
            
            <div className="space-y-3 text-xs leading-relaxed text-zinc-400">
              <div className="p-3 bg-zinc-900/20 border border-zinc-850 rounded-xl">
                <span className="font-bold text-white block mb-1">How long does the withdrawal process take?</span>
                The prize review process takes between 12 to 24 hours to prevent coin exploits, after which the voucher is automatically sent to your registered email address.
              </div>
              
              <div className="p-3 bg-zinc-900/20 border border-zinc-850 rounded-xl">
                <span className="font-bold text-white block mb-1">Do balances expire?</span>
                No! Your virtual coin balance and cash balance will remain securely stored in your Game Vault account forever.
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ================== TAB: SPIN WIN HISTORY LOGS ================== */}
      {activeTab === "HISTORY" && (
        <div className="bg-zinc-950/70 border border-zinc-900 p-6 sm:p-8 rounded-3xl animate-fade-in">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-950/50 rounded-xl border border-amber-500/20 text-amber-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-md font-black uppercase text-white">Your Spin Log History</h3>
                <p className="text-[10px] text-zinc-500 font-mono uppercase">Certified records of previous wheel actions</p>
              </div>
            </div>

            {currentUser.spinHistory.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-all font-semibold cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Clear Logs
              </button>
            )}
          </div>

          {currentUser.spinHistory.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-xs">
              <AlertTriangle className="w-8 h-8 text-zinc-650 mx-auto mb-2 animate-bounce" />
              You haven't spun the wheel yet. Spin your lucky wheel in the "Spin Wheel" tab!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-400 border-collapse">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-500 uppercase tracking-widest font-mono text-[9px] font-bold">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Result</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Wallet Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/60 font-mono text-[11px]">
                  {currentUser.spinHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-900/20">
                      <td className="py-3 px-4 text-zinc-500">
                        {new Date(item.timestamp).toLocaleTimeString()} • {new Date(item.timestamp).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-black text-white flex items-center gap-2">
                        <span className="text-lg">{item.prizeIcon}</span>
                        {item.prizeLabel}
                      </td>
                      <td className="py-3 px-4 uppercase text-[10px] tracking-wide text-zinc-400">
                        {item.prizeType}
                      </td>
                      <td className="py-3 px-4">
                        {item.prizeType === "coins" && (
                          <span className="text-cyan-400 font-bold">+{item.prizeValue} Coins</span>
                        )}
                        {item.prizeType === "cash" && (
                          <span className="text-emerald-400 font-bold">+${item.prizeValue.toFixed(2)} USD</span>
                        )}
                        {item.prizeType === "bomb" && (
                          <span className="text-red-500 font-bold">-15% Coins (Danger)</span>
                        )}
                        {item.prizeType === "zonk" && (
                          <span className="text-slate-500 font-bold">0 Coins (Try Again)</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

      {/* ================== SPIN RESULT CELEBRATION MODAL OVERLAY ================== */}
      {spinCompleted && wonPrize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          
          <div className="bg-zinc-950 border-2 border-purple-500/50 p-8 rounded-3xl max-w-sm w-full text-center relative overflow-hidden shadow-[0_0_80px_rgba(139,92,246,0.3)] animate-scale-up">
            
            {/* Colorful sparks backing */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10">
              
              {/* Prize Icon Animation */}
              <div className="relative w-24 h-24 bg-zinc-900 rounded-3xl flex items-center justify-center text-5xl mx-auto shadow-inner border border-zinc-800 mb-6 animate-bounce">
                {wonPrize.icon}
                <div className="absolute inset-0 rounded-3xl bg-white/5 animate-pulse" />
              </div>

              {/* Secondary title according to category */}
              {wonPrize.type === "coins" || wonPrize.type === "cash" ? (
                <>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-500/20 px-3 py-1 rounded-full">
                    🎉 CONGRATULATIONS WINNER!
                  </span>
                  <h2 className="text-2xl font-black text-white uppercase mt-4 mb-2">
                    YOU WON {wonPrize.label}
                  </h2>
                  <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                    Claim successful! Your {wonPrize.type} reward has been deposited directly into your Player Vault. Keep collecting coins to redeem exciting gift cards!
                  </p>
                </>
              ) : wonPrize.type === "bomb" ? (
                <>
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-400 font-mono bg-red-950/40 border border-red-500/20 px-3 py-1 rounded-full">
                    💥 BOOM! DANGER TRIGGERED
                  </span>
                  <h2 className="text-2xl font-black text-white uppercase mt-4 mb-2">
                    BOMB DETONATED!
                  </h2>
                  <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                    Oh no, the spin landed on a BOMB! Your vault suffered a minor shock which reset 15% of your current coin stash. Stay positive, and spin again tomorrow!
                  </p>
                </>
              ) : (
                <>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono bg-slate-900/40 border border-slate-500/20 px-3 py-1 rounded-full">
                    💨 BETTER LUCK NEXT TIME
                  </span>
                  <h2 className="text-2xl font-black text-white uppercase mt-4 mb-2">
                    IT'S A ZONK!
                  </h2>
                  <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                    Too bad, the lucky wheel landed on a ZONK. Don't be discouraged, come back tomorrow to claim your free daily spin and try again!
                  </p>
                </>
              )}

              {/* Action Close/Redeem button */}
              <button
                onClick={handleClosePrizeModal}
                className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 text-white shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                Claim & Save Prize
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ================== DAILY LOGIN BONUS MODAL ================== */}
      {showDailyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-zinc-950 border-2 border-purple-500/50 p-8 rounded-3xl max-w-sm w-full text-center relative overflow-hidden shadow-[0_0_80px_rgba(139,92,246,0.3)] animate-scale-up">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              {/* Prize Icon with dynamic styles */}
              <div className="relative w-20 h-20 bg-purple-950/40 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-inner border border-purple-500/20 mb-6 animate-bounce">
                🎁
                <div className="absolute inset-0 rounded-3xl bg-white/5 animate-pulse" />
              </div>

              {!dailyClaimSuccess ? (
                <>
                  <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 font-mono bg-purple-950/40 border border-purple-500/20 px-3 py-1 rounded-full">
                    DAILY LOGIN REWARD AVAILABLE!
                  </span>
                  <h2 className="text-2xl font-black text-white uppercase mt-4 mb-2">
                    CLAIM FREE COINS
                  </h2>
                  <p className="text-xs text-zinc-300 mb-6 leading-relaxed">
                    Welcome back! Visit us every single day to secure extra virtual coins. Claim your daily bonus package of <span className="text-purple-400 font-bold">25 Coins</span> now!
                  </p>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleClaimDailyBonus}
                      disabled={isClaimingDaily}
                      className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 text-white shadow-lg active:scale-95 transition-all cursor-pointer"
                    >
                      {isClaimingDaily ? "Processing Claim..." : "Claim 25 Free Coins!"}
                    </button>
                    <button
                      onClick={() => setShowDailyModal(false)}
                      className="w-full py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-400 transition-colors"
                    >
                      Maybe Later
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-500/20 px-3 py-1 rounded-full">
                    🎉 SUCCESSFUL COLLECTION!
                  </span>
                  <h2 className="text-2xl font-black text-white uppercase mt-4 mb-2">
                    COINS CREDITED
                  </h2>
                  <p className="text-xs text-zinc-300 mb-6 leading-relaxed">
                    Awesome! You have successfully collected your <span className="text-emerald-400 font-bold">+25 Coins</span> bonus! Your updated player balance has been secured in the vault.
                  </p>

                  <button
                    onClick={() => {
                      setShowDailyModal(false);
                      setDailyClaimSuccess(false);
                    }}
                    className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg active:scale-95 transition-all cursor-pointer"
                  >
                    Awesome, thanks!
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
