'use client';
import Link from 'next/link';
import PageHead from '@/components/dash/PageHead';
import Icon from '@/components/ui/Icon';
import { EmptyState, ErrorNote, Loading } from '@/components/ui/bits';
import { socialApi } from '@/lib/api';
import { useResource } from '@/lib/useResource';

export default function NotificationsPage() {
  const { data, loading, error } = useResource(() => socialApi.notifications());
  return (
    <>
      <PageHead title="Notifications" />
      {loading ? <Loading /> : error ? <ErrorNote msg={error} /> : data?.length ? (
        <div className="dpanel stack" style={{ padding: 12 }}>
          {data.map((n) => <Link key={n.id} href={n.href} className="orow" style={{ boxShadow: 'none' }}><Icon name="bell" size={20} /><span className="info">{n.text}</span></Link>)}
        </div>
      ) : <div className="dpanel"><EmptyState title="No notification yet" /></div>}
    </>
  );
}
