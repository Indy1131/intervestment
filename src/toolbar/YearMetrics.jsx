import metrics from "../mappings/metrics";

export default function YearMetric({ metric, country }) {
  return <>{metrics.content(metric, country)}</>;
}
