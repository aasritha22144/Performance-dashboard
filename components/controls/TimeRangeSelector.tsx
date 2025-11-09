
'use client';
import React from 'react';

export default function TimeRangeSelector({onChange}:{onChange?: (ms:number)=>void}){
  return (
    <div style={{display:'flex', gap:8}}>
      <button onClick={() => onChange?.(60*1000)}>1m</button>
      <button onClick={() => onChange?.(5*60*1000)}>5m</button>
      <button onClick={() => onChange?.(60*60*1000)}>1h</button>
    </div>
  );
}