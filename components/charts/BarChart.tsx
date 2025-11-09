'use client';
import React, { useEffect, useRef } from 'react';
import type { DataPoint } from '../../lib/types';
import { sampleReduce } from '../../lib/performanceUtils';
import { useZoomPan } from '../../hooks/useZoomPan';

/**
 * Basic bar chart visualization for time-series data.
 */
export default function BarChart({ getData }: { getData: () => DataPoint[] }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const view = useRef({ zoom: 1, offset: 0 });
  useZoomPan(ref, (s) => (view.current = s));

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let run = true;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = () => {
      if (!run) return;
      resize();
      const raw = getData();
      if (!raw.length) {
        raf = requestAnimationFrame(render);
        return;
      }

      const data = sampleReduce(raw, 500);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const minT = data[0].timestamp;
      const maxT = data[data.length - 1].timestamp;
      const minV = Math.min(...data.map((d) => d.value));
      const maxV = Math.max(...data.map((d) => d.value));

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#22c55e';
      const barW = Math.max(1, w / data.length);
      for (let i = 0; i < data.length; i++) {
        const x =
          ((data[i].timestamp - minT) / Math.max(1, maxT - minT)) *
            w *
            view.current.zoom +
          view.current.offset;
        const val = (data[i].value - minV) / (maxV - minV || 1);
        const barH = val * h;
        ctx.fillRect(x, h - barH, barW * 0.9, barH);
      }

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => {
      run = false;
      cancelAnimationFrame(raf);
    };
  }, [getData]);

  return (
    <div style={{ width: '100%', height: 220 }}>
      <canvas
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          borderRadius: 8,
          background: 'rgba(6,12,25,0.7)',
        }}
      />
    </div>
  );
}
