'use client';
import React, { useRef } from 'react';
import { useChartRenderer } from '../../hooks/useChartRenderer';
import type { DataPoint } from '../../lib/types';

/**
 * Real-time line chart for continuous data streams.
 */
export default function LineChart({ getData }: { getData: () => DataPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useChartRenderer(canvasRef, getData, {
    stroke: '#06b6d4',
    lineWidth: 1.5,
    maxPoints: 2500,
  });

  return (
    <div style={{ width: '100%', height: 350 }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          background: 'rgba(5,10,20,0.9)',
          borderRadius: 8,
          display: 'block',
        }}
      />
    </div>
  );
}
