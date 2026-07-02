import { useState, useEffect } from "react";
import { Lock, CheckCircle, Loader2 } from "lucide-react";

interface ContentLockerProps {
  /** What the user gets after unlocking */
  rewardText: string;
  /** Callback when locker is unlocked */
  onUnlock: () => void;
  /** Show locker or not */
  show: boolean;
}

declare global {
  interface Window {
    og_load?: () => void;
  }
}

export default function ContentLocker({ rewardText, onUnlock, show }: ContentLockerProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!show || unlocked) return;

    // Poll for unlock status (OGAds removes locker div when converted)
    const interval = setInterval(() => {
      // Check if OGAds locker element is still present
      const lockerEl = document.querySelector('[id*="og_"], [class*="og-locker"], [id*="content-locker"]');
      if (!lockerEl && !unlocked) {
        // Locker was removed = offer completed
        setUnlocked(true);
        setChecking(false);
        clearInterval(interval);
        onUnlock();
      }
    }, 2000);

    // Try to trigger OGAds locker
    if (window.og_load) {
      window.og_load();
    }

    return () => clearInterval(interval);
  }, [show, unlocked, onUnlock]);

  if (!show || unlocked) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Locker Card */}
      <div className="relative w-full max-w-md mx-auto">
        <div className="bg-zinc-950/95 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 shadow-[0_0_60px_rgba(139,92,246,0.2)] text-center">
          {/* Icon */}
          <div className="inline-flex p-4 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.4)] mb-4 animate-pulse">
            <Lock className="w-8 h-8 text-white" />
          </div>

          {/* Title */}
          <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">
            🎰 Unlock Your Reward!
          </h2>

          {/* Description */}
          <p className="text-sm text-zinc-400 mb-2">
            Complete <span className="text-purple-400 font-bold">ONE quick offer</span> below to unlock:
          </p>

          {/* Reward Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-xl mb-4">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-300 font-bold text-sm">{rewardText}</span>
          </div>

          {/* OGAds Locker Container */}
          <div id="og-content-locker" className="min-h-[200px] mb-4">
            {/* OGAds locker loads here automatically */}
          </div>

          {/* Status */}
          {checking && (
            <div className="flex items-center justify-center gap-2 text-purple-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying your completion...</span>
            </div>
          )}

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-zinc-600">
            <span>🔒 Secure</span>
            <span>•</span>
            <span>✅ Verified Offers</span>
            <span>•</span>
            <span>⚡ Instant Unlock</span>
          </div>
        </div>
      </div>
    </div>
  );
}
