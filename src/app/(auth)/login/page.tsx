import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import AuthShell from '@/components/auth/AuthShell';
import LoginForm from '@/components/auth/LoginForm';
import { ROUTES } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Log into your Shoplect account.',
  alternates: { canonical: '/login' },
};

export default function LoginPage() {
  return (
    <AuthShell title="Log into your account" footer={<>Don’t have an account? <Link href={ROUTES.register}>Sign up</Link></>}>
      <Suspense><LoginForm /></Suspense>
    </AuthShell>
  );
}
