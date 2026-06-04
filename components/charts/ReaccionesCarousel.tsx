"use client";

import { useState, useEffect, useCallback } from "react";
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
  FACEBOOK: "📘",
  INSTAGRAM: "📸",
  TIKTOK: "🎵",
  TWITTER: "𝕏",
  YOUTUBE: "▶️",
};

function fmt(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return String(v);
}

function CardImage({ src, network, color }: { src?: string; network?: string; color: string }) {
  const [err, setErr] = useState(false);
  const netColor = NETWORK_COLORS[network ?? ""] ?? color;
  if (!src || err) {
    return (
      <div className="w-full h-full flex items-center justify-center text-4xl"
        style={{ background: `${netColor}18` }}>
        {NETWORK_ICONS[network ?? ""] ?? "📱"}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className="w-full h-full object-cover" onError={() => setErr(true)} />
  );
}

export default function ReaccionesCarousel({ data, color }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = data.length;

  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);

  // Auto-advance every 4 seconds
  useEffect(() => {
    if (paused || total <= 1) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [paused, next, total]);

  if (total === 0) return null;

  // Visible cards: 4 on xl, 3 on lg, 2 on sm, 1 on mobile
  // We render a sliding window of 4 cards around current
  const VISIBLE = 4;
  const slides = Array.from({ length: VISIBLE }, (_, i) => data[(current + i) % total]);

  return (
    <div
      className="glass rounded-2xl overflow-hidden mb-5"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div>
          <h3 className="font-bold text-white text-base">Top 10 Reacciones del Mes</h3>
          <p className="text-slate-500 text-xs mt-0.5">Perfiles con mayor engagement del período</p>
        </div>
        {/* Navigation arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background: `${color}20`, color }}
            aria-label="Anterior"
          >
            ‹
          </button>
          <span className="text-xs text-slate-500 min-w-[40px] text-center">
            {current + 1} / {total}
          </span>
          <button
            onClick={next}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background: `${color}20`, color }}
            aria-label="Siguiente"
          >
            ›
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {slides.map((item, i) => {
            const rank = (current + i) % total;
            const netColor = NETWORK_COLORS[item.network ?? ""] ?? color;
            return (
              <div
                key={`${item.name}-${rank}`}
                className="glass rounded-xl overflow-hidden flex flex-col transition-transform duration-300"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {/* Image */}
                <div className="relative" style={{ height: 160 }}>
                  <CardImage src={item.imageLink} network={item.network} color={color} />
                  {/* Rank badge */}
                  <div
                    className="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow"
                    style={{ background: color, color: "#fff" }}
                  >
                    {rank + 1}
                  </div>
                  {/* Network badge */}
                  <div
                    className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold shadow"
                    style={{ background: netColor, color: "#fff" }}
                  >
                    {PLATFORM_LABELS[item.network ?? ""] ?? item.network}
                  </div>
                  {/* Gradient overlay */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-12"
                    style={{ background: "linear-gradient(to top, rgba(10,16,32,0.9), transparent)" }}
                  />
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col gap-1 flex-1">
                  <p className="font-bold text-white text-sm leading-tight line-clamp-1">
                    {item.name}
                  </p>
                  <p className="font-black text-lg leading-none" style={{ color }}>
                    ❤️ {fmt(item.value)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-4">
          {data.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all duration-200"
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                background: i === current ? color : "rgba(255,255,255,0.2)",
              }}
              aria-label={`Ir a ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
