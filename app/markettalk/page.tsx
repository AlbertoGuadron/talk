import { getTalkData } from "@/lib/get-talk-data";
import { getTalkConfig } from "@/lib/talks-config";
import TalkDashboard from "@/components/TalkDashboard";

export const revalidate = false;

export default async function MarkettalkPage() {
  const [data, config] = await Promise.all([
    getTalkData("markettalk"),
    Promise.resolve(getTalkConfig("markettalk")),
  ]);
  return <TalkDashboard data={data} config={config} />;
}
