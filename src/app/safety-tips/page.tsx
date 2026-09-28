import type { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';

export const metadata: Metadata = { title: 'Safety tips', robots: { index: false, follow: true } };

export default function Page() { return <ComingSoon title="Safety tips" />; }
