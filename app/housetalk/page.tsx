import type { Metadata } from "next";
import { getTalkData } from "@/lib/get-talk-data";
import { getTalkConfig } from "@/lib/talks-config";
import { getTalkMetadata } from "@/lib/seo";
import TalkDashboard from "@/components/TalkDashboard";

export const metadata: Metadata = getTalkMetadata("housetalk", "sv");

export const revalidate = false;

export default async function HousetalkPage() {
  const [data, config] = await Promise.all([
    getTalkData("housetalk"),
    Promise.resolve(getTalkConfig("housetalk")),
  ]);
  return <TalkDashboard data={data} config={config} />;
}
