"use client";

import { TalkDashboardData, TalkConfig } from "@/types";
import TalkHeader from "@/components/ui/TalkHeader";
import StatsCard from "@/components/ui/StatsCard";
import TopBarChart from "@/components/charts/TopBarChart";
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
    carouselItems,
    porRedPublicaciones, porRedReacciones, porRedSeguidores,
    topPosts,
  } = data;

  const hasCategoria = config.hasCategoria ?? false;
  const engagementRateStr = `${stats.engagementRate.toFixed(2)}%`;

  return (
    <div className="pt-28 pb-16 px-4 max-w-7xl mx-auto">
      <TalkHeader config={config} meta={meta} />

      {/* ── Stats (5 cards) ─────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatsCard label="Perfiles monitoreados" value={fmt(stats.totalPerfiles)}       icon="👥" color={config.color} colorLight={config.colorLight} />
        <StatsCard label="Total seguidores"       value={fmt(stats.totalSeguidores)}    icon="📣" color={config.color} colorLight={config.colorLight} />
        <StatsCard label="Total publicaciones"    value={fmt(stats.totalPublicaciones)} icon="📝" color={config.color} colorLight={config.colorLight} />
        <StatsCard label="Total reacciones"       value={fmt(stats.totalReacciones)}    icon="❤️" color={config.color} colorLight={config.colorLight} />
        <StatsCard label="Tasa de engagement"     value={engagementRateStr}             icon="📊" color={config.color} colorLight={config.colorLight} />
      </div>

      {/* ── Datos por industria ──────────────────────────── */}
      {hasCategoria ? (
        <>
          {/* Carousel: top categorías por engagement */}
          <ReaccionesCarousel
            data={carouselItems}
            color={config.color}
            title="Top Categorías por Engagement"
            subtitle="Categorías con mayor impacto en el período"
          />

          {/* 3 gráficas por categoría */}
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
      ) : (
        /* Housetalk: datos generales por plataforma */
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
      )}

      {/* ── Análisis ──────────────────────────────────────── */}
      {meta.analisis2 && (
        <AnalisisBox text={meta.analisis2} color={config.color} label="Análisis" />
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
