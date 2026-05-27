import { getTalkData } from "@/lib/get-talk-data";
import { getTalkConfig } from "@/lib/talks-config";
import TalkDashboard from "@/components/TalkDashboard";

export const revalidate = false;

export default async function RetailtalkPage() {
  const [data, config] = await Promise.all([
    getTalkData("retailtalk"),
    Promise.resolve(getTalkConfig("retailtalk")),
  ]);
  return <TalkDashboard data={data} config={config} />;
}
