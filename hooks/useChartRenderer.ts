import { useEffect } from 'react';
import { sampleReduce } from '../lib/performanceUtils';
import { useZoomPan } from './useZoomPan';
import type { DataPoint } from '../lib/types';

type RenderOptions = { stroke?: string; lineWidth?: number; maxPoints?: number };

/**
 * Canvas renderer hook for smooth real-time plotting.
 */
export function useChartRenderer(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  getData: () => DataPoint[],
  opts?: RenderOptions
) {
  let zoomState = { zoom: 1, offset: 0 };
  useZoomPan(canvasRef, (s) => (zoomState = s));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let lastTs = 0;
    let running = true;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      if (!running) return;
      resize();

      const raw = getData();
      if (!raw.length) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const latest = raw[raw.length - 1].timestamp;
      if (latest === lastTs) {
        raf = requestAnimationFrame(draw);
        return;
      }
      lastTs = latest;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const data = sampleReduce(raw, opts?.maxPoints ?? 2500);

      const minT = data[0].timestamp;
      const maxT = data[data.length - 1].timestamp;
      const minV = Math.min(...data.map((d) => d.value));
      const maxV = Math.max(...data.map((d) => d.value));

      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      ctx.strokeStyle = opts?.stroke ?? '#06b6d4';
      ctx.lineWidth = opts?.lineWidth ?? 1.2;

      const xScale = w * zoomState.zoom;
      const offset = zoomState.offset;
      const xMap = (t: number) => ((t - minT) / Math.max(1, maxT - minT)) * xScale + offset;
      const yMap = (v: number) => h - ((v - minV) / Math.max(1e-6, maxV - minV)) * h;

      ctx.moveTo(xMap(data[0].timestamp), yMap(data[0].value));
      for (let i = 1; i < data.length; i++) {
        const p = data[i];
        ctx.lineTo(xMap(p.timestamp), yMap(p.value));
      }
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  }, [canvasRef, getData, opts?.stroke, opts?.lineWidth, opts?.maxPoints]);
}
