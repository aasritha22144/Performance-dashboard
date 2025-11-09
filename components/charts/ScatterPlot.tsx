'use client';
import React, { useEffect, useRef } from 'react';
import type { DataPoint } from '../../lib/types';
import { sampleReduce } from '../../lib/performanceUtils';
import { useZoomPan } from '../../hooks/useZoomPan';

/**
 * Simple scatter plot using canvas dots.
 */
export default function ScatterPlot({ getData }: { getData: () => DataPoint[] }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const view = useRef({ zoom: 1, offset: 0 });
  useZoomPan(ref, (s) => (view.current = s));

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let running = true;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      if (!running) return;
      resize();

      const data = sampleReduce(getData(), 2000);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      if (!data.length) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const minT = data[0].timestamp;
      const maxT = data[data.length - 1].timestamp;
      const minV = Math.min(...data.map((d) => d.value));
      const maxV = Math.max(...data.map((d) => d.value));

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#f59e0b';

      for (let i = 0; i < data.length; i++) {
        const x =
          ((data[i].timestamp - minT) / Math.max(1, maxT - minT)) *
            w *
            view.current.zoom +
          view.current.offset;
        const y = h - ((data[i].value - minV) / Math.max(1e-6, maxV - minV)) * h;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      running = false;
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
