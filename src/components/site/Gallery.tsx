'use client';
import { useState } from 'react';
import { ProductImage } from '@/components/ui/bits';

export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const list = images.length ? images : [undefined, undefined, undefined, undefined];
  const [i, setI] = useState(0);
  return (
    <div className="gallery">
      <div className="main"><ProductImage src={list[i]} alt={alt} /></div>
      <div className="thumbs" role="group" aria-label="Product images">
        {list.map((src, k) => (
          <button key={k} aria-current={i === k} aria-label={`Show image ${k + 1}`} onClick={() => setI(k)}><ProductImage src={src} /></button>
        ))}
      </div>
    </div>
  );
}
