'use client';
import React from 'react';
import { DataProvider } from '../../components/providers/DataProvider';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import ScatterPlot from '../../components/charts/ScatterPlot';
import Heatmap from '../../components/charts/Heatmap';
import SystemHealthWidget from '../../components/charts/SystemHealthWidget';
import DataTable from '../../components/ui/DataTable';
import PerformanceMonitor from '../../components/ui/PerformanceMonitor';
import { useDataStream } from '../../hooks/useDataStream';

/**
 * Main dashboard that combines charts, data table, and controls.
 */
export default function DashboardPage() {
  return (
    <DataProvider>
      <DashboardContent />
    </DataProvider>
  );
}

function DashboardContent() {
  const { getSlice } = useDataStream();
  const getData = React.useCallback(() => getSlice(), [getSlice]);

  const activateStress = () => {
    window.dispatchEvent(new CustomEvent('stressMode', { detail: true }));
    const badge = document.getElementById('stress-badge');
    if (badge) badge.style.display = 'inline';
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('stressMode', { detail: false }));
      if (badge) badge.style.display = 'none';
    }, 10000);
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 360px',
        gap: 16,
        padding: 20,
      }}
    >
      {/* Left Column: Visuals */}
      <div>
        <div className="card header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>📈 Real-Time Line Chart</strong>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>Data stream: 100ms refresh</div>
          </div>
          <PerformanceMonitor />
        </div>

        <div className="card" style={{ marginTop: 12 }}>
          <LineChart getData={getData} />
        </div>

        <div className="card" style={{ marginTop: 16 }}>
          <h3 style={{ marginBottom: 10 }}>📊 Other Visualizations</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
            }}
          >
            <BarChart getData={getData} />
            <ScatterPlot getData={getData} />
            <Heatmap getData={getData} />
            <SystemHealthWidget />
          </div>
        </div>
      </div>

      {/* Right Column: Data + Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="card">
          <h4>Data Table (Virtualized)</h4>
          <LiveDataTable />
        </div>

        <div className="card">
          <h4>Controls</h4>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            <button onClick={() => window.location.reload()}>Reload</button>
            <button onClick={activateStress}>Stress Mode</button>
            <button
              onClick={() => {
                const e = new CustomEvent('resetZoom');
                window.dispatchEvent(e);
              }}
            >
              Reset Zoom
            </button>
            <span id="stress-badge" style={{ display: 'none', color: '#ef4444', fontWeight: 600 }}>
               STRESS ACTIVE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveDataTable() {
  const { slice } = useDataStream(10000);
  return <DataTable data={slice} />;
}
