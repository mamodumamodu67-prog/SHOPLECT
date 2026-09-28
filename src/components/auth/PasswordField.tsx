'use client';
import { useState } from 'react';
import { A } from '@/components/landing/assets';
import s from './Auth.module.css';

type Props = {
  value: string; onChange: (v: string) => void; error?: string;
  autoComplete: 'new-password' | 'current-password'; id?: string;
};

export default function PasswordField({ value, onChange, error, autoComplete, id = 'password' }: Props) {
  const [show, setShow] = useState(false);
  return (
    <div className={s.fieldWrap}>
      <div className={`${s.field} ${error ? s.fieldErr : ''}`}>
        <label htmlFor={id} className="sr-only">Password</label>
        <input id={id} className={s.input} type={show ? 'text' : 'password'} placeholder="Password" value={value}
          onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} maxLength={128}
          aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} />
        <button type="button" className={s.eye} onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}>
          <img src={A('auth-eye.svg')} alt="" />
        </button>
      </div>
      {error && <span id={`${id}-err`} className={s.err} role="alert">{error}</span>}
    </div>
  );
}
