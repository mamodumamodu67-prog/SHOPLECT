import '@/styles/app.css';
import SiteNav from './SiteNav';
import Footer from '@/components/landing/Footer';

export default function SiteShell({ children, query }: { children: React.ReactNode; query?: string }) {
  return (
    <div className="app site">
      <SiteNav initialQuery={query} />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}
