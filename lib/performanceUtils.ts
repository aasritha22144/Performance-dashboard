import type { DataPoint } from './types';

/**
 * Reduces dataset size by uniform sampling.
 * Prevents overdraw and improves canvas performance.
 */
export function sampleReduce(data: DataPoint[], limit = 2000): DataPoint[] {
  if (data.length <= limit) return data;
  const step = Math.floor(data.length / limit);
  const reduced: DataPoint[] = [];
  for (let i = 0; i < data.length; i += step) reduced.push(data[i]);
  return reduced;
}
