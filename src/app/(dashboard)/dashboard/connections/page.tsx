'use client';
import { useState } from 'react';
import PageHead from '@/components/dash/PageHead';
import { EmptyState, ErrorNote, Loading, Tabs } from '@/components/ui/bits';
import { socialApi } from '@/lib/api';
import { useResource } from '@/lib/useResource';
import type { Person } from '@/lib/types';

const TABS = ['Followers', 'Following'] as const;

function Row({ p, onToggle }: { p: Person; onToggle: (id: string) => void }) {
  return (
    <div className="orow">
      <span className="avatar" aria-hidden="true">{p.name[0]}</span>
      <div className="info"><b>{p.name}</b><small>{p.when}</small></div>
      <button className={`btn sm ${p.following ? 'outline' : ''}`} onClick={() => onToggle(p.id)}>{p.following ? 'Following' : 'Follow back'}</button>
    </div>
  );
}

export default function ConnectionsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Followers');
  const kind = tab === 'Followers' ? 'followers' : 'following';
  const { data, setData, loading, error } = useResource(() => socialApi.people(kind), [kind]);
  const toggle = (id: string) => { setData((d) => d && d.map((p) => (p.id === id ? { ...p, following: !p.following } : p))); socialApi.toggleFollow(id).catch(() => {}); };
  return (
    <>
      <PageHead title="Connections" />
      <div style={{ marginBottom: 20 }}><Tabs tabs={TABS} value={tab} onChange={setTab} label="Connections" /></div>
      {loading ? <Loading /> : error ? <ErrorNote msg={error} /> : data?.length ? <div className="stack">{data.map((p) => <Row key={p.id} p={p} onToggle={toggle} />)}</div> : <div className="dpanel"><EmptyState title={`No ${tab.toLowerCase()} yet`} /></div>}
    </>
  );
}
