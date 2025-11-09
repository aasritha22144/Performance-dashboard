
export function deviceSizeToPixels(el: HTMLElement){
  const dpr = window.devicePixelRatio || 1;
  return { width: Math.floor(el.clientWidth * dpr), height: Math.floor(el.clientHeight * dpr), dpr };
}