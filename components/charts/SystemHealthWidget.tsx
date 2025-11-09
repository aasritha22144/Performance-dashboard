'use client';
import React, { useEffect, useRef, useState } from 'react';

/**
 * SystemHealthWidget
 * Compact system summary (CPU, memory, ping) with expandable modal for small charts.
 */
export default function SystemHealthWidget() {
  const [cpu, setCpu] = useState(0);
  const [mem, setMem] = useState(0);
  const [ping, setPing] = useState(0);
  const [open, setOpen] = useState(false);

  // simulate metrics
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setCpu(Math.min(100, Math.max(5, 50 + Math.sin(Date.now() / 900) * 36 + Math.random() * 6)));
      setMem(Math.min(2048, Math.max(64, 500 + Math.sin(Date.now() / 1200) * 220 + Math.random() * 20)));
      setPing(Math.round(30 + Math.sin(Date.now() / 800) * 25 + Math.random() * 8));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // draw circular CPU meter
  const cpuCanvas = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = cpuCanvas.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = 100 * dpr;
    c.height = 100 * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = 50;
    const cy = 50;
    const r = 36;
    ctx.clearRect(0, 0, 100, 100);

    // background ring
    ctx.lineWidth = 9;
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // progress
    const angle = (cpu / 100) * Math.PI * 2;
    const color = cpu < 50 ? '#22c55e' : cpu < 75 ? '#eab308' : '#ef4444';
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + angle);
    ctx.stroke();

    // label
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(cpu)}%`, cx, cy + 5);
  }, [cpu]);

  return (
    <>
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onClick={() => setOpen(true)}
      >
        <h4 style={{ margin: 0, fontSize: 14 }}>System Health</h4>
        <canvas ref={cpuCanvas} style={{ width: 100, height: 100 }} />
        <div style={{ width: 140, height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 6, overflow: 'hidden' }}>
          <div
            style={{
              width: `${Math.min(100, (mem / 2048) * 100)}%`,
              height: '100%',
              transition: 'width 0.25s linear',
              background: '#38bdf8',
            }}
          />
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8' }}>Memory {Math.round(mem)} MB</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: ping < 60 ? '#22c55e' : ping < 120 ? '#eab308' : '#ef4444',
              boxShadow: `0 0 8px ${ping < 60 ? '#22c55e' : ping < 120 ? '#eab308' : '#ef4444'}`,
            }}
          />
          <div style={{ fontSize: 12 }}>{ping} ms</div>
        </div>
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 640,
              background: 'rgba(16,18,30,0.98)',
              borderRadius: 12,
              padding: 18,
              color: '#e2e8f0',
              boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
            }}
          >
            <h2 style={{ margin: 0, marginBottom: 12, textAlign: 'center' }}>System Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <MiniChart title="CPU (%)" value={cpu} color="#22c55e" />
              <MiniChart title="Memory (MB)" value={mem} color="#38bdf8" />
              <MiniChart title="Ping (ms)" value={ping} color="#eab308" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
              <button onClick={() => setOpen(false)} style={{ padding: '8px 14px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MiniChart({ title, value, color }: { title: string; value: number; color: string }) {
  const cRef = useRef<HTMLCanvasElement | null>(null);
  const historyRef = useRef<number[]>([]);

  useEffect(() => {
    historyRef.current = [...historyRef.current.slice(-59), value];
    const c = cRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    const w = c.width;
    const h = c.height;
    const data = historyRef.current;
    const min = Math.min(...data);
    const max = Math.max(...data);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.6;
    data.forEach((v, i) => {
      const x = (i / Math.max(1, data.length - 1)) * w;
      const y = h - ((v - min) / Math.max(1e-6, max - min)) * h;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
  }, [value, color]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <strong style={{ marginBottom: 6 }}>{title}</strong>
      <canvas ref={cRef} width={180} height={80} style={{ borderRadius: 6, background: 'rgba(255,255,255,0.03)' }} />
    </div>
  );
}
