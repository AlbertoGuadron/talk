"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { ChartDataPoint } from "@/types";

interface Props {
  data: ChartDataPoint[];
  color: string;
  formatValue?: (v: number) => string;
  title: string;
  subtitle?: string;
}

function fmtDefault(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return String(v);
}

function hexToRgb(hex: string) {
  const c = hex.replace("#", "");
  return `${parseInt(c.slice(0,2),16)},${parseInt(c.slice(2,4),16)},${parseInt(c.slice(4,6),16)}`;
}

const DarkTooltip = ({
  active, payload, color, fmt,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: ChartDataPoint }>;
  color: string;
  fmt: (v: number) => string;
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
      <p className="font-black mt-1" style={{ color }}>{fmt(item.value)}</p>
    </div>
  );
};

export default function TopBarChart({ data, color, formatValue = fmtDefault, title, subtitle }: Props) {
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
    <div
      className="glass rounded-2xl p-5 hover:border-white/10 transition-all duration-300"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="mb-4">
        <h3 className="font-bold text-white text-base">{title}</h3>
        {subtitle && <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>}
      </div>
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
            content={<DarkTooltip color={color} fmt={formatValue} />}
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={18}>
            {data.map((_, idx) => (
              <Cell key={idx} fill={`rgba(${rgb}, ${1 - idx * 0.07})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
