import { TalkSlug, TalkDashboardData, TalkMeta } from "@/types";
import { buildDashboardData } from "./data-parser";
import type { ProfileData } from "@/types";

const DEFAULT_META: Record<TalkSlug, TalkMeta> = {
  foodtalk: {
    titulo: "Foodtalk",
    subtitulo: "Ranking de presencia en redes sociales",
    mes: "Abril 2026",
    analisis:
      "Análisis del mes de Abril 2026. Edita este texto desde el panel de administrador.",
  },
  housetalk: {
    titulo: "Housetalk",
    subtitulo: "Ranking de presencia en redes sociales",
    mes: "Abril 2026",
    analisis:
      "Análisis del mes de Abril 2026. Edita este texto desde el panel de administrador.",
  },
  markettalk: {
    titulo: "Markettalk",
    subtitulo: "Ranking de presencia en redes sociales",
    mes: "Abril 2026",
    analisis:
      "Análisis del mes de Abril 2026. Edita este texto desde el panel de administrador.",
  },
  retailtalk: {
    titulo: "Retailtalk",
    subtitulo: "Ranking de presencia en redes sociales",
    mes: "Abril 2026",
    analisis:
      "Análisis del mes de Abril 2026. Edita este texto desde el panel de administrador.",
  },
};

export async function getTalkData(slug: TalkSlug): Promise<TalkDashboardData> {
  const useSheets =
    process.env.GOOGLE_SPREADSHEET_ID &&
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY;

  let profiles: ProfileData[];
  let meta: TalkMeta;

  if (useSheets) {
    const { getTalkData: getSheetsData } = await import("./google-sheets");
    return getSheetsData(slug);
  }

  // Demo mode: load from JSON files
  const demoData = await import(`./demo-data/${slug}.json`);
  profiles = demoData.default as ProfileData[];
  meta = DEFAULT_META[slug];

  return buildDashboardData(slug, profiles, meta);
}
