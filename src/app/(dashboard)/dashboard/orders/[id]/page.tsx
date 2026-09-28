export function generateStaticParams() {
  return Array.from({ length: 7 }, (_, i) => ({ id: `o${i + 1}` }));
}
import OrderDetailClient from './OrderDetailClient';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <OrderDetailClient params={params} />;
}
