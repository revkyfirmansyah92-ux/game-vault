import React, { useState } from "react";
import { PageType, User } from "../types";
import { Trophy, Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";

interface LoginPageProps {
  setCurrentPage: (page: PageType) => void;
  onLoginSuccess: (user: User, token: string) => void;
}

export default function LoginPage({ setCurrentPage, onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("All fields are required.");
      return;
    }

    setIsLoading(true);

    fetch("/api/auth?action=login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        password: password
      })
    })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid email or password.");
      }
      return data;
    })
    .then((data) => {
      setIsLoading(false);
      onLoginSuccess(data.user, data.token);
      setCurrentPage("DASHBOARD");
    })
    .catch((err) => {
      setIsLoading(false);
      setError(err.message || "An unexpected error occurred.");
    });
  };

  return (
    <div className="w-full max-w-md mx-auto my-16 px-4 z-10">
      
      {/* Glassmorphic Login Panel */}
      <div className="bg-zinc-950/70 backdrop-blur-xl border border-purple-500/20 p-8 rounded-3xl shadow-[0_0_50px_rgba(139,92,246,0.15)] relative overflow-hidden">
        
        {/* Glow decorative particles */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-pink-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.4)] mb-4 animate-bounce">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">Log In to Player Vault</h2>
          <p className="text-xs text-zinc-400 mt-1.5">
            Continue your adventure and spin for great prizes!
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800 focus:border-purple-500 focus:outline-none text-sm text-white font-medium transition-all"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800 focus:border-purple-500 focus:outline-none text-sm text-white font-medium transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-300 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)] active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Authenticating..." : "Sign In"}
            </button>
          </div>

        </form>

        <div className="mt-6 text-center border-t border-zinc-900 pt-5">
          <p className="text-xs text-zinc-500">
            Don't have an account?{" "}
            <button
              onClick={() => setCurrentPage("REGISTER")}
              className="text-purple-400 font-bold hover:text-purple-300 underline cursor-pointer"
            >
              Register for free here
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
