import Image from 'next/image';
import { A } from './assets';
import s from './Landing.module.css';

const POINTS = ['No scams', 'No stress', 'Just safe transactions'];

export default function Trust() {
  return (
    <section className={s.split} aria-labelledby="trust-title">
      <div className={s.splitCopy}>
        <div>
          <h2 id="trust-title" className={s.splitH}>Shop with Confidence</h2>
          <p className={s.splitP}>
            At Shoplect, your safety comes first. Our secure escrow system protects both buyers and sellers; funds are only released when orders are delivered. No fraud, no stress, just safe, transparent transactions.
          </p>
        </div>
        <ul className={s.checks}>
          {POINTS.map((p) => (
            <li key={p} className={s.check}>
              <span className={s.checkIcon} aria-hidden="true"><span><img src={A('check.svg')} alt="" /></span></span>
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className={s.photo}>
        <Image src="/assets/people.png" alt="Two people shaking hands to close a safe deal" fill sizes="610px" />
      </div>
    </section>
  );
}
