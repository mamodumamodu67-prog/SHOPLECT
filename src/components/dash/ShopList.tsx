'use client';
import Link from 'next/link';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Icon from '@/components/ui/Icon';
import { shopApi } from '@/lib/api';
import { DASH } from '@/lib/routes';
import { SITE } from '@/lib/site';
import type { Shop } from '@/lib/types';

export default function ShopList({ initial }: { initial: Shop[] }) {
  const [shops, setShops] = useState(initial);
  const [del, setDel] = useState<Shop | null>(null);
  const [copied, setCopied] = useState('');
  async function copy(id: string) { try { await navigator.clipboard.writeText(`${SITE.url}/vendor/${id}`); setCopied(id); setTimeout(() => setCopied(''), 1800); } catch {} }
  async function remove() { if (!del) return; await shopApi.remove(del.id); setShops((s) => s.filter((x) => x.id !== del.id)); setDel(null); }
  return (
    <>
      <div className="grid3">
        {shops.map((s) => (
          <article key={s.id} className="card shop-card">
            <h3>{s.name}</h3><p>{s.category}</p><p>{s.positive}% positive reviews</p>
            <div className="acts">
              <Link className="btn outline sm" href={DASH.shop(s.id)}><Icon name="edit" size={14} />Edit</Link>
              <button className="btn outline sm" onClick={() => setDel(s)}><Icon name="trash" size={14} />Delete</button>
              <button className="btn outline sm" onClick={() => copy(s.id)}><Icon name="copy" size={14} />{copied === s.id ? 'Copied' : 'Copy URL'}</button>
            </div>
          </article>
        ))}
      </div>
      {del && (
        <Modal title="Delete shop" onClose={() => setDel(null)} width={420}>
          <p>Delete <b>{del.name}</b>? Its products will also be removed. This cannot be undone.</p>
          <div className="modal-actions"><button className="btn outline" onClick={() => setDel(null)}>Cancel</button><button className="btn danger" onClick={remove}>Delete</button></div>
        </Modal>
      )}
    </>
  );
}
