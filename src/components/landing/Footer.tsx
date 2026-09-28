import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { SITE, SOCIAL } from '@/lib/site';
import { A } from './assets';
import s from './Landing.module.css';

const ABOUT = [
  ['About Shoplect', ROUTES.about], ['Terms & Conditions', ROUTES.terms], ['Privacy Policy', ROUTES.privacy],
  ['Cookies Policy', ROUTES.cookies], ['Escrow Policy', ROUTES.escrow],
] as const;

const SOCIALS = [
  ['Google', 'google', SOCIAL.google], ['Framer', 'framer', SOCIAL.framer], ['Facebook', 'facebook', SOCIAL.facebook],
  ['WhatsApp', 'whatsapp', SOCIAL.whatsapp], ['YouTube', 'youtube', SOCIAL.youtube],
] as const;

export default function Footer() {
  return (
    <footer className={s.footer}>
      <nav aria-label="About">
        <h2 className={s.fHead}>About us</h2>
        <ul className={s.fList}>{ABOUT.map(([l, h]) => <li key={l}><Link href={h}>{l}</Link></li>)}</ul>
      </nav>
      <nav aria-label="Support">
        <h2 className={s.fHead}>Support</h2>
        <ul className={s.fList}>
          <li><a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a></li>
          <li><Link href={ROUTES.safety}>Safety tips</Link></li>
          <li><Link href={ROUTES.contact}>Contact Us</Link></li>
          <li><Link href={ROUTES.faq}>FAQs</Link></li>
        </ul>
      </nav>
      {/* Figma repeats the "About us" column here; kept as designed. */}
      <nav aria-label="About (more)">
        <h2 className={s.fHead}>About us</h2>
        <ul className={s.fList}>{ABOUT.map(([l, h]) => <li key={l}><Link href={h}>{l}</Link></li>)}</ul>
      </nav>
      <div>
        <h2 className={s.fHead}>Join us on</h2>
        <ul className={s.social}>
          {SOCIALS.map(([label, file, url]) => (
            <li key={file}>
              <a href={url || '#'} aria-label={`Shoplect on ${label}`} target={url ? '_blank' : undefined} rel="noopener noreferrer">
                <img src={A(`social-${file}.svg`)} alt="" width={24} height={24} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
