import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pub = ['', '/search', '/register', '/login', '/about', '/terms', '/privacy', '/cookies', '/escrow-policy', '/safety-tips', '/contact', '/faq'];
  return pub.map((p) => ({ url: `${SITE.url}${p}`, lastModified: now, changeFrequency: p === '' ? 'daily' : 'monthly', priority: p === '' ? 1 : 0.6 }));
}
