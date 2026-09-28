'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi, ApiError } from '@/lib/api';
import { AUTH_ROUTES, ROUTES } from '@/lib/routes';
import { cleanText, isEmail, isStrongPassword, safeRedirect } from '@/lib/validation';
import { setPendingEmail, setPostAuthRedirect } from '@/lib/pending';
import { A } from '@/components/landing/assets';
import TextField from './TextField';
import PasswordField from './PasswordField';
import s from './Auth.module.css';

type Errors = Partial<Record<'fullName' | 'email' | 'phone' | 'password' | 'agree', string>>;

export default function RegisterForm() {
  const router = useRouter();
  const next = safeRedirect(useSearchParams().get('next'), '');
  const [f, setF] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [banner, setBanner] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF((p) => ({ ...p, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const v = { fullName: cleanText(f.fullName, 100), email: f.email.trim().toLowerCase(), phone: f.phone.replace(/[^\d+]/g, ''), password: f.password };
    const er: Errors = {};
    if (v.fullName.length < 2) er.fullName = 'Enter your full name';
    if (!isEmail(v.email)) er.email = 'Enter a valid email address';
    if (v.phone.replace(/\D/g, '').length < 7) er.phone = 'Enter a valid phone number';
    if (!isStrongPassword(v.password)) er.password = 'Use 8+ characters with upper, lower case and a number';
    if (!agree) er.agree = 'Please accept the privacy policy and terms';
    setErrors(er); setBanner('');
    if (Object.keys(er).length) return;

    setBusy(true);
    try {
      await authApi.register(v);
      setPendingEmail(v.email);
      if (next) setPostAuthRedirect(next);
      router.push(AUTH_ROUTES.verify);
    } catch (err) {
      setBanner(err instanceof ApiError && err.status !== 0 ? err.message : 'Could not create your account. Please try again.');
    } finally { setBusy(false); }
  }

  return (
    <form className={s.form} onSubmit={onSubmit} noValidate>
      <TextField id="fullName" label="Full name" placeholder="Full name" value={f.fullName} onChange={set('fullName')} error={errors.fullName} autoComplete="name" maxLength={100} />
      <TextField id="email" label="Email" placeholder="Enter your email" type="email" inputMode="email" value={f.email} onChange={set('email')} error={errors.email} autoComplete="email" />
      <TextField id="phone" label="Phone number" placeholder="Phone number" type="tel" inputMode="tel" value={f.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" maxLength={20} />
      <PasswordField value={f.password} onChange={set('password')} error={errors.password} autoComplete="new-password" />
      {banner && <p className={s.banner} role="alert">{banner}</p>}
      <div className={s.actions}>
        <button className={s.btn} type="submit" disabled={busy}>{busy ? 'Creating…' : 'Create Account'}</button>
        <label className={s.agree}>
          <span className={s.checkbox}>
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} aria-describedby={errors.agree ? 'agree-err' : undefined} />
            {agree ? <img src={A('auth-checkbox.svg')} alt="" /> : <span className={s.box} />}
          </span>
          <span>
            I agree with the <Link href={ROUTES.privacy} target="_blank"><strong>privacy policy,</strong></Link>{' '}
            <Link href={ROUTES.terms} target="_blank"><strong>terms &amp; conditions</strong></Link>
          </span>
        </label>
        {errors.agree && <span id="agree-err" className={s.err} role="alert">{errors.agree}</span>}
      </div>
    </form>
  );
}
