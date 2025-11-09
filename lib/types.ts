
export interface DataPoint{
  timestamp: number;
  value: number;
  category?: string;
  id?: string;
}

export interface PerformanceMetrics{
  fps: number;
  memoryMB?: number;
  renderTimeMs?: number;
}