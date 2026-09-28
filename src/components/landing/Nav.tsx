import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { A } from './assets';
import s from './Landing.module.css';

export default function Nav() {
  return (
    <header className={s.nav}>
      <Link href={ROUTES.home} className={s.logo} aria-label="Shoplect home">
        <img className={s.logoImg} src={A('logo.png')} alt="" width={185} height={189} />
      </Link>

      <form className={s.search} role="search" action={ROUTES.search} method="get">
        <label htmlFor="q" className="sr-only">Search Shoplect</label>
        <input id="q" name="q" type="search" className={s.searchInput} placeholder="What are you looking for?" maxLength={100} autoComplete="off" />
        <button type="submit" className={s.searchBtn}>Search</button>
      </form>

      <nav className={s.auth} aria-label="Account">
        <Link href={ROUTES.login} className={`${s.pill} ${s.authBtn} ${s.authOutline}`}>Sign in</Link>
        <Link href={ROUTES.register} className={`${s.pill} ${s.authBtn} ${s.pillBrown}`}>Sign up</Link>
      </nav>
    </header>
  );
}
