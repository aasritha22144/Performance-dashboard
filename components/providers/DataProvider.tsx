 'use client';
import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import type { DataPoint } from '../../lib/types';
import { generateInitialDataset, generateRealtimePoint } from '../../lib/dataGenerator';

type DataContext = {
  subscribe: (fn: (data: DataPoint[]) => void) => () => void;
  getLatestWindow: (msWindow: number) => DataPoint[];
  pushPoint: (p: DataPoint) => void;
};

const DataCtx = createContext<DataContext | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }){
  const bufferRef = useRef<DataPoint[]>(generateInitialDataset(10000));
  const subsRef = useRef(new Set<(d: DataPoint[]) => void>());
  const maxPoints = 200_000;

  const pushPoint = useCallback((p: DataPoint) => {
    bufferRef.current.push(p);
    if (bufferRef.current.length > maxPoints) bufferRef.current.splice(0, bufferRef.current.length - maxPoints);
    const snap = bufferRef.current.slice(-20000);
    subsRef.current.forEach(s => s(snap));
  }, []);

  useEffect(() => {
    let cancelled = false;
    let last = bufferRef.current[bufferRef.current.length - 1]?.timestamp ?? Date.now();

    const produce = () => {
      if (cancelled) return;
      const p = generateRealtimePoint(last);
      last = p.timestamp;
      pushPoint(p);
      setTimeout(produce, 100);
    };
    produce();
    return () => { cancelled = true; };
  }, [pushPoint]);

  const subscribe = useCallback((fn: (d: DataPoint[]) => void) => {
    subsRef.current.add(fn);
    fn(bufferRef.current.slice(-20000));
    return () => { subsRef.current.delete(fn); };
  }, []);

  const getLatestWindow = useCallback((msWindow: number) => {
    const now = Date.now();
    return bufferRef.current.filter(d => d.timestamp >= now - msWindow);
  }, []);

  return (
    <DataCtx.Provider value={{ subscribe, getLatestWindow, pushPoint }}>
      {children}
    </DataCtx.Provider>
  );
}

export function useDataProvider(){
  const c = useContext(DataCtx);
  if (!c) throw new Error('useDataProvider must be used under DataProvider');
  return c;
}