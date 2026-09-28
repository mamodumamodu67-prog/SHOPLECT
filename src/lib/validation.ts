/** Client-side validation helpers. The backend must re-validate everything. */
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 254;
export const isStrongPassword = (v: string) =>
  v.length >= 8 && /[a-z]/.test(v) && /[A-Z]/.test(v) && /\d/.test(v);
/** Strip control chars and trim; React already escapes output, this limits junk input. */
export const cleanText = (v: string, max = 500) =>
  v.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, max);
/** Only allow same-site relative redirects (prevents open-redirect after login). */
export const safeRedirect = (v: string | null | undefined, fallback = '/') =>
  v && v.startsWith('/') && !v.startsWith('//') && !v.includes('\\') ? v : fallback;
