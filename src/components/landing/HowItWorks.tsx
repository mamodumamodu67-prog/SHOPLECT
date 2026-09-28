import { A } from './assets';
import s from './Landing.module.css';

const STEPS = [
  { t: 'Seller lists product', d: 'List your products, sell with confidence and speed, no hassle; just secure and smooth transactions.' },
  { t: 'Buyer pays into escrow', d: 'Secure payments made to escrow; funds are held safely until the buyer confirms satisfaction.' },
  { t: 'Funds released after delivery', d: 'List your products, sell with confidence and speed, no hassle; just secure and smooth transactions.' },
];

export default function HowItWorks() {
  return (
    <section className={s.how} aria-labelledby="how-title">
      <h2 id="how-title" className={s.h2}>How It Works</h2>
      <div className={s.steps}>
        <ol className={s.stepList}>
          {STEPS.map((st) => (
            <li key={st.t} className={s.step}>
              <h3 className={s.stepTitle}>{st.t}</h3>
              <p className={s.stepText}>{st.d}</p>
            </li>
          ))}
        </ol>
        <span className={s.connector} style={{ left: 338, top: 107 }} aria-hidden="true"><img src={A('connector.svg')} alt="" /></span>
        <span className={s.connector} style={{ left: 794, top: 98 }} aria-hidden="true"><img src={A('connector.svg')} alt="" /></span>
      </div>
    </section>
  );
}
