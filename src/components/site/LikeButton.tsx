'use client';
import { useState } from 'react';
import { catalogApi } from '@/lib/api';

/** Figma's frosted like chip on the product photo: outline heart, filled once liked. */
export default function LikeButton({ id, count }: { id: string; count: number }) {
  const [on, setOn] = useState(false);
  const [n, setN] = useState(count);
  async function toggle() {
    const next = !on; setOn(next); setN((v) => v + (next ? 1 : -1));
    try { await catalogApi.toggleLike(id); } catch { setOn(!next); setN((v) => v + (next ? -1 : 1)); }
  }
  return (
    <button className="chip" aria-pressed={on} aria-label={on ? `Unlike (${n} likes)` : `Like (${n} likes)`} onClick={toggle}>
      <img src={on ? '/assets/heart-filled.svg' : '/assets/heart-outline.svg'} alt="" width={11} height={9} />{n}
    </button>
  );
}
