import { getTalkData } from "@/lib/get-talk-data";
import { getTalkConfig } from "@/lib/talks-config";
import TalkDashboard from "@/components/TalkDashboard";

export const revalidate = false;

export default async function TourismtalkPage() {
  const [data, config] = await Promise.all([
    getTalkData("tourismtalk"),
    Promise.resolve(getTalkConfig("tourismtalk")),
  ]);
  return <TalkDashboard data={data} config={config} />;
}
