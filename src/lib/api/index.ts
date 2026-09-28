import { apiFetch, isApiConfigured } from './client';
export { ApiError, isApiConfigured } from './client';

/**
 * Endpoint modules. Each function calls the backend when NEXT_PUBLIC_API_BASE_URL is set,
 * otherwise returns mock data so the UI is fully usable before the backend exists.
 * Endpoint paths below are placeholders: adjust to your backend contract.
 */
export type Category = { id: string; name: string; slug: string };
export type Testimonial = { name: string; role?: string; quote: string };

const MOCK_TESTIMONIALS: Testimonial[] = [
  { name: 'Hannah', quote: 'Smooth experience from start to finish. I chatted directly with the seller, paid securely, and got my package within 3 days. Love it!' },
  { name: 'Steve M.', quote: 'I was a bit nervous at first, but the escrow system gave me peace of mind. My order arrived on time and exactly as described. Highly recommended!' },
  { name: 'Aisha T.', role: 'Lead designer', quote: 'What I loved most was the buyer protection. I had a small issue, but support resolved it quickly. I’ll definitely shop here again.' },
];

export const testimonialsApi = {
  list: async (): Promise<Testimonial[]> =>
    isApiConfigured ? apiFetch<Testimonial[]>('/testimonials') : MOCK_TESTIMONIALS,
};
export * from './auth';
export * from './resources';
