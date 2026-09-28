import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import SiteShell from '@/components/site/SiteShell';
import CategoryPanel from '@/components/site/CategoryPanel';
import ProductCard from '@/components/site/ProductCard';
import { catalogApi } from '@/lib/api';
import { SUBCATEGORIES } from '@/lib/mock';
import { ROUTES, vendorHref } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Shop trusted vendors',
  description: 'Browse electronics, phones, fashion, furniture and more from verified Shoplect vendors, paid safely through escrow.',
  alternates: { canonical: '/shop' },
};

function SeeAll() {
  return <Link className="see-all" href={ROUTES.search}>See All<img src="/assets/see-all-chevron.svg" alt="" /></Link>;
}

export default async function ShopPage() {
  const [categories, vendors, products] = await Promise.all([catalogApi.categories(), catalogApi.topVendors(), catalogApi.topProducts()]);
  return (
    <SiteShell>
      <div className="wrap">
        <section className="hero-grid" aria-label="Categories and featured ad">
          <CategoryPanel categories={categories} />
          <div className="banner" role="region" aria-label="Sponsored ad">
            <Image className="bg" src="/assets/shop-banner.png" alt="Woman announcing through a megaphone against a pink background" fill priority sizes="(max-width: 1023px) 100vw, 925px" />
            <span className="sponsor">Sponsored Ad</span>
            <img className="slider" src="/assets/banner-slider.svg" alt="" />
          </div>
        </section>

        <section className="panel" aria-label="Browse by category">
          <div className="panel-body subgrid" style={{ padding: 0 }}>
            {SUBCATEGORIES.map((c) => (
              <Link key={c.name} href={`${ROUTES.search}?q=${encodeURIComponent(c.name)}`} className="subcat">
                <div className="pimgbox"><img className="pimg" src={c.image} alt="" loading="lazy" /></div>
                <span>{c.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="panel" aria-labelledby="tv">
          <div className="panel-head"><h2 id="tv">Top Vendors</h2><SeeAll /></div>
          <div className="panel-body fluid-grid" style={{ ['--card-min' as string]: '230px' } as React.CSSProperties}>
            {vendors.map((v, i) => (
              <div key={`${v.id}-${i}`} className="vcard">
                <img className="av" src={v.avatar || '/assets/vendor-avatar.png'} alt="" width={80} height={80} loading="lazy" />
                <b>{v.name}</b>
                <Link href={vendorHref(v.id)}>View Profile</Link>
              </div>
            ))}
          </div>
        </section>

        <section className="panel" aria-labelledby="tp" style={{ marginBottom: 60 }}>
          <div className="panel-head"><h2 id="tp">Top Products</h2><SeeAll /></div>
          <div className="panel-body pgrid">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        </section>
      </div>
    </SiteShell>
  );
}
