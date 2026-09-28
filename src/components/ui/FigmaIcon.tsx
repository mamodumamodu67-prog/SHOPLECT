/**
 * Renders Figma's exported icon files. `inset`/`bleed` reproduce Figma's own icon frame geometry so each glyph
 * lands pixel-for-pixel; colour comes from CSS `currentColor` (mask), so one file serves active + inactive states.
 */
const A = (f: string) => `/assets/${f}`;

export type NavIcon = { file: string; inset?: string; bleed?: string };
export const NAV_ICONS: Record<string, NavIcon> = {
  promotion: { file: 'nav-promotion.svg', inset: '8.34% 12.5% 8.33% 12.5%', bleed: '-3.75% -4.17%' },
  shop: { file: 'nav-shop.svg' },
  products: { file: 'nav-products.svg' },
  connections: { file: 'nav-connections.svg', inset: '14.58%', bleed: '-2.94%' },
  notifications: { file: 'nav-notifications.svg' },
  likes: { file: 'nav-likes.svg' },
  inbox: { file: 'nav-inbox.svg', inset: '6.72% 7.14% 6.25% 6.25%', bleed: '-2.39% -2.41%' },
  orders: { file: 'nav-orders.svg' },
  offers: { file: 'nav-offers.svg' },
  wallet: { file: 'nav-wallet.svg' },
  settings: { file: 'nav-settings.svg' },
  logout: { file: 'nav-logout.svg', inset: '11.46% 13.35%', bleed: '-4.05% -4.26%' },
};

export function NavGlyph({ name }: { name: keyof typeof NAV_ICONS | string }) {
  const ic = NAV_ICONS[name];
  if (!ic) return <span className="ni" />;
  const mask = { ['--m' as string]: `url(${A(ic.file)})` } as React.CSSProperties;
  return (
    <span className="ni" aria-hidden="true">
      {ic.inset ? (
        <span style={{ inset: ic.inset }}><span style={{ inset: ic.bleed }}><span className="mi" style={mask} /></span></span>
      ) : <span className="mi" style={mask} />}
    </span>
  );
}
