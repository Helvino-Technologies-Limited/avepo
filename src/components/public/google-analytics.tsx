import { getSiteSetting } from "@/lib/settings";
import { AnalyticsLoader } from "@/components/public/analytics-loader";

export async function GoogleAnalytics() {
  const { gaMeasurementId } = await getSiteSetting("analytics.ga");
  if (!gaMeasurementId) return null;

  return <AnalyticsLoader gaMeasurementId={gaMeasurementId} />;
}
