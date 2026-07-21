import type { TalkSlug, TalkDashboardData, TalkMeta } from "@/types";
import type { ProfileData } from "@/types";
import type { CountryCode } from "./countries-config";
import { buildDashboardData } from "./data-parser";

const COUNTRY_META: Record<CountryCode, Record<string, TalkMeta>> = {
  sv: {},
  hn: {
    foodtalk: {
      titulo: "Así se movió el mercado de alimentos en Honduras",
      subtitulo: "Ranking de presencia en redes sociales · Honduras",
      mes: "Junio 2026",
      analisis: "Junio mostró una alta actividad en fast food: McDonald's y Pollo Campero concentraron la mayor parte del engagement, mientras que las marcas locales ganaron terreno en eficiencia de contenido.",
      analisis2: "El mercado hondureño de alimentos presenta una dinámica competitiva donde las grandes cadenas dominan el volumen pero las marcas locales encuentran nichos de mayor eficiencia.",
    },
    retailtalk: {
      titulo: "Así se movió el mercado de retail en Honduras",
      subtitulo: "Ranking de presencia en redes sociales · Honduras",
      mes: "Junio 2026",
      analisis: "La Colonia y Walmart lideraron la actividad en retail, con una presencia dominante en Facebook e Instagram. Las tiendas especializadas muestran mejores tasas de engagement relativo.",
      analisis2: "El retail hondureño está protagonizado por grandes cadenas con alta inversión en contenido, pero las tiendas especializadas superan en engagement rate promedio.",
    },
  },
  gt: {
    foodtalk: {
      titulo: "Así se movió el mercado de alimentos en Guatemala",
      subtitulo: "Ranking de presencia en redes sociales · Guatemala",
      mes: "Junio 2026",
      analisis: "Pollo Campero mantuvo su dominio en Guatemala con la mayor comunidad digital, mientras McDonald's y Domino's compitieron por el engagement en contenido pagado y orgánico.",
      analisis2: "Guatemala presenta el mercado de alimentos más activo de Centroamérica en redes sociales, con marcas globales y locales compitiendo en todos los indicadores.",
    },
    housetalk: {
      titulo: "Así se movió el mercado inmobiliario en Guatemala",
      subtitulo: "Ranking de presencia en redes sociales · Guatemala",
      mes: "Junio 2026",
      analisis: "Cayalá y Villas de Antigua lideraron el desempeño digital en el segmento inmobiliario, con contenido de alta calidad visual que genera engagement superior al promedio del sector.",
      analisis2: "El mercado inmobiliario guatemalteco está adoptando rápidamente estrategias digitales, con proyectos de alto valor invirtiendo en contenido para plataformas como Instagram y TikTok.",
    },
    retailtalk: {
      titulo: "Así se movió el mercado de retail en Guatemala",
      subtitulo: "Ranking de presencia en redes sociales · Guatemala",
      mes: "Junio 2026",
      analisis: "Walmart Guatemala y Siman lideraron el mes en volumen de publicaciones y seguidores, aunque marcas como Cemaco destacaron por su alta tasa de engagement en contenido de lifestyle.",
      analisis2: "El retail en Guatemala muestra una consolidación de grandes cadenas con presencia multicanal robusta, mientras marcas especializadas compiten eficientemente en nichos de contenido.",
    },
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
    mes: "Junio 2026",
    analisis: "",
  };
  return buildDashboardData(slug, profiles, meta);
}
