import { TalkConfig, TalkSlug } from "@/types";

export const TALKS: TalkConfig[] = [
  {
    slug: "foodtalk",
    label: "Foodtalk",
    description: "Ranking de marcas de alimentos y restaurantes en redes sociales",
    color: "#FF1493",
    colorLight: "rgba(255,20,147,0.15)",
    bgGradient: "from-[#FF1493] to-[#00B4D8]",
    icon: "🍽️",
    hasCategoria: true,
  },
  {
    slug: "housetalk",
    label: "Housetalk",
    description: "Ranking de proyectos inmobiliarios en redes sociales",
    color: "#FF8C00",
    colorLight: "rgba(255,140,0,0.15)",
    bgGradient: "from-[#FF8C00] via-[#FF4E8B] to-[#9B59B6]",
    icon: "🏠",
    hasCategoria: false,
  },
  {
    slug: "markettalk",
    label: "Markettalk",
    description: "Ranking de marcas del mercado general en redes sociales",
    color: "#6B8E23",
    colorLight: "rgba(107,142,35,0.15)",
    bgGradient: "from-[#6B8E23] to-[#4682B4]",
    icon: "🛒",
    hasCategoria: true,
  },
  {
    slug: "retailtalk",
    label: "Retailtalk",
    description: "Ranking de marcas de retail y comercio en redes sociales",
    color: "#00CED1",
    colorLight: "rgba(0,206,209,0.15)",
    bgGradient: "from-[#00CED1] to-[#8B5CF6]",
    icon: "🏪",
    hasCategoria: true,
  },
];

export const COMING_SOON_TALKS: never[] = [];

export const TALK_LOGOS: Record<TalkSlug, string> = {
  foodtalk: "/galeria/foodtalk.png",
  housetalk: "/galeria/housetalk.png",
  markettalk: "/galeria/markettalk.png",
  retailtalk: "/galeria/retailtalk.png",
};

export const TALK_COLORS: Record<TalkSlug, string> = {
  foodtalk: "#FF1493",
  housetalk: "#FF8C00",
  markettalk: "#6B8E23",
  retailtalk: "#00CED1",
};

export const TALK_GRADIENT_STOPS: Record<TalkSlug, [string, string]> = {
  foodtalk: ["#FF1493", "#00B4D8"],
  housetalk: ["#FF8C00", "#9B59B6"],
  markettalk: ["#6B8E23", "#4682B4"],
  retailtalk: ["#00CED1", "#8B5CF6"],
};

export const NETWORK_COLORS: Record<string, string> = {
  FACEBOOK: "#1877F2",
  INSTAGRAM: "#E1306C",
  TIKTOK: "#69C9D0",
  TWITTER: "#1DA1F2",
  YOUTUBE: "#FF0000",
  LINKEDIN: "#0A66C2",
  OTHER: "#64748B",
};

export function getTalkConfig(slug: TalkSlug): TalkConfig {
  return TALKS.find((t) => t.slug === slug)!;
}
