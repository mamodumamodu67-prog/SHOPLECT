import Link from 'next/link';
import type { Category } from '@/lib/types';

// Icon file + rendered size, exactly as placed in Figma's "categories" list.
const CAT_ICONS: Record<string, { f: string; w: number; h: number }> = {
  electronics: { f: 'cat-electronics.svg', w: 16, h: 16 }, phone: { f: 'cat-phone.svg', w: 17, h: 24 },
  health: { f: 'cat-health.svg', w: 17.5, h: 20.5 }, furniture: { f: 'cat-furniture.svg', w: 17, h: 12 },
  gaming: { f: 'cat-gaming.svg', w: 18, h: 18 }, baby: { f: 'cat-baby.svg', w: 14.4, h: 13.2 },
  home: { f: 'cat-home.svg', w: 16, h: 17.5 }, music: { f: 'cat-music.svg', w: 24, h: 15.92 },
};

export default function CategoryPanel({ categories, active }: { categories: Category[]; active?: string }) {
  return (
    <nav className="catpanel" aria-label="Categories">
      {categories.map((c) => {
        const ic = CAT_ICONS[c.icon];
        return (
          <Link key={c.slug} href={`/search?category=${encodeURIComponent(c.slug)}`} aria-current={active === c.slug}>
            <span className="ci" aria-hidden="true">{ic && <img src={`/assets/${ic.f}`} alt="" width={ic.w} height={ic.h} />}</span>{c.name}
          </Link>
        );
      })}
    </nav>
  );
}
