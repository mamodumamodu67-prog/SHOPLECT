'use client';
import PageHead from '@/components/dash/PageHead';
import ShopList from '@/components/dash/ShopList';
import { EmptyState, ErrorNote, Loading } from '@/components/ui/bits';
import { shopApi } from '@/lib/api';
import { useResource } from '@/lib/useResource';
import { DASH } from '@/lib/routes';

export default function ManageShopsPage() {
  const { data, loading, error } = useResource(() => shopApi.list());
  return (
    <>
      <PageHead title="My Shop" action={{ label: 'Create a shop', href: DASH.newShop }} />
      {loading ? <Loading /> : error ? <ErrorNote msg={error} /> : data?.length ? <ShopList initial={data} /> : (
        <div className="dpanel"><EmptyState title="Empty shop" text="Create a collection of your products" action={{ label: 'Create a shop', href: DASH.newShop }} /></div>
      )}
    </>
  );
}
