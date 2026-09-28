/** Holds the email between register -> verify. Not a secret; cleared on success. */
const KEY = 'shoplect_pending_email';
export const setPendingEmail = (e: string) => { try { sessionStorage.setItem(KEY, e); } catch {} };
export const getPendingEmail = () => { try { return sessionStorage.getItem(KEY) || ''; } catch { return ''; } };
export const clearPendingEmail = () => { try { sessionStorage.removeItem(KEY); } catch {} };

/** Where to send the person once they finish verifying (e.g. straight to "Create a shop"). Cleared after use. */
const REDIRECT_KEY = 'shoplect_post_auth_redirect';
export const setPostAuthRedirect = (path: string) => { try { sessionStorage.setItem(REDIRECT_KEY, path); } catch {} };
export const takePostAuthRedirect = (fallback: string) => {
  try {
    const v = sessionStorage.getItem(REDIRECT_KEY);
    if (v) sessionStorage.removeItem(REDIRECT_KEY);
    return v || fallback;
  } catch { return fallback; }
};
