import React from 'react';

export const metadata = { title: 'Dashboard | Performance Monitor' };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section style={{ padding: '16px' }}>
      <h1 style={{ marginBottom: 12 }}>📊 Real-Time Dashboard</h1>
      {children}
    </section>
  );
}
