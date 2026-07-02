import React from "react";
import { PageType } from "../types";
import { ShieldCheck, FileText, Scale, Lock, Heart, ArrowLeft } from "lucide-react";

interface LegalPagesProps {
  type: "PRIVACY" | "TERMS";
  setCurrentPage: (page: PageType) => void;
}

export function LegalPages({ type, setCurrentPage }: LegalPagesProps) {
  const isPrivacy = type === "PRIVACY";

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4 z-10 text-zinc-300">
      
      {/* Back to Dashboard/Home Link */}
      <button
        onClick={() => setCurrentPage("LANDING")}
        className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 mb-6 transition-all font-semibold cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </button>

      {/* Primary Read Container */}
      <div className="bg-zinc-950/70 backdrop-blur-xl border border-zinc-900 p-6 sm:p-10 rounded-3xl shadow-xl">
        
        {/* Page Title Header */}
        <div className="flex items-center gap-3 border-b border-zinc-900 pb-6 mb-8">
          <div className="p-2 bg-purple-950/40 rounded-xl border border-purple-500/30">
            {isPrivacy ? (
              <ShieldCheck className="w-6 h-6 text-purple-400" />
            ) : (
              <Scale className="w-6 h-6 text-purple-400" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase text-white leading-none">
              {isPrivacy ? "Privacy Policy" : "Terms of Service"}
            </h1>
            <p className="text-[10px] text-zinc-500 font-mono tracking-wider mt-1.5 uppercase">
              Last Updated: July 2, 2026 • Verified USA Compliant
            </p>
          </div>
        </div>

        {/* Content Flow */}
        {isPrivacy ? (
          <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
            
            <section className="bg-zinc-900/20 p-4 rounded-xl border border-zinc-850">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-2 flex items-center gap-2">
                <span className="w-1.5 h-3 bg-purple-500 rounded" />
                1. Information We Collect
              </h3>
              <p>
                We collect essential information to secure and optimize your Game Vault account. This information includes registration details such as email address, username (nickname), encrypted password, and mechanical logs of your wheel spin activity. We may also collect non-sensitive device data (coarse IP address, browser metadata) to prevent abuse and duplicate registrations.
              </p>
            </section>

            <section className="bg-zinc-900/20 p-4 rounded-xl border border-zinc-850">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-2 flex items-center gap-2">
                <span className="w-1.5 h-3 bg-purple-500 rounded" />
                2. How We Use Information
              </h3>
              <p>
                Your information is used strictly to maintain your player profile, accurately calculate virtual coin balances, process reward claims, and detect illegal bots trying to manipulate our secure server-side randomizer. We never use your contact details for purposes outside of Game Vault promotions.
              </p>
            </section>

            <section className="bg-zinc-900/20 p-4 rounded-xl border border-zinc-850">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-2 flex items-center gap-2">
                <span className="w-1.5 h-3 bg-purple-500 rounded" />
                3. Cookies & Tracking
              </h3>
              <p>
                We use standard browser cookies and local storage (LocalStorage) to keep your login session active so you do not have to type in your credentials repeatedly every day. These cookies are secure and can only be read by the Game Vault platform.
              </p>
            </section>

            <section className="bg-zinc-900/20 p-4 rounded-xl border border-zinc-850">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-2 flex items-center gap-2">
                <span className="w-1.5 h-3 bg-purple-500 rounded" />
                4. Third-Party Sharing
              </h3>
              <p>
                Game Vault is deeply committed to your data privacy. We <strong>never sell, rent, or distribute</strong> your personal information to any third-party advertising companies. Data is only shared securely with licensed transaction processors when you request a coin conversion to real rewards.
              </p>
            </section>

            <section className="bg-zinc-900/20 p-4 rounded-xl border border-zinc-850">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-2 flex items-center gap-2">
                <span className="w-1.5 h-3 bg-purple-500 rounded" />
                5. Data Security
              </h3>
              <p>
                Every piece of account data you enter is protected with industry-standard Secure Sockets Layer (SSL) encryption. All data is securely stored on strictly configured private servers to prevent unauthorized access.
              </p>
            </section>

            <section className="bg-zinc-900/20 p-4 rounded-xl border border-zinc-850">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-2 flex items-center gap-2">
                <span className="w-1.5 h-3 bg-purple-500 rounded" />
                6. User Rights & Contact
              </h3>
              <p>
                You have the right to request account deletion, spin history clearance, or email modifications at any time by contacting our support team via email at <a href="mailto:privacy@gamevaultpromo.com" className="text-purple-400 hover:underline">privacy@gamevaultpromo.com</a>. We will process your request within 48 business hours.
              </p>
            </section>

          </div>
        ) : (
          <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
            
            <section className="bg-zinc-900/20 p-4 rounded-xl border border-zinc-850">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-2 flex items-center gap-2">
                <span className="w-1.5 h-3 bg-purple-500 rounded" />
                1. Acceptance of Terms
              </h3>
              <p>
                By accessing and registering with Game Vault, you agree to be legally bound by these Terms of Service. If you do not agree with any of the terms outlined here, please discontinue using this platform.
              </p>
            </section>

            <section className="bg-zinc-900/20 p-4 rounded-xl border border-zinc-850">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-2 flex items-center gap-2">
                <span className="w-1.5 h-3 bg-purple-500 rounded" />
                2. Eligibility (18+)
              </h3>
              <p>
                This site is intended purely for adult entertainment promotions. You <strong>must be at least 18 years old</strong> (or the age of majority in your jurisdiction) to register and participate in the Game Vault lucky wheel spin promotions.
              </p>
            </section>

            <section className="bg-zinc-900/20 p-4 rounded-xl border border-zinc-850">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-2 flex items-center gap-2">
                <span className="w-1.5 h-3 bg-purple-500 rounded" />
                3. Description of Service
              </h3>
              <p>
                Game Vault provides a free simulated spin the wheel minigame for advertising and promotional entertainment purposes. All virtual coins, player ranks, and simulated dollar values displayed on the dashboard carry no real monetary value outside of our platform prior to valid conversion via the rewards claim tab.
              </p>
            </section>

            <section className="bg-zinc-900/20 p-4 rounded-xl border border-zinc-850">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-2 flex items-center gap-2">
                <span className="w-1.5 h-3 bg-purple-500 rounded" />
                4. User Responsibilities
              </h3>
              <p>
                You agree to provide true, accurate, and current registration information. The use of automated registration bots, exploitation of software vulnerabilities, or hacking of coin balances will result in immediate account termination and permanent freezing of any virtual rewards.
              </p>
            </section>

            <section className="bg-zinc-900/20 p-4 rounded-xl border border-zinc-850">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-2 flex items-center gap-2">
                <span className="w-1.5 h-3 bg-purple-500 rounded" />
                5. Spin Wheel Disclaimer (No Gambling)
              </h3>
              <p>
                <strong>IMPORTANT DISCLAIMER:</strong> Game Vault wheel spins do not constitute real-money gambling. Users do not need to place real bets or make any financial deposits to participate. All participation is completely voluntary, free, and purely for commercial promotional purposes. Spin probabilities are determined mathematically and managed securely by the Game Vault server.
              </p>
            </section>

            <section className="bg-zinc-900/20 p-4 rounded-xl border border-zinc-850">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-2 flex items-center gap-2">
                <span className="w-1.5 h-3 bg-purple-500 rounded" />
                6. Limitation of Liability & Governing Law
              </h3>
              <p>
                Game Vault and its creators shall not be liable for any emotional distress or technical connection issues that prevent users from spinning the wheel in real-time. These terms are governed by and construed in accordance with the laws of the United States of America (Governing Law of USA), without prejudice to your local consumer protection rights.
              </p>
            </section>

          </div>
        )}

      </div>
    </div>
  );
}
