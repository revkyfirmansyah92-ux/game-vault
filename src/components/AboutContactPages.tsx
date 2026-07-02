import React, { useState } from "react";
import { PageType } from "../types";
import { Info, HelpCircle, Mail, MapPin, Send, CheckCircle, Shield, Award, Users } from "lucide-react";

interface AboutContactPagesProps {
  type: "ABOUT" | "CONTACT";
  setCurrentPage: (page: PageType) => void;
}

export function AboutContactPages({ type, setCurrentPage }: AboutContactPagesProps) {
  const isAbout = type === "ABOUT";

  // Contact States
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;

    setIsSubmitting(true);

    try {
      // Post message to the secure server API
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        setContactName("");
        setContactEmail("");
        setContactMessage("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4 z-10 text-zinc-300">
      {isAbout ? (
        
        /* ================== PAGE 11: ABOUT US ================== */
        <div className="space-y-10 animate-fade-in">
          
          {/* Main Hero Card */}
          <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-500/20 p-8 sm:p-12 rounded-3xl shadow-xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-pink-400 font-mono bg-pink-950/40 border border-pink-500/20 px-3 py-1 rounded-full">
                OUR BRAND STORY
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mt-4 mb-6">
                About Game Vault
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                Founded by a team of modern gaming enthusiasts, <strong>Game Vault</strong> is committed to delivering best-in-class digital promotion fun. We believe that every player deserves appreciation for their digital engagement, without any complicated financial burdens.
              </p>
            </div>
          </div>

          {/* Mission & Core Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-zinc-950/70 border border-zinc-900 p-6 rounded-2xl">
              <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 w-fit mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-md font-bold text-white uppercase tracking-wide mb-2">
                Fast & Transparent Process
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We are committed to maintaining full transparency in prize distributions. The winning odds for every lucky wheel item are calculated fairly from the server-side without any manipulation. Coin balance redemptions are processed securely for player satisfaction.
              </p>
            </div>

            <div className="bg-zinc-950/70 border border-zinc-900 p-6 rounded-2xl">
              <div className="p-3 bg-pink-500/10 rounded-xl border border-pink-500/20 w-fit mb-4">
                <Award className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-md font-bold text-white uppercase tracking-wide mb-2">
                Fun Rewards for Everyone
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We design entertainment systems that are completely free of paid financial gambling elements. At Game Vault, all participation is free and fully supported by our external commercial sponsors. Our mission is to bring smiles and daily happiness to hundreds of thousands of loyal users.
              </p>
            </div>

          </div>

          {/* Statistics Grid */}
          <div className="bg-zinc-950/40 border border-zinc-900/60 p-8 rounded-3xl">
            <h3 className="text-xs font-bold text-center uppercase tracking-widest text-zinc-500 mb-8 font-mono">
              GAME VAULT BY THE NUMBERS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <span className="text-3xl font-black text-white font-mono block">1.2M+</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1 block">Total Spins Processed</span>
              </div>
              <div className="border-t sm:border-t-0 sm:border-x border-zinc-900 pt-4 sm:pt-0">
                <span className="text-3xl font-black text-purple-400 font-mono block">99.8%</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1 block">Fairness Rating Score</span>
              </div>
              <div className="border-t sm:border-t-0 pt-4 sm:pt-0">
                <span className="text-3xl font-black text-pink-400 font-mono block">350K+</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1 block">Satisfied Players</span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        
        /* ================== PAGE 12: CONTACT US ================== */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in">
          
          {/* Contact Details Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-zinc-950/70 border border-zinc-900 p-6 sm:p-8 rounded-3xl space-y-6">
              
              <div>
                <h1 className="text-2xl font-black text-white uppercase tracking-tight">Get in Touch</h1>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Do you have questions about the coin redemption process, account login issues, or wish to collaborate as an official advertising partner? Contact us directly.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-900">
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-950/40 rounded-xl border border-purple-500/20 text-purple-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block font-mono">SUPPORT EMAIL</span>
                    <a href="mailto:support@gamevaultpromo.com" className="text-xs text-white font-semibold hover:text-purple-400 underline">
                      support@gamevaultpromo.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-950/40 rounded-xl border border-pink-500/20 text-pink-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block font-mono">HEADQUARTERS</span>
                    <span className="text-xs text-white font-semibold">
                      Los Angeles, California, USA
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Contact Form Column */}
          <div className="md:col-span-7">
            <div className="bg-zinc-950/70 border border-zinc-900 p-6 sm:p-8 rounded-3xl">
              <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4">Send a Message</h2>
              
              {submitSuccess ? (
                <div className="p-6 bg-emerald-950/30 border border-emerald-500/20 rounded-2xl text-center space-y-3 animate-pulse">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                  <h3 className="text-md font-bold text-white uppercase">Message Sent!</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
                    Thank you for contacting us. Our support team will review your message and reply within a maximum of 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-2 text-xs text-purple-400 font-bold hover:underline cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800 focus:border-purple-500 focus:outline-none text-xs text-white font-medium transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800 focus:border-purple-500 focus:outline-none text-xs text-white font-medium transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Your Message
                    </label>
                    <textarea
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      rows={4}
                      placeholder="Write your question, inquiry, or comment here..."
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800 focus:border-purple-500 focus:outline-none text-xs text-white font-medium transition-all"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.35)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmitting ? "Sending..." : "Submit Message"}
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>
      )}
    </div>
  );
}
