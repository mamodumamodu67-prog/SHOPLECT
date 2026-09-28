import type { Metadata } from 'next';
import '@/styles/app.css';
import DashShell from '@/components/dash/DashShell';

export const metadata: Metadata = { title: { default: 'Dashboard', template: '%s | Shoplect Dashboard' }, robots: { index: false, follow: false } };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashShell>{children}</DashShell>;
}
