'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { takePostAuthRedirect } from '@/lib/pending';
import { ROUTES } from '@/lib/routes';
import s from './Auth.module.css';

export default function ContinueButton() {
  const [href, setHref] = useState<string>(ROUTES.shop);
  useEffect(() => { setHref(takePostAuthRedirect(ROUTES.shop)); }, []);
  return <Link href={href} className={s.btn}>Continue</Link>;
}
