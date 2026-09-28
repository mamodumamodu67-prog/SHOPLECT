'use client';
import { useState } from 'react';
import { accountApi } from '@/lib/api';
import { useSession } from '@/lib/session';
import { isStrongPassword } from '@/lib/validation';

export function ProfilePanel() {
  const { user, refresh } = useSession();
  const [f, setF] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [busy, setBusy] = useState(false); const [msg, setMsg] = useState('');
  async function submit(e: React.FormEvent) { e.preventDefault(); setBusy(true); setMsg(''); try { await accountApi.saveProfile(f); await refresh(); setMsg('Profile updated.'); } catch { setMsg('Could not save changes.'); } finally { setBusy(false); } }
  return (
    <form className="set-panel dpanel f-form" onSubmit={submit}>
      <h2>Profile</h2>
      <div className="f-group"><label className="f-label" htmlFor="pn">Full name</label><input id="pn" className="f-input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} maxLength={100} /></div>
      <div className="f-group"><label className="f-label" htmlFor="pe">Email</label><input id="pe" className="f-input" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
      <div className="f-group"><label className="f-label" htmlFor="pp">Phone</label><input id="pp" className="f-input" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} maxLength={20} /></div>
      {msg && <p className="f-hint" role="status">{msg}</p>}
      <div><button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button></div>
    </form>
  );
}

export function PasswordPanel() {
  const [f, setF] = useState({ current: '', next: '', confirm: '' });
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(''); setMsg('');
    if (!isStrongPassword(f.next)) return setErr('Use 8+ characters with upper, lower case and a number');
    if (f.next !== f.confirm) return setErr('Passwords do not match');
    setBusy(true);
    try { await accountApi.changePassword({ current: f.current, next: f.next }); setF({ current: '', next: '', confirm: '' }); setMsg('Password changed.'); }
    catch { setErr('Current password is incorrect.'); } finally { setBusy(false); }
  }
  return (
    <form className="set-panel dpanel f-form" onSubmit={submit}>
      <h2>Change password</h2>
      <div className="f-group"><label className="f-label" htmlFor="cp">Current password</label><input id="cp" type="password" className="f-input" value={f.current} onChange={(e) => setF({ ...f, current: e.target.value })} autoComplete="current-password" /></div>
      <div className="f-group"><label className="f-label" htmlFor="np">New password</label><input id="np" type="password" className="f-input" value={f.next} onChange={(e) => setF({ ...f, next: e.target.value })} autoComplete="new-password" /></div>
      <div className="f-group"><label className="f-label" htmlFor="cf">Confirm new password</label><input id="cf" type="password" className="f-input" value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} autoComplete="new-password" /></div>
      {err && <span className="f-err">{err}</span>}{msg && <p className="f-hint" role="status">{msg}</p>}
      <div><button className="btn" disabled={busy}>{busy ? 'Updating…' : 'Update password'}</button></div>
    </form>
  );
}

const NOTIF_ITEMS = ['New messages', 'Offers on my products', 'Order status updates', 'Promotions and news'];
export function NotificationSettingsPanel() {
  const [on, setOn] = useState<Record<string, boolean>>({ 'New messages': true, 'Offers on my products': true, 'Order status updates': true, 'Promotions and news': false });
  const [saved, setSaved] = useState(false);
  return (
    <div className="set-panel dpanel">
      <h2>Notification settings</h2>
      {NOTIF_ITEMS.map((k) => (
        <div key={k} className="notif-row"><span>{k}</span>
          <span className="toggle"><input type="checkbox" checked={on[k]} onChange={(e) => { setOn({ ...on, [k]: e.target.checked }); setSaved(false); }} /><span /></span></div>
      ))}
      <div><button className="btn" onClick={() => { accountApi.saveNotifications(on).catch(() => {}); setSaved(true); }}>Save preferences</button>{saved && <span className="f-hint" style={{ marginLeft: 12 }}>Saved.</span>}</div>
    </div>
  );
}

export function DeliverySettingsPanel() {
  const [address, setAddress] = useState(''); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState('');
  async function submit(e: React.FormEvent) { e.preventDefault(); setBusy(true); try { await accountApi.saveDelivery({ address }); setMsg('Default address saved.'); } catch { setMsg('Could not save your address.'); } finally { setBusy(false); } }
  return (
    <form className="set-panel dpanel f-form" onSubmit={submit}>
      <h2>Delivery address</h2>
      <div className="f-group"><label className="f-label" htmlFor="da">Default delivery address</label><textarea id="da" className="f-area" value={address} onChange={(e) => setAddress(e.target.value.slice(0, 300))} /></div>
      {msg && <p className="f-hint" role="status">{msg}</p>}
      <div><button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Save address'}</button></div>
    </form>
  );
}
