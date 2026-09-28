import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteShell from '@/components/site/SiteShell';
import VendorBox from '@/components/site/VendorBox';
import ProductCard from '@/components/site/ProductCard';
import Icon from '@/components/ui/Icon';
import { catalogApi } from '@/lib/api';
import { ROUTES } from '@/lib/routes';

type P = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return [1, 2, 3, 4].map((i) => ({ id: `v${i}` }));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const v = await catalogApi.vendor((await params).id).catch(() => null);
  return v ? { title: v.name, description: `Shop products from ${v.name} in ${v.location} on Shoplect.`, alternates: { canonical: `/vendor/${(await params).id}` } } : { title: 'Vendor not found', robots: { index: false } };
}

export default async function VendorPage({ params }: P) {
  const { id } = await params;
  const v = await catalogApi.vendor(id).catch(() => null);
  if (!v) notFound();
  const products = await catalogApi.vendorProducts(id);
  return (
    <SiteShell>
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href={ROUTES.shop}>Shop</Link><Icon name="chevron-right" size={12} /><b aria-current="page">{v.name}</b>
        </nav>
        <div className="vend-layout">
          <VendorBox v={v} />
          <section aria-label={`Products from ${v.name}`}>
            <div style={{ marginBottom: 20 }}><span className="btn outline" style={{ width: 160, background: '#fff', pointerEvents: 'none' }}>All Products</span></div>
            <div className="pgrid">{products.map((p) => <ProductCard key={p.id} p={{ ...p, views: p.views }} variant="shop" />)}</div>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
