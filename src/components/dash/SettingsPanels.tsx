'use client';
import { useEffect, useState } from 'react';
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

type NotificationPreferences = {
  pauseAll: boolean;
  commentsAndLikes: 'EVERYONE' | 'FOLLOWERS_ONLY';
  messages: boolean;
  emails: boolean;
  feedbackEmails: boolean;
  textMessages: boolean;
  newsletters: boolean;
};
const DEFAULT_PREFERENCES: NotificationPreferences = { pauseAll: false, commentsAndLikes: 'EVERYONE', messages: true, emails: true, feedbackEmails: true, textMessages: false, newsletters: false };
const NOTIF_ITEMS: { key: Exclude<keyof NotificationPreferences, 'commentsAndLikes'>; label: string }[] = [
  { key: 'pauseAll', label: 'Pause all notifications' },
  { key: 'messages', label: 'Messages' },
  { key: 'emails', label: 'Email notifications' },
  { key: 'feedbackEmails', label: 'Feedback emails' },
  { key: 'textMessages', label: 'Text messages' },
  { key: 'newsletters', label: 'Newsletters' },
];
export function NotificationSettingsPanel() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    accountApi.notificationPreferences().then((value) => { if (active) setPreferences((current) => ({ ...current, ...value })); }).catch(() => {});
    return () => { active = false; };
  }, []);
  async function save() {
    setBusy(true); setMsg('');
    try { await accountApi.saveNotifications(preferences); setMsg('Preferences saved.'); }
    catch { setMsg('Could not save preferences.'); }
    finally { setBusy(false); }
  }
  return (
    <div className="set-panel dpanel">
      <h2>Notification settings</h2>
      {NOTIF_ITEMS.map(({ key, label }) => (
        <div key={key} className="notif-row"><span>{label}</span>
          <span className="toggle"><input type="checkbox" checked={preferences[key]} onChange={(e) => { setPreferences({ ...preferences, [key]: e.target.checked }); setMsg(''); }} /><span /></span></div>
      ))}
      <div className="f-group"><label className="f-label" htmlFor="comments-likes">Comments and likes</label><select id="comments-likes" className="f-select" value={preferences.commentsAndLikes} onChange={(e) => { setPreferences({ ...preferences, commentsAndLikes: e.target.value as NotificationPreferences['commentsAndLikes'] }); setMsg(''); }}><option value="EVERYONE">Everyone</option><option value="FOLLOWERS_ONLY">Followers only</option></select></div>
      {msg && <p className="f-hint" role="status">{msg}</p>}
      <div><button className="btn" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save preferences'}</button></div>
    </div>
  );
}

export function DeliverySettingsPanel() {
  const { user } = useSession();
  const [addressId, setAddressId] = useState('');
  const [f, setF] = useState({ recipientName: user?.name || '', phone: user?.phone || '', addressLine: '', city: '', state: '' });
  const [busy, setBusy] = useState(false); const [msg, setMsg] = useState('');
  useEffect(() => {
    let active = true;
    accountApi.addresses().then((addresses) => {
      if (!active) return;
      const current = addresses.find((address) => address.isDefault) || addresses[0];
      if (current) {
        setAddressId(current.id);
        setF({ recipientName: current.recipientName || user?.name || '', phone: current.phone || user?.phone || '', addressLine: current.addressLine || '', city: current.city || '', state: current.state || '' });
      }
    }).catch(() => {});
    return () => { active = false; };
  }, [user?.name, user?.phone]);
  const set = (key: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((current) => ({ ...current, [key]: e.target.value }));
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg('');
    try {
      await accountApi.saveAddress(addressId || undefined, { ...f, isDefault: true });
      const addresses = await accountApi.addresses();
      const current = addresses.find((address) => address.isDefault) || addresses[0];
      if (current) setAddressId(current.id);
      setMsg('Default address saved.');
    } catch { setMsg('Could not save your address.'); }
    finally { setBusy(false); }
  }
  return (
    <form className="set-panel dpanel f-form" onSubmit={submit}>
      <h2>Delivery address</h2>
      <div className="f-group"><label className="f-label" htmlFor="drn">Recipient name</label><input id="drn" className="f-input" value={f.recipientName} onChange={set('recipientName')} required /></div>
      <div className="f-group"><label className="f-label" htmlFor="dph">Phone</label><input id="dph" className="f-input" value={f.phone} onChange={set('phone')} required /></div>
      <div className="f-group"><label className="f-label" htmlFor="da">Street address</label><input id="da" className="f-input" value={f.addressLine} onChange={set('addressLine')} required /></div>
      <div className="two-col"><div className="f-group"><label className="f-label" htmlFor="dc">City</label><input id="dc" className="f-input" value={f.city} onChange={set('city')} required /></div>
        <div className="f-group"><label className="f-label" htmlFor="ds">State</label><input id="ds" className="f-input" value={f.state} onChange={set('state')} required /></div></div>
      {msg && <p className="f-hint" role="status">{msg}</p>}
      <div><button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Save address'}</button></div>
    </form>
  );
}
