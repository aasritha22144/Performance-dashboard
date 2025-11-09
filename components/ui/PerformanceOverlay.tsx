'use client';
import React, { useEffect, useRef, useState } from 'react';

/**
 * Expandable overlay HUD showing FPS, frame time, memory, cpu, ping summary.
 * Click to expand/collapse.
 */
export default function PerformanceOverlay() {
  const [open, setOpen] = useState(false);
  const [metrics, setMetrics] = useState({ fps: 60, dt: 16, mem: null as number | null, cpu: 20, ping: 40 });

  const lastRef = useRef(performance.now());
  const framesRef = useRef<number[]>([]);
  const memRef = useRef<number[]>([]);
  const cpuRef = useRef<number[]>([]);
  const pingRef = useRef<number[]>([]);

  useEffect(() => {
    let running = true;
    const loop = () => {
      if (!running) return;
      const now = performance.now();
      const dt = now - lastRef.current;
      lastRef.current = now;

      framesRef.current.push(dt);
      if (framesRef.current.length > 50) framesRef.current.shift();
      const avg = framesRef.current.reduce((a, b) => a + b, 0) / framesRef.current.length;
      const fps = Math.round(1000 / avg);

      let mem: number | null = null;
      try {
        // @ts-ignore
        const m = (performance as any).memory;
        mem = m ? Math.round(m.usedJSHeapSize / 1024 / 1024) : null;
      } catch {
        mem = null;
      }
      memRef.current.push(mem ?? 0); if (memRef.current.length > 60) memRef.current.shift();

      // lightweight simulated CPU & ping for visualization
      const cpu = Math.round(Math.min(99, 40 + Math.sin(Date.now() / 1000) * 30 + Math.random() * 10));
      const ping = Math.round(30 + Math.sin(Date.now() / 700) * 25 + Math.random() * 8);
      cpuRef.current.push(cpu); if (cpuRef.current.length > 60) cpuRef.current.shift();
      pingRef.current.push(ping); if (pingRef.current.length > 60) pingRef.current.shift();

      setMetrics({ fps, dt: Math.round(avg), mem, cpu, ping });
      requestAnimationFrame(loop);
    };

    const id = requestAnimationFrame(loop);
    return () => { running = false; cancelAnimationFrame(id); };
  }, []);

  const fpsColor = metrics.fps >= 55 ? '#22c55e' : metrics.fps >= 35 ? '#eab308' : '#ef4444';

  return (
    <>
      <div
        onClick={() => setOpen((s) => !s)}
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 9999,
          background: 'rgba(8,10,20,0.9)',
          padding: 8,
          borderRadius: 8,
          color: '#e2e8f0',
          cursor: 'pointer',
          fontFamily: 'monospace',
          fontSize: 13,
        }}
      >
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ color: fpsColor }}>●</span>
          <div>{metrics.fps} FPS</div>
          <div style={{ marginLeft: 8 }}>{metrics.mem !== null ? `${metrics.mem} MB` : 'mem n/a'}</div>
        </div>
      </div>

      {open && (
        <div
          style={{
            position: 'fixed',
            top: 56,
            right: 16,
            zIndex: 9999,
            width: 320,
            background: 'rgba(8,10,20,0.95)',
            padding: 12,
            borderRadius: 8,
            color: '#e2e8f0',
            fontFamily: 'monospace',
            fontSize: 13,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>FPS: {metrics.fps}</div>
            <div>Δt: {metrics.dt} ms</div>
          </div>
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
            <div>CPU: {metrics.cpu}%</div>
            <div>Ping: {metrics.ping} ms</div>
          </div>
          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.8 }}>
            Click HUD to toggle
          </div>
        </div>
      )}
    </>
  );
}
