import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { A } from '@/components/landing/assets';
import s from './Auth.module.css';

export function ShieldIcon() {
  // Stand-in for Figma's "uiw:safety" icon (100x100). Swap for the exported SVG if you prefer.
  return (
    <svg className={s.icon} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <path d="M50 8 16 21v26c0 21 14.5 38.5 34 45 19.5-6.5 34-24 34-45V21L50 8Z" fill="#784c31" />
      <path d="m34 50 12 12 21-24" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Props = {
  title: string;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export default function AuthShell({ title, subtitle, icon, footer, children }: Props) {
  return (
    <main id="main" className={s.page}>
      <section className={`${s.card} ${footer ? '' : s.noFooter}`} aria-labelledby="auth-title">
        <div className={s.content}>
          <div className={s.head}>
            <div className={s.topRow}>
              <Link href={ROUTES.home} className={s.close} aria-label="Close and return home">
                <img src={A('auth-close.svg')} alt="" />
              </Link>
              <Link href={ROUTES.home} className={s.logo} aria-label="Shoplect home">
                <img src={A('auth-logo.png')} alt="" />
              </Link>
            </div>
            <div className={s.titleBlock}>
              {icon}
              <h1 id="auth-title" className={s.title}>{title}</h1>
              {subtitle && <p className={s.sub}>{subtitle}</p>}
            </div>
          </div>
          {children}
        </div>
        {footer && <p className={s.footer}>{footer}</p>}
      </section>
    </main>
  );
}
