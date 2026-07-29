import { getTalkData } from "@/lib/get-talk-data";
import { getTalkConfig } from "@/lib/talks-config";
import TalkDashboard from "@/components/TalkDashboard";

export const revalidate = false;

export default async function MoneytalkPage() {
  const [data, config] = await Promise.all([
    getTalkData("moneytalk"),
    Promise.resolve(getTalkConfig("moneytalk")),
  ]);
  return <TalkDashboard data={data} config={config} />;
}
