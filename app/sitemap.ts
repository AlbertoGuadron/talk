import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const TALKS = ["foodtalk", "housetalk", "markettalk", "retailtalk", "moneytalk", "tourismtalk"];
const COUNTRIES = ["gt", "hn"];

export default function sitemap(): MetadataRoute.Sitemap {
  const svTalkPages = TALKS.map(t => ({
    url: `${SITE_URL}/${t}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const countryLandingPages = ["sv", "gt", "hn"].map(c => ({
    url: `${SITE_URL}/${c}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const countryTalkPages = COUNTRIES.flatMap(c =>
    TALKS.map(t => ({
      url: `${SITE_URL}/${c}/${t}`,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }))
  );

  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/demos`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/cotizar`, changeFrequency: "monthly", priority: 0.5 },
    ...countryLandingPages,
    ...svTalkPages,
    ...countryTalkPages,
  ];
}
