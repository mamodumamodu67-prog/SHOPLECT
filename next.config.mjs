/** @type {import('next').NextConfig} */
const apiOrigin = (() => {
  try { return new URL(process.env.NEXT_PUBLIC_API_BASE_URL || '').origin; } catch { return null; }
})();

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];
// Content-Security-Policy (with per-request nonce) is set in src/middleware.ts

const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: { unoptimized: true,
    remotePatterns: apiOrigin
      ? [{ protocol: new URL(apiOrigin).protocol.replace(':', ''), hostname: new URL(apiOrigin).hostname }]
      : [],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};
export default nextConfig;
