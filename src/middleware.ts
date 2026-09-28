import { NextResponse, type NextRequest } from 'next/server';

/** Per-request nonce CSP. Scripts run only if they carry the nonce. */
export function middleware(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const isDev = process.env.NODE_ENV !== 'production';

  let apiOrigin = '';
  try { apiOrigin = new URL(process.env.NEXT_PUBLIC_API_BASE_URL || '').origin; } catch { /* mock mode */ }

  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' blob: data: ${apiOrigin}`.trim(),
    `font-src 'self'`,
    `connect-src 'self' ${apiOrigin}${isDev ? ' ws:' : ''}`.trim(),
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    ...(isDev ? [] : ['upgrade-insecure-requests']),
  ].join('; ');

  const headers = new Headers(request.headers);
  headers.set('x-nonce', nonce);
  headers.set('Content-Security-Policy', csp);

  const response = NextResponse.next({ request: { headers } });
  response.headers.set('Content-Security-Policy', csp);
  return response;
}

export const config = {
  matcher: [{ source: '/((?!api|_next/static|_next/image|favicon.ico|assets).*)' }],
};
