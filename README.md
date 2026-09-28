# Shoplect web (front end)

Next.js (App Router) + TypeScript, plain CSS (no UI framework). Built from the Figma file `SHOPLECT`.
Front end only — every write action calls a placeholder backend endpoint (see below) and falls back to
in-memory mock data until a real API is connected.

## Run
```bash
npm install
cp .env.example .env.local
npm run dev
```
You said you've already downloaded the Figma images onto your machine — copy them into `public/assets/`
(same file names as referenced in the components, e.g. `logo.png`, `hero.png`, `cat-1.png`, `avatar-hannah.png`,
`social-google.svg`, `why-1.svg`, `auth-close.svg`, etc). `npm run assets` will still work if you'd rather
re-download from Figma (URLs expire ~7 days after being generated).

## Responsive system (one design, generated for every screen)
- **Fluid grids** (`src/styles/app.css`): product/vendor/category grids use `repeat(auto-fill, minmax(min(100%, var(--card-min)), 1fr))`,
  so the column count is *computed from the space available* at any width (320px … 4K) instead of hard-coded.
- **Device tiers**: mobile <768 · tablet 768–1023 · laptop 1024–1439 · desktop 1440–1919 · wide ≥1920, plus xs ≤359, landscape-short
  (568×320 … 896×414), touch vs mouse. Base styles are the 1440 Figma design; every tier below/above only retunes what must change.
- **Logic layer** (`src/lib/device.tsx`): `DeviceProvider` mirrors the live viewport onto `<html data-device data-tier data-orientation data-input data-short>`;
  `useDevice()` returns it; `<Responsive mobile={…} tablet={…} laptop={…} desktop={…} wide={…}/>` renders a *different view per device*
  (example: the phone-only sticky "Buy with escrow" bar on the product page). First paint never depends on JS — CSS media queries drive layout.
- **Guards**: no horizontal page scroll (`overflow-x: clip`), `viewport-fit=cover` + safe-area insets on every fixed/sticky bar, 16px inputs (no iOS zoom),
  44px touch targets on coarse pointers, modals capped to the viewport, tables scroll inside their own container, dashboard menu becomes an off-canvas drawer ≤1023.

## Assets
```bash
npm run assets          # downloads every Figma image/icon used by the code (87 files) into public/assets
FIGMA_TOKEN=figd_xxx npm run assets:figma   # permanent export of EVERYTHING in the Figma file into public/assets/figma (no expiring links)
```
`npm run assets` uses Figma's temporary links (~7 days). Files that fail (expired links) are skipped, never overwritten — safe to re-run.
Token: Figma → Settings → Security → Personal access tokens (scope `file_content:read`).

## Connect the backend
Set `NEXT_PUBLIC_API_BASE_URL=https://shoplect-dev-test.vercel.app/api/v1`. The frontend uses the documented
JWT bearer-token auth flow and maps catalog responses through `src/lib/api/*.ts`.
For Netlify, add the same variable under Site configuration → Environment variables and deploy the Next.js app;
the static `out/` folder is only suitable for the mock-data build and cannot provide live authenticated API data.

## Structure
- `src/app/(auth)/*` — register, login, verify, verified
- `src/app/(site)/*` — public marketplace: shop home, search, product page, vendor page
- `src/app/(dashboard)/dashboard/*` — logged-in app: shops, products, promotions, connections,
  notifications, likes, inbox, offers, orders (+ tracking, dispute), appeals, wallet, settings
- `src/app/page.tsx` — landing page
- `src/components/landing|auth|site|dash|ui` — components grouped by area
- `src/lib/api/*` — the only place that talks to a backend
- `src/lib/mock.ts`, `src/lib/types.ts` — mock data and shared types

## Security
Per-request CSP nonce + `strict-dynamic` (`src/middleware.ts`), HSTS/frame/referrer/permissions headers
(`next.config.mjs`), no `dangerouslySetInnerHTML` except escaped JSON-LD, validation + open-redirect guard
(`src/lib/validation.ts`), dashboard route gate once a backend session cookie exists.

## SEO
Server-rendered pages, per-page metadata, canonical + Open Graph + Twitter tags, Product JSON-LD on product
pages, `robots.ts`, `sitemap.ts`, alt text, lazy images.

## Start Selling flow
"Start Selling" (landing hero, CTA banner, and the logged-out "Sell" nav button) now goes through
`src/components/site/StartSellingLink.tsx`, matching the single generic Dashboard/Register in Figma
(there's no separate seller account type):
- Logged in -> straight to `/dashboard/shops/new` (Create a Shop).
- Logged out -> `/register?next=/dashboard/shops/new` -> the intended destination is kept in
  sessionStorage (`src/lib/pending.ts`) through the verify step -> the Verified page's Continue button
  lands on Create a Shop instead of the marketplace.
Plain "Sign up" / "Sign in" links are unaffected and still land on the marketplace after verifying.

## Known gaps / guesses (tell me if these should change)
- Sign In / Verify / Verified screens were built from Figma's text and layout data (icons/precise spacing
  not pixel-checked) because the Figma MCP call limit was reached while building them.
- Footer repeats the "About us" column, matching the Figma file exactly (looked like a possible design duplication).
- "Electronics" category reuses the "Beauty" image in Figma; kept as-is.
- Every backend endpoint path (`/auth/login`, `/products`, `/me/orders`, etc.) is a guess — rename in
  `src/lib/api/*.ts` to match your real API.
- Not run/tested in this environment (no internet/npm access in the sandbox) — please run
  `npm install && npm run dev` and report anything that looks wrong.
