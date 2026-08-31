import type { TalkSlug, TalkDashboardData, TalkMeta } from "@/types";
import type { CountryCode } from "./countries-config";
import { buildDashboardData } from "./data-parser";

const COUNTRY_META: Record<CountryCode, Record<string, TalkMeta>> = {
  sv: {},
  hn: {
    foodtalk:    { titulo: "Así se movió el mercado de alimentos en Honduras",     subtitulo: "Ranking semanal de presencia en redes sociales · Honduras", mes: "Agosto 2026", analisis: "", analisis2: "" },
    housetalk:   { titulo: "Así se movió el sector inmobiliario en Honduras",      subtitulo: "Ranking semanal de presencia en redes sociales · Honduras", mes: "Agosto 2026", analisis: "", analisis2: "" },
    markettalk:  { titulo: "Así se movió el mercado de consumo masivo en Honduras",subtitulo: "Ranking semanal de presencia en redes sociales · Honduras", mes: "Agosto 2026", analisis: "", analisis2: "" },
    retailtalk:  { titulo: "Así se movió el mercado de retail en Honduras",        subtitulo: "Ranking semanal de presencia en redes sociales · Honduras", mes: "Agosto 2026", analisis: "", analisis2: "" },
    moneytalk:   { titulo: "Así se movió el sector financiero en Honduras",        subtitulo: "Ranking semanal de presencia en redes sociales · Honduras", mes: "Agosto 2026", analisis: "", analisis2: "" },
    tourismtalk: { titulo: "Así se movió el sector turístico en Honduras",         subtitulo: "Ranking semanal de presencia en redes sociales · Honduras", mes: "Agosto 2026", analisis: "", analisis2: "" },
  },
  gt: {
    foodtalk:    { titulo: "Así se movió el mercado de alimentos en Guatemala",      subtitulo: "Ranking semanal de presencia en redes sociales · Guatemala", mes: "Agosto 2026", analisis: "", analisis2: "" },
    housetalk:   { titulo: "Así se movió el sector inmobiliario en Guatemala",       subtitulo: "Ranking semanal de presencia en redes sociales · Guatemala", mes: "Agosto 2026", analisis: "", analisis2: "" },
    markettalk:  { titulo: "Así se movió el mercado de consumo masivo en Guatemala", subtitulo: "Ranking semanal de presencia en redes sociales · Guatemala", mes: "Agosto 2026", analisis: "", analisis2: "" },
    retailtalk:  { titulo: "Así se movió el mercado de retail en Guatemala",         subtitulo: "Ranking semanal de presencia en redes sociales · Guatemala", mes: "Agosto 2026", analisis: "", analisis2: "" },
    moneytalk:   { titulo: "Así se movió el sector financiero en Guatemala",         subtitulo: "Ranking semanal de presencia en redes sociales · Guatemala", mes: "Agosto 2026", analisis: "", analisis2: "" },
    tourismtalk: { titulo: "Así se movió el sector turístico en Guatemala",          subtitulo: "Ranking semanal de presencia en redes sociales · Guatemala", mes: "Agosto 2026", analisis: "", analisis2: "" },
  },
};

export async function getCountryTalkData(
  pais: CountryCode,
  slug: TalkSlug
): Promise<TalkDashboardData> {
  if (pais === "sv") {
    const { getTalkData } = await import("./get-talk-data");
    return getTalkData(slug);
  }

  if (pais === "gt") {
    const gtSlug = slug as "foodtalk" | "moneytalk" | "tourismtalk" | "housetalk" | "markettalk" | "retailtalk";
    const meta = COUNTRY_META.gt[slug] ?? {
      titulo: `${slug.charAt(0).toUpperCase() + slug.slice(1)} Guatemala`,
      subtitulo: "Ranking semanal de presencia en redes sociales · Guatemala",
      mes: "Agosto 2026",
      analisis: "",
    };
    try {
      const { getGtTalkData } = await import("./google-sheets");
      return await getGtTalkData(gtSlug, meta);
    } catch (err) {
      console.warn(`[get-country-data] GT Sheets failed for ${slug}:`, (err as Error).message);
      return buildDashboardData(slug, [], meta);
    }
  }

  // HN: Google Sheets
  if (pais === "hn") {
    const hnSlug = slug as "foodtalk" | "moneytalk" | "tourismtalk" | "housetalk" | "markettalk" | "retailtalk";
    const meta = COUNTRY_META.hn[slug] ?? {
      titulo: `${slug.charAt(0).toUpperCase() + slug.slice(1)} Honduras`,
      subtitulo: "Ranking semanal de presencia en redes sociales · Honduras",
      mes: "Agosto 2026",
      analisis: "",
    };
    try {
      const { getHnTalkData } = await import("./google-sheets");
      return await getHnTalkData(hnSlug, meta);
    } catch (err) {
      console.warn(`[get-country-data] HN Sheets failed for ${slug}:`, (err as Error).message);
      return buildDashboardData(slug, [], meta);
    }
  }

  return buildDashboardData(slug, [], {
    titulo: slug,
    subtitulo: "Ranking de presencia en redes sociales",
    mes: "Agosto 2026",
    analisis: "",
  });
}
