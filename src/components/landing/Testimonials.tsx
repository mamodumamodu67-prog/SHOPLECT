'use client';
import { useState } from 'react';
import { A } from './assets';
import type { Testimonial } from '@/lib/api';
import s from './Landing.module.css';

const AVATARS = ['avatar-hannah.png', 'avatar-steve.png', 'avatar-aisha.png'];

function Blob({ src, w, h, transform, style }: { src: string; w: number; h: number; transform?: string; style?: React.CSSProperties }) {
  return (
    <div className={s.blobBox} style={{ position: 'absolute', ...style }}>
      <div className={s.blobInner} style={{ width: w, height: h, transform }}>
        <img src={A(src)} alt="" aria-hidden="true" />
      </div>
    </div>
  );
}

export default function Testimonials({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  const n = items.length;
  const at = (k: number) => ((k % n) + n) % n;
  const c = at(i), l = at(i - 1), r = at(i + 1);
  const go = (d: number) => setI((v) => at(v + d));

  return (
    <section className={s.tSection} aria-labelledby="t-title" aria-roledescription="carousel">
      <div className={s.stage}>
        <h2 id="t-title" className={s.tTitle}>What Our Clients Say About Us</h2>
        <button className={`${s.arrow} ${s.arrowL}`} onClick={() => go(-1)} aria-label="Previous testimonial"><img src={A('chevron-prev.svg')} alt="" /></button>
        <button className={`${s.arrow} ${s.arrowR}`} onClick={() => go(1)} aria-label="Next testimonial"><img src={A('chevron-next.svg')} alt="" /></button>
        <img className={s.dots} src={A('dots.svg')} alt="" aria-hidden="true" />

        {/* Left card */}
        <figure className={`${s.tCard} ${s.tLeft}`} aria-hidden="true" style={{ margin: 0 }}>
          <Blob src="blob-left-a.svg" w={302} h={342} transform="rotate(7.35deg)" style={{ left: 0, top: 0, width: 343.256, height: 377.812 }} />
          <img src={A('blob-left-b.svg')} alt="" style={{ left: 39.63, top: 1.02, width: 302, height: 342 }} />
          <img className={s.avatar} src={A(AVATARS[l])} alt="" style={{ left: 152.63, top: 0.91, width: 76, height: 76 }} />
          <img src={A('quote-sm.svg')} alt="" style={{ left: 179.63, top: 131.91, width: 22, height: 22 }} />
          <p className={`${s.cName} ${s.name}`}>{items[l].name}</p>
          <p className={`${s.cQuote} ${s.quote}`}>{items[l].quote}</p>
        </figure>

        {/* Center card (the active testimonial) */}
        <figure className={`${s.tCard} ${s.tCenter}`} style={{ margin: 0 }} aria-live="polite">
          <img src={A('blob-center-b.svg')} alt="" aria-hidden="true" style={{ left: 0, top: 33, width: 415, height: 433 }} />
          <img src={A('blob-center-a.svg')} alt="" aria-hidden="true" style={{ left: 55, top: 33, width: 379, height: 378 }} />
          <img className={s.avatar} src={A(AVATARS[c])} alt="" style={{ left: 157, top: 0, width: 102, height: 102 }} />
          <img src={A('quote-lg.svg')} alt="" aria-hidden="true" style={{ left: 190, top: 186, width: 36, height: 36 }} />
          <figcaption className={`${s.cName} ${s.name}`}>{items[c].name}</figcaption>
          <blockquote className={`${s.cQuote} ${s.quote}`} style={{ margin: 0 }}>{items[c].quote}</blockquote>
        </figure>

        {/* Right card */}
        <figure className={`${s.tCard} ${s.tRight}`} aria-hidden="true" style={{ margin: 0 }}>
          <Blob src="blob-right-a.svg" w={302.004} h={342} transform="rotate(172.65deg) scaleY(-1)" style={{ left: 0, top: 0, width: 343.26, height: 377.812 }} />
          <Blob src="blob-right-b.svg" w={302.004} h={342} transform="rotate(180deg) scaleY(-1)" style={{ left: 1.63, top: 1.02, height: 342 }} />
          <img className={s.avatar} src={A(AVATARS[r])} alt="" style={{ left: 114.63, top: 0.91, width: 76, height: 76, transform: 'rotate(180deg) scaleY(-1)' }} />
          <img src={A('quote-sm.svg')} alt="" style={{ left: 143, top: 132, width: 22, height: 22 }} />
          <p className={`${s.cName} ${s.name}`}>{items[r].name}</p>
          {items[r].role && <p className={`${s.cRole} ${s.role}`}>{items[r].role}</p>}
          <p className={`${s.cQuote} ${s.quote}`}>{items[r].quote}</p>
        </figure>
      </div>
    </section>
  );
}
