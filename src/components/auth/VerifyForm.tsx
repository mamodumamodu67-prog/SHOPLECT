'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { AUTH_ROUTES } from '@/lib/routes';
import { clearPendingEmail, getPendingEmail } from '@/lib/pending';
import AuthShell, { ShieldIcon } from './AuthShell';
import s from './Auth.module.css';

const LEN = 6;

export default function VerifyForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [digits, setDigits] = useState<string[]>(Array(LEN).fill(''));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { setEmail(getPendingEmail()); }, []);
  useEffect(() => {
    if (!cooldown) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const code = digits.join('');
  const focus = (i: number) => refs.current[Math.max(0, Math.min(LEN - 1, i))]?.focus();

  function onChange(i: number, v: string) {
    const d = v.replace(/\D/g, '');
    if (!d) { setDigits((p) => p.map((x, k) => (k === i ? '' : x))); return; }
    setDigits((p) => { const n = [...p]; d.slice(0, LEN - i).split('').forEach((c, k) => (n[i + k] = c)); return n; });
    focus(i + d.length);
  }
  function onKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[i]) focus(i - 1);
    if (e.key === 'ArrowLeft') focus(i - 1);
    if (e.key === 'ArrowRight') focus(i + 1);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || code.length !== LEN) return;
    setBusy(true); setMsg('');
    try {
      await authApi.verify({ email, code });
      clearPendingEmail();
      router.push(AUTH_ROUTES.verified);
    } catch { setMsg('That code is incorrect or has expired.'); }
    finally { setBusy(false); }
  }

  async function resend() {
    if (cooldown || !email) return;
    setCooldown(30); setMsg('');
    try { await authApi.resend({ email }); setMsg('A new code has been sent.'); }
    catch { setMsg('Could not resend the code. Try again shortly.'); }
  }

  return (
    <AuthShell icon={<ShieldIcon />} title="Account verification"
      subtitle={<>We’ve sent a verification code to {email || 'your email'}</>}>
      <form className={s.form} onSubmit={onSubmit} noValidate>
        <div className={s.otpRow} role="group" aria-label="Verification code">
          {digits.map((d, i) => (
            <input key={i} ref={(el) => { refs.current[i] = el; }} className={s.otp} value={d} inputMode="numeric"
              autoComplete={i === 0 ? 'one-time-code' : 'off'} maxLength={LEN} aria-label={`Digit ${i + 1}`}
              onChange={(e) => onChange(i, e.target.value)} onKeyDown={(e) => onKeyDown(i, e)} onFocus={(e) => e.target.select()} />
          ))}
        </div>
        {msg && <p className={s.banner} role="status">{msg}</p>}
        <div className={s.actions} style={{ gap: 12 }}>
          <p className={s.resend}>Didn’t receive any code?{' '}
            <button type="button" className={s.link} onClick={resend} disabled={cooldown > 0}>{cooldown ? `Resend (${cooldown}s)` : 'Resend'}</button>
          </p>
          <button className={s.btn} type="submit" disabled={busy || code.length !== LEN}>{busy ? 'Verifying…' : 'Verify'}</button>
        </div>
      </form>
    </AuthShell>
  );
}
