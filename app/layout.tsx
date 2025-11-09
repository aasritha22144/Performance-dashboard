import './globals.css';
import type { ReactNode } from 'react';
import PerformanceOverlay from '../components/ui/PerformanceOverlay';

export const metadata = {
  title: 'Performance Dashboard',
  description: 'High-performance real-time data visualization dashboard built with Next.js 14 + TypeScript',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PerformanceOverlay />
        <main>{children}</main>
      </body>
    </html>
  );
}
