'use client';
import { useState } from 'react';
import PageHead from '@/components/dash/PageHead';
import { EmptyState, ErrorNote, Loading, StatusBadge, Tabs } from '@/components/ui/bits';
import { ProductImage } from '@/components/ui/bits';
import { orderApi } from '@/lib/api';
import { naira, shortDate } from '@/lib/format';
import { useResource } from '@/lib/useResource';
import { DASH } from '@/lib/routes';
import Link from 'next/link';

const TABS = ['Buying', 'Selling'] as const;

export default function OrdersPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Buying');
  const role = tab === 'Buying' ? 'buyer' : 'seller';
  const { data, loading, error } = useResource(() => orderApi.list(role), [role]);
  return (
    <>
      <PageHead title="Orders" />
      <div style={{ marginBottom: 20 }}><Tabs tabs={TABS} value={tab} onChange={setTab} label="Orders" /></div>
      {loading ? <Loading /> : error ? <ErrorNote msg={error} /> : data?.length ? (
        <div className="stack">
          {data.map((o) => (
            <Link key={o.id} href={DASH.order(o.id)} className="orow" style={{ color: 'inherit' }}>
              <div className="thumb"><ProductImage alt={o.title} /></div>
              <div className="info"><b>{o.title}</b><small>Order #{o.orderNo} · {shortDate(o.date)}</small></div>
              <div className="end"><span style={{ fontWeight: 600, color: 'var(--brown)' }}>{naira(o.amount)}</span><StatusBadge status={o.status} /></div>
            </Link>
          ))}
        </div>
      ) : <div className="dpanel"><EmptyState title={`No ${tab.toLowerCase()} orders yet`} /></div>}
    </>
  );
}
