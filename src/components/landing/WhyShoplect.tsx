import Image from 'next/image';
import { A } from './assets';
import s from './Landing.module.css';

const ITEMS = [
  { i: 'why-1.svg', t: 'Safe payments with escrow', d: 'Your money’s safe until you’re satisfied.', med: true },
  { i: 'why-2.svg', t: 'Direct seller-buyer interaction without risks', d: 'Connect directly, trade securely.' },
  { i: 'why-3.svg', t: 'Dispute resolution & buyer protection', d: 'We’ve got your back, every step of the way.' },
  { i: 'why-4.svg', t: 'Easy withdrawals for vendors', d: 'Fast, easy access to your earnings.' },
];

export default function WhyShoplect() {
  return (
    <section className={s.split} aria-labelledby="why-title">
      <div className={s.photo}>
        <Image src="/assets/people.png" alt="Buyer and seller agreeing on a transaction" fill sizes="610px" />
      </div>
      <div className={s.splitCopy}>
        <div>
          <h2 id="why-title" className={s.splitH}>Why Shoplect?</h2>
          <p className={s.splitP}>A safer, smarter way to buy and sell with escrow secured payments, fraud protection, and fast, hassle-free transactions.</p>
        </div>
        <ul className={s.why}>
          {ITEMS.map((it) => (
            <li key={it.t} className={s.whyItem}>
              <img src={A(it.i)} alt="" width={36} height={36} />
              <div>
                <p className={`${s.whyTitle} ${it.med ? s.whyTitleMed : ''}`}>{it.t}</p>
                <p className={s.whySub}>{it.d}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
