'use client';
import React, { useEffect, useRef, useState } from 'react';

/**
 * Small inline performance monitor showing FPS and heap (if available).
 */
export default function PerformanceMonitor() {
  const [fps, setFps] = useState(60);
  const [mem, setMem] = useState<number | null>(null);
  const frames = useRef(0);
  const last = useRef(performance.now());

  useEffect(() => {
    let raf = 0;
    const loop = (t: number) => {
      frames.current += 1;
      if (t - last.current >= 1000) {
        setFps(Math.round((frames.current * 1000) / (t - last.current)));
        frames.current = 0;
        last.current = t;
        try {
          // @ts-ignore
          const m = (performance as any).memory;
          setMem(m ? Math.round(m.usedJSHeapSize / 1024 / 1024) : null);
        } catch {
          setMem(null);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', color: '#dbeafe', fontSize: 13 }}>
      <div>FPS: <strong>{fps}</strong></div>
      <div>{mem !== null ? `${mem} MB` : 'mem n/a'}</div>
    </div>
  );
}
