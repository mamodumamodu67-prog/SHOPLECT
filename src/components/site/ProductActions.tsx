'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Icon from '@/components/ui/Icon';
import { dealApi } from '@/lib/api';
import { useSession } from '@/lib/session';
import { DASH, ROUTES } from '@/lib/routes';
import { naira } from '@/lib/format';

export default function ProductActions({ productId, price }: { productId: string; price: number }) {
  const { user } = useSession();
  const router = useRouter();
  const path = usePathname();
  const [offer, setOffer] = useState(false);
  const [amount, setAmount] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const needLogin = () => { router.push(`${ROUTES.login}?next=${encodeURIComponent(path)}`); };

  async function buy() {
    if (!user) return needLogin();
    setBusy(true); setMsg('');
    try { const r = await dealApi.buy(productId); router.push(DASH.order(r.orderId)); }
    catch { setMsg('Could not start the order. Please try again.'); setBusy(false); }
  }
  async function sendOffer(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(amount.replace(/\D/g, ''));
    if (!n || n >= price) return setMsg(`Enter an offer below ${naira(price)}.`);
    setBusy(true);
    try { await dealApi.makeOffer(productId, n); setOffer(false); setMsg('Offer sent to the seller.'); }
    catch { setMsg('Could not send your offer.'); }
    finally { setBusy(false); }
  }

  return (
    <div className="vlist" style={{ display: 'grid', gap: 10 }}>
      <button className="btn block" onClick={buy} disabled={busy}><Icon name="shield" size={18} />Buy with escrow</button>
      <button className="btn outline block" onClick={() => (user ? setOffer(true) : needLogin())}><Icon name="tag" size={18} />Make an offer</button>
      <Link className="btn outline block" href={user ? DASH.inbox : `${ROUTES.login}?next=${encodeURIComponent(path)}`}><Icon name="message" size={18} />Chat with vendor</Link>
      <button className="btn outline block crypto-action" disabled><span>Pay with crypto currency</span><small>Coming Soon</small></button>
      {msg && <p className="f-hint" role="status">{msg}</p>}
      {offer && (
        <Modal title="Make an offer" onClose={() => setOffer(false)} width={420}>
          <form className="f-form" onSubmit={sendOffer}>
            <div className="f-group"><label className="f-label" htmlFor="offer">Your offer (listed at {naira(price)})</label>
              <input id="offer" className="f-input" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="₦0" autoFocus /></div>
            <div className="modal-actions"><button type="button" className="btn outline" onClick={() => setOffer(false)}>Cancel</button><button className="btn" disabled={busy}>Send offer</button></div>
          </form>
        </Modal>
      )}
    </div>
  );
}
