import { notFound } from "next/navigation";
import { getCountryInfo, COUNTRIES } from "@/lib/countries-config";
import { getCountryTalkData } from "@/lib/get-country-data";
import { getTalkConfig } from "@/lib/talks-config";
import TalkDashboard from "@/components/TalkDashboard";
import type { TalkSlug } from "@/types";
import type { CountryCode } from "@/lib/countries-config";

export const revalidate = false;

// Pre-build all country/talk combinations at deploy time so pages are static
export async function generateStaticParams() {
  return COUNTRIES.flatMap((country) =>
    country.talks.map((talk) => ({ pais: country.code, talk }))
  );
}

interface Props {
  params: Promise<{ pais: string; talk: string }>;
}

const VALID_TALKS: TalkSlug[] = ["foodtalk", "housetalk", "markettalk", "retailtalk", "moneytalk", "tourismtalk"];

export default async function CountryTalkPage({ params }: Props) {
  const { pais, talk } = await params;

  const country = getCountryInfo(pais);
  if (!country) notFound();

  const slug = talk as TalkSlug;
  if (!VALID_TALKS.includes(slug)) notFound();
  if (!country.talks.includes(slug)) notFound();

  const [data, config] = await Promise.all([
    getCountryTalkData(pais as CountryCode, slug),
    Promise.resolve(getTalkConfig(slug)),
  ]);

  return <TalkDashboard data={data} config={config} />;
}
