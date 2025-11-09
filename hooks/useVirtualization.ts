
import { useState, useRef, useEffect } from 'react';

export function useVirtualization(totalCount:number, rowHeight:number, viewportRows:number){
  const [scrollTop,setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const start = Math.max(0, Math.floor(scrollTop/rowHeight)-4);
  const end = Math.min(totalCount, start + viewportRows + 8);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => setScrollTop(el.scrollTop);
    el.addEventListener('scroll', handler);
    return () => el.removeEventListener('scroll', handler);
  }, []);
  return { containerRef, start, end };
}