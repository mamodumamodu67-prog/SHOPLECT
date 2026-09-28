import { redirect } from 'next/navigation';
import { DASH } from '@/lib/routes';

// Figma's sidebar has no "Dashboard" entry of its own — landing here means "Manage Shop".
export default function DashboardRootPage() {
  redirect(DASH.shops);
}
