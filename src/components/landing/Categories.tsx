import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import s from './Landing.module.css';

// Image mapping mirrors the Figma frame exactly (Electronics reuses the Beauty image there).
const CATS = [
  { name: 'Furniture', slug: 'furniture', img: 'cat-1.png' },
  { name: 'Fashion', slug: 'fashion', img: 'cat-2.png' },
  { name: 'Gadgets', slug: 'gadgets', img: 'cat-3.png' },
  { name: 'Beauty', slug: 'beauty', img: 'cat-4.png' },
  { name: 'Electronics', slug: 'electronics', img: 'cat-4.png' },
  { name: 'Gaming', slug: 'gaming', img: 'cat-5.png' },
  { name: 'Home & living', slug: 'home-living', img: 'cat-1.png' },
  { name: 'Home & Gardens', slug: 'home-gardens', img: 'cat-6.png', contain: true },
];

export default function Categories() {
  return (
    <section className={s.cats} aria-labelledby="cat-title">
      <h2 id="cat-title" className={s.h2}>Shop by Category</h2>
      <ul className={s.catGrid}>
        {CATS.map((c) => (
          <li key={c.slug}>
            <Link href={ROUTES.category(c.slug)} className={s.catCard}>
              <span className={s.catName}>{c.name}</span>
              <span className={`${s.catImg} ${c.contain ? s.catImgContain : ''}`}>
                <Image src={`/assets/${c.img}`} alt="" fill sizes="180px" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
