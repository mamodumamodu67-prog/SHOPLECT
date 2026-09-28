export const SITE = {
  name: 'Shoplect',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.shoplect.com').replace(/\/+$/, ''),
  description:
    'Shoplect is a secure marketplace with escrow protection, built for small businesses and social vendors. Buy and sell with confidence.',
  supportEmail: 'Support@shoplect.com',
};

export const SOCIAL = {
  google: process.env.NEXT_PUBLIC_SOCIAL_GOOGLE || '',
  framer: process.env.NEXT_PUBLIC_SOCIAL_FRAMER || '',
  facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || '',
  whatsapp: process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP || '',
  youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || '',
};
