import type { TalkSlug, TalkConfig } from "@/types";
import { TALKS } from "./talks-config";

export type CountryCode = "sv" | "hn" | "gt";

export interface CountryInfo {
  code: CountryCode;
  name: string;
  flag: string;
  talks: TalkSlug[];
}

export const COUNTRIES: CountryInfo[] = [
  {
    code: "sv",
    name: "El Salvador",
    flag: "🇸🇻",
    talks: ["foodtalk", "housetalk", "markettalk", "retailtalk"],
  },
  {
    code: "hn",
    name: "Honduras",
    flag: "🇭🇳",
    talks: ["foodtalk", "retailtalk"],
  },
  {
    code: "gt",
    name: "Guatemala",
    flag: "🇬🇹",
    talks: ["foodtalk", "housetalk", "retailtalk"],
  },
];

export function getCountryInfo(code: string): CountryInfo | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

export function getCountryTalks(code: string): TalkConfig[] {
  const country = getCountryInfo(code);
  if (!country) return [];
  return country.talks
    .map((slug) => TALKS.find((t) => t.slug === slug))
    .filter((t): t is TalkConfig => Boolean(t));
}
