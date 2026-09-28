'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi, ApiError } from '@/lib/api';
import { AUTH_ROUTES, ROUTES } from '@/lib/routes';
import { isEmail, safeRedirect } from '@/lib/validation';
import TextField from './TextField';
import PasswordField from './PasswordField';
import s from './Auth.module.css';

export default function LoginForm() {
  const router = useRouter();
  const next = safeRedirect(useSearchParams().get('next'), ROUTES.shop);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [banner, setBanner] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const em = email.trim().toLowerCase();
    const er: typeof errors = {};
    if (!isEmail(em)) er.email = 'Enter a valid email address';
    if (!password) er.password = 'Enter your password';
    setErrors(er); setBanner('');
    if (Object.keys(er).length) return;
    setBusy(true);
    try {
      await authApi.login({ email: em, password });
      router.push(next);
    } catch (err) {
      // Generic message on purpose: never reveal whether the email exists.
      setBanner(err instanceof ApiError && err.status === 429 ? 'Too many attempts. Please wait and try again.' : 'Incorrect email or password.');
    } finally { setBusy(false); }
  }

  return (
    <form className={s.form} onSubmit={onSubmit} noValidate>
      <TextField id="email" label="Email" placeholder="Enter your email" type="email" inputMode="email" value={email} onChange={setEmail} error={errors.email} autoComplete="email" />
      <PasswordField value={password} onChange={setPassword} error={errors.password} autoComplete="current-password" />
      <div className={s.forgotRow}><Link href={AUTH_ROUTES.forgot} className={s.link}>Forgot password?</Link></div>
      {banner && <p className={s.banner} role="alert">{banner}</p>}
      <button className={s.btn} type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Log in'}</button>
    </form>
  );
}
