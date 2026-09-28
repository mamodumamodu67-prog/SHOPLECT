import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import StartSellingLink from '@/components/site/StartSellingLink';
import { A } from './assets';
import s from './Landing.module.css';

export default function CtaBanner() {
  return (
    <section className={s.ctaSection} aria-labelledby="cta-title">
      <div className={s.ctaBox}>
        <img className={s.ctaRing} style={{ left: -345, top: -338 }} src={A('cta-ring.svg')} alt="" aria-hidden="true" />
        <img className={s.ctaRing} style={{ left: 964, top: 272 }} src={A('cta-ring.svg')} alt="" aria-hidden="true" />
        <div className={s.ctaInner}>
          <div className={s.ctaText}>
            <h2 id="cta-title" className={s.ctaH}>Join 1,000+ safe buyers and sellers today.</h2>
            <p className={s.lead}>Experience secure, stress-free transactions with escrow protection and trusted support.</p>
          </div>
          <div className={s.ctaRow}>
            <StartSellingLink className={`${s.pill} ${s.pillBrown}`}>Start Selling</StartSellingLink>
            <Link href={ROUTES.shop} className={`${s.pill} ${s.pillWhite}`}>Shop Now</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
