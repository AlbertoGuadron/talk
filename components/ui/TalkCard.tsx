"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { TalkConfig } from "@/types";

interface Props {
  talk: TalkConfig;
  delay?: number;
}

export default function TalkCard({ talk, delay = 0 }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/${talk.slug}`}
      className={`group glass rounded-3xl overflow-hidden transition-all duration-300 animate-fade-up`}
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
        <p className="text-slate-400 text-sm text-center leading-relaxed mb-5">
          {talk.description}
        </p>
        <div
          className="flex items-center justify-center gap-1.5 text-sm font-semibold"
          style={{ color: talk.color }}
        >
          Ver ranking
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
