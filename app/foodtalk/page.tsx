import type { Metadata } from "next";
import { getTalkData } from "@/lib/get-talk-data";
import { getTalkConfig } from "@/lib/talks-config";
import { getTalkMetadata } from "@/lib/seo";
import TalkDashboard from "@/components/TalkDashboard";

export const revalidate = false;
export const metadata: Metadata = getTalkMetadata("foodtalk", "sv");

export default async function FoodtalkPage() {
  const [data, config] = await Promise.all([
    getTalkData("foodtalk"),
    Promise.resolve(getTalkConfig("foodtalk")),
  ]);
  return <TalkDashboard data={data} config={config} />;
}
