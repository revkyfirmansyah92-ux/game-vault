/**
 * GameAudio Utility using Web Audio API
 * Provides synthesized physical audio feedback for the spin wheel.
 */

class GameAudio {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private lastTickTime: number = 0;

  constructor() {
    // Read initial mute state from local storage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gamevault_muted");
      this.isMuted = saved === "true";
    }
  }

  // Safe initialization of the AudioContext on user interaction
  init() {
    if (this.isMuted) return;
    try {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    } catch (e) {
      console.warn("Failed to initialize AudioContext:", e);
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem("gamevault_muted", String(this.isMuted));
    return this.isMuted;
  }

  getMuteState(): boolean {
    return this.isMuted;
  }

  /**
   * Synthesizes a fast, clean physical 'tick' sound
   * Uses high-frequency bandpass or short pitch sweep with exponential decay
   */
  playTick() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Prevent overlapping ticks from saturating the speakers at high wheel speeds
      if (now - this.lastTickTime < 0.035) return;
      this.lastTickTime = now;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      // High-frequency click mimicking a real wheel pin hitting the plastic flapper
      osc.type = "sine";
      osc.frequency.setValueAtTime(1300, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.03);

      // Rapid linear to exponential decay for clean impact
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {
      // Gracefully catch any background context errors
    }
  }

  /**
   * Synthesizes a glorious C-Major Pentatonic arpeggio win chime
   */
  playWin() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      
      const playTone = (freq: number, delay: number, duration: number, volume: number) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Add a subtle vibrato to make it sound extra premium & shiny
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(12, now + delay);
        lfoGain.gain.setValueAtTime(5, now + delay);
        
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        // Sweet triangle/sine combo for warm chime timbre
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + delay);

        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(volume, now + delay + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);

        lfo.start(now + delay);
        osc.start(now + delay);

        lfo.stop(now + delay + duration);
        osc.stop(now + delay + duration);
      };

      // Pentatonic scale arpeggio notes (C5, D5, E5, G5, C6)
      const notes = [523.25, 587.33, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        playTone(freq, idx * 0.09, 0.45, 0.12);
      });
    } catch (e) {
      // Catch silently
    }
  }

  /**
   * Synthesizes a comical sliding downward pitch for land on BOMBs or ZONKs
   */
  playZonk() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      // Low buzz sawtooth wave sliding downwards
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(70, now + 0.55);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc.start(now);
      osc.stop(now + 0.55);
    } catch (e) {
      // Catch silently
    }
  }
}

export const gameAudio = new GameAudio();
