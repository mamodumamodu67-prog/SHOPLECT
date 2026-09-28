'use client';
import PageHead from '@/components/dash/PageHead';
import ProductCard from '@/components/site/ProductCard';
import { EmptyState, ErrorNote, Loading } from '@/components/ui/bits';
import { socialApi } from '@/lib/api';
import { useResource } from '@/lib/useResource';
import { ROUTES } from '@/lib/routes';

export default function LikesPage() {
  const { data, loading, error } = useResource(() => socialApi.likes());
  return (
    <>
      <PageHead title="Liked Products" />
      {loading ? <Loading /> : error ? <ErrorNote msg={error} /> : data?.length ? (
        <div className="pgrid">{data.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      ) : <div className="dpanel"><EmptyState title="No liked product yet" action={{ label: 'Browse products', href: ROUTES.shop }} /></div>}
    </>
  );
}
