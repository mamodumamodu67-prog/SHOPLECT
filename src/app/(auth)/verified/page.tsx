import type { Metadata } from 'next';
import AuthShell, { ShieldIcon } from '@/components/auth/AuthShell';
import ContinueButton from '@/components/auth/ContinueButton';
import s from '@/components/auth/Auth.module.css';

export const metadata: Metadata = { title: 'Account verified', robots: { index: false, follow: false } };

export default function VerifiedPage() {
  return (
    <AuthShell icon={<ShieldIcon />} title="Account verified" subtitle="You can now start buying selling securely">
      <div className={s.form}>
        <ContinueButton />
      </div>
    </AuthShell>
  );
}
