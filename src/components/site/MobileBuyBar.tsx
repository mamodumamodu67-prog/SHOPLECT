import { naira } from '@/lib/format';

/** Phone-only view: price + primary action pinned to the bottom (the desktop layout keeps them in the side column). */
export default function MobileBuyBar({ price }: { price: number }) {
  return (
    <>
      <div className="mbar-spacer" aria-hidden="true" />
      <div className="mbar" role="region" aria-label="Quick buy">
        <b>{naira(price)}</b>
        <a className="btn" href="#buy">Buy with escrow</a>
      </div>
    </>
  );
}
