export function generateStaticParams() {
  return Array.from({ length: 7 }, (_, i) => ({ id: `o${i + 1}` }));
}
import DisputeClient from './DisputeClient';

export default function DisputePage({ params }: { params: Promise<{ id: string }> }) {
  return <DisputeClient params={params} />;
}
