import type { Metadata, Viewport } from 'next';
import { Poppins, Lato, Hedvig_Letters_Serif, Plus_Jakarta_Sans } from 'next/font/google';
import { SITE } from '@/lib/site';
import { SessionProvider } from '@/lib/session';
import { DeviceProvider } from '@/lib/device';
import './globals.css';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--font-poppins', display: 'swap' });
const lato = Lato({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-lato-var', display: 'swap' });
const hedvig = Hedvig_Letters_Serif({ subsets: ['latin'], weight: '400', variable: '--font-hedvig', display: 'swap' });

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-jakarta', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: 'Shoplect | Buy & Sell Safely with Escrow Protection', template: '%s | Shoplect' },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website', siteName: SITE.name, url: SITE.url,
    title: 'Shoplect | Buy & Sell Safely with Escrow Protection',
    description: SITE.description, images: ['/assets/hero.png'],
  },
  twitter: { card: 'summary_large_image', title: 'Shoplect', description: SITE.description, images: ['/assets/hero.png'] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#784c31' };

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Organization', name: SITE.name, url: SITE.url, logo: `${SITE.url}/assets/logo.png`, email: SITE.supportEmail },
    { '@type': 'WebSite', name: SITE.name, url: SITE.url,
      potentialAction: { '@type': 'SearchAction', target: `${SITE.url}/search?q={search_term_string}`, 'query-input': 'required name=search_term_string' } },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${lato.variable} ${hedvig.variable} ${jakarta.variable}`}>
      <body>
        <a href="#main" className="sr-only">Skip to content</a>
        {/* JSON-LD is data, not executable script: safe under the CSP. '<' is escaped to prevent tag breakout. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
        <DeviceProvider><SessionProvider>{children}</SessionProvider></DeviceProvider>
      </body>
    </html>
  );
}
