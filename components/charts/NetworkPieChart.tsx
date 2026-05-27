"use client";

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { ChartDataPoint } from "@/types";
import type { PieLabelRenderProps } from "recharts";

interface Props {
  data: ChartDataPoint[];
  title: string;
  subtitle?: string;
  valueLabel?: string;
}

const RADIAN = Math.PI / 180;

function fmtVal(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return String(v);
}

function renderLabel(props: PieLabelRenderProps) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  if (!cx || !cy || !midAngle || !innerRadius || !outerRadius || !percent) return null;
  if (Number(percent) < 0.05) return null;
  const r = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
  const x = Number(cx) + r * Math.cos(-Number(midAngle) * RADIAN);
  const y = Number(cy) + r * Math.sin(-Number(midAngle) * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(Number(percent) * 100).toFixed(0)}%`}
    </text>
  );
}

export default function NetworkPieChart({ data, title, subtitle, valueLabel }: Props) {
  return (
    <div
      className="glass rounded-2xl p-5 hover:border-white/10 transition-all duration-300"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="mb-4">
        <h3 className="font-bold text-white text-base">{title}</h3>
        {subtitle && <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>}
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            outerRadius={95}
            dataKey="value"
            labelLine={false}
            label={renderLabel}
          >
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [fmtVal(Number(value)), valueLabel ?? "valor"]}
            contentStyle={{
              background: "#0F1A35",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              color: "#F8FAFC",
            }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ fontSize: 11, color: "#94A3B8" }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
