"use client";

import { useState, useEffect, useCallback } from "react";
import type { ChartDataPoint } from "@/types";

interface Props {
  data: ChartDataPoint[];
  color: string;
  title?: string;
  subtitle?: string;
}

function fmt(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return String(v);
}

function SlideImg({ src, color }: { src?: string; color: string }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${color}25, ${color}08)` }}
      >
        <span className="text-7xl opacity-30">🏆</span>
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt=""
      className="w-full h-full object-contain p-8"
      onError={() => setErr(true)}
    />
  );
}

function ThumbImg({ src, color }: { src?: string; color: string }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div className="w-full h-full" style={{ background: `${color}20` }} />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img src={src} alt="" className="w-full h-full object-cover" onError={() => setErr(true)} />
  );
}

export default function ReaccionesCarousel({
  data,
  color,
  title = "Top 10 Reacciones del Mes",
  subtitle = "Categorías con mayor engagement",
}: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const total = data.length;

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
    setAnimKey((k) => k + 1);
  }, []);

  const prev = useCallback(() => goTo((current - 1 + total) % total), [current, total, goTo]);
  const next = useCallback(() => goTo((current + 1) % total), [current, total, goTo]);

  useEffect(() => {
    if (paused || total <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [paused, next, total]);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const d = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(d) > 40) d > 0 ? next() : prev();
    setTouchStart(null);
  };

  if (total === 0) return null;

  const slide = data[current];

  return (
    <div
      className="glass rounded-2xl overflow-hidden mb-5"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Header ───────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-5 pt-4 pb-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div>
          <h3 className="font-bold text-white text-base">{title}</h3>
          <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>
        </div>
        <span className="text-xs text-slate-500 tabular-nums">{current + 1} / {total}</span>
      </div>

      {/* ── Slide principal ──────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: 320 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Imagen */}
        <div key={animKey} className="absolute inset-0" style={{ animation: "fadeIn 0.5s ease both" }}>
          <SlideImg src={slide.imageLink} color={color} />
        </div>

        {/* Gradiente inferior */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(4,8,20,0.97) 0%, rgba(4,8,20,0.6) 35%, rgba(4,8,20,0.1) 60%, transparent 100%)",
          }}
        />

        {/* Gradiente lateral izquierdo (suaviza bordes) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to right, ${color}18 0%, transparent 25%, transparent 75%, ${color}18 100%)`,
          }}
        />

        {/* Flecha izquierda */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{ background: "rgba(0,0,0,0.55)", border: `1px solid ${color}40`, color }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Flecha derecha */}
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{ background: "rgba(0,0,0,0.55)", border: `1px solid ${color}40`, color }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Info de la categoría */}
        <div
          key={`text-${animKey}`}
          className="absolute bottom-0 left-0 right-0 px-6 pb-6"
          style={{ animation: "slideUp 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
        >
          {/* Rank badge */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-widest"
              style={{ background: `${color}30`, color, border: `1px solid ${color}50` }}
            >
              #{current + 1}
            </span>
            <span className="text-slate-400 text-xs font-medium">
              {fmt(slide.value)} engagement
            </span>
          </div>

          {/* Nombre categoría */}
          <p className="text-white font-black text-3xl sm:text-4xl leading-tight drop-shadow-2xl">
            {slide.name}
          </p>

          {/* Barra de progreso */}
          <div className="mt-3 h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
            <div
              className="h-full rounded-full transition-all duration-[5000ms] ease-linear"
              style={{
                width: paused ? "0%" : "100%",
                background: `linear-gradient(to right, ${color}, ${color}80)`,
                transitionDuration: paused ? "0ms" : "5000ms",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Thumbnails ───────────────────────────────────── */}
      <div className="px-5 py-3">
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {data.map((slide, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="flex-shrink-0 relative rounded-xl overflow-hidden transition-all duration-300"
              style={{
                width: 56,
                height: 56,
                border: `2px solid ${i === current ? color : "rgba(255,255,255,0.08)"}`,
                opacity: i === current ? 1 : 0.45,
                transform: i === current ? "scale(1.08)" : "scale(1)",
                boxShadow: i === current ? `0 0 12px ${color}70` : "none",
              }}
            >
              <ThumbImg src={slide.imageLink} color={color} />
              {/* Rank badge sobre thumbnail */}
              <div
                className="absolute inset-0 flex items-end justify-center pb-0.5"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent 55%)" }}
              >
                <span
                  className="font-black"
                  style={{ fontSize: 9, color: i === current ? color : "#fff" }}
                >
                  #{i + 1}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes slideUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
