'use client';
import PageHead from '@/components/dash/PageHead';
import { EmptyState, ErrorNote, Loading, StatusBadge } from '@/components/ui/bits';
import { shopApi } from '@/lib/api';
import { shortDate } from '@/lib/format';
import { useResource } from '@/lib/useResource';

export default function PromotionsPage() {
  const { data, loading, error } = useResource(() => shopApi.promotions());
  return (
    <>
      <PageHead title="My Promotions" />
      {loading ? <Loading /> : error ? <ErrorNote msg={error} /> : data?.length ? (
        <div className="dpanel table-wrap">
          <table className="table">
            <thead><tr>{['Date Created', 'Product Name', 'Category', 'Status', 'Start Date', 'End Date', 'Actions'].map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
            <tbody>{data.map((r) => (
              <tr key={r.id}><td>{shortDate(r.created)}</td><td>{r.product}</td><td>{r.category}</td><td><StatusBadge status={r.status} /></td><td>{shortDate(r.start)}</td><td>{shortDate(r.end)}</td><td><button className="link-btn">Action</button></td></tr>
            ))}</tbody>
          </table>
        </div>
      ) : <div className="dpanel"><EmptyState title="No promotion yet" /></div>}
    </>
  );
}
