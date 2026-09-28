'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { A } from '@/components/landing/assets';
import { useSession } from '@/lib/session';
import { DASH, ROUTES } from '@/lib/routes';
import StartSellingLink from './StartSellingLink';

export default function SiteNav({ initialQuery = '' }: { initialQuery?: string }) {
  const { user, signOut } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent | TouchEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', h); document.addEventListener('touchstart', h); document.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('touchstart', h); document.removeEventListener('keydown', k); };
  }, []);

  return (
    <header className="snav">
      <div className="in">
        <Link href={ROUTES.home} className="logo" aria-label="Shoplect home"><img src={A('logo.png')} alt="" /></Link>
        <form className="sform" role="search" action={ROUTES.search} method="get">
          <label htmlFor="site-q" className="sr-only">Search Shoplect</label>
          <input id="site-q" name="q" type="search" defaultValue={initialQuery} placeholder="What are you looking for?" maxLength={100} autoComplete="off" />
          <button type="submit">Search</button>
        </form>
        <div className="right">
          {user ? (
            <>
              <div className="acc">
                <Link className="navlink" href={DASH.notifications} aria-label="Notifications"><img src={A('icon-notifications.svg')} alt="" /><span>Notifications</span></Link>
                <div className="menu" ref={ref}>
                  <button className="navlink" aria-expanded={open} aria-haspopup="menu" aria-label="Account menu" onClick={() => setOpen((v) => !v)}>
                    <img src={A('icon-person.svg')} alt="" /><span>Account</span><img className="chev" src={A('icon-chevron-down.svg')} alt="" />
                  </button>
                  {open && (
                    <div className="pop" role="menu">
                      <Link role="menuitem" href={DASH.root} onClick={() => setOpen(false)}><img src={A('acct-dashboard.svg')} alt="" />Dashboard</Link>
                      <Link role="menuitem" href={DASH.orders} onClick={() => setOpen(false)}><img src={A('acct-orders.svg')} alt="" />Orders</Link>
                      <Link role="menuitem" href={DASH.inbox} onClick={() => setOpen(false)}><img src={A('acct-inbox.svg')} alt="" />Inbox</Link>
                      <button role="menuitem" onClick={async () => { await signOut(); setOpen(false); router.refresh(); }}><img src={A('nav-logout.svg')} alt="" style={{ filter: 'brightness(0)' }} />Log out</button>
                    </div>
                  )}
                </div>
              </div>
              <Link href={DASH.newProduct} className="btn sellbtn">Sell</Link>
            </>
          ) : (
            <>
              <Link href={ROUTES.login} className="btn outline sellbtn">Sign in</Link>
              <StartSellingLink className="btn sellbtn">Sell</StartSellingLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
