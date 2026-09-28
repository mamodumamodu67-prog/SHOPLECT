import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteShell from '@/components/site/SiteShell';
import Gallery from '@/components/site/Gallery';
import ProductCard from '@/components/site/ProductCard';
import VendorBox from '@/components/site/VendorBox';
import MobileBuyBar from '@/components/site/MobileBuyBar';
import { Responsive } from '@/lib/device';
import Icon from '@/components/ui/Icon';
import { catalogApi } from '@/lib/api';
import { naira } from '@/lib/format';
import { SITE } from '@/lib/site';
import { ROUTES } from '@/lib/routes';

type P = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return Array.from({ length: 12 }, (_, i) => ({ id: `p${i + 1}` }));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = await catalogApi.product((await params).id).catch(() => null);
  if (!p) return { title: 'Product not found', robots: { index: false } };
  const desc = `${p.title} for ${naira(p.price)} on Shoplect. ${p.description}`.slice(0, 158);
  return { title: p.title, description: desc, alternates: { canonical: `/product/${p.id}` }, openGraph: { title: p.title, description: desc, type: 'website', images: p.image ? [p.image] : ['/assets/hero.png'] } };
}

export default async function ProductPage({ params }: P) {
  const { id } = await params;
  const p = await catalogApi.product(id).catch(() => null);
  if (!p) notFound();
  const [similar, vendor] = await Promise.all([catalogApi.similar(id), catalogApi.vendor(p.seller.id)]);
  const ld = {
    '@context': 'https://schema.org', '@type': 'Product', name: p.title, description: p.description, image: p.images?.length ? p.images : p.image ? [p.image] : undefined,
    itemCondition: p.condition === 'New' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
    offers: { '@type': 'Offer', priceCurrency: 'NGN', price: p.price, availability: p.inStock ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut', url: `${SITE.url}/product/${p.id}` },
  };
  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href={ROUTES.shop}>Home</Link><Icon name="chevron-right" size={12} />
          <Link href={`${ROUTES.search}?category=${p.category}`}>{p.category.replace(/-/g, ' ')}</Link><Icon name="chevron-right" size={12} />
          <b aria-current="page">{p.title.slice(0, 40)}</b>
        </nav>
        <div className="pdetail">
          <div className="stack" style={{ gap: 29 }}>
            <Gallery images={p.images || (p.image ? [p.image] : [])} alt={p.title} />
            <article className="card pinfo">
              <h1>{p.title}</h1>
              <p className="price">{naira(p.price)}</p>
              <hr />
              <h2>Description</h2>
              <p>{p.description}</p>
            </article>
          </div>
          <aside className="side-stack product-side" aria-label="Seller and actions">
            {vendor && <VendorBox v={vendor} compact productId={p.id} price={p.price} />}
          </aside>
        </div>
        <section aria-labelledby="sim" style={{ paddingBottom: 60 }}>
          <div className="sec-head"><h2 id="sim">Similar Ads</h2></div>
          <div className="pgrid">{similar.map((s) => <ProductCard key={s.id} p={s} />)}</div>
        </section>
      </div>
      <Responsive mobile={<MobileBuyBar price={p.price} />} tablet={null} />
    </SiteShell>
  );
}
