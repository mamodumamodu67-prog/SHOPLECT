'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHead from '@/components/dash/PageHead';
import Icon from '@/components/ui/Icon';
import { shopApi } from '@/lib/api';
import { DASH } from '@/lib/routes';
import { cleanText } from '@/lib/validation';

export default function CreateShopPage() {
  const router = useRouter();
  const [f, setF] = useState({ name: '', description: '', phone: '', address: '', minOffer: '50' });
  const [logo, setLogo] = useState<{ file: File; url: string } | null>(null);
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState('');
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\/(png|jpe?g|webp)$/.test(file.type) || file.size > 5 * 1024 * 1024) return setErr((p) => ({ ...p, logo: 'Use a PNG, JPG or WebP image under 5MB' }));
    setErr((p) => ({ ...p, logo: '' })); setLogo({ file, url: URL.createObjectURL(file) });
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const v = { name: cleanText(f.name, 80), description: cleanText(f.description, 500), phone: f.phone.replace(/\D/g, ''), address: cleanText(f.address, 160) };
    const er: Record<string, string> = {};
    if (v.name.length < 2) er.name = 'Enter your shop name';
    if (v.description.length < 10) er.description = 'Describe your shop in a few words';
    if (v.phone.length < 10) er.phone = 'Enter a valid phone number';
    if (v.address.length < 5) er.address = 'Enter your shop address';
    setErr(er); if (Object.keys(er).length) return;
    setBusy(true); setBanner('');
    try { await shopApi.create({ ...v, minOffer: Number(f.minOffer) }); router.push(DASH.shops); }
    catch { setBanner('Could not create your shop. Please try again.'); setBusy(false); }
  }

  return (
    <>
      <PageHead title="Create shop" />
      <form className="dpanel pad f-form" style={{ maxWidth: 700 }} onSubmit={submit} noValidate>
        <label className="upload" style={{ width: 200 }}>
          {logo ? <div className="thumbs"><img src={logo.url} alt="Shop logo preview" /></div> : <Icon name="upload" size={28} />}
          <span>Upload Image</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={pick} />
        </label>
        {err.logo && <span className="f-err">{err.logo}</span>}
        <div className="f-group"><label className="f-label" htmlFor="name">Shop name</label><input id="name" className="f-input" placeholder="Enter shop name" value={f.name} onChange={set('name')} maxLength={80} aria-invalid={!!err.name} />{err.name && <span className="f-err">{err.name}</span>}</div>
        <div className="f-group"><label className="f-label" htmlFor="desc">Shop description</label><textarea id="desc" className="f-area" placeholder="Describe your shop" value={f.description} onChange={set('description')} maxLength={500} />{err.description && <span className="f-err">{err.description}</span>}</div>
        <div className="f-group"><label className="f-label" htmlFor="phone">Phone number</label><input id="phone" className="f-input" inputMode="tel" placeholder="00000000000000" value={f.phone} onChange={set('phone')} maxLength={16} aria-invalid={!!err.phone} />{err.phone && <span className="f-err">{err.phone}</span>}</div>
        <div className="f-group"><label className="f-label" htmlFor="addr">Shop address</label><input id="addr" className="f-input" placeholder="No 12, Abuja, Wuse" value={f.address} onChange={set('address')} maxLength={160} aria-invalid={!!err.address} />{err.address && <span className="f-err">{err.address}</span>}</div>
        <div className="f-group" style={{ maxWidth: 200 }}><label className="f-label" htmlFor="mo">Minimum offer accepted</label>
          <select id="mo" className="f-select" value={f.minOffer} onChange={set('minOffer')}>{[10, 20, 30, 40, 50, 60, 70, 80, 90].map((n) => <option key={n} value={n}>{n} %</option>)}</select></div>
        {banner && <p className="err-note" role="alert">{banner}</p>}
        <div><button className="btn" disabled={busy}>{busy ? 'Creating…' : 'Create Shop'}</button></div>
      </form>
    </>
  );
}
