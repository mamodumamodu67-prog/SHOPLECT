/** All app routes in one place. Rename here and every link follows. */
export const ROUTES = {
  home: '/',
  shop: '/shop',
  search: '/search',
  register: '/register',
  login: '/login',
  category: (slug: string) => `/shop?category=${encodeURIComponent(slug)}`,
  about: '/about',
  terms: '/terms',
  privacy: '/privacy',
  cookies: '/cookies',
  escrow: '/escrow-policy',
  safety: '/safety-tips',
  contact: '/contact',
  faq: '/faq',
} as const;

export const AUTH_ROUTES = { verify: '/verify', verified: '/verified', forgot: '/forgot-password' } as const;

export const DASH = {
  root: '/dashboard', shops: '/dashboard/shops', newShop: '/dashboard/shops/new', shop: (id: string) => `/dashboard/shops/${id}`,
  products: '/dashboard/products', newProduct: '/dashboard/products/new', promotions: '/dashboard/promotions',
  connections: '/dashboard/connections', notifications: '/dashboard/notifications', likes: '/dashboard/likes',
  inbox: '/dashboard/inbox', orders: '/dashboard/orders', order: (id: string) => `/dashboard/orders/${id}`,
  dispute: (id: string) => `/dashboard/orders/${id}/dispute`, appeals: '/dashboard/appeals',
  offers: '/dashboard/offers', wallet: '/dashboard/wallet', settings: '/dashboard/settings',
} as const;
export const productHref = (id: string) => `/product/${id}`;
export const vendorHref = (id: string) => `/vendor/${id}`;
