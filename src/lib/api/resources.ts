import { apiFetch, isApiConfigured } from './client';
import * as M from '../mock';
import type * as T from '../types';

/**
 * Every backend call the UI makes lives here. With NEXT_PUBLIC_API_BASE_URL set, requests go to your API;
 * otherwise mock data is returned so every screen works standalone.
 * Paths/shape are placeholders: adjust to your backend contract.
 */
const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms));
async function call<R>(path: string, mock: () => R | Promise<R>, o: Parameters<typeof apiFetch>[1] = {}): Promise<R> {
  if (isApiConfigured) return apiFetch<R>(path, o);
  await wait(120);
  return mock();
}
const ok = () => ({ ok: true as const });

const dataOf = <T,>(value: T | { data: T }) => (value && typeof value === 'object' && 'data' in value ? value.data : value) as T;
function productOf(raw: any): T.Product {
  const images = (raw.images || []).map((image: any) => typeof image === 'string' ? image : image.url).filter(Boolean);
  const shop = raw.shop || {};
  const owner = shop.owner || raw.owner || {};
  return {
    id: raw.id, title: raw.name || raw.title || '', price: Number(raw.price || 0), description: raw.description || '',
    image: images[0], images, condition: raw.condition === 'USED' ? 'Used' : 'New', category: raw.category?.slug || raw.category || '',
    seller: { id: owner.id || shop.id || '', name: owner.fullName || shop.name || 'Shoplect vendor', positive: Number(shop.positiveReviewCount || shop.reviewCount || 0) },
    likes: Number(raw.likeCount || raw.likes || 0), views: Number(raw.viewCount || raw.views || 0), inStock: Number(raw.stockQuantity ?? 1) > 0 && raw.status !== 'SOLD', sold: raw.status === 'SOLD',
  };
}
function vendorOf(raw: any): T.Vendor {
  const owner = raw.owner || {};
  return { id: raw.id, name: raw.name || owner.fullName || 'Shoplect vendor', location: [raw.city, raw.state].filter(Boolean).join(', '), lastSeen: owner.lastSeenAt || 'Recently', verified: !!raw.isVerified, phone: raw.phone || '', avatar: raw.logoUrl || owner.avatarUrl, positive: Number(raw.positiveReviewCount || raw.reviewCount || 0) };
}

export const catalogApi = {
  categories: () => call<any[]>('/categories', () => M.CATEGORIES).then((items) => items.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug, icon: c.slug })) as T.Category[]),
  search: (p: T.SearchParams) => call<any>('/search/products', () => {
    let items = M.PRODUCTS.filter((x) => !p.q || x.title.toLowerCase().includes(p.q.toLowerCase()));
    if (p.category) items = items.filter((x) => x.category === p.category);
    if (p.min) items = items.filter((x) => x.price >= p.min!);
    if (p.max) items = items.filter((x) => x.price <= p.max!);
    if (p.sort === 'price-asc') items = [...items].sort((a, b) => a.price - b.price);
    if (p.sort === 'price-desc') items = [...items].sort((a, b) => b.price - a.price);
    return { total: items.length, items };
  }, { query: { q: p.q || '', category: p.category, minPrice: p.min, maxPrice: p.max, sort: p.sort } }).then((result) => {
    const payload = dataOf<any>(result);
    const raw: any[] = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.items)
        ? payload.items
        : Array.isArray(payload?.products)
          ? payload.products
          : [];
    const total = result?.meta?.total ?? payload?.meta?.total ?? payload?.total ?? raw.length;
    return { total: Number(total), items: raw.map(productOf) };
  }),
  product: (id: string) => call<any>(`/products/${encodeURIComponent(id)}`, () => M.PRODUCTS.find((x) => x.id === id) || null).then((raw) => raw ? productOf(raw) : null),
  topProducts: () => call<any>('/products', () => M.PRODUCTS.slice(0, 8), { query: { sort: 'top', limit: 8 } }).then((raw) => dataOf<any[]>(raw).map(productOf)),
  similar: (id: string) => call<any[]>(`/products/${encodeURIComponent(id)}/similar`, () => M.PRODUCTS.filter((x) => x.id !== id).slice(0, 8), { query: { limit: 8 } }).then((raw) => raw.map(productOf)),
  topVendors: () => call<any[]>('/shops', () => M.VENDORS, { query: { sort: 'top', limit: 8 } }).then((items) => items.map(vendorOf)),
  vendor: (id: string) => call<any>(`/shops/${encodeURIComponent(id)}`, () => M.VENDORS[0] ? { ...M.VENDORS[0], id } : null).then((raw) => raw ? vendorOf(raw) : null),
  vendorProducts: (id: string) => call<any>(`/shops/${encodeURIComponent(id)}/products`, () => M.PRODUCTS.slice(0, 6), { query: { limit: 6, page: 1 } }).then((raw) => dataOf<any[]>(raw).map(productOf)),
  toggleLike: (id: string) => call(`/products/${encodeURIComponent(id)}/like`, ok, { method: 'POST' }),
};

export const shopApi = {
  list: () => call<T.Shop[]>('/me/shops', () => M.SHOPS),
  get: (id: string) => call<T.Shop | null>(`/me/shops/${encodeURIComponent(id)}`, () => M.SHOPS.find((s) => s.id === id) || null),
  create: (b: Omit<T.Shop, 'id' | 'positive' | 'category'> & { minOffer: number }) => call('/me/shops', ok, { method: 'POST', body: b }),
  remove: (id: string) => call(`/me/shops/${encodeURIComponent(id)}`, ok, { method: 'DELETE' }),
  products: (status: 'active' | 'sold') => call<T.Product[]>('/me/products', () => M.PRODUCTS.slice(0, 3).map((p) => ({ ...p, sold: status === 'sold', inStock: status !== 'sold' })), { query: { status } }),
  addProduct: (b: unknown) => call('/me/products', ok, { method: 'POST', body: b }),
  promotions: () => call<T.Promotion[]>('/me/promotions', () => M.PROMOTIONS),
};

export const socialApi = {
  people: (kind: 'followers' | 'following') => call<T.Person[]>(`/me/${kind}`, () => (kind === 'followers' ? M.FOLLOWERS : M.FOLLOWING)),
  toggleFollow: (id: string) => call(`/users/${encodeURIComponent(id)}/follow`, ok, { method: 'POST' }),
  notifications: () => call<T.Notice[]>('/me/notifications', () => M.NOTICES),
  likes: () => call<T.Product[]>('/me/likes', () => M.PRODUCTS.slice(0, 2).map((p) => ({ ...p, likes: 1 }))),
  conversations: () => call<T.Conversation[]>('/me/conversations', () => M.CONVERSATIONS),
  sendMessage: (cid: string, text: string) => call(`/me/conversations/${encodeURIComponent(cid)}/messages`, ok, { method: 'POST', body: { text } }),
  block: (cid: string) => call(`/me/conversations/${encodeURIComponent(cid)}/block`, ok, { method: 'POST' }),
  report: (cid: string) => call(`/me/conversations/${encodeURIComponent(cid)}/report`, ok, { method: 'POST' }),
  offers: (d: 'received' | 'sent') => call<T.Offer[]>('/me/offers', () => M.OFFERS.filter((o) => o.direction === d), { query: { direction: d } }),
  respondOffer: (id: string, action: 'accept' | 'decline' | 'cancel') => call(`/me/offers/${encodeURIComponent(id)}`, ok, { method: 'PATCH', body: { action } }),
};

export const orderApi = {
  list: (role: 'buyer' | 'seller') => call<T.Order[]>('/me/orders', () => M.ORDERS.filter((o) => o.role === role), { query: { role } }),
  get: (id: string) => call<T.Order | null>(`/me/orders/${encodeURIComponent(id)}`, () => M.ORDERS.find((o) => o.id === id) || null),
  advance: (id: string) => call(`/me/orders/${encodeURIComponent(id)}/advance`, ok, { method: 'POST' }),
  releaseFunds: (id: string) => call(`/me/orders/${encodeURIComponent(id)}/release`, ok, { method: 'POST' }),
  dispute: (id: string, b: unknown) => call(`/me/orders/${encodeURIComponent(id)}/dispute`, ok, { method: 'POST', body: b }),
  disputeDetails: (id: string) => call<T.Dispute>(`/me/orders/${encodeURIComponent(id)}/dispute`, () => M.DISPUTE),
  appeals: () => call<T.Appeal[]>('/me/appeals', () => M.APPEALS),
  sendAppealMessage: (id: string, text: string) => call(`/me/appeals/${encodeURIComponent(id)}/messages`, ok, { method: 'POST', body: { text } }),
  dissolveAppeal: (id: string) => call(`/me/appeals/${encodeURIComponent(id)}/dissolve`, ok, { method: 'POST' }),
};

export const walletApi = {
  get: () => call<T.Wallet>('/me/wallet', () => M.WALLET),
  fund: (amount: number) => call<{ paymentUrl?: string }>('/me/wallet/fund', () => ({}), { method: 'POST', body: { amount } }),
  withdraw: (amount: number, accountId: string) => call('/me/wallet/withdraw', ok, { method: 'POST', body: { amount, accountId } }),
  accounts: () => call<T.Bank[]>('/me/bank-accounts', () => M.ACCOUNTS),
  resolveAccount: (bank: string, number: string) => call<{ accountName: string }>('/bank/resolve', () => ({ accountName: 'OLUDAYO SOLOMON IDOWU' }), { query: { bank, number } }),
  addAccount: (b: { bankName: string; accountNumber: string }) => call<{ requiresOtp: boolean }>('/me/bank-accounts', () => ({ requiresOtp: true }), { method: 'POST', body: b }),
  confirmAccount: (otp: string) => call('/me/bank-accounts/confirm', ok, { method: 'POST', body: { otp } }),
  removeAccount: (id: string) => call(`/me/bank-accounts/${encodeURIComponent(id)}`, ok, { method: 'DELETE' }),
};

export const accountApi = {
  saveProfile: (b: { name: string; email: string; phone: string }) => call('/me/profile', ok, { method: 'PATCH', body: b }),
  changePassword: (b: { current: string; next: string }) => call('/me/password', ok, { method: 'POST', body: b }),
  saveNotifications: (b: unknown) => call('/me/notification-settings', ok, { method: 'PUT', body: b }),
  saveDelivery: (b: unknown) => call('/me/delivery-settings', ok, { method: 'PUT', body: b }),
};

export const dealApi = {
  buy: (productId: string) => call<{ orderId: string }>('/me/orders', () => ({ orderId: 'o2' }), { method: 'POST', body: { productId } }),
  makeOffer: (productId: string, amount: number) => call(`/products/${encodeURIComponent(productId)}/offers`, ok, { method: 'POST', body: { amount } }),
  follow: (vendorId: string) => call(`/vendors/${encodeURIComponent(vendorId)}/follow`, ok, { method: 'POST' }),
  revealPhone: (vendorId: string) => call<{ phone: string }>(`/vendors/${encodeURIComponent(vendorId)}/phone`, () => ({ phone: '08023414491' })),
  reportVendor: (vendorId: string, reason: string) => call(`/vendors/${encodeURIComponent(vendorId)}/report`, ok, { method: 'POST', body: { reason } }),
  feedback: (vendorId: string, text: string) => call(`/vendors/${encodeURIComponent(vendorId)}/feedback`, ok, { method: 'POST', body: { text } }),
};
