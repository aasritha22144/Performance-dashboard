'use client';
import React from 'react';
import type { DataPoint } from '../../lib/types';

/**
 * Simple table that displays the latest rows.
 * For large-scale virtualization replace with an actual windowing library.
 */
export default function DataTable({ data }: { data: DataPoint[] }) {
  const rows = data.slice(-60).reverse();

  return (
    <div style={{ maxHeight: 420, overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <td style={{ padding: '8px 10px' }}>{new Date(r.timestamp).toLocaleTimeString()}</td>
              <td style={{ padding: '8px 10px', textAlign: 'right', fontFamily: 'monospace' }}>{r.value.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
