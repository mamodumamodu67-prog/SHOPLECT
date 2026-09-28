import Link from 'next/link';
import Nav from '@/components/landing/Nav';
import Footer from '@/components/landing/Footer';
import { ROUTES } from '@/lib/routes';
import l from '@/components/landing/Landing.module.css';

export default function ComingSoon({ title }: { title: string }) {
  return (
    <>
      <Nav />
      <main id="main" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ display: 'grid', gap: 24, justifyItems: 'center' }}>
          <h1 className={l.h2}>{title}</h1>
          <p style={{ color: 'var(--slate)', maxWidth: 480 }}>This page is being built and will be available soon.</p>
          <Link href={ROUTES.home} className={`${l.pill} ${l.pillBrown}`}>Back to home</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
