import React from "react";
import { PageType } from "../types";
import { Trophy, HelpCircle, Shield, FileText, Compass, MessageSquare } from "lucide-react";

interface FooterProps {
  setCurrentPage: (page: PageType) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-zinc-950/90 border-t border-zinc-900 py-12 px-4 sm:px-6 lg:px-8 mt-auto z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="flex flex-col items-start gap-4 col-span-1 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-lg">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <span className="text-md font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              GAME VAULT
            </span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed font-sans">
            Spin the high-performance wheel of fortune, win free virtual coins or dollar credits, and redeem amazing rewards daily. Completely promotional, safe, and fun!
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">Platform</h4>
          <button
            onClick={() => setCurrentPage("LANDING")}
            className="text-xs text-zinc-400 hover:text-white transition-all text-left flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-zinc-600" />
            Home / Landings
          </button>
          <button
            onClick={() => setCurrentPage("DASHBOARD")}
            className="text-xs text-zinc-400 hover:text-white transition-all text-left flex items-center gap-1.5 cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 text-zinc-600" />
            Spin the Wheel
          </button>
          <button
            onClick={() => setCurrentPage("CLAIM_PRIZES")}
            className="text-xs text-zinc-400 hover:text-white transition-all text-left flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-zinc-600" />
            Claim Rewards
          </button>
        </div>

        {/* Legal Column */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">Legal Compliance</h4>
          <button
            onClick={() => setCurrentPage("PRIVACY")}
            className="text-xs text-zinc-400 hover:text-white transition-all text-left flex items-center gap-1.5 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-zinc-600" />
            Privacy Policy
          </button>
          <button
            onClick={() => setCurrentPage("TERMS")}
            className="text-xs text-zinc-400 hover:text-white transition-all text-left flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-zinc-600" />
            Terms of Service
          </button>
          <p className="text-[10px] text-zinc-600 leading-normal mt-1 italic">
            * 18+ Eligibility strictly required. Promotional entertainment only. No actual gambling.
          </p>
        </div>

        {/* Company Column */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">Company</h4>
          <button
            onClick={() => setCurrentPage("ABOUT")}
            className="text-xs text-zinc-400 hover:text-white transition-all text-left flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-zinc-600" />
            About Game Vault
          </button>
          <button
            onClick={() => setCurrentPage("CONTACT")}
            className="text-xs text-zinc-400 hover:text-white transition-all text-left flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-zinc-600" />
            Contact Support
          </button>
          <div className="mt-2 text-xs text-zinc-500 font-mono">
            Email: <a href="mailto:support@gamevaultpromo.com" className="hover:text-purple-400 underline">support@gamevaultpromo.com</a>
          </div>
        </div>

      </div>

      {/* Bottom disclaimer bar */}
      <div className="max-w-7xl mx-auto border-t border-zinc-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <p className="text-[11px] text-zinc-600 font-mono font-medium">
          &copy; {currentYear} Game Vault Inc. All Rights Reserved. Manufactured and audited in the USA.
        </p>
        <p className="text-[10px] text-zinc-500 font-sans tracking-wide max-w-md">
          Disclaimer: Spin wheel results are calculated on highly secure server-side logic adhering to the stated, transparent prize odds. Simulated rewards are delivered via standard client-side redemption interfaces.
        </p>
      </div>
    </footer>
  );
}
