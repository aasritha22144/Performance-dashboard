
import type { DataPoint } from './types';

export function generateInitialDataset(points = 10000, start = Date.now() - 1000 * 60){
  const data: DataPoint[] = new Array(points).fill(0).map((_, i) => ({
    timestamp: start + i * 100,
    value: Math.sin(i/50) * 20 + (Math.random()-0.5) * 5,
    id: `p-${i}`
  }));
  return data;
}

export function generateRealtimePoint(lastTimestamp: number){
  const t = lastTimestamp + 100;
  const v = Math.sin(t/1000) * 20 + (Math.random()-0.5) * 6;
  return { timestamp: t, value: v };
}