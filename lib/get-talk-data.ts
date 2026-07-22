import { unstable_cache } from "next/cache";
import { TalkSlug, TalkDashboardData, TalkMeta } from "@/types";
import { buildDashboardData } from "./data-parser";
import type { ProfileData } from "@/types";

const DEFAULT_META: Record<TalkSlug, TalkMeta> = {
  foodtalk: {
    titulo: "Foodtalk",
    subtitulo: "Ranking de presencia en redes sociales",
    mes: "Abril 2026",
    analisis: "Análisis del mes de Abril 2026. Edita este texto desde el panel de administrador.",
  },
  housetalk: {
    titulo: "Housetalk",
    subtitulo: "Ranking de presencia en redes sociales",
    mes: "Abril 2026",
    analisis: "Análisis del mes de Abril 2026. Edita este texto desde el panel de administrador.",
  },
  markettalk: {
    titulo: "Markettalk",
    subtitulo: "Ranking de presencia en redes sociales",
    mes: "Abril 2026",
    analisis: "Análisis del mes de Abril 2026. Edita este texto desde el panel de administrador.",
  },
  retailtalk: {
    titulo: "Retailtalk",
    subtitulo: "Ranking de presencia en redes sociales",
    mes: "Abril 2026",
    analisis: "Análisis del mes de Abril 2026. Edita este texto desde el panel de administrador.",
  },
  moneytalk: {
    titulo: "Moneytalk",
    subtitulo: "Ranking de presencia en redes sociales",
    mes: "Abril 2026",
    analisis: "Análisis del mes de Abril 2026. Edita este texto desde el panel de administrador.",
  },
  tourismtalk: {
    titulo: "Tourismtalk",
    subtitulo: "Ranking de presencia en redes sociales",
    mes: "Abril 2026",
    analisis: "Análisis del mes de Abril 2026. Edita este texto desde el panel de administrador.",
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

  const demoData = await import(`./demo-data/${slug}.json`);
  const profiles = demoData.default as ProfileData[];
  const meta = DEFAULT_META[slug];
  return buildDashboardData(slug, profiles, meta);
}

// En DEV: unstable_cache evita llamadas repetidas a Google Sheets (5 min TTL).
// En PRODUCCIÓN: se llama directamente — el ISR de la página maneja el caching,
// y syncPostImages puede correr en cada revalidación del admin sin quedar bloqueado.
const _devCached: Partial<Record<TalkSlug, () => Promise<TalkDashboardData>>> = {};

function getDevCached(slug: TalkSlug) {
  if (!_devCached[slug]) {
    _devCached[slug] = unstable_cache(
      () => fetchTalkData(slug),
      [`talk-data-${slug}`],
      { revalidate: 300 } // 5 minutos en dev
    );
  }
  return _devCached[slug]!;
}

export function getTalkData(slug: TalkSlug): Promise<TalkDashboardData> {
  if (process.env.NODE_ENV === "development") {
    return getDevCached(slug)();
  }
  return fetchTalkData(slug);
}
