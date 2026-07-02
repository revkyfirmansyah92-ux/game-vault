import React, { useState } from "react";
import { PageType, User } from "../types";
import { Trophy, Mail, Lock, User as UserIcon, AlertCircle, Eye, EyeOff, CheckCircle } from "lucide-react";

interface RegisterPageProps {
  setCurrentPage: (page: PageType) => void;
  onRegisterSuccess: (user: User, token: string) => void;
}

export default function RegisterPage({ setCurrentPage, onRegisterSuccess }: RegisterPageProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form validations
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    if (!email.includes("@")) {
      setError("Invalid email format.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.trim(),
        email: email.trim(),
        password: password
      })
    })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed.");
      }
      return data;
    })
    .then((data) => {
      setIsLoading(false);
      onRegisterSuccess(data.user, data.token);
      setCurrentPage("THANK_YOU");
    })
    .catch((err) => {
      setIsLoading(false);
      setError(err.message || "An unexpected error occurred.");
    });
  };

  return (
    <div className="w-full max-w-md mx-auto my-12 px-4 z-10">
      
      {/* Glassmorphic signup Card */}
      <div className="bg-zinc-950/70 backdrop-blur-xl border border-purple-500/20 p-8 rounded-3xl shadow-[0_0_50px_rgba(139,92,246,0.15)] relative overflow-hidden">
        
        {/* Glow corner decorations */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-pink-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />

        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.4)] mb-4 animate-bounce">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">Create Player Vault</h2>
          <p className="text-xs text-zinc-400 mt-1.5">
            Register for free to claim your first bonus spin!
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-start gap-2 animate-pulse">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Player Nickname / Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
                <UserIcon className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. WinnerPro99"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800 focus:border-purple-500 focus:outline-none text-sm text-white font-medium transition-all"
                required
              />
            </div>
          </div>

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

          {/* Confirm Password Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800 focus:border-purple-500 focus:outline-none text-sm text-white font-medium transition-all"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)] active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Creating Vault..." : "Register Now"}
            </button>
          </div>

        </form>

        <div className="mt-6 text-center border-t border-zinc-900 pt-5">
          <p className="text-xs text-zinc-500">
            Already have an account?{" "}
            <button
              onClick={() => setCurrentPage("LOGIN")}
              className="text-purple-400 font-bold hover:text-purple-300 underline cursor-pointer"
            >
              Log In here
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
