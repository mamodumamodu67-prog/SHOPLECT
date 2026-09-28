'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHead from '@/components/dash/PageHead';
import Icon from '@/components/ui/Icon';
import { shopApi } from '@/lib/api';
import { CATEGORIES } from '@/lib/mock';
import { DASH } from '@/lib/routes';
import { naira } from '@/lib/format';
import { cleanText } from '@/lib/validation';

const DURATIONS = [['A week', 2000], ['Two weeks', 3800], ['A month', 5000]] as const;
const MAX_IMG = 8;

export default function AddProductPage() {
  const router = useRouter();
  const [f, setF] = useState({ category: '', sub: '', name: '', qtyType: 'Single', qty: '1', description: '', price: '', offers: 'No', delivery: '', adType: 'Basic', duration: 'A week' });
  const [imgs, setImgs] = useState<{ file: File; url: string }[]>([]);
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState('');
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF((p) => ({ ...p, [k]: e.target.value }));
  const promoPrice = DURATIONS.find(([d]) => d === f.duration)![1];

  function pick(files: FileList | null) {
    if (!files) return;
    const ok = Array.from(files).filter((x) => /^image\/(png|jpe?g|webp)$/.test(x.type) && x.size <= 5 * 1024 * 1024).slice(0, MAX_IMG - imgs.length);
    setImgs((p) => [...p, ...ok.map((file) => ({ file, url: URL.createObjectURL(file) }))]);
    if (ok.length < files.length) setErr((p) => ({ ...p, images: `Only PNG, JPG or WebP under 5MB, up to ${MAX_IMG} images` }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    const price = Number(f.price.replace(/\D/g, ''));
    if (!f.category) er.category = 'Select a category';
    if (!imgs.length) er.images = 'Upload at least one image';
    if (cleanText(f.name, 120).length < 3) er.name = 'Enter a product name';
    if (cleanText(f.description, 2000).length < 10) er.description = 'Add a short description';
    if (!price) er.price = 'Enter a price';
    if (!f.delivery) er.delivery = 'Select a delivery option';
    setErr(er); if (Object.keys(er).length) return;

    const fd = new FormData();
    Object.entries({ ...f, name: cleanText(f.name, 120), description: cleanText(f.description, 2000), price }).forEach(([k, v]) => fd.append(k, String(v)));
    imgs.forEach((i) => fd.append('images', i.file));
    setBusy(true); setBanner('');
    try { await shopApi.addProduct(fd); router.push(DASH.products); }
    catch { setBanner('Could not upload your product. Please try again.'); setBusy(false); }
  }

  return (
    <>
      <PageHead title="Add product" />
      <form className="dpanel pad f-form" style={{ maxWidth: 700 }} onSubmit={submit} noValidate>
        <div className="two-col">
          <div className="f-group"><label className="f-label" htmlFor="cat">Category</label>
            <select id="cat" className="f-select" value={f.category} onChange={set('category')} aria-invalid={!!err.category}><option value="">Select Category</option>{CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>{err.category && <span className="f-err">{err.category}</span>}</div>
          <div className="f-group"><label className="f-label" htmlFor="sub">Sub-category</label>
            <select id="sub" className="f-select" value={f.sub} onChange={set('sub')}><option value="">Select Sub-category</option><option>General</option><option>Accessories</option><option>Parts</option></select></div>
        </div>

        <div className="f-group"><span className="f-label" id="imgs-l">Product images</span>
          <label className="upload" aria-labelledby="imgs-l">
            <Icon name="upload" size={28} /><span>Click or Drag/drop to upload image.</span>
            <input type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={(e) => pick(e.target.files)} />
            {imgs.length > 0 && <div className="thumbs">{imgs.map((i) => <img key={i.url} src={i.url} alt="" />)}</div>}
          </label>{err.images && <span className="f-err">{err.images}</span>}</div>

        <div className="f-group"><label className="f-label" htmlFor="pn">Product name</label><input id="pn" className="f-input" placeholder="Enter Product Name" value={f.name} onChange={set('name')} maxLength={120} aria-invalid={!!err.name} />{err.name && <span className="f-err">{err.name}</span>}</div>
        <div className="two-col">
          <div className="f-group"><label className="f-label" htmlFor="qt">Quantity</label><select id="qt" className="f-select" value={f.qtyType} onChange={set('qtyType')}><option>Single</option><option>Multiple</option></select></div>
          {f.qtyType === 'Multiple' && <div className="f-group"><label className="f-label" htmlFor="q">How many?</label><input id="q" className="f-input" inputMode="numeric" value={f.qty} onChange={set('qty')} /></div>}
        </div>
        <div className="f-group"><label className="f-label" htmlFor="pd">Description</label><textarea id="pd" className="f-area" placeholder="Add Description" value={f.description} onChange={set('description')} maxLength={2000} />{err.description && <span className="f-err">{err.description}</span>}</div>
        <div className="f-group"><label className="f-label" htmlFor="pp">Price</label><input id="pp" className="f-input" inputMode="numeric" placeholder="₦0" value={f.price} onChange={set('price')} maxLength={12} aria-invalid={!!err.price} />{err.price && <span className="f-err">{err.price}</span>}</div>

        <div className="f-group"><span className="f-label" id="off-l">Open to offers?</span>
          <div className="seg" role="group" aria-labelledby="off-l">{['No', 'Yes'].map((o) => <button type="button" key={o} className={f.offers === o ? 'on' : ''} aria-pressed={f.offers === o} onClick={() => setF((p) => ({ ...p, offers: o }))}>{o}</button>)}</div></div>

        <div className="f-group"><label className="f-label" htmlFor="dl">Delivery options</label>
          <select id="dl" className="f-select" value={f.delivery} onChange={set('delivery')} aria-invalid={!!err.delivery}><option value="">Select Delivery Options</option><option>Pick Up</option><option>Nationwide Delivery</option></select>
          {f.delivery === 'Nationwide Delivery' && <span className="f-hint">NB: Nationwide Delivery take between 1 - 2 days within the state and 1 - 3 outside the state</span>}
          {err.delivery && <span className="f-err">{err.delivery}</span>}</div>

        <div className="f-group"><label className="f-label" htmlFor="ad">Upload Product</label>
          <select id="ad" className="f-select" value={f.adType} onChange={set('adType')}><option>Basic</option><option>Premium</option></select></div>
        {f.adType === 'Premium' && (
          <div className="two-col end">
            <div className="f-group"><label className="f-label" htmlFor="du">Duration</label><select id="du" className="f-select" value={f.duration} onChange={set('duration')}>{DURATIONS.map(([d]) => <option key={d}>{d}</option>)}</select></div>
            <p style={{ fontSize: 20, fontWeight: 600, color: 'var(--brown)', paddingBottom: 14 }} aria-live="polite">{naira(promoPrice)}.00</p>
          </div>
        )}
        {banner && <p className="err-note" role="alert">{banner}</p>}
        <div><button className="btn" disabled={busy}>{busy ? 'Uploading…' : 'Add product'}</button></div>
      </form>
    </>
  );
}
