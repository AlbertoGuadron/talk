"use client";

import { useState, useMemo } from "react";
import type { PostData } from "@/types";
import { NETWORK_COLORS } from "@/lib/talks-config";

interface Props {
  posts: PostData[];
  color: string;
  hasCategoria?: boolean;
}

const PLATFORM_ORDER = ["FACEBOOK", "INSTAGRAM", "TIKTOK", "TWITTER", "YOUTUBE"];
const PLATFORM_LABELS: Record<string, string> = {
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  TWITTER: "Twitter",
  YOUTUBE: "YouTube",
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

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("es-SV", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function toTitleCase(str: string): string {
  return str.trim().replace(/\s+/g, " ").toLowerCase().split(" ").filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

// ── Individual post card ──────────────────────────────────────────────────────
function PostCard({ post, color }: { post: PostData; color: string }) {
  const [imgError, setImgError] = useState(false);
  const netColor = NETWORK_COLORS[post.network] ?? color;
  const hasImg = Boolean(post.imageLink) && !imgError;

  return (
    <div
      className="glass rounded-2xl overflow-hidden flex flex-col"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Thumbnail */}
      <div className="relative w-full" style={{ height: 172 }}>
        {hasImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.imageLink}
            alt={post.profile}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <a
            href={post.link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-full flex flex-col items-center justify-center gap-2 cursor-pointer"
            style={{ background: `linear-gradient(135deg, ${netColor}18, ${netColor}08)` }}
          >
            <span className="text-5xl">{NETWORK_ICONS[post.network] ?? "📱"}</span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: `${netColor}30`, color: netColor }}>
              Ver en {PLATFORM_LABELS[post.network] ?? post.network}
            </span>
          </a>
        )}
        {/* Platform badge */}
        <div
          className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-xs font-bold shadow"
          style={{ background: netColor, color: "#fff" }}
        >
          {PLATFORM_LABELS[post.network] ?? post.network}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Engagement + date */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">{formatDate(post.date)}</span>
          <span className="font-black text-base" style={{ color }}>
            ❤️ {fmt(post.engagement)}
          </span>
        </div>

        {/* Category */}
        {post.categoria && (
          <span
            className="self-start text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: `${color}20`, color }}
          >
            {toTitleCase(post.categoria)}
          </span>
        )}

        {/* Message excerpt */}
        {post.message && (
          <p
            className="text-xs text-slate-400 leading-relaxed"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.message}
          </p>
        )}

        {/* Link */}
        {post.link && (
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto pt-2 text-xs font-semibold inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
            style={{ color: netColor }}
          >
            Ver publicación →
          </a>
        )}
      </div>
    </div>
  );
}

// ── Main grid component ───────────────────────────────────────────────────────
export default function TopPostsGrid({ posts, color, hasCategoria }: Props) {
  const [activeNetwork, setActiveNetwork] = useState("TODOS");
  const [activeCategoria, setActiveCategoria] = useState("TODAS");

  const networks = useMemo(() => {
    const nets = Array.from(new Set(posts.map((p) => p.network).filter(Boolean)));
    return PLATFORM_ORDER.filter((n) => nets.includes(n));
  }, [posts]);

  const categorias = useMemo(() => {
    if (!hasCategoria) return [];
    const base = activeNetwork === "TODOS" ? posts : posts.filter((p) => p.network === activeNetwork);
    return Array.from(new Set(base.map((p) => p.categoria).filter(Boolean))).sort();
  }, [posts, hasCategoria, activeNetwork]);

  const isCategoryFiltered = hasCategoria && activeCategoria !== "TODAS";
  const displayCount = isCategoryFiltered ? 5 : 10;

  const filtered = useMemo(() => {
    let result = posts;
    if (activeNetwork !== "TODOS") result = result.filter((p) => p.network === activeNetwork);
    if (hasCategoria && activeCategoria !== "TODAS") result = result.filter((p) => p.categoria === activeCategoria);
    return result.slice(0, displayCount);
  }, [posts, activeNetwork, activeCategoria, hasCategoria, displayCount]);

  if (posts.length === 0) return null;

  const tabs = ["TODOS", ...networks];

  return (
    <div className="mb-5">
      <div
        className="glass rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Platform tab bar */}
        <div
          className="flex gap-1 px-4 pt-4 flex-wrap"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          {tabs.map((tab) => {
            const isActive = tab === activeNetwork;
            const tabColor = tab === "TODOS" ? color : (NETWORK_COLORS[tab] ?? color);
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveNetwork(tab);
                  setActiveCategoria("TODAS");
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-all duration-150"
                style={{
                  color: isActive ? tabColor : "#64748B",
                  background: isActive ? `${tabColor}18` : "transparent",
                  borderBottom: isActive ? `2px solid ${tabColor}` : "2px solid transparent",
                }}
              >
                {tab === "TODOS" ? "Todos" : (PLATFORM_LABELS[tab] ?? tab)}
              </button>
            );
          })}
        </div>

        <div className="p-5 pt-4">
          {/* Section title */}
          <div className="mb-4">
            <h3 className="font-bold text-white text-base">
              {isCategoryFiltered
                ? `Top 5 Publicaciones — ${toTitleCase(activeCategoria)}`
                : "Top 10 Publicaciones del Período"}
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Publicaciones con mayor engagement del mes
            </p>
          </div>

          {/* Category filter pills */}
          {hasCategoria && categorias.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-5">
              {["TODAS", ...categorias].map((cat) => {
                const isActive = cat === activeCategoria;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoria(cat)}
                    className="px-3 py-1 text-xs font-semibold rounded-full border transition-all duration-150"
                    style={{
                      background: isActive ? `${color}22` : "transparent",
                      color: isActive ? color : "#64748B",
                      borderColor: isActive ? `${color}60` : "rgba(255,255,255,0.1)",
                    }}
                  >
                    {cat === "TODAS" ? "Todas" : toTitleCase(cat)}
                  </button>
                );
              })}
            </div>
          )}

          {/* Post cards grid */}
          {filtered.length > 0 ? (
            <div className={`grid gap-4 ${isCategoryFiltered ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"}`}>
              {filtered.map((post, i) => (
                <PostCard key={`${post.link || i}`} post={post} color={color} />
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 text-sm py-10">
              No hay publicaciones para este filtro.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
