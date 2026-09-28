export function generateStaticParams() {
  return [{ id: 's1' }, { id: 's2' }];
}
import ShopViewClient from './ShopViewClient';

export default function ShopViewPage({ params }: { params: Promise<{ id: string }> }) {
  return <ShopViewClient params={params} />;
}
