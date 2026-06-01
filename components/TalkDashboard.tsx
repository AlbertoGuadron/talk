"use client";

import { TalkDashboardData, TalkConfig } from "@/types";
import TalkHeader from "@/components/ui/TalkHeader";
import StatsCard from "@/components/ui/StatsCard";
import TopBarChartTabbed from "@/components/charts/TopBarChartTabbed";
import TopBarChartCategoryTabbed from "@/components/charts/TopBarChartCategoryTabbed";
import NetworkPieChart from "@/components/charts/NetworkPieChart";
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
    porRedPublicaciones, porRedReacciones, porRedSeguidores,
    topPosts,
  } = data;

  return (
    <div className="pt-28 pb-16 px-4 max-w-7xl mx-auto">
      <TalkHeader config={config} meta={meta} />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatsCard label="Perfiles monitoreados" value={fmt(stats.totalPerfiles)}     icon="👥" color={config.color} colorLight={config.colorLight} />
        <StatsCard label="Total seguidores"       value={fmt(stats.totalSeguidores)}  icon="📣" color={config.color} colorLight={config.colorLight} />
        <StatsCard label="Total publicaciones"    value={fmt(stats.totalPublicaciones)} icon="📝" color={config.color} colorLight={config.colorLight} />
        <StatsCard label="Total reacciones"       value={fmt(stats.totalReacciones)}  icon="❤️" color={config.color} colorLight={config.colorLight} />
      </div>

      {/* ── Análisis 2 (debajo de stats) ────────────────── */}
      {meta.analisis2 && (
        <AnalisisBox text={meta.analisis2} color={config.color} label="Análisis" />
      )}

      {/* ── Top 10 Rankings ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <TopBarChartTabbed
          profiles={profiles}
          field="publicaciones"
          color={config.color}
          title="Top 10 por Publicaciones"
          subtitle="Total de publicaciones en la red"
        />
        <TopBarChartTabbed
          profiles={profiles}
          field="engagement"
          color={config.color}
          title="Top 10 por Reacciones"
          subtitle="Reacciones + Comentarios + Compartidos"
        />
        <TopBarChartTabbed
          profiles={profiles}
          field="seguidores"
          color={config.color}
          title="Top 10 por Seguidores"
          subtitle="Total de seguidores en la red"
        />
      </div>

      {/* ── Por Plataforma ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <NetworkPieChart
          data={porRedPublicaciones}
          title="Publicaciones por Plataforma"
          subtitle="Suma de publicaciones por red social"
          valueLabel="publicaciones"
        />
        <NetworkPieChart
          data={porRedReacciones}
          title="Reacciones por Plataforma"
          subtitle="Reacciones + Comentarios + Compartidos por red"
          valueLabel="reacciones"
        />
        <NetworkPieChart
          data={porRedSeguidores}
          title="Seguidores por Plataforma"
          subtitle="Suma de seguidores por red social"
          valueLabel="seguidores"
        />
      </div>

      {/* ── Por Categoría (foodtalk & markettalk) ───────── */}
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

      {/* ── Análisis 3 (encima de top publicaciones) ──── */}
      {meta.analisis3 && (
        <AnalisisBox text={meta.analisis3} color={config.color} label="Análisis" />
      )}

      {/* ── Top Publicaciones del Período ─────────────── */}
      <TopPostsGrid
        posts={topPosts}
        color={config.color}
        hasCategoria={config.hasCategoria}
      />
    </div>
  );
}
