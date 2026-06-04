"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { ChartDataPoint } from "@/types";
import { NETWORK_COLORS } from "@/lib/talks-config";

interface Props {
  data: ChartDataPoint[];
  color: string;
}

const PLATFORM_LABELS: Record<string, string> = {
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  TWITTER: "Twitter",
  YOUTUBE: "YouTube",
  LINKEDIN: "LinkedIn",
};
const NETWORK_ICONS: Record<string, string> = {
  FACEBOOK: "📘", INSTAGRAM: "📸", TIKTOK: "🎵", TWITTER: "𝕏", YOUTUBE: "▶️",
};

const AUTO_DELAY = 4000;

function SlideImage({ src, network, color }: { src?: string; network?: string; color: string }) {
  const [err, setErr] = useState(false);
  const netColor = NETWORK_COLORS[network ?? ""] ?? color;
  if (!src || err) {
    return (
      <div className="w-full h-full flex items-center justify-center text-7xl"
        style={{ background: `linear-gradient(135deg, ${netColor}18, ${netColor}06)` }}>
        {NETWORK_ICONS[network ?? ""] ?? "📱"}
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className="w-full h-full object-cover" onError={() => setErr(true)} />;
}

function ThumbImage({ src, network, color }: { src?: string; network?: string; color: string }) {
  const [err, setErr] = useState(false);
  const netColor = NETWORK_COLORS[network ?? ""] ?? color;
  if (!src || err) {
    return (
      <div className="w-full h-full flex items-center justify-center text-lg"
        style={{ background: `${netColor}22` }}>
        {NETWORK_ICONS[network ?? ""] ?? "📱"}
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className="w-full h-full object-cover" onError={() => setErr(true)} />;
}

export default function ReaccionesCarousel({ data, color }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = data.length;

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
    setProgress(0);
  }, []);

  const prev = useCallback(() => goTo((current - 1 + total) % total), [current, total, goTo]);
  const next = useCallback(() => goTo((current + 1) % total), [current, total, goTo]);

  // Progress bar + auto-advance
  useEffect(() => {
    if (paused || total <= 1) return;
    setProgress(0);
    const step = 100 / (AUTO_DELAY / 50);
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          next();
          return 0;
        }
        return p + step;
      });
    }, 50);
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, [current, paused, total, next]);

  if (total === 0) return null;

  const item = data[current];
  const netColor = NETWORK_COLORS[item.network ?? ""] ?? color;

  return (
    <div
      className="glass rounded-2xl overflow-hidden mb-5"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Main slide ──────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ height: 420 }}>

        {/* All slides stacked, sliding via transform */}
        <div className="absolute inset-0" style={{ display: "flex" }}>
          {data.map((slide, i) => (
            <div
              key={i}
              className="absolute inset-0 w-full h-full"
              style={{
                transform: `translateX(${(i - current) * 100}%)`,
                transition: "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              <SlideImage src={slide.imageLink} network={slide.network} color={color} />
            </div>
          ))}
        </div>

        {/* Dark gradient overlays */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(5,10,25,0.92) 0%, rgba(5,10,25,0.3) 45%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(5,10,25,0.4) 0%, transparent 30%)" }} />

        {/* ── Top bar: title + arrows ── */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-4 z-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color }}>Top 10 Reacciones</p>
            <p className="text-white text-xs opacity-60 mt-0.5">Perfiles con mayor engagement</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prev}
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold backdrop-blur-sm transition-all hover:scale-110"
              style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>
              ‹
            </button>
            <span className="text-xs text-white opacity-50 w-8 text-center">{current + 1}/{total}</span>
            <button onClick={next}
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold backdrop-blur-sm transition-all hover:scale-110"
              style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>
              ›
            </button>
          </div>
        </div>

        {/* ── Network badge ── */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold shadow-lg"
            style={{ background: netColor, color: "#fff" }}>
            {PLATFORM_LABELS[item.network ?? ""] ?? item.network}
          </span>
        </div>

        {/* ── Bottom info ── */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-5 z-10">
          {/* Rank */}
          <div className="flex items-end gap-4">
            <span
              className="text-8xl font-black leading-none"
              style={{
                color: "transparent",
                WebkitTextStroke: `2px ${color}`,
                textShadow: `0 0 40px ${color}60`,
                lineHeight: 1,
              }}
            >
              #{current + 1}
            </span>
            <div className="pb-2">
              <p className="text-white font-black text-xl leading-tight drop-shadow-lg">
                {item.name}
              </p>
            </div>
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 z-20" style={{ background: "rgba(255,255,255,0.1)" }}>
          <div
            className="h-full transition-none"
            style={{ width: `${progress}%`, background: color, transition: paused ? "none" : "width 50ms linear" }}
          />
        </div>
      </div>

      {/* ── Thumbnail strip ─────────────────────────────── */}
      <div className="px-4 py-3" style={{ background: "rgba(0,0,0,0.2)" }}>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {data.map((slide, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="flex-shrink-0 rounded-lg overflow-hidden relative transition-all duration-200"
              style={{
                width: 56,
                height: 40,
                border: `2px solid ${i === current ? color : "transparent"}`,
                opacity: i === current ? 1 : 0.45,
                transform: i === current ? "scale(1.08)" : "scale(1)",
                boxShadow: i === current ? `0 0 8px ${color}80` : "none",
              }}
            >
              <ThumbImage src={slide.imageLink} network={slide.network} color={color} />
              {/* Rank label */}
              <div className="absolute bottom-0 left-0 right-0 text-center"
                style={{ background: "rgba(0,0,0,0.55)", fontSize: 9, color: i === current ? color : "#fff", fontWeight: 700, lineHeight: "14px" }}>
                #{i + 1}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
