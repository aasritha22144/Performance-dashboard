'use client';
import { useEffect, useState, useCallback } from 'react';
import type { DataPoint } from '../lib/types';

/**
 * Simulates a real-time data stream.
 * Reacts to “stressMode” events that dynamically increase frequency.
 */
export function useDataStream(limit = 10000) {
  const [points, setPoints] = useState<DataPoint[]>([]);
  const [intervalMs, setIntervalMs] = useState(100);

  // Listen to stressMode global event
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<boolean>;
      setIntervalMs(ce.detail ? 30 : 100);
    };
    window.addEventListener('stressMode', handler);
    return () => window.removeEventListener('stressMode', handler);
  }, []);

  // Data generator
  useEffect(() => {
    let time = Date.now();
    let timer: NodeJS.Timeout;
    const tick = () => {
      time += intervalMs;
      setPoints(prev => {
        const val =
          Math.sin(time / 400) * 20 +
          Math.cos(time / 700) * 8 +
          (Math.random() - 0.5) * 3;
        const newPoint = { timestamp: time, value: val };
        const arr = [...prev, newPoint];
        if (arr.length > limit) arr.splice(0, arr.length - limit);
        return arr;
      });
      timer = setTimeout(tick, intervalMs);
    };
    timer = setTimeout(tick, intervalMs);
    return () => clearTimeout(timer);
  }, [intervalMs, limit]);

  const getSlice = useCallback(() => points.slice(-limit), [points, limit]);
  return { slice: points.slice(-limit), getSlice };
}
