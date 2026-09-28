/**
 * Single entry point for every backend call.
 * Point it at your backend by setting NEXT_PUBLIC_API_BASE_URL. Nothing else changes.
 * - Cookies (httpOnly session) are sent with credentials: 'include'
 * - CSRF: double-submit token read from the `csrf_token` cookie -> X-CSRF-Token header
 * - Timeouts, JSON parsing and typed errors are handled here
 */
const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '');
const browserBase = '/api/backend';
const TOKEN_KEY = 'shoplect_access_token';

export const isApiConfigured = BASE.length > 0;

export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

type Opts = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  timeoutMs?: number;
};

function readCookie(name: string) {
  if (typeof document === 'undefined') return '';
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : '';
}

export function setAccessToken(token: string) {
  try { localStorage.setItem(TOKEN_KEY, token); } catch {}
}

export function clearAccessToken() {
  try { localStorage.removeItem(TOKEN_KEY); } catch {}
}

function readAccessToken() {
  try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; }
}

export async function apiFetch<T>(path: string, opts: Opts = {}): Promise<T> {
  if (!isApiConfigured) throw new ApiError(0, 'API base URL is not configured');
  if (!path.startsWith('/')) throw new Error('API path must start with "/"');

  const { method = 'GET', body, query, signal, timeoutMs = 15000 } = opts;
  const requestBase = typeof window === 'undefined' ? BASE : browserBase;
  const url = requestBase.startsWith('/') ? new URL(requestBase + path, window.location.origin) : new URL(requestBase + path);
  Object.entries(query || {}).forEach(([k, v]) => v !== undefined && url.searchParams.set(k, String(v)));

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  signal?.addEventListener('abort', () => ctrl.abort());

  const headers: Record<string, string> = { Accept: 'application/json' };
  const token = readAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json';
  if (method !== 'GET') {
    const csrf = readCookie('csrf_token');
    if (csrf) headers['X-CSRF-Token'] = csrf;
  }

  try {
    const res = await fetch(url, {
      method,
      headers,
      credentials: 'include',
      signal: ctrl.signal,
      body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
    });
    const data = res.status === 204 ? null : await res.json().catch(() => null);
    if (!res.ok) throw new ApiError(res.status, (data as any)?.message || res.statusText, data);
    return data as T;
  } finally {
    clearTimeout(timer);
  }
}
