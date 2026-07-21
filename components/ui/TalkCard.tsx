"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { TalkConfig } from "@/types";

export interface TalkCardStats {
  brands: number;
  posts: number;
  reactions: number;
  lastUpdate: string;
}

interface Props {
  talk: TalkConfig;
  delay?: number;
  href?: string;
  stats?: TalkCardStats;
}

function fmt(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return String(v);
}

export default function TalkCard({ talk, delay = 0, href, stats }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href ?? `/${talk.slug}`}
      className="group glass rounded-3xl overflow-hidden transition-all duration-300 animate-fade-up"
      style={{
        border: hovered ? `1px solid ${talk.color}44` : "1px solid rgba(255,255,255,0.08)",
        boxShadow: hovered ? `0 0 30px ${talk.color}33` : "none",
        transform: hovered ? "scale(1.03)" : "scale(1)",
        animationDelay: `${delay}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${talk.bgGradient}`} />
      <div className="p-8 pb-4 flex justify-center">
        <Image
          src={`/galeria/${talk.slug}.png`}
          alt={talk.label}
          width={260}
          height={80}
          className="h-24 w-auto object-contain drop-shadow-lg transition-transform duration-300"
          style={{ transform: hovered ? "scale(1.05)" : "scale(1)" }}
        />
      </div>
      <div className="px-6 pb-7">
        {stats ? (
          <div className="grid grid-cols-2 gap-2 mb-5">
            <div className="rounded-xl p-2.5 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
              <p className="text-lg font-black text-white leading-none">{fmt(stats.brands)}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Marcas monitoreadas</p>
            </div>
            <div className="rounded-xl p-2.5 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
              <p className="text-lg font-black text-white leading-none">{fmt(stats.posts)}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Publicaciones del mes</p>
            </div>
            <div className="rounded-xl p-2.5 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
              <p className="text-lg font-black text-white leading-none">{fmt(stats.reactions)}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Reacciones generadas</p>
            </div>
            <div className="rounded-xl p-2.5 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
              <p className="text-sm font-bold text-white leading-none">{stats.lastUpdate}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Última actualización</p>
            </div>
          </div>
        ) : (
          <p className="text-slate-400 text-sm text-center leading-relaxed mb-5">
            {talk.description}
          </p>
        )}
        <div
          className="flex items-center justify-center gap-1.5 text-sm font-semibold"
          style={{ color: talk.color }}
        >
          Ver ranking {talk.label}
          <span
            className="transition-transform duration-200"
            style={{ transform: hovered ? "translateX(4px)" : "translateX(0)" }}
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
