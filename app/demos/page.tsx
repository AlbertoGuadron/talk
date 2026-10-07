import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Demos – TALK Digital Insights",
  description: "Reportes de demostración de los TALK por país y categoría.",
};

const BUCKET = "talk-images";
const DEMOS_PREFIX = "demos";

interface DemoFile {
  name: string;
  viewUrl: string;
  talk: string;
  country: string;
  countryFlag: string;
  period: string;
  color: string;
}

const TALK_COLORS: Record<string, string> = {
  foodtalk:    "#FF6B35",
  housetalk:   "#10B981",
  markettalk:  "#6366F1",
  retailtalk:  "#F59E0B",
  moneytalk:   "#3B82F6",
  tourismtalk: "#EC4899",
};

const COUNTRY_MAP: Record<string, { name: string; flag: string }> = {
  SV:  { name: "El Salvador", flag: "🇸🇻" },
  GT:  { name: "Guatemala",   flag: "🇬🇹" },
  HN:  { name: "Honduras",    flag: "🇭🇳" },
  HND: { name: "Honduras",    flag: "🇭🇳" },
};

function parseDemoFilename(name: string) {
  const noExt = name.replace(/\.pdf$/i, "");
  const parts = noExt.split(/\s+/);

  const talkRaw = (parts[0] ?? "").toUpperCase();
  const talk = talkRaw.charAt(0) + talkRaw.slice(1).toLowerCase();
  const talkSlug = talkRaw.toLowerCase();

  const countryRaw = (parts[1] ?? "").toUpperCase();
  const countryInfo = COUNTRY_MAP[countryRaw] ?? { name: countryRaw, flag: "🌎" };

  const demoIdx = parts.findIndex(p => p.toUpperCase() === "DEMO");
  const periodParts = parts.slice(2, demoIdx > 2 ? demoIdx : undefined);
  const period = periodParts
    .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(" ") || "Demo";

  return {
    talk,
    country: countryInfo.name,
    countryFlag: countryInfo.flag,
    period,
    color: TALK_COLORS[talkSlug] ?? "#6366F1",
  };
}

async function getDemos(): Promise<DemoFile[]> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return [];

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: files, error } = await supabase.storage
    .from(BUCKET)
    .list(DEMOS_PREFIX, { sortBy: { column: "name", order: "asc" } });

  if (error || !files) return [];

  return files
    .filter(f => f.name.toLowerCase().endsWith(".pdf"))
    .map(f => {
      const parsed = parseDemoFilename(f.name);
      const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(`${DEMOS_PREFIX}/${f.name}`);
      return {
        name: f.name,
        viewUrl: data.publicUrl,
        ...parsed,
      };
    });
}

export default async function DemosPage() {
  const demos = await getDemos();

  return (
    <div className="pt-28 pb-16 px-4 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: "rgba(99,102,241,0.15)", color: "#818CF8" }}
          >
            Reportes Demo
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight">
          Demos TALK
        </h1>
        <p className="text-slate-400 text-base max-w-2xl">
          Reportes de muestra de nuestros análisis de mercado por país y categoría.
          Haz clic para ver el reporte o descárgalo directamente.
        </p>
      </div>

      {/* Grid */}
      {demos.length === 0 ? (
        <div
          className="rounded-3xl p-12 text-center"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-slate-500 text-lg">No hay demos disponibles aún.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {demos.map(demo => (
            <div
              key={demo.name}
              className="rounded-3xl p-6 flex flex-col gap-4 transition-all duration-300 hover:scale-[1.015]"
              style={{
                background: "linear-gradient(135deg, #0A1020 0%, #0D1535 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Icon + badges */}
              <div className="flex items-start justify-between gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${demo.color}18`, border: `1px solid ${demo.color}30` }}
                >
                  📄
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: `${demo.color}20`, color: demo.color }}
                  >
                    {demo.talk}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 text-slate-400">
                    {demo.countryFlag} {demo.country}
                  </span>
                </div>
              </div>

              {/* Title */}
              <div>
                <h3 className="text-white font-black text-lg leading-tight">
                  {demo.talk} {demo.country}
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  {demo.period}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-auto pt-1">
                <a
                  href={demo.viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80 active:scale-[0.97]"
                  style={{
                    background: `${demo.color}20`,
                    color: demo.color,
                    border: `1px solid ${demo.color}30`,
                  }}
                >
                  Ver demo
                </a>
                <a
                  href={`/api/demos/download?file=${encodeURIComponent(demo.name)}`}
                  className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80 active:scale-[0.97]"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "#e2e8f0",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  Descargar
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div
        className="rounded-3xl p-8 text-center mt-12"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(255,20,147,0.08) 100%)",
          border: "1px solid rgba(99,102,241,0.2)",
        }}
      >
        <h3 className="text-xl md:text-2xl font-black text-white mb-2">
          ¿Le interesa un reporte completo para su marca?
        </h3>
        <p className="text-slate-400 text-sm mb-6 max-w-xl mx-auto">
          Contáctenos para recibir un análisis personalizado de su categoría y mercado.
        </p>
        <Link
          href="/cotizar"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #FF1493, #00B4D8)",
            color: "white",
          }}
        >
          Agenda una reunión →
        </Link>
      </div>

    </div>
  );
}
