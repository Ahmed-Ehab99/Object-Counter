// ─── Shared Types ────────────────────────────────────────────────────────────

export type NeonColor = "cyan" | "purple";

export interface Detection {
  id: string;
  label: string;
  confidence: number;
  color: NeonColor;
  box: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
}

export interface DistributionItem {
  label: string;
  value: number;
  color: NeonColor;
  _id?: string;
}

export interface MetricItem {
  label: string;
  value: number;
  suffix: string;
  max?: number;
  color: NeonColor;
  _id?: string;
}

export interface PastWeekItem {
  id: string;
  title: string;
  date: string;
  image?: string; // optional — some history items may have no image
}

// ─── POST /detect ─────────────────────────────────────────────────────────────

export interface DetectRequestBody {
  image: string; // base64 data URL
}

export interface DetectResponseData {
  title: string;
  image: string;
  detections: Detection[];
  distribution: DistributionItem[];
  metrics: MetricItem[];
}

export interface DetectResponse {
  message: string;
  data: DetectResponseData;
  historyId: string;
}

// ─── GET /detect/history ──────────────────────────────────────────────────────

export interface HistoryResponse {
  message: string;
  pastWeek: PastWeekItem[];
}

// ─── GET /detect/stats ────────────────────────────────────────────────────────

export interface StatsSummary {
  dailyTotalObjectCounted: number;
  dailyTotalScans: number;
}

export interface StatsResponse {
  message: string;
  summary: StatsSummary;
  distribution: DistributionItem[];
  metrics: MetricItem[];
}
