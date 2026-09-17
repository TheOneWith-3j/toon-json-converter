// Local metrics tracking
export interface Metrics {
  totalConversions: number;
  successCount: number;
  failureCount: number;
  jsonToonCount: number;
  toonJsonCount: number;
  detectionDistribution: Record<string, number>;
  avgInputSize: number;
  avgOutputSize: number;
  sessionDuration: number;
  pageViews: number;
  featureUsage: Record<string, number>;
}

const METRICS_KEY = "toon-json-converter-metrics";

export function getDefaultMetrics(): Metrics {
  return {
    totalConversions: 0,
    successCount: 0,
    failureCount: 0,
    jsonToonCount: 0,
    toonJsonCount: 0,
    detectionDistribution: {},
    avgInputSize: 0,
    avgOutputSize: 0,
    sessionDuration: 0,
    pageViews: 0,
    featureUsage: {},
  };
}

export function loadMetrics(): Metrics {
  if (typeof window === "undefined") return getDefaultMetrics();
  try {
    return { ...getDefaultMetrics(), ...JSON.parse(localStorage.getItem(METRICS_KEY) ?? "{}") };
  } catch {
    return getDefaultMetrics();
  }
}

export function recordConversion(
  metrics: Metrics,
  inputSize: number,
  outputSize: number,
  direction: "json-toon" | "toon-json",
  success: boolean,
): Metrics {
  const total = metrics.totalConversions + 1;
  return {
    ...metrics,
    totalConversions: total,
    successCount: metrics.successCount + (success ? 1 : 0),
    failureCount: metrics.failureCount + (success ? 0 : 1),
    jsonToonCount: metrics.jsonToonCount + (direction === "json-toon" ? 1 : 0),
    toonJsonCount: metrics.toonJsonCount + (direction === "toon-json" ? 1 : 0),
    avgInputSize: (metrics.avgInputSize * metrics.totalConversions + inputSize) / total,
    avgOutputSize: (metrics.avgOutputSize * metrics.totalConversions + outputSize) / total,
    featureUsage: { ...metrics.featureUsage, convert: (metrics.featureUsage.convert ?? 0) + 1 },
  };
}

export function saveMetrics(metrics: Metrics): void {
  if (typeof window !== "undefined") localStorage.setItem(METRICS_KEY, JSON.stringify(metrics));
}
