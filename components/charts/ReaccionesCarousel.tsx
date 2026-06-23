"use client";

import { useState, useEffect, useCallback } from "react";
import type { ChartDataPoint } from "@/types";
import { NETWORK_COLORS } from "@/lib/talks-config";

interface Props {
  data: ChartDataPoint[];
  color: string;
  title?: string;
  subtitle?: string;
}

const NETWORK_ICONS: Record<string, string> = {
  FACEBOOK: "📘", INSTAGRAM: "📸", TIKTOK: "🎵", TWITTER: "𝕏", YOUTUBE: "▶️",
};

function CardImg({ src, network, color }: { src?: string; network?: string; color: string }) {
  const [err, setErr] = useState(false);
  const nc = NETWORK_COLORS[network ?? ""] ?? color;
  if (!src || err) {
    return (
      <div className="w-full h-full flex items-center justify-center text-6xl"
        style={{ background: `linear-gradient(135deg,${nc}20,${nc}06)` }}>
        {NETWORK_ICONS[network ?? ""] ?? "📱"}
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className="w-full h-full object-cover" onError={() => setErr(true)} />;
}

function ThumbImg({ src, network, color }: { src?: string; network?: string; color: string }) {
  const [err, setErr] = useState(false);
  const nc = NETWORK_COLORS[network ?? ""] ?? color;
  if (!src || err) {
    return (
      <div className="w-full h-full flex items-center justify-center text-base"
        style={{ background: `${nc}22` }}>
        {NETWORK_ICONS[network ?? ""] ?? "📱"}
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className="w-full h-full object-cover" onError={() => setErr(true)} />;
}

export default function ReaccionesCarousel({ data, color, title = "Top 10 Reacciones del Mes", subtitle = "Perfiles con mayor engagement" }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused]   = useState(false);
  const [tilt, setTilt]       = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [textKey, setTextKey] = useState(0); // trigger text re-animation
  const total = data.length;

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
    setTextKey(k => k + 1);
  }, []);
  const prev = useCallback(() => goTo((current - 1 + total) % total), [current, total, goTo]);
  const next = useCallback(() => goTo((current + 1) % total), [current, total, goTo]);

  // Auto-advance
  useEffect(() => {
    if (paused || total <= 1) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [paused, next, total]);

  // 3D tilt (center card only)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 14;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -10;
    setTilt({ x: y, y: x });
  };

  // Swipe
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd   = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const d = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(d) > 40) d > 0 ? next() : prev();
    setTouchStart(null);
  };

  if (total === 0) return null;

  // Card transform per position offset
  const cardStyle = (pos: number): React.CSSProperties => {
    const abs = Math.abs(pos);
    if (abs > 2) return { opacity: 0, pointerEvents: "none", position: "absolute", width: "100%" };

    const base: React.CSSProperties = {
      position: "absolute",
      left: 0, top: 0,
      width: "100%", height: "100%",
      transition: "transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.55s, filter 0.55s",
      borderRadius: 16,
      overflow: "hidden",
      cursor: abs > 0 ? "pointer" : "default",
    };

    if (pos === 0) {
      return {
        ...base,
        zIndex: 20,
        opacity: 1,
        transform: `scale(1) translateX(0%) perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        filter: "brightness(1)",
        boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${color}30`,
      };
    }
    const sign = pos > 0 ? 1 : -1;
    const offset = abs === 1 ? 78 : 110;
    const rot = sign * -22;
    const scl = abs === 1 ? 0.78 : 0.62;
    const bri = abs === 1 ? 0.45 : 0.25;
    return {
      ...base,
      zIndex: 20 - abs * 5,
      opacity: abs === 1 ? 0.7 : 0.3,
      transform: `scale(${scl}) translateX(${sign * offset}%) perspective(1000px) rotateY(${rot}deg)`,
      filter: `brightness(${bri})`,
    };
  };

  const item = data[current];

  return (
    <div
      className="glass rounded-2xl overflow-hidden mb-5"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); setTilt({ x: 0, y: 0 }); }}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div>
          <h3 className="font-bold text-white text-base">{title}</h3>
          <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prev}
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-all hover:scale-110 active:scale-95"
            style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>‹</button>
          <span className="text-xs text-slate-500 w-10 text-center tabular-nums">{current + 1} / {total}</span>
          <button onClick={next}
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-all hover:scale-110 active:scale-95"
            style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>›</button>
        </div>
      </div>

      {/* ── 3D Coverflow stage ─────────────────────────── */}
      <div className="relative px-2 pt-4 pb-2"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}>

        {/* Glow blob behind active card */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{
            width: "60%", height: "70%",
            background: `radial-gradient(ellipse at center, ${color}35 0%, transparent 70%)`,
            filter: "blur(30px)",
          }} />
        </div>

        {/* Card stage */}
        <div className="relative mx-auto" style={{ height: 380, maxWidth: 700 }}>
          {data.map((slide, i) => {
            const pos = i - current;
            const isCenter = pos === 0;
            return (
              <div
                key={i}
                style={cardStyle(pos)}
                onClick={() => !isCenter && goTo(i)}
                onMouseMove={isCenter ? handleMouseMove : undefined}
                onMouseLeave={isCenter ? () => setTilt({ x: 0, y: 0 }) : undefined}
              >
                {/* Image */}
                <CardImg src={slide.imageLink} network={slide.network} color={color} />

                {/* Bottom gradient */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(to top, rgba(4,8,20,0.95) 0%, rgba(4,8,20,0.4) 40%, transparent 65%)" }} />

                {/* Rank + Name — only animate for center */}
                {isCenter && (
                  <div key={textKey} className="absolute bottom-0 left-0 right-0 px-5 pb-5"
                    style={{ animation: "slideUp 0.45s cubic-bezier(0.22,1,0.36,1) both" }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color }}>
                      #{current + 1}
                    </p>
                    <p className="text-white font-black text-2xl leading-tight drop-shadow-xl">
                      {slide.name}
                    </p>
                  </div>
                )}

                {/* Rank badge for non-center */}
                {!isCenter && (
                  <div className="absolute bottom-4 left-4">
                    <span className="text-white font-black text-sm opacity-80">#{i + 1}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CSS keyframe for text animation */}
        <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }`}</style>
      </div>

      {/* ── Thumbnail strip ────────────────────────────── */}
      <div className="px-5 pb-4">
        <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {data.map((slide, i) => (
            <button key={i} onClick={() => goTo(i)}
              className="flex-shrink-0 relative rounded-lg overflow-hidden transition-all duration-300"
              style={{
                width: 52, height: 36,
                border: `2px solid ${i === current ? color : "rgba(255,255,255,0.1)"}`,
                transform: i === current ? "scale(1.1)" : "scale(1)",
                boxShadow: i === current ? `0 0 10px ${color}60` : "none",
                opacity: i === current ? 1 : 0.5,
              }}>
              <ThumbImg src={slide.imageLink} network={slide.network} color={color} />
              <div className="absolute inset-0 flex items-end justify-center pb-0.5"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)" }}>
                <span className="text-white font-bold" style={{ fontSize: 8, color: i === current ? color : "#fff" }}>#{i + 1}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
