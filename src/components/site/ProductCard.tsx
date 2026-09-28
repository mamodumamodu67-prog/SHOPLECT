import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import { ProductImage, StatusBadge } from '@/components/ui/bits';
import { naira } from '@/lib/format';
import { productHref } from '@/lib/routes';
import type { Product } from '@/lib/types';
import LikeButton from './LikeButton';

/** variant "buyer" = Figma product card. variant "shop" = stock badge + views (vendor page, dashboard). */
export default function ProductCard({ p, variant = 'buyer', actions }: { p: Product; variant?: 'buyer' | 'shop'; actions?: React.ReactNode }) {
  return (
    <article className="pcard">
      <div className="pimgbox">
        <ProductImage src={p.image} alt={p.title} />
        {variant === 'buyer' && <LikeButton id={p.id} count={p.likes} />}
      </div>
      {actions && <div className="actions">{actions}</div>}
      <div className="body">
        <h3><Link href={productHref(p.id)} className="pcard-link">{p.title}</Link></h3>
        <p className="price">{naira(p.price)}</p>
      </div>
      <div className="foot">
        {variant === 'buyer' ? (
          <>
            <span className="tag-new">{p.condition}</span>
            <span className="reviewer">
              <span className="u"><img src="/assets/reviewer-avatar.png" alt="" width={18} height={18} /><span>{p.seller.name}</span></span>
              <small>{p.seller.positive}% positive reviews</small>
            </span>
          </>
        ) : (
          <>
            <StatusBadge status={p.sold ? 'Sold' : p.inStock ? 'In Stock' : 'Sold'} />
            <span className="meta-views"><Icon name="eye" size={16} />{p.views}</span>
          </>
        )}
      </div>
    </article>
  );
}
