"use client";

import { useState, useMemo, useEffect } from "react";
import type { ProfileData } from "@/types";
import TopBarChart from "./TopBarChart";
import { NETWORK_COLORS } from "@/lib/talks-config";

interface Props {
  profiles: ProfileData[];
  field: "publicaciones" | "likes" | "seguidores";
  color: string;
  title: string;
  subtitle?: string;
}

const PLATFORM_ORDER = ["FACEBOOK", "INSTAGRAM", "TIKTOK", "TWITTER", "YOUTUBE", "LINKEDIN"];

const PLATFORM_LABELS: Record<string, string> = {
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  TWITTER: "Twitter",
  YOUTUBE: "YouTube",
  LINKEDIN: "LinkedIn",
};

export default function TopBarChartTabbed({ profiles, field, color, title, subtitle }: Props) {
  const [activeNetwork, setActiveNetwork] = useState<string>("TODOS");

  const networks = useMemo(() => {
    const nets = Array.from(new Set(profiles.map((p) => p.network).filter(Boolean)));
    return PLATFORM_ORDER.filter((n) => nets.includes(n));
  }, [profiles]);

  const chartData = useMemo(() => {
    if (activeNetwork === "TODOS") {
      // Aggregate by brand name across all platforms
      const map: Record<string, number> = {};
      for (const p of profiles) {
        if (p[field] > 0) map[p.profile] = (map[p.profile] || 0) + p[field];
      }
      return Object.entries(map)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([name, value]) => ({ name, value, fill: color }));
    }
    return profiles
      .filter((p) => p.network === activeNetwork && p[field] > 0)
      .sort((a, b) => b[field] - a[field])
      .slice(0, 10)
      .map((p) => ({
        name: p.profile,
        value: p[field],
        network: p.network,
        fill: NETWORK_COLORS[activeNetwork] ?? color,
      }));
  }, [profiles, field, activeNetwork, color]);

  const tabs = ["TODOS", ...networks];

  return (
    <div
      className="glass rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Tab bar */}
      <div
        className="flex gap-1 px-4 pt-4 pb-0 flex-wrap"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {tabs.map((tab) => {
          const isActive = tab === activeNetwork;
          const tabColor = tab === "TODOS" ? color : (NETWORK_COLORS[tab] ?? color);
          return (
            <button
              key={tab}
              onClick={() => setActiveNetwork(tab)}
              className="px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-all duration-150 mb-0"
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

      {/* Chart — reuse TopBarChart but without its outer wrapper */}
      <div className="p-5 pt-4">
        <div className="mb-4">
          <h3 className="font-bold text-white text-base">{title}</h3>
          {subtitle && <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>}
        </div>
        <InnerBarChart data={chartData} color={activeNetwork === "TODOS" ? color : (NETWORK_COLORS[activeNetwork] ?? color)} />
      </div>
    </div>
  );
}

// ── inline mini bar chart (avoids double card wrapper) ──────────────────────
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import type { ChartDataPoint } from "@/types";

function fmtDefault(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return String(v);
}

function hexToRgb(hex: string) {
  const c = hex.replace("#", "");
  return `${parseInt(c.slice(0, 2), 16)},${parseInt(c.slice(2, 4), 16)},${parseInt(c.slice(4, 6), 16)}`;
}

const DarkTooltip = ({
  active, payload, color,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: ChartDataPoint }>;
  color: string;
}) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div
      className="rounded-xl p-3 text-sm shadow-xl"
      style={{ background: "#0F1A35", border: "1px solid rgba(255,255,255,0.1)" }}
    >
      <p className="font-semibold text-white max-w-[200px] leading-tight">{item.payload.name}</p>
      {item.payload.network && (
        <p className="text-slate-500 text-xs mt-0.5">{item.payload.network}</p>
      )}
      <p className="font-black mt-1" style={{ color }}>{fmtDefault(item.value)}</p>
    </div>
  );
};

function InnerBarChart({ data, color }: { data: ChartDataPoint[]; color: string }) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const rgb = hexToRgb(color);
  const yAxisWidth = isMobile ? 95 : 140;
  const maxChars = isMobile ? 13 : 22;
  const chartHeight = isMobile ? 260 : 320;
  const truncate = (s: string) => s.length > maxChars ? s.slice(0, maxChars) + "…" : s;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis
          type="number"
          tickFormatter={fmtDefault}
          tick={{ fontSize: 10, fill: "#475569" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={yAxisWidth}
          tickFormatter={truncate}
          tick={{ fontSize: 10, fill: "#64748B" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          content={<DarkTooltip color={color} />}
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={18}>
          {data.map((_, idx) => (
            <Cell key={idx} fill={`rgba(${rgb}, ${1 - idx * 0.07})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
