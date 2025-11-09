
import { useEffect, useState } from 'react';

export function usePerformanceMonitor(){
  const [fps, setFps] = useState(60);
  useEffect(() => {
    let last = performance.now(); let frames = 0; let raf = 0;
    const loop = (t: number) => {
      frames++;
      const dt = t - last;
      if (dt >= 1000){ setFps(Math.round((frames * 1000) / dt)); frames = 0; last = t; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return { fps };
}