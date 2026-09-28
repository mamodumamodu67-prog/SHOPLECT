import type { Metadata } from 'next';
import VerifyForm from '@/components/auth/VerifyForm';

export const metadata: Metadata = { title: 'Account verification', robots: { index: false, follow: false } };

export default function VerifyPage() { return <VerifyForm />; }
