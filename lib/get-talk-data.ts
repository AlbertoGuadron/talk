import { unstable_cache } from "next/cache";
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

async function fetchTalkData(slug: TalkSlug): Promise<TalkDashboardData> {
  const useSheets =
    process.env.GOOGLE_SPREADSHEET_ID &&
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY;

  if (useSheets) {
    const { getTalkData: getSheetsData } = await import("./google-sheets");
    return getSheetsData(slug);
  }

  // Demo mode: load from JSON files
  const demoData = await import(`./demo-data/${slug}.json`);
  const profiles = demoData.default as ProfileData[];
  const meta = DEFAULT_META[slug];
  return buildDashboardData(slug, profiles, meta);
}

// Cache separado por slug — primera carga es lenta (Google Sheets),
// las siguientes son instantáneas hasta que el admin publique cambios.
const _cachedFoodtalk   = unstable_cache(() => fetchTalkData("foodtalk"),   ["talk-data-foodtalk"],   { revalidate: false, tags: ["talk-data"] });
const _cachedHousetalk  = unstable_cache(() => fetchTalkData("housetalk"),  ["talk-data-housetalk"],  { revalidate: false, tags: ["talk-data"] });
const _cachedMarkettalk = unstable_cache(() => fetchTalkData("markettalk"), ["talk-data-markettalk"], { revalidate: false, tags: ["talk-data"] });
const _cachedRetailtalk = unstable_cache(() => fetchTalkData("retailtalk"), ["talk-data-retailtalk"], { revalidate: false, tags: ["talk-data"] });

const CACHED: Record<TalkSlug, () => Promise<TalkDashboardData>> = {
  foodtalk:   _cachedFoodtalk,
  housetalk:  _cachedHousetalk,
  markettalk: _cachedMarkettalk,
  retailtalk: _cachedRetailtalk,
};

export function getTalkData(slug: TalkSlug): Promise<TalkDashboardData> {
  return CACHED[slug]();
}
