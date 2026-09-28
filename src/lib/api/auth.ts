import { apiFetch, clearAccessToken, isApiConfigured, setAccessToken } from './client';
import { ME } from '../mock';
import type { User } from '../types';

const FLAG = 'shoplect_mock_session';
const mockOn = () => { try { sessionStorage.setItem(FLAG, '1'); } catch {} };
const mockOff = () => { try { sessionStorage.removeItem(FLAG); } catch {} };
const mockIs = () => { try { return sessionStorage.getItem(FLAG) === '1'; } catch { return false; } };

export type RegisterInput = { fullName: string; email: string; phone: string; password: string };
export type LoginInput = { email: string; password: string };

const wait = (ms = 500) => new Promise((r) => setTimeout(r, ms));

/**
 * Placeholder endpoints: change the paths to match your backend.
 * Sessions should be httpOnly cookies set by the server; the front end never stores tokens.
 */
export const authApi = {
  register: async (b: RegisterInput) =>
    isApiConfigured ? apiFetch<{ ok: true }>('/auth/register', { method: 'POST', body: b }) : (await wait(), { ok: true as const }),
  login: async (b: LoginInput) =>
    isApiConfigured
      ? apiFetch<{ accessToken: string; user: User }>('/auth/login', { method: 'POST', body: b }).then((r) => { setAccessToken(r.accessToken); return r; })
      : (await wait(), mockOn(), { ok: true as const }),
  me: async (): Promise<User | null> => {
    if (!isApiConfigured) return mockIs() ? ME : null;
    try {
      const user = await apiFetch<User & { avatarUrl?: string; fullName?: string }>('/user/me');
      return { ...user, name: user.name || user.fullName || '', avatar: user.avatar || user.avatarUrl };
    } catch { return null; }
  },
  logout: async () => { if (isApiConfigured) { try { await apiFetch('/auth/logout', { method: 'POST' }); } catch {} clearAccessToken(); } else mockOff(); },
  verify: async (b: { email: string; code: string }) =>
    isApiConfigured
      ? apiFetch<{ verified: boolean }>('/auth/otp/verify', { method: 'POST', body: { ...b, purpose: 'EMAIL_VERIFICATION' } })
      : (await wait(), mockOn(), { ok: true as const }), // mock mode accepts any 4-digit code
  resend: async (b: { email: string }) =>
    isApiConfigured ? apiFetch<{ ok: true }>('/auth/otp/resend', { method: 'POST', body: { ...b, purpose: 'EMAIL_VERIFICATION' } }) : (await wait(300), { ok: true as const }),
};
