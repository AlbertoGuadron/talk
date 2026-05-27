import { getTalkData } from "@/lib/get-talk-data";
import { getTalkConfig } from "@/lib/talks-config";
import TalkDashboard from "@/components/TalkDashboard";

export const revalidate = false; // manual revalidation only

export default async function FoodtalkPage() {
  const [data, config] = await Promise.all([
    getTalkData("foodtalk"),
    Promise.resolve(getTalkConfig("foodtalk")),
  ]);
  return <TalkDashboard data={data} config={config} />;
}
