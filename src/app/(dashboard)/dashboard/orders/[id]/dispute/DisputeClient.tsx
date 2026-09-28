'use client';
import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHead from '@/components/dash/PageHead';
import { ErrorNote, Loading } from '@/components/ui/bits';
import { orderApi } from '@/lib/api';
import { useResource } from '@/lib/useResource';
import { DASH } from '@/lib/routes';
import type { DisputeStep } from '@/lib/types';

const REASONS = ['Item not received', 'Item not as described', 'Fund released but product not as described', 'Damaged on arrival', 'Other'];

export default function DisputeClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: dispute, loading, error, reload } = useResource(() => orderApi.disputeDetails(id).catch(() => null as any), [id]);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason || details.trim().length < 10) return setBanner('Select a reason and describe the issue (10+ characters).');
    setBusy(true);
    try { await orderApi.dispute(id, { reason, details: details.trim() }); await reload(); }
    catch { setBanner('Could not submit the dispute. Please try again.'); }
    finally { setBusy(false); }
  }

  if (loading) return <Loading />;
  if (error) return <ErrorNote msg={error} />;
  if (dispute) return (
    <>
      <PageHead title="Dispute" />
      <div className="dpanel pad">
        <dl className="info-list" style={{ marginBottom: 20 }}><dt>Ticket ID</dt><dd>{dispute.ticketId}</dd><dt>Issue</dt><dd>{dispute.questionType}</dd></dl>
        <div className="steps-v" style={{ padding: 0 }}>
          {dispute.steps.map((s: DisputeStep, i: number) => (
            <div key={s.title} className={`stp ${i < dispute.steps.length - 1 ? 'done' : 'now'}`}>
              <span className="dot">{i < dispute.steps.length - 1 ? '✓' : i + 1}</span>
              <div><b>{s.title}</b><small>{s.when}</small>{s.note && <p>{s.note}</p>}</div>
            </div>
          ))}
        </div>
        <button className="btn outline" style={{ marginTop: 16 }} onClick={() => router.push(DASH.appeals)}>Not resolved? Escalate to appeal</button>
      </div>
    </>
  );
  return (
    <>
      <PageHead title="Raise a dispute" />
      <form className="dpanel pad f-form" style={{ maxWidth: 640 }} onSubmit={submit} noValidate>
        <div className="f-group"><span className="f-label" id="rl">Reason</span>
          <div className="stack" role="radiogroup" aria-labelledby="rl">{REASONS.map((r) => (
            <label key={r} className="f-radio"><input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} />{r}</label>
          ))}</div></div>
        <div className="f-group"><label className="f-label" htmlFor="dt">Describe what happened</label>
          <textarea id="dt" className="f-area" value={details} onChange={(e) => setDetails(e.target.value.slice(0, 2000))} required /></div>
        {banner && <p className="err-note" role="alert">{banner}</p>}
        <div><button className="btn" disabled={busy}>{busy ? 'Submitting…' : 'Submit dispute'}</button></div>
      </form>
    </>
  );
}