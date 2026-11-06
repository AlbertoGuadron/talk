import type { Metadata } from "next";
import { getTalkData } from "@/lib/get-talk-data";
import { getTalkConfig } from "@/lib/talks-config";
import { getTalkMetadata } from "@/lib/seo";
import TalkDashboard from "@/components/TalkDashboard";

export const metadata: Metadata = getTalkMetadata("retailtalk", "sv");

export const revalidate = false;

export default async function RetailtalkPage() {
  const [data, config] = await Promise.all([
    getTalkData("retailtalk"),
    Promise.resolve(getTalkConfig("retailtalk")),
  ]);
  return <TalkDashboard data={data} config={config} />;
}
