import type { Metadata } from "next";
import type { TalkSlug } from "@/types";
import type { CountryCode } from "./countries-config";

export const SITE_URL = "https://talk.digitalinsightsla.com";
const OG_IMAGE = `${SITE_URL}/galeria/logotalk.png`;

const COUNTRY_NAMES: Record<CountryCode, string> = {
  sv: "El Salvador",
  gt: "Guatemala",
  hn: "Honduras",
};

const TALK_SEO: Record<TalkSlug, { label: string; desc: string }> = {
  foodtalk: {
    label: "FoodTalk",
    desc: "Ranking quincenal de publicaciones, seguidores y engagement de las principales marcas de alimentos y restaurantes en redes sociales.",
  },
  housetalk: {
    label: "HouseTalk",
    desc: "Ranking quincenal de publicaciones, seguidores y engagement de los principales proyectos inmobiliarios y bienes raíces en redes sociales.",
  },
  markettalk: {
    label: "MarketTalk",
    desc: "Ranking quincenal de las principales marcas de consumo masivo en redes sociales. Publicaciones, seguidores y engagement en Facebook, Instagram y TikTok.",
  },
  retailtalk: {
    label: "RetailTalk",
    desc: "Ranking quincenal de las principales cadenas de retail y comercio. Publicaciones, seguidores y engagement en redes sociales.",
  },
  moneytalk: {
    label: "MoneyTalk",
    desc: "Ranking quincenal de bancos, aseguradoras y servicios financieros. Publicaciones, seguidores y engagement en redes sociales.",
  },
  tourismtalk: {
    label: "TourismTalk",
    desc: "Ranking quincenal de marcas turísticas, hoteles y destinos. Publicaciones, seguidores y engagement en Facebook, Instagram y TikTok.",
  },
};

export function getTalkMetadata(slug: TalkSlug, country: CountryCode = "sv"): Metadata {
  const talk = TALK_SEO[slug];
  const countryName = COUNTRY_NAMES[country];
  const path = country === "sv" ? `/${slug}` : `/${country}/${slug}`;
  const title = `${talk.label} ${countryName} – Ranking de marcas en redes sociales`;
  const description = `${talk.desc} Datos actualizados de ${countryName}.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      images: [{ url: OG_IMAGE }],
    },
  };
}

export function getCountryMetadata(country: CountryCode): Metadata {
  const countryName = COUNTRY_NAMES[country];
  const path = `/${country}`;
  const title = `TALK ${countryName} – Rankings de marcas en redes sociales`;
  const description = `Explora los rankings quincenales de las principales marcas en ${countryName}: alimentos, inmobiliaria, retail, finanzas, turismo y más. Datos de Facebook, Instagram y TikTok.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      images: [{ url: OG_IMAGE }],
    },
  };
}
