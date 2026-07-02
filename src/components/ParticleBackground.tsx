import { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      decay: number;
    }

    const particles: Particle[] = [];
    const colors = ["#06B6D4", "#3B82F6", "#8B5CF6", "#10B981", "#F59E0B"];

    const createParticle = (x: number, y: number, isSparkle = false): Particle => {
      const size = isSparkle ? Math.random() * 2 + 1 : Math.random() * 3 + 1;
      return {
        x,
        y,
        size,
        speedX: (Math.random() - 0.5) * (isSparkle ? 1.5 : 0.6),
        speedY: (Math.random() - 0.5) * (isSparkle ? 1.5 : 0.6) - (isSparkle ? 0.3 : 0.1),
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.3,
        decay: Math.random() * 0.005 + 0.002,
      };
    };

    // Initialize random background stars/particles
    for (let i = 0; i < 40; i++) {
      particles.push(createParticle(Math.random() * width, Math.random() * height));
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background radial glow
      const radialGlow = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      radialGlow.addColorStop(0, "#0b0f19");
      radialGlow.addColorStop(0.5, "#070a13");
      radialGlow.addColorStop(1, "#020408");
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // Add a random sparkle once in a while
      if (Math.random() < 0.1 && particles.length < 70) {
        particles.push(createParticle(Math.random() * width, height - 10, true));
      }

      particles.forEach((p, index) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha -= p.decay;

        // Wrap around borders or regenerate if faded
        if (p.alpha <= 0 || p.y < 0 || p.x < 0 || p.x > width) {
          particles[index] = createParticle(Math.random() * width, height + 10);
          return;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-50 pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
