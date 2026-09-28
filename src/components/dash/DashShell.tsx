'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NavGlyph } from '@/components/ui/FigmaIcon';
import { Loading } from '@/components/ui/bits';
import { A } from '@/components/landing/assets';
import { useSession } from '@/lib/session';
import { DASH, ROUTES } from '@/lib/routes';

// Same 11 entries, same order as Figma's side menu.
const NAV = [
  ['My Promotion', DASH.promotions, 'promotion'], ['Manage Shop', DASH.shops, 'shop'], ['Manage Products', DASH.products, 'products'],
  ['Connections', DASH.connections, 'connections'], ['Notifications', DASH.notifications, 'notifications'], ['Likes', DASH.likes, 'likes'],
  ['Inbox', DASH.inbox, 'inbox'], ['Orders', DASH.orders, 'orders'], ['Offers', DASH.offers, 'offers'],
  ['Wallet', DASH.wallet, 'wallet'], ['Settings', DASH.settings, 'settings'],
] as const;

export default function DashShell({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useSession();
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [open]);
  useEffect(() => { if (!loading && !user) router.replace(`${ROUTES.login}?next=${encodeURIComponent(path)}`); }, [loading, user, path, router]);

  if (loading || !user) return <div className="dash app"><Loading /></div>;

  return (
    <div className="dash app">
      <header className="dtop">
        <button className="menu-btn" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="dash-menu" onClick={() => setOpen((v) => !v)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#784c31" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d={open ? 'M6 6l12 12M18 6 6 18' : 'M4 7h16M4 12h16M4 17h16'} /></svg>
        </button>
        <Link href={ROUTES.home} className="logo" aria-label="Shoplect home"><img src={A('logo.png')} alt="" /></Link>
        <div className="acc">
          <Link className="navlink bell" href={DASH.notifications} aria-label="Notifications"><img src={A('top-bell.svg')} alt="" /></Link>
          <Link className="navlink name" href={DASH.settings}>
            <img className="av" src={user.avatar || A('dash-avatar.png')} alt="" width={24} height={24} /><span>{user.name}</span><img className="chev" src={A('top-chevron.svg')} alt="" />
          </Link>
        </div>
      </header>
      <div className={`scrim ${open ? 'open' : ''}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside id="dash-menu" className={`dside ${open ? 'open' : ''}`} aria-label="Dashboard menu">
        <nav>
          {NAV.map(([label, href, icon]) => (
            <Link key={href} href={href} aria-current={path === href || path.startsWith(href + '/') ? 'page' : undefined}><NavGlyph name={icon} />{label}</Link>
          ))}
        </nav>
        <button className="out" onClick={async () => { await signOut(); router.push(ROUTES.home); }}><NavGlyph name="logout" />Log out</button>
      </aside>
      <main id="main" className="dmain"><div className="inner">{children}</div></main>
    </div>
  );
}
