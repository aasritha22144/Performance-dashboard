'use client';
import React, { useEffect, useRef } from 'react';
import { sampleReduce } from '../../lib/performanceUtils';
import { useZoomPan } from '../../hooks/useZoomPan';

/**
 * Lightweight heatmap visualization.
 */
export default function Heatmap({ getData }: { getData: () => any[] }) {
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

      const data = sampleReduce(getData(), 3000);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      if (!data.length) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const minT = data[0].timestamp;
      const maxT = data[data.length - 1].timestamp;
      const minV = Math.min(...data.map((d) => d.value));
      const maxV = Math.max(...data.map((d) => d.value));

      const cols = 40;
      const rows = 20;
      const grid = Array.from({ length: rows }, () => Array(cols).fill(0));

      for (const d of data) {
        const cx = Math.floor(((d.timestamp - minT) / (maxT - minT)) * cols);
        const cy = Math.floor(((d.value - minV) / (maxV - minV)) * rows);
        if (cx >= 0 && cy >= 0 && cx < cols && cy < rows) grid[cy][cx]++;
      }

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const v = Math.min(1, grid[y][x] / 5);
          if (v > 0) {
            ctx.fillStyle = `rgba(239,68,68,${v})`;
            ctx.fillRect((x / cols) * w, (y / rows) * h, w / cols, h / rows);
          }
        }
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
          borderRadius: 8,
          background: 'rgba(6,12,25,0.7)',
        }}
      />
    </div>
  );
}
