"use client";

import Link from "next/link";
import { TalkDashboardData, TalkConfig, ProfileData } from "@/types";
import TalkHeader from "@/components/ui/TalkHeader";
import StatsCard from "@/components/ui/StatsCard";
import TopBarChart from "@/components/charts/TopBarChart";
import TopBarChartCategoryTabbed from "@/components/charts/TopBarChartCategoryTabbed";
import ReaccionesCarousel from "@/components/charts/ReaccionesCarousel";
import TopPostsGrid from "@/components/TopPostsGrid";

interface Props {
  data: TalkDashboardData;
  config: TalkConfig;
}

function fmt(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return String(v);
}

function computeHallazgos(profiles: ProfileData[], hasCategoria: boolean): [string, string, string] {
  if (hasCategoria && profiles.some(p => p.categoria)) {
    const cats = new Map<string, { posts: number; reactions: number; followers: number }>();
    for (const p of profiles) {
      const cat = p.categoria || "Sin categoría";
      const prev = cats.get(cat) ?? { posts: 0, reactions: 0, followers: 0 };
      cats.set(cat, {
        posts: prev.posts + p.publicaciones,
        reactions: prev.reactions + p.likes + p.comentarios + p.compartidos,
        followers: prev.followers + p.seguidores,
      });
    }
    const arr = Array.from(cats.entries()).map(([name, v]) => ({ name, ...v }));
    const byPosts = [...arr].sort((a, b) => b.posts - a.posts);
    const byReactions = [...arr].sort((a, b) => b.reactions - a.reactions);
    const byEff = [...arr]
      .filter(c => c.followers > 0)
      .sort((a, b) => b.reactions / b.followers - a.reactions / a.followers);

    return [
      `${byPosts[0]?.name ?? "—"} dominó la actividad con el mayor volumen de publicaciones del período.`,
      `${byReactions[0]?.name ?? "—"} lideró el impacto con las mayores reacciones generadas.`,
      `${byEff[0]?.name ?? "—"} destacó por su eficiencia, logrando el mejor engagement relativo a su audiencia.`,
    ];
  }

  const byPosts = [...profiles].sort((a, b) => b.publicaciones - a.publicaciones);
  const byReactions = [...profiles].sort(
    (a, b) => (b.likes + b.comentarios + b.compartidos) - (a.likes + a.comentarios + a.compartidos)
  );
  const byEff = [...profiles]
    .filter(p => p.seguidores > 0)
    .sort((a, b) => {
      const eA = (a.likes + a.comentarios + a.compartidos) / a.seguidores;
      const eB = (b.likes + b.comentarios + b.compartidos) / b.seguidores;
      return eB - eA;
    });

  return [
    `${byPosts[0]?.profile ?? "—"} dominó la actividad con el mayor volumen de publicaciones.`,
    `${byReactions[0]?.profile ?? "—"} generó el mayor impacto en reacciones durante el período.`,
    `${byEff[0]?.profile ?? "—"} destacó por su eficiencia en engagement relativo a su audiencia.`,
  ];
}

export default function TalkDashboard({ data, config }: Props) {
  const {
    meta, stats, profiles,
    carouselItems,
    topReacciones, topPublicaciones, topSeguidores,
    porRedPublicaciones, porRedReacciones, porRedSeguidores,
    topPosts,
  } = data;

  const hasCategoria = config.hasCategoria ?? false;
  const engagementRateStr = `${stats.engagementRate.toFixed(2)}%`;
  const hallazgos = computeHallazgos(profiles, hasCategoria);

  return (
    <div className="pt-28 pb-16 px-4 max-w-7xl mx-auto">

      {/* ── Header (logo + periodo + metodología) ─────────── */}
      <TalkHeader config={config} meta={meta} />

      {/* ── Titular ejecutivo + Tres señales ──────────────── */}
      <div
        className="rounded-3xl p-8 mb-8"
        style={{
          background: "linear-gradient(135deg, #0A1020 0%, #0D1535 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h2 className="text-2xl md:text-3xl font-black text-white mb-3 leading-tight">
          {meta.titulo}
        </h2>
        {meta.analisis && (
          <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-3xl">
            {meta.analisis}
          </p>
        )}

        <div
          className="pt-5 border-t"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: config.color }}
          >
            Tres señales que explican el mercado
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hallazgos.map((text, i) => (
              <div
                key={i}
                className="rounded-2xl p-4"
                style={{ background: `${config.color}0D`, border: `1px solid ${config.color}22` }}
              >
                <span
                  className="text-xs font-black rounded-full w-5 h-5 inline-flex items-center justify-center mr-2"
                  style={{ background: config.color, color: "#fff" }}
                >
                  {i + 1}
                </span>
                <span className="text-slate-300 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Indicadores generales ─────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatsCard label="Perfiles monitoreados" value={fmt(stats.totalPerfiles)}       icon="👥" color={config.color} colorLight={config.colorLight} />
        <StatsCard label="Total seguidores"       value={fmt(stats.totalSeguidores)}    icon="📣" color={config.color} colorLight={config.colorLight} />
        <StatsCard label="Total publicaciones"    value={fmt(stats.totalPublicaciones)} icon="📝" color={config.color} colorLight={config.colorLight} />
        <StatsCard label="Total reacciones"       value={fmt(stats.totalReacciones)}    icon="❤️" color={config.color} colorLight={config.colorLight} />
        <StatsCard label="Tasa de engagement"     value={engagementRateStr}             icon="📊" color={config.color} colorLight={config.colorLight} />
      </div>

      {/* ── Top marcas del mes ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <TopBarChart
          data={topReacciones}
          color={config.color}
          title="Top Marcas por Reacciones"
          subtitle="Marcas con mayor impacto en el período"
        />
        <TopBarChart
          data={topPublicaciones}
          color={config.color}
          title="Top Marcas por Publicaciones"
          subtitle="Marcas más activas del período"
        />
        <TopBarChart
          data={topSeguidores}
          color={config.color}
          title="Top Marcas por Seguidores"
          subtitle="Marcas con mayor comunidad digital"
        />
      </div>

      {/* ── Datos por industria / categoría ───────────────── */}
      {hasCategoria ? (
        <>
          <ReaccionesCarousel
            data={carouselItems}
            color={config.color}
            title="Top Categorías por Engagement"
            subtitle="Categorías con mayor impacto en el período"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
            <TopBarChartCategoryTabbed
              profiles={profiles}
              field="publicaciones"
              color={config.color}
              title="Publicaciones por Categoría"
              subtitle="Suma de publicaciones por tipo de marca"
            />
            <TopBarChartCategoryTabbed
              profiles={profiles}
              field="engagement"
              color={config.color}
              title="Reacciones por Categoría"
              subtitle="Engagement total por categoría"
            />
            <TopBarChartCategoryTabbed
              profiles={profiles}
              field="seguidores"
              color={config.color}
              title="Seguidores por Categoría"
              subtitle="Audiencia total por tipo de marca"
            />
          </div>
        </>
      ) : null}

      {/* ── Desempeño por plataforma ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <TopBarChart
          data={porRedPublicaciones}
          color={config.color}
          title="Publicaciones por Plataforma"
          subtitle="Distribución de publicaciones en redes sociales"
        />
        <TopBarChart
          data={porRedSeguidores}
          color={config.color}
          title="Seguidores por Plataforma"
          subtitle="Audiencia total de la industria por red social"
        />
        <TopBarChart
          data={porRedReacciones}
          color={config.color}
          title="Engagement por Plataforma"
          subtitle="Reacciones totales de la industria por red social"
        />
      </div>

      {/* ── Top publicaciones ─────────────────────────────── */}
      <TopPostsGrid
        posts={topPosts}
        color={config.color}
        hasCategoria={config.hasCategoria}
      />

      {/* ── Metodología ───────────────────────────────────── */}
      <div
        id="metodologia"
        className="rounded-3xl p-8 mb-8 mt-5"
        style={{
          background: "linear-gradient(135deg, #0A1020 0%, #0D1535 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: config.color }}>
          Metodología
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Periodo analizado", value: "Mes calendario" },
            { label: "Fuentes", value: "Perfiles oficiales y públicos de las marcas" },
            { label: "Plataformas", value: "Facebook, Instagram, TikTok y otras según disponibilidad" },
            { label: "Indicadores", value: "Publicaciones, seguidores, reacciones, engagement y efectividad por contenido" },
            { label: "Clasificación", value: "Marcas organizadas por industria, categoría y país" },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-3">
              <span className="text-slate-500 text-xs font-bold min-w-[120px] shrink-0">{label}:</span>
              <span className="text-slate-400 text-xs">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA — Solicitá el reporte ─────────────────────── */}
      <div
        className="rounded-3xl p-8 text-center"
        style={{
          background: `linear-gradient(135deg, ${config.color}15 0%, rgba(99,102,241,0.1) 100%)`,
          border: `1px solid ${config.color}30`,
        }}
      >
        <h3 className="text-xl md:text-2xl font-black text-white mb-2">
          ¿Querés conocer cómo se desempeña tu marca dentro de esta categoría?
        </h3>
        <p className="text-slate-400 text-sm mb-6 max-w-xl mx-auto">
          Cotizá un análisis personalizado con comparación competitiva, desempeño por plataforma y oportunidades de crecimiento.
        </p>
        <Link
          href="/cotizar"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${config.color}, #6366F1)`,
            color: "white",
            boxShadow: `0 0 24px ${config.color}40`,
          }}
        >
          Solicitá el reporte de tu marca →
        </Link>
      </div>

    </div>
  );
}
