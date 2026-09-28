'use client';
import Link from 'next/link';
import { use } from 'react';
import PageHead from '@/components/dash/PageHead';
import ProductCard from '@/components/site/ProductCard';
import { EmptyState, ErrorNote, Loading } from '@/components/ui/bits';
import { shopApi } from '@/lib/api';
import { useResource } from '@/lib/useResource';
import { DASH } from '@/lib/routes';

export default function ShopViewClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const shop = useResource(() => shopApi.get(id), [id]);
  const prods = useResource(() => shopApi.products('active'), [id]);
  if (shop.loading) return <Loading />;
  if (shop.error) return <ErrorNote msg={shop.error} />;
  if (!shop.data) return <EmptyState title="Shop not found" action={{ label: 'Back to shops', href: DASH.shops }} />;
  return (
    <>
      <PageHead title="Manage Shop" />
      <p style={{ marginBottom: 16, fontSize: 20, fontWeight: 500 }}>{shop.data.name} <span className="muted" style={{ fontSize: 14 }}>· {shop.data.category}</span></p>
      <div className="banner-note" style={{ marginBottom: 24 }}><p>Bring your shop to life by adding products and start attracting customers.</p><Link href={DASH.newProduct} className="btn">Add New Product</Link></div>
      {prods.loading ? <Loading /> : prods.data?.length ? <div className="pgrid">{prods.data.map((p) => <ProductCard key={p.id} p={p} variant="shop" />)}</div> : <div className="dpanel"><EmptyState title="No Product" text="No data yet" action={{ label: 'Add Product', href: DASH.newProduct }} /></div>}
    </>
  );
}