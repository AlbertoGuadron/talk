"use client";

import { TalkDashboardData, TalkConfig } from "@/types";
import TalkHeader from "@/components/ui/TalkHeader";
import StatsCard from "@/components/ui/StatsCard";
import TopBarChartTabbed from "@/components/charts/TopBarChartTabbed";
import TopBarChartCategoryTabbed from "@/components/charts/TopBarChartCategoryTabbed";
import ReaccionesCarousel from "@/components/charts/ReaccionesCarousel";
import TopPostsGrid from "@/components/TopPostsGrid";
import AnalisisBox from "@/components/ui/AnalisisBox";

interface Props {
  data: TalkDashboardData;
  config: TalkConfig;
}

function fmt(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return String(v);
}

export default function TalkDashboard({ data, config }: Props) {
  const {
    meta, stats, profiles,
    topReacciones, topPosts,
  } = data;

  return (
    <div className="pt-28 pb-16 px-4 max-w-7xl mx-auto">
      <TalkHeader config={config} meta={meta} />

      {/* ── Stats ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Perfiles monitoreados" value={fmt(stats.totalPerfiles)}       icon="👥" color={config.color} colorLight={config.colorLight} />
        <StatsCard label="Total seguidores"       value={fmt(stats.totalSeguidores)}    icon="📣" color={config.color} colorLight={config.colorLight} />
        <StatsCard label="Total publicaciones"    value={fmt(stats.totalPublicaciones)} icon="📝" color={config.color} colorLight={config.colorLight} />
        <StatsCard label="Total reacciones"       value={fmt(stats.totalReacciones)}    icon="❤️" color={config.color} colorLight={config.colorLight} />
      </div>

      {/* ── Top Rankings (sin tabs) ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <TopBarChartTabbed
          profiles={profiles}
          field="publicaciones"
          color={config.color}
          title="Top 10 por Publicaciones"
          subtitle="Total de publicaciones en la red"
          hideTabs
        />
        <TopBarChartTabbed
          profiles={profiles}
          field="seguidores"
          color={config.color}
          title="Top 10 por Seguidores"
          subtitle="Total de seguidores en la red"
          hideTabs
        />
      </div>

      {/* ── Carrusel Top 10 Reacciones ───────────────────── */}
      <ReaccionesCarousel data={topReacciones} color={config.color} />

      {/* ── Por Categoría (foodtalk, markettalk, retailtalk) ─ */}
      {config.hasCategoria && (
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
            subtitle="Reacciones + Comentarios + Compartidos por categoría"
          />
          <TopBarChartCategoryTabbed
            profiles={profiles}
            field="seguidores"
            color={config.color}
            title="Seguidores por Categoría"
            subtitle="Suma de seguidores por tipo de marca"
          />
        </div>
      )}

      {/* ── Análisis 2 y 3 (encima de top publicaciones) ─── */}
      {meta.analisis2 && (
        <AnalisisBox text={meta.analisis2} color={config.color} label="Análisis" />
      )}
      {meta.analisis3 && (
        <AnalisisBox text={meta.analisis3} color={config.color} label="Análisis" />
      )}

      {/* ── Top Publicaciones del Período ─────────────────── */}
      <TopPostsGrid
        posts={topPosts}
        color={config.color}
        hasCategoria={config.hasCategoria}
      />
    </div>
  );
}
