'use client';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Icon from '@/components/ui/Icon';
import { EmptyState, ErrorNote, Loading, StatusBadge } from '@/components/ui/bits';
import { walletApi } from '@/lib/api';
import { BANKS } from '@/lib/mock';
import { naira, shortDate } from '@/lib/format';
import { useResource } from '@/lib/useResource';

function FundModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(amount.replace(/\D/g, ''));
    if (!n || n < 100) return setErr('Enter an amount of at least ₦100');
    setBusy(true);
    try { const r = await walletApi.fund(n); if (r.paymentUrl) window.location.href = r.paymentUrl; else onClose(); }
    catch { setErr('Could not start funding. Please try again.'); setBusy(false); }
  }
  return (
    <Modal title="Fund wallet" onClose={onClose} width={400}>
      <form className="f-form" onSubmit={submit}>
        <div className="f-group"><label className="f-label" htmlFor="fa">Amount</label><input id="fa" className="f-input" inputMode="numeric" placeholder="₦0" value={amount} onChange={(e) => setAmount(e.target.value)} autoFocus /></div>
        {err && <span className="f-err">{err}</span>}
        <button className="btn block" disabled={busy}>{busy ? 'Please wait…' : 'Continue to payment'}</button>
      </form>
    </Modal>
  );
}

function WithdrawModal({ onClose }: { onClose: () => void }) {
  const { data: accounts, loading } = useResource(() => walletApi.accounts());
  const [accountId, setAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(amount.replace(/\D/g, ''));
    if (!accountId) return setErr('Select a withdrawal account');
    if (!n || n < 100) return setErr('Enter an amount of at least ₦100');
    setBusy(true);
    try { await walletApi.withdraw(n, accountId); onClose(); }
    catch { setErr('Could not process the withdrawal.'); setBusy(false); }
  }
  return (
    <Modal title="Withdraw funds" onClose={onClose} width={420}>
      {loading ? <Loading /> : (
        <form className="f-form" onSubmit={submit}>
          <div className="f-group"><label className="f-label" htmlFor="wa">Withdraw to</label>
            <select id="wa" className="f-select" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
              <option value="">Select account</option>{accounts?.map((a) => <option key={a.id} value={a.id}>{a.bankName} · {a.accountNumber}</option>)}
            </select></div>
          <div className="f-group"><label className="f-label" htmlFor="wam">Amount</label><input id="wam" className="f-input" inputMode="numeric" placeholder="₦0" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
          {err && <span className="f-err">{err}</span>}
          <button className="btn block" disabled={busy}>{busy ? 'Processing…' : 'Withdraw'}</button>
        </form>
      )}
    </Modal>
  );
}

function AddAccountModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [resolved, setResolved] = useState('');
  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function resolve() {
    if (!bankName || accountNumber.length < 10) return setErr('Select a bank and enter a 10-digit account number');
    setBusy(true); setErr('');
    try { setResolved((await walletApi.resolveAccount(bankName, accountNumber)).accountName); } catch { setErr('Could not resolve this account.'); } finally { setBusy(false); }
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!resolved) return setErr('Resolve the account name first');
    setBusy(true);
    try { const r = await walletApi.addAccount({ bankName, accountNumber }); if (r.requiresOtp) setStep('otp'); else onAdded(); }
    catch { setErr('Could not add this account.'); } finally { setBusy(false); }
  }
  async function confirm(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try { await walletApi.confirmAccount(otp); onAdded(); } catch { setErr('Incorrect code.'); } finally { setBusy(false); }
  }

  return (
    <Modal title="Add withdrawal account" onClose={onClose} width={420}>
      {step === 'form' ? (
        <form className="f-form" onSubmit={submit}>
          <div className="f-group"><label className="f-label" htmlFor="bn">Bank</label>
            <select id="bn" className="f-select" value={bankName} onChange={(e) => { setBankName(e.target.value); setResolved(''); }}><option value="">Select bank</option>{BANKS.map((b) => <option key={b}>{b}</option>)}</select></div>
          <div className="f-group"><label className="f-label" htmlFor="an">Account number</label>
            <input id="an" className="f-input" inputMode="numeric" maxLength={10} value={accountNumber} onChange={(e) => { setAccountNumber(e.target.value.replace(/\D/g, '')); setResolved(''); }} onBlur={resolve} /></div>
          {resolved && <p className="f-hint" style={{ color: 'var(--ok)' }}>{resolved}</p>}
          {err && <span className="f-err">{err}</span>}
          <button className="btn block" disabled={busy}>{busy ? 'Please wait…' : 'Add account'}</button>
        </form>
      ) : (
        <form className="f-form" onSubmit={confirm}>
          <p className="f-hint">Enter the code sent to your phone to confirm this account.</p>
          <div className="f-group"><label className="f-label" htmlFor="otp">Code</label><input id="otp" className="f-input" inputMode="numeric" value={otp} onChange={(e) => setOtp(e.target.value)} /></div>
          {err && <span className="f-err">{err}</span>}
          <button className="btn block" disabled={busy}>{busy ? 'Verifying…' : 'Confirm'}</button>
        </form>
      )}
    </Modal>
  );
}

export default function WalletPanel() {
  const { data, loading, error, reload } = useResource(() => walletApi.get());
  const { data: accounts, reload: reloadAccounts } = useResource(() => walletApi.accounts());
  const [dlg, setDlg] = useState<'fund' | 'withdraw' | 'add' | null>(null);

  if (loading) return <Loading />;
  if (error) return <ErrorNote msg={error} />;
  if (!data) return null;

  return (
    <>
      <div className="wallet-top">
        <div className="card stat"><small>Wallet balance</small><strong>{naira(data.balance)}</strong>
          <div className="row" style={{ marginTop: 8 }}><button className="btn sm" onClick={() => setDlg('fund')}>Fund wallet</button><button className="btn sm outline" onClick={() => setDlg('withdraw')}>Withdraw</button></div></div>
        <div className="card stat"><small>Total incoming</small><strong>{naira(data.incoming)}</strong></div>
        <div className="card stat"><small>Total outgoing</small><strong>{naira(data.outgoing)}</strong></div>
      </div>

      <div className="dpanel pad" style={{ margin: '20px 0' }}>
        <div className="spread" style={{ marginBottom: 12 }}><h2 style={{ fontWeight: 500, fontSize: 18 }}>Withdrawal accounts</h2><button className="btn sm" onClick={() => setDlg('add')}><Icon name="plus" size={14} />Add account</button></div>
        {accounts?.length ? <div className="stack">{accounts.map((a) => <div key={a.id} className="row" style={{ justifyContent: 'space-between' }}><span>{a.bankName} · {a.accountNumber} · {a.accountName}</span><button className="icon-btn" aria-label="Remove account" onClick={() => walletApi.removeAccount(a.id).then(reloadAccounts)}><Icon name="trash" size={14} /></button></div>)}</div> : <p className="muted">No withdrawal account added yet.</p>}
      </div>

      <h2 style={{ fontWeight: 500, fontSize: 18, margin: '20px 0 12px' }}>Recent transactions</h2>
      {data.transactions.length ? (
        <div className="dpanel table-wrap">
          <table className="table"><thead><tr>{['Date', 'Amount', 'Type', 'Status'].map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>{data.transactions.map((t) => <tr key={t.id}><td>{shortDate(t.date)}</td><td>{naira(t.amount)}</td><td>{t.type}</td><td><StatusBadge status={t.status} /></td></tr>)}</tbody></table>
        </div>
      ) : <div className="dpanel"><EmptyState title="No transactions yet" /></div>}

      {dlg === 'fund' && <FundModal onClose={() => { setDlg(null); reload(); }} />}
      {dlg === 'withdraw' && <WithdrawModal onClose={() => { setDlg(null); reload(); }} />}
      {dlg === 'add' && <AddAccountModal onClose={() => setDlg(null)} onAdded={() => { setDlg(null); reloadAccounts(); }} />}
    </>
  );
}
