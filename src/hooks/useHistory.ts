import { getHistory, getStats } from "@/lib/api";
import type {
  DistributionItem,
  MetricItem,
  PastWeekItem,
  StatsSummary,
} from "@/types";
import { useEffect, useState } from "react";

export interface UseHistoryReturn {
  summary: StatsSummary | null;
  distribution: DistributionItem[];
  metrics: MetricItem[];
  statsLoading: boolean;
  pastWeek: PastWeekItem[];
  historyLoading: boolean;
}

export const useHistory = (): UseHistoryReturn => {
  const [summary, setSummary] = useState<StatsSummary | null>(null);
  const [distribution, setDistribution] = useState<DistributionItem[]>([]);
  const [metrics, setMetrics] = useState<MetricItem[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  const [pastWeek, setPastWeek] = useState<PastWeekItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then((res) => {
        setSummary(res.summary);
        setDistribution(res.distribution);
        setMetrics(res.metrics);
      })
      .catch(console.error)
      .finally(() => setStatsLoading(false));

    getHistory()
      .then((res) => setPastWeek(res.pastWeek))
      .catch(console.error)
      .finally(() => setHistoryLoading(false));
  }, []);

  return {
    summary,
    distribution,
    metrics,
    statsLoading,
    pastWeek,
    historyLoading,
  };
};
