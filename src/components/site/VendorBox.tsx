'use client';
import Link from 'next/link';
import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import Modal from '@/components/ui/Modal';
import ProductActions from '@/components/site/ProductActions';
import { dealApi } from '@/lib/api';
import { DASH } from '@/lib/routes';
import type { Vendor } from '@/lib/types';

export default function VendorBox({ v, compact = false, productId, price }: { v: Vendor; compact?: boolean; productId?: string; price?: number }) {
  const [phone, setPhone] = useState('');
  const [following, setFollowing] = useState(false);
  const [dlg, setDlg] = useState<'feedback' | 'report' | null>(null);
  const [text, setText] = useState('');
  const [note, setNote] = useState('');

  async function show() { try { setPhone((await dealApi.revealPhone(v.id)).phone); } catch { setNote('Sign in to view the phone number.'); } }
  async function follow() { setFollowing((f) => !f); try { await dealApi.follow(v.id); } catch { setFollowing((f) => !f); setNote('Sign in to follow vendors.'); } }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    try { await (dlg === 'feedback' ? dealApi.feedback(v.id, text.trim()) : dealApi.reportVendor(v.id, text.trim())); setNote('Thank you. We received it.'); setDlg(null); setText(''); }
    catch { setNote('Sign in to continue.'); setDlg(null); }
  }

  return (
    <div className="side-stack">
      <section className="card vbox" aria-label="Vendor">
        <div className="vhead">
          {v.avatar ? <img className="avatar" src={v.avatar} alt="" width={51} height={51} /> : <span className="avatar" aria-hidden="true" style={{ width: 51, height: 51 }}>{v.name[0]}</span>}
          <div><h3>{v.name}</h3>{v.verified && <span className="verified">Verified</span>}<p className="vmeta">{v.location}, {v.lastSeen}</p></div>
        </div>
        <div className="phone-row"><Icon name="call" size={18} /><span>{phone || v.phone}</span>{!phone && <button onClick={show}>Show</button>}</div>
        {!compact && (
          <div className="row" style={{ gap: 8 }}>
            <Link href={DASH.inbox} className="btn outline sm" style={{ flex: '0 0 80px' }}>Message</Link>
            <button className={`btn sm ${following ? 'outline' : ''}`} style={{ flex: 1 }} aria-pressed={following} onClick={follow}>{following ? 'Following' : 'Follow'}</button>
          </div>
        )}
        {note && <p className="f-hint" role="status">{note}</p>}
      </section>
      {compact && productId && price !== undefined && <div id="buy" className="card product-actions" style={{ padding: 12, scrollMarginTop: 90 }}><ProductActions productId={productId} price={price} /></div>}
      <section className="card vlist vendor-actions" style={{ padding: 10, display: 'grid', gap: 8 }} aria-label="Vendor actions">
        <button onClick={() => setDlg('feedback')}><Icon name="feedback" size={22} />Feedback</button>
        <button onClick={() => setDlg('report')}><Icon name="flag" size={22} />Report Abuse</button>
      </section>
      {compact && <section className="card safety-tips" aria-labelledby="safety-title">
        <h2 id="safety-title">Safety tips</h2>
        <ul>
          <li>Use Escrow for Every Payment</li>
          <li>Never Share Personal Details</li>
          <li>Confirm Before You Pay</li>
          <li>Report Suspicious Activity</li>
          <li>Keep All Communication on the Platform</li>
          <li>Track Your Orders</li>
        </ul>
      </section>}
      {dlg && (
        <Modal title={dlg === 'feedback' ? 'Send feedback' : 'Report abuse'} onClose={() => setDlg(null)} width={440}>
          <form className="f-form" onSubmit={submit}>
            <div className="f-group"><label className="f-label" htmlFor="vt">{dlg === 'feedback' ? 'Your feedback' : 'What happened?'}</label>
              <textarea id="vt" className="f-area" value={text} onChange={(e) => setText(e.target.value.slice(0, 1000))} required /></div>
            <div className="modal-actions"><button type="button" className="btn outline" onClick={() => setDlg(null)}>Cancel</button><button className="btn">Submit</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}
