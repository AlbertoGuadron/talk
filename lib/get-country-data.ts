import type { TalkSlug, TalkDashboardData, TalkMeta } from "@/types";
import type { ProfileData } from "@/types";
import type { CountryCode } from "./countries-config";
import { buildDashboardData } from "./data-parser";

const COUNTRY_META: Record<CountryCode, Record<string, TalkMeta>> = {
  sv: {},
  hn: {
    foodtalk:   { titulo: "Foodtalk Honduras", subtitulo: "Ranking de presencia en redes sociales", mes: "Julio 2026", analisis: "Datos de muestra para Honduras." },
    retailtalk: { titulo: "Retailtalk Honduras", subtitulo: "Ranking de presencia en redes sociales", mes: "Julio 2026", analisis: "Datos de muestra para Honduras." },
  },
  gt: {
    foodtalk:   { titulo: "Foodtalk Guatemala", subtitulo: "Ranking de presencia en redes sociales", mes: "Julio 2026", analisis: "Datos de muestra para Guatemala." },
    housetalk:  { titulo: "Housetalk Guatemala", subtitulo: "Ranking de presencia en redes sociales", mes: "Julio 2026", analisis: "Datos de muestra para Guatemala." },
    retailtalk: { titulo: "Retailtalk Guatemala", subtitulo: "Ranking de presencia en redes sociales", mes: "Julio 2026", analisis: "Datos de muestra para Guatemala." },
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

  const demoData = await import(`./demo-data/${pais}/${slug}.json`);
  const profiles = demoData.default as ProfileData[];
  const meta = COUNTRY_META[pais][slug] ?? {
    titulo: `${slug.charAt(0).toUpperCase() + slug.slice(1)} ${pais.toUpperCase()}`,
    subtitulo: "Ranking de presencia en redes sociales",
    mes: "Julio 2026",
    analisis: "",
  };
  return buildDashboardData(slug, profiles, meta);
}
