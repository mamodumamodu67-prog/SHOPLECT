'use client';
import { useState } from 'react';
import PageHead from '@/components/dash/PageHead';
import { EmptyState, ErrorNote, Loading, Tabs } from '@/components/ui/bits';
import { socialApi } from '@/lib/api';
import { naira, shortDate } from '@/lib/format';
import { useResource } from '@/lib/useResource';
import type { Offer } from '@/lib/types';

const TABS = ['Received', 'Sent'] as const;

function Row({ o, onAct }: { o: Offer; onAct: (id: string, a: 'accept' | 'decline' | 'cancel') => void }) {
  return (
    <div className="orow">
      <div className="thumb pimg ph" aria-hidden="true" />
      <div className="info"><b>{o.title}</b><small>{shortDate(o.date)} · Listed {naira(o.listPrice)}</small></div>
      <div className="end">
        <span style={{ fontWeight: 600, color: 'var(--brown)' }}>{naira(o.amount)}</span>
        {o.direction === 'received' ? (
          <><button className="btn sm outline" onClick={() => onAct(o.id, 'decline')}>Decline</button><button className="btn sm" onClick={() => onAct(o.id, 'accept')}>Accept</button></>
        ) : <button className="btn sm outline" onClick={() => onAct(o.id, 'cancel')}>Cancel offer</button>}
      </div>
    </div>
  );
}

export default function OffersPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Received');
  const dir = tab === 'Received' ? 'received' : 'sent';
  const { data, setData, loading, error } = useResource(() => socialApi.offers(dir), [dir]);
  const act = (id: string, a: 'accept' | 'decline' | 'cancel') => { setData((d) => d && d.filter((o) => o.id !== id)); socialApi.respondOffer(id, a).catch(() => {}); };
  return (
    <>
      <PageHead title="Offers" />
      <div style={{ marginBottom: 20 }}><Tabs tabs={TABS} value={tab} onChange={setTab} label="Offers" /></div>
      {loading ? <Loading /> : error ? <ErrorNote msg={error} /> : data?.length ? <div className="stack">{data.map((o) => <Row key={o.id} o={o} onAct={act} />)}</div> : <div className="dpanel"><EmptyState title={`No offers ${tab.toLowerCase()} yet`} /></div>}
    </>
  );
}
