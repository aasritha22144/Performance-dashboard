import { useEffect, useRef } from 'react';

export type ZoomState = { zoom: number; offset: number };

/**
 * Basic pan & zoom control for canvas.
 */
export function useZoomPan(ref: React.RefObject<HTMLCanvasElement>, onChange: (s: ZoomState) => void) {
  const state = useRef<ZoomState>({ zoom: 1, offset: 0 });
  const dragging = useRef(false);
  const lastX = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const scale = e.deltaY > 0 ? 1.1 : 0.9;
      state.current.zoom = Math.max(0.5, Math.min(5, state.current.zoom * scale));
      onChange({ ...state.current });
    };

    const down = (e: MouseEvent) => {
      dragging.current = true;
      lastX.current = e.clientX;
    };

    const up = () => (dragging.current = false);

    const move = (e: MouseEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;
      state.current.offset += dx;
      onChange({ ...state.current });
    };

    canvas.addEventListener('wheel', wheel);
    canvas.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    window.addEventListener('mousemove', move);

    return () => {
      canvas.removeEventListener('wheel', wheel);
      canvas.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('mousemove', move);
    };
  }, [ref, onChange]);
}
