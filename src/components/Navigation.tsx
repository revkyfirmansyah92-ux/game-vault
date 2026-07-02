import React, { useState } from "react";
import { PageType, User } from "../types";
import { Trophy, Menu, X, Coins, Wallet, Landmark, LogOut, Info, Mail, LayoutDashboard, ShieldAlert } from "lucide-react";

interface NavigationProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export default function Navigation({
  currentPage,
  setCurrentPage,
  currentUser,
  onLogout,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", page: "LANDING" as PageType, icon: LayoutDashboard },
    { label: "Spin Wheel", page: "DASHBOARD" as PageType, icon: Trophy },
    { label: "Claim Prizes", page: "CLAIM_PRIZES" as PageType, icon: Wallet },
    { label: "About Us", page: "ABOUT" as PageType, icon: Info },
    { label: "Contact Us", page: "CONTACT" as PageType, icon: Mail },
  ];

  const handleNavClick = (page: PageType) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-zinc-950/80 backdrop-blur-md border-b border-purple-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand section */}
          <div className="flex items-center">
            <button 
              onClick={() => handleNavClick("LANDING")}
              className="flex items-center gap-2 group focus:outline-none"
            >
              <div className="relative p-2 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-transform group-hover:scale-105">
                <Trophy className="w-5 h-5 text-white animate-pulse" />
                <div className="absolute inset-0 bg-white/20 rounded-lg scale-0 group-hover:scale-100 transition-transform" />
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-lg font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 font-sans">
                  GAME VAULT
                </span>
                <span className="text-[9px] text-zinc-500 font-mono tracking-widest font-bold uppercase">
                  PROMO REWARDS
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.page)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-purple-600/20 border border-purple-500/30 text-purple-200 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-purple-400" : "text-zinc-500"}`} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* User Auth Section & Wallet Panel (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {/* User Info Capsule */}
                <div 
                  onClick={() => handleNavClick("DASHBOARD")}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 cursor-pointer hover:border-purple-500/30 transition-all"
                >
                  <div className="flex flex-col items-end leading-none">
                    <span className="text-xs font-bold text-zinc-300">{currentUser.username}</span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">Player Rank #1</span>
                  </div>
                  {/* Coins Balance Capsule */}
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-950 to-blue-950 px-2 py-1 rounded-full border border-cyan-500/30">
                    <Coins className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "6s" }} />
                    <span className="text-xs font-black text-cyan-300 font-mono">
                      {currentUser.balanceCoins}
                    </span>
                  </div>
                  {/* Virtual Cash Balance Capsule */}
                  <div className="flex items-center gap-1 bg-gradient-to-r from-emerald-950 to-green-950 px-2 py-1 rounded-full border border-emerald-500/30">
                    <span className="text-xs font-black text-emerald-400 font-mono">
                      ${currentUser.balanceCash.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Logout Action */}
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-red-950/20 hover:border-red-500/30 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick("LOGIN")}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNavClick("REGISTER")}
                  className="px-4 py-1.5 rounded-lg text-xs font-black bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-[0_0_15px_rgba(219,39,119,0.4)] transition-all active:scale-95 cursor-pointer"
                >
                  Sign Up Free
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {currentUser && (
              <div className="flex items-center gap-1.5 bg-zinc-900/90 px-2.5 py-1 rounded-full border border-zinc-800">
                <Coins className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span className="text-xs font-extrabold text-cyan-300 font-mono">{currentUser.balanceCoins}</span>
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-purple-500/20 px-2 pt-2 pb-4 space-y-1 sm:px-3 animate-fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.page)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-purple-600/20 border border-purple-500/30 text-purple-200"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-purple-400" : "text-zinc-500"}`} />
                {item.label}
              </button>
            );
          })}
          
          <div className="pt-4 pb-2 border-t border-zinc-900 mt-4 px-3">
            {currentUser ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-400">Account</span>
                    <span className="text-sm font-black text-white">{currentUser.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-cyan-950/50 px-2 py-1 rounded-full border border-cyan-500/20">
                      <Coins className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-xs font-black text-cyan-300 font-mono">{currentUser.balanceCoins}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-emerald-950/50 px-2 py-1 rounded-full border border-emerald-500/20">
                      <span className="text-xs font-black text-emerald-400 font-mono">${currentUser.balanceCash.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-red-950/30 hover:bg-red-950/50 text-red-400 border border-red-900/50 text-xs font-bold transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleNavClick("LOGIN")}
                  className="w-full py-2 rounded-lg text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-850 transition-all border border-zinc-800 cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNavClick("REGISTER")}
                  className="w-full py-2.5 rounded-lg text-xs font-black bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-center shadow-[0_0_15px_rgba(219,39,119,0.3)] transition-all cursor-pointer"
                >
                  Sign Up Free
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
