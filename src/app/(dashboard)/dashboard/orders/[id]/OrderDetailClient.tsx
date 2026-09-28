'use client';
import { use, useState } from 'react';
import Link from 'next/link';
import PageHead from '@/components/dash/PageHead';
import { EmptyState, ErrorNote, Loading, ProductImage, StatusBadge } from '@/components/ui/bits';
import { orderApi } from '@/lib/api';
import { naira, dateTime } from '@/lib/format';
import { useResource } from '@/lib/useResource';
import { DASH } from '@/lib/routes';

const BUYER_STEPS = ['Order placed', 'Payment secured in escrow', 'Seller preparing item', 'Item shipped', 'Item delivered', 'Inspection period', 'Funds released'];
const SELLER_STEPS = ['Order received', 'Payment secured in escrow', 'Preparing item', 'Item shipped', 'Delivered to buyer', 'Awaiting confirmation', 'Funds released to you'];

export default function OrderDetailClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: o, loading, error } = useResource(() => orderApi.get(id), [id]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  if (loading) return <Loading />;
  if (error) return <ErrorNote msg={error} />;
  if (!o) return <EmptyState title="Order not found" action={{ label: 'Back to orders', href: DASH.orders }} />;
  const steps = o.role === 'buyer' ? BUYER_STEPS : SELLER_STEPS;
  const canAdvance = o.role === 'seller' && o.stage < steps.length - 1 && o.status !== 'Cancelled' && o.status !== 'Disputed';
  const canRelease = o.role === 'buyer' && o.stage === steps.length - 2;
  async function advance() { setBusy(true); try { await orderApi.advance(id); setMsg('Status updated.'); } catch { setMsg('Could not update the order.'); } finally { setBusy(false); } }
  async function release() { setBusy(true); try { await orderApi.releaseFunds(id); setMsg('Funds released to the seller.'); } catch { setMsg('Could not release funds.'); } finally { setBusy(false); } }
  return (
    <>
      <PageHead title="Order details" />
      <div className="track">
        <section className="dpanel steps-v timeline" aria-label="Order timeline">
          {steps.map((label, i) => <div key={label} className={`stp ${i < o.stage ? 'done' : i === o.stage ? 'now' : 'todo'}`}><span className="dot">{i < o.stage ? '✓' : i + 1}</span><div><b>{label}</b>{i <= o.stage && <small>{dateTime(o.date)}</small>}</div></div>)}
        </section>
        <aside className="stack">
          <div className="dpanel pad"><div className="row" style={{ marginBottom: 12 }}><div className="thumb" style={{ width: 64, height: 64 }}><ProductImage alt={o.title} /></div><b>{o.title}</b></div><dl className="info-list"><dt>Order No.</dt><dd>{o.orderNo}</dd><dt>Amount</dt><dd>{naira(o.amount)}</dd><dt>Status</dt><dd><StatusBadge status={o.status} /></dd><dt>Role</dt><dd style={{ textTransform: 'capitalize' }}>{o.role}</dd></dl></div>
          {msg && <p className="f-hint" role="status">{msg}</p>}
          {canAdvance && <button className="btn block" disabled={busy} onClick={advance}>Mark as shipped / next step</button>}
          {canRelease && <button className="btn block" disabled={busy} onClick={release}>Confirm delivery &amp; release funds</button>}
          {o.status !== 'Disputed' && o.status !== 'Cancelled' && <Link className="btn outline block" href={DASH.dispute(o.id)}>Raise a dispute</Link>}
          {o.status === 'Disputed' && <Link className="btn outline block" href={DASH.dispute(o.id)}>View dispute</Link>}
        </aside>
      </div>
    </>
  );
}