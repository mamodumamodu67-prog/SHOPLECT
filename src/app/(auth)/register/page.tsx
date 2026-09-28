import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import AuthShell from '@/components/auth/AuthShell';
import RegisterForm from '@/components/auth/RegisterForm';
import { ROUTES } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Create an account',
  description: 'Join Shoplect to buy and sell safely with escrow protection.',
  alternates: { canonical: '/register' },
};

export default function RegisterPage() {
  return (
    <AuthShell title="Create an Account" subtitle="Join thousands of users buying and selling products on Shoplect daily."
      footer={<>Already have an account? <Link href={ROUTES.login}>Sign in</Link></>}>
      <Suspense><RegisterForm /></Suspense>
    </AuthShell>
  );
}
