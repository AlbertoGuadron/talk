import { getTalkData } from "@/lib/get-talk-data";
import { getTalkConfig } from "@/lib/talks-config";
import TalkDashboard from "@/components/TalkDashboard";

export const revalidate = false;

export default async function HousetalkPage() {
  const [data, config] = await Promise.all([
    getTalkData("housetalk"),
    Promise.resolve(getTalkConfig("housetalk")),
  ]);
  return <TalkDashboard data={data} config={config} />;
}
