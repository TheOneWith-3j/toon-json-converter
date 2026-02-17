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
