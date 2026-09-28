'use client';
import { useState } from 'react';
import PageHead from '@/components/dash/PageHead';
import ProductCard from '@/components/site/ProductCard';
import Icon from '@/components/ui/Icon';
import { EmptyState, ErrorNote, Loading, Tabs } from '@/components/ui/bits';
import { shopApi } from '@/lib/api';
import { useResource } from '@/lib/useResource';
import { DASH } from '@/lib/routes';

const TABS = ['Active', 'Sold'] as const;

export default function ManageProductsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Active');
  const { data, loading, error } = useResource(() => shopApi.products(tab === 'Active' ? 'active' : 'sold'), [tab]);
  return (
    <>
      <PageHead title="Manage products" action={{ label: 'Add Product', href: DASH.newProduct }} />
      <div style={{ marginBottom: 20 }}><Tabs tabs={TABS} value={tab} onChange={setTab} label="Product status" /></div>
      {loading ? <Loading /> : error ? <ErrorNote msg={error} /> : data?.length ? (
        <div className="pgrid">
          {data.map((p) => <ProductCard key={p.id} p={p} variant="shop" actions={<><button className="icon-btn" aria-label={`Edit ${p.title}`}><Icon name="edit" size={16} /></button><button className="icon-btn" aria-label={`Delete ${p.title}`}><Icon name="trash" size={16} /></button></>} />)}
        </div>
      ) : <div className="dpanel"><EmptyState title="No Product" text="No data yet" action={{ label: 'Add Product', href: DASH.newProduct }} /></div>}
    </>
  );
}
