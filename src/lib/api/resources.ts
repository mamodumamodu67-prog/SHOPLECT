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
function shopOf(raw: any): T.Shop {
  return { id: raw.id, name: raw.name || '', category: raw.category?.name || raw.category || '', description: raw.description || '', positive: Number(raw.positiveReviewCount || raw.reviewCount || 0), phone: raw.phone || '', address: raw.address || '', logo: raw.logoUrl };
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
  }, { query: { q: p.q || '', category: p.category, minPrice: p.min, maxPrice: p.max, sort: p.sort } }).then((result) => { const raw = dataOf<any[]>(result); return { total: (result as any).meta?.total ?? raw.length, items: raw.map(productOf) }; }),
  product: (id: string) => call<any>(`/products/${encodeURIComponent(id)}`, () => M.PRODUCTS.find((x) => x.id === id) || null).then((raw) => raw ? productOf(raw) : null),
  topProducts: () => call<any>('/products', () => M.PRODUCTS.slice(0, 8), { query: { sort: 'top', limit: 8 } }).then((raw) => dataOf<any[]>(raw).map(productOf)),
  similar: (id: string) => call<any[]>(`/products/${encodeURIComponent(id)}/similar`, () => M.PRODUCTS.filter((x) => x.id !== id).slice(0, 8), { query: { limit: 8 } }).then((raw) => raw.map(productOf)),
  topVendors: () => call<any[]>('/shops', () => M.VENDORS, { query: { sort: 'top', limit: 8 } }).then((items) => items.map(vendorOf)),
  vendor: (id: string) => call<any>(`/shops/${encodeURIComponent(id)}`, () => M.VENDORS[0] ? { ...M.VENDORS[0], id } : null).then((raw) => raw ? vendorOf(raw) : null),
  vendorProducts: (id: string) => call<any>(`/shops/${encodeURIComponent(id)}/products`, () => M.PRODUCTS.slice(0, 6), { query: { limit: 6, page: 1 } }).then((raw) => dataOf<any[]>(raw).map(productOf)),
  toggleLike: (id: string) => call(`/products/${encodeURIComponent(id)}/like`, ok, { method: 'POST' }),
};

export const shopApi = {
  list: () => call<any>('/shops/my-shops', () => M.SHOPS).then((raw) => dataOf<any[]>(raw).map(shopOf)),
  get: (id: string) => call<any>(`/shops/${encodeURIComponent(id)}`, () => M.SHOPS.find((s) => s.id === id) || null).then((raw) => raw ? shopOf(dataOf(raw)) : null),
  create: (b: Omit<T.Shop, 'id' | 'positive' | 'category'> & { minOffer: number }) => call('/shops', ok, { method: 'POST', body: b }),
  remove: (id: string) => call(`/shops/${encodeURIComponent(id)}`, ok, { method: 'DELETE' }),
  products: async (status: 'active' | 'sold') => {
    const rawShops = await call<any>('/shops/my-shops', () => M.SHOPS);
    const shops = dataOf<any[]>(rawShops);
    if (!isApiConfigured) return M.PRODUCTS.slice(0, 3).map((p) => ({ ...p, sold: status === 'sold', inStock: status !== 'sold' }));
    const lists = await Promise.all(shops.map((shop) => call<any>(`/shops/${encodeURIComponent(shop.id)}/products`, () => [], { query: { status: status.toUpperCase() } })));
    return lists.flatMap((items) => dataOf<any[]>(items).map(productOf));
  },
  addProduct: (b: unknown) => call('/me/products', ok, { method: 'POST', body: b }),
  promotions: () => call<any>('/account/promotions', () => M.PROMOTIONS).then((raw) => dataOf<T.Promotion[]>(raw)),
};

export const socialApi = {
  people: (kind: 'followers' | 'following') => call<any>(`/account/${kind}`, () => (kind === 'followers' ? M.FOLLOWERS : M.FOLLOWING)).then((raw) => dataOf<T.Person[]>(raw)),
  toggleFollow: (id: string) => call(`/users/${encodeURIComponent(id)}/follow`, ok, { method: 'POST' }),
  notifications: () => call<any>('/notifications', () => M.NOTICES).then((raw) => dataOf<T.Notice[]>(raw)),
  likes: () => call<any>('/account/likes', () => M.PRODUCTS.slice(0, 2).map((p) => ({ ...p, likes: 1 }))).then((raw) => dataOf<any[]>(raw).map(productOf)),
  conversations: () => call<any>('/conversations', () => M.CONVERSATIONS).then((raw) => dataOf<T.Conversation[]>(raw)),
  sendMessage: (cid: string, text: string) => call(`/conversations/${encodeURIComponent(cid)}/messages`, ok, { method: 'POST', body: { text } }),
  block: (cid: string) => call(`/users/${encodeURIComponent(cid)}/block`, ok, { method: 'POST' }),
  report: (cid: string) => call('/reports', ok, { method: 'POST', body: { targetId: cid } }),
  offers: (d: 'received' | 'sent') => call<any>('/offers', () => M.OFFERS.filter((o) => o.direction === d), { query: { direction: d } }).then((raw) => dataOf<T.Offer[]>(raw)),
  respondOffer: (id: string, action: 'accept' | 'decline' | 'cancel') => call(`/offers/${encodeURIComponent(id)}/${action === 'cancel' ? 'withdraw' : action}`, ok, { method: 'PATCH' }),
};

export const orderApi = {
  list: (role: 'buyer' | 'seller') => call<any>('/orders', () => M.ORDERS.filter((o) => o.role === role), { query: { role } }).then((raw) => dataOf<T.Order[]>(raw)),
  get: (id: string) => call<any>(`/orders/${encodeURIComponent(id)}`, () => M.ORDERS.find((o) => o.id === id) || null).then((raw) => raw ? dataOf<T.Order>(raw) : null),
  advance: (id: string) => call(`/me/orders/${encodeURIComponent(id)}/advance`, ok, { method: 'POST' }),
  releaseFunds: (id: string) => call(`/orders/${encodeURIComponent(id)}/release`, ok, { method: 'POST' }),
  dispute: (id: string, b: unknown) => call(`/orders/${encodeURIComponent(id)}/disputes`, ok, { method: 'POST', body: b }),
  disputeDetails: (id: string) => call<T.Dispute>(`/disputes/${encodeURIComponent(id)}`, () => M.DISPUTE),
  appeals: () => call<any>('/appeals', () => M.APPEALS).then((raw) => dataOf<T.Appeal[]>(raw)),
  sendAppealMessage: (id: string, text: string) => call(`/appeals/${encodeURIComponent(id)}/messages`, ok, { method: 'POST', body: { text } }),
  dissolveAppeal: (id: string) => call(`/appeals/${encodeURIComponent(id)}/dissolve`, ok, { method: 'PATCH' }),
};

export const walletApi = {
  get: async (): Promise<T.Wallet> => {
    if (!isApiConfigured) return call<T.Wallet>('/wallet', () => M.WALLET);
    const [walletResponse, transactionsResponse] = await Promise.all([
      call<any>('/wallet', () => M.WALLET),
      call<any>('/wallet/transactions', () => M.WALLET.transactions),
    ]);
    const wallet = dataOf<any>(walletResponse) || {};
    const rawTransactions = dataOf<any>(transactionsResponse);
    const rows: any[] = Array.isArray(rawTransactions) ? rawTransactions : rawTransactions?.items || [];
    const transactions: T.WalletTx[] = rows.map((transaction) => {
      const direction = String(transaction.direction || transaction.type || '').toUpperCase();
      const status = String(transaction.status || '').toUpperCase();
      return {
        id: transaction.id,
        date: transaction.createdAt || transaction.date || '',
        amount: Number(transaction.amount) || 0,
        type: direction.includes('CREDIT') || direction.includes('DEPOSIT') ? 'Deposit' : 'Withdraw',
        status: status.includes('SUCCESS') || status === 'COMPLETED' ? 'Successful' : status.includes('FAIL') ? 'Failed' : 'Pending',
      };
    });
    const total = (kind: 'Deposit' | 'Withdraw') => transactions.filter((transaction) => transaction.type === kind).reduce((sum, transaction) => sum + transaction.amount, 0);
    return {
      balance: Number(wallet.balance) || 0,
      incoming: Number(wallet.incoming ?? total('Deposit')) || 0,
      outgoing: Number(wallet.outgoing ?? total('Withdraw')) || 0,
      transactions,
    };
  },
  fund: (amount: number) => call<{ paymentUrl?: string }>('/wallet/fund', () => ({}), { method: 'POST', body: { amount } }),
  withdraw: (amount: number, accountId: string) => call('/wallet/withdraw', ok, { method: 'POST', body: { amount, bankAccountId: accountId } }),
  accounts: () => call<any>('/bank-accounts', () => M.ACCOUNTS).then((raw) => dataOf<T.Bank[]>(raw)),
  banks: () => call<any>('/banks', () => M.BANKS).then((raw) => dataOf<any[]>(raw).map((bank, i) => typeof bank === 'string' ? { id: bank, name: bank } : { id: bank.id || bank.bankId || String(i), name: bank.name || bank.bankName || '', code: bank.code })),
  resolveAccount: (bankId: string, accountNumber: string) => call<{ accountName: string }>('/bank-accounts/resolve', () => ({ accountName: 'OLUDAYO SOLOMON IDOWU' }), { method: 'POST', body: { bankId, accountNumber } }),
  addAccount: async (b: { bankId: string; accountNumber: string; accountName?: string }) => {
    const raw = await call<any>('/bank-accounts', () => ({ requiresOtp: false }), { method: 'POST', body: b });
    const result = dataOf<any>(raw);
    const id = result.id || result.bankAccount?.id || result.account?.id;
    return { requiresOtp: !!(result.requiresOtp || result.otpRequired), id };
  },
  confirmAccount: (id: string, code: string) => call(`/bank-accounts/${encodeURIComponent(id)}/verify`, ok, { method: 'POST', body: { code } }),
  removeAccount: (id: string) => call(`/bank-accounts/${encodeURIComponent(id)}`, ok, { method: 'DELETE' }),
};

export const accountApi = {
  saveProfile: (b: { name: string; email: string; phone: string }) => call('/account/profile', ok, { method: 'PATCH', body: { fullName: b.name, email: b.email, phone: b.phone } }),
  changePassword: (b: { current: string; next: string }) => call('/account/password', ok, { method: 'PATCH', body: { currentPassword: b.current, newPassword: b.next } }),
  saveNotifications: (b: unknown) => call('/account/notification-preferences', ok, { method: 'PATCH', body: b }),
  notificationPreferences: () => call<any>('/account/notification-preferences', () => ({})).then((raw) => dataOf(raw)),
  addresses: () => call<any>('/addresses', () => []).then((raw) => dataOf<any[]>(raw)),
  saveAddress: (id: string | undefined, b: unknown) => call(id ? `/addresses/${encodeURIComponent(id)}` : '/addresses', () => ok(), { method: id ? 'PATCH' : 'POST', body: b }),
};

export const dealApi = {
  buy: (productId: string) => call<{ orderId: string }>('/orders', () => ({ orderId: 'o2' }), { method: 'POST', body: { productId } }),
  makeOffer: (productId: string, amount: number) => call(`/products/${encodeURIComponent(productId)}/offers`, ok, { method: 'POST', body: { amount } }),
  follow: (vendorId: string) => call(`/vendors/${encodeURIComponent(vendorId)}/follow`, ok, { method: 'POST' }),
  revealPhone: (vendorId: string) => call<{ phone: string }>(`/vendors/${encodeURIComponent(vendorId)}/phone`, () => ({ phone: '08023414491' })),
  reportVendor: (vendorId: string, reason: string) => call(`/vendors/${encodeURIComponent(vendorId)}/report`, ok, { method: 'POST', body: { reason } }),
  feedback: (vendorId: string, text: string) => call(`/vendors/${encodeURIComponent(vendorId)}/feedback`, ok, { method: 'POST', body: { text } }),
};
