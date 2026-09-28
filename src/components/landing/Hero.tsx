import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import StartSellingLink from '@/components/site/StartSellingLink';
import s from './Landing.module.css';

export default function Hero() {
  return (
    <section className={s.hero} aria-labelledby="hero-title">
      <Image src="/assets/hero.png" alt="" fill priority sizes="100vw" className={s.heroBg} />
      <div className={s.heroInner}>
        <div className={s.heroText}>
          <h1 id="hero-title" className={s.h1}>Buy &amp; Sell Safely with Shoplect</h1>
          <p className={s.lead}>
            Secure marketplace platform with escrow protection, built for small businesses and social vendors. Buy and sell with confidence; every transaction is safe, simple, and trusted.
          </p>
        </div>
        <div className={s.ctaRow}>
          <StartSellingLink className={`${s.pill} ${s.pillBrown}`}>Start Selling</StartSellingLink>
          <Link href={ROUTES.shop} className={`${s.pill} ${s.pillWhite}`}>Shop Now</Link>
        </div>
      </div>
    </section>
  );
}
