import type { Metadata } from "next";
import { getTalkData } from "@/lib/get-talk-data";
import { getTalkConfig } from "@/lib/talks-config";
import { getTalkMetadata } from "@/lib/seo";
import TalkDashboard from "@/components/TalkDashboard";

export const metadata: Metadata = getTalkMetadata("tourismtalk", "sv");

export const revalidate = false;

export default async function TourismtalkPage() {
  const [data, config] = await Promise.all([
    getTalkData("tourismtalk"),
    Promise.resolve(getTalkConfig("tourismtalk")),
  ]);
  return <TalkDashboard data={data} config={config} />;
}
