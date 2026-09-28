import type * as T from './types';

export const CATEGORIES: T.Category[] = [
  { slug: 'electronics', name: 'Electronics', icon: 'electronics' },
  { slug: 'mobile-phones-tablets', name: 'Mobile Phones & Tablets', icon: 'phone' },
  { slug: 'health-beauty', name: 'Health Beauty', icon: 'health' },
  { slug: 'furnitures', name: 'Furnitures', icon: 'furniture' },
  { slug: 'gaming', name: 'Gaming', icon: 'gaming' },
  { slug: 'baby-products', name: 'Baby Products', icon: 'baby' },
  { slug: 'home-appliances', name: 'Home Appliances', icon: 'home' },
  { slug: 'musical-instruments', name: 'Musical Instruments', icon: 'music' },
];

/** Image tiles on the buyer home page (Figma "sub category"). */
export const SUBCATEGORIES = [
  { name: 'Gadgets', image: '/assets/sub-gadgets.png' }, { name: 'Appliances', image: '/assets/sub-appliances.png' },
  { name: 'Fashion', image: '/assets/sub-fashion.png' }, { name: 'Home & Office', image: '/assets/sub-home-office.png' },
  { name: 'Accessories', image: '/assets/sub-accessories.png' }, { name: 'Wristwatches', image: '/assets/sub-wristwatches.png' },
  { name: 'Sneakers', image: '/assets/sub-sneakers.png' }, { name: 'Gaming', image: '/assets/sub-gaming.png' },
];

const seller: T.Seller = { id: 'v1', name: 'usernameislong', positive: 56 };
const IMG = { starlink: '/assets/prod-starlink.png', iphone: '/assets/prod-iphone.png', lamp: '/assets/prod-lamp.png', laptop: '/assets/prod-laptop.png' };
const mk = (id: string, title: string, price: number, category: string, image: string, extra: Partial<T.Product> = {}): T.Product => ({
  id, title, price, category, image, images: [image], seller, condition: 'New', likes: 0, views: 1000, inStock: true,
  description: 'Lorem ipsum dolor sit amet consectetur. Molestie nisi amet ligula arcu. Etiam.',
  blurb: 'Lorem ipsum dolor sit amet consectetur. Molestie nisi amet ligula arcu. Etiam.', ...extra,
});

const STARLINK = 'Starlink Mini Kit - High Speed Internet Network - White';
const IPHONE = 'Iphone 12 pro 128G 5G | Good Condition and very clean...';
export const PRODUCTS: T.Product[] = [
  mk('p1', STARLINK, 318000, 'electronics', IMG.starlink),
  mk('p2', IPHONE, 320000, 'mobile-phones-tablets', IMG.iphone),
  mk('p3', 'Modern wooden table lamp with white shade', 45000, 'home-appliances', IMG.lamp, { likes: 2 }),
  mk('p4', 'MacBook Pro 14-inch M1 | Clean UK used', 1250000, 'electronics', IMG.laptop),
  mk('p5', IPHONE, 320000, 'mobile-phones-tablets', IMG.iphone),
  mk('p6', 'MacBook Pro 14-inch M1 | Clean UK used', 1250000, 'electronics', IMG.laptop),
  mk('p7', STARLINK, 318000, 'electronics', IMG.starlink),
  mk('p8', 'Modern wooden table lamp with white shade', 45000, 'home-appliances', IMG.lamp, { likes: 2 }),
  mk('p9', 'Digital baby monitor with night vision', 58000, 'baby-products', IMG.iphone),
  mk('p10', 'Yamaha acoustic guitar', 120000, 'musical-instruments', IMG.lamp),
  mk('p11', 'Air fryer 6L stainless steel', 75000, 'home-appliances', IMG.laptop),
  mk('p12', 'Vitamin C serum set', 18500, 'health-beauty', IMG.starlink),
];

export const VENDORS: T.Vendor[] = [1, 2, 3, 4].map((i) => ({
  id: `v${i}`, name: 'Chisom Ventures', location: 'Wuse 1, Abuja', lastSeen: '3 hours ago', verified: true, phone: '08023XXXXXX', positive: 56, avatar: '/assets/vendor-avatar.png',
}));

export const SHOPS: T.Shop[] = [
  { id: 's1', name: 'The Enterprises', category: 'Gaming Gadget Store', description: 'Gaming gadgets and accessories.', positive: 56, phone: '08023414491', address: 'No 12, Abuja, Wuse' },
  { id: 's2', name: 'Theo Enterprises', category: 'Gaming Gadget Store', description: 'Console and PC gaming.', positive: 56, phone: '08023414491', address: 'No 4, Garki, Abuja' },
];

const D = (d: number) => new Date(2025, 8, d, 11, 30).toISOString();
export const ORDERS: T.Order[] = [
  { id: 'o1', orderNo: '1245787783', title: 'Starlink Mini Kit - High Speed Internet Network - White', status: 'Delivered', date: D(25), role: 'buyer', stage: 6, amount: 318000 },
  { id: 'o2', orderNo: '1245787783', title: 'Starlink Mini Kit - High Speed Internet Network - White', status: 'In Escrow', date: D(25), role: 'buyer', stage: 2, amount: 318000 },
  { id: 'o3', orderNo: '1245787783', title: 'Starlink Mini Kit - High Speed Internet Network - White', status: 'Pending', date: D(25), role: 'buyer', stage: 1, amount: 318000 },
  { id: 'o4', orderNo: '1245787783', title: 'Starlink Mini Kit - High Speed Internet Network - White', status: 'Disputed', date: D(25), role: 'buyer', stage: 6, amount: 318000 },
  { id: 'o5', orderNo: '1245787783', title: 'Starlink Mini Kit - High Speed Internet Network - White', status: 'Cancelled', date: D(25), role: 'buyer', stage: 0, amount: 318000 },
  { id: 'o6', orderNo: '1245787790', title: 'Iphone 12 pro 128G 5G | Good Condition and very clean...', status: 'Pending', date: D(26), role: 'seller', stage: 0, amount: 320000 },
  { id: 'o7', orderNo: '1245787791', title: 'PlayStation 5 Slim Console with extra controller', status: 'In Escrow', date: D(24), role: 'seller', stage: 2, amount: 690000 },
];

export const OFFERS: T.Offer[] = [
  { id: 'f1', title: 'Starlink Mini Kit - High Speed Internet Network - White', date: D(25), amount: 300000, listPrice: 318000, direction: 'received', from: 'Eden Finn' },
  { id: 'f2', title: 'Starlink Mini Kit - High Speed Internet Network - White', date: D(25), amount: 290000, listPrice: 318000, direction: 'received', from: 'Ethan Morire' },
  { id: 'f3', title: 'Starlink Mini Kit - High Speed Internet Network - White', date: D(25), amount: 300000, listPrice: 318000, direction: 'sent', from: 'You' },
  { id: 'f4', title: 'Starlink Mini Kit - High Speed Internet Network - White', date: D(25), amount: 295000, listPrice: 318000, direction: 'sent', from: 'You' },
];

export const NOTICES: T.Notice[] = [1, 2, 3, 4, 5].map((i) => ({ id: `n${i}`, text: 'New Message', href: '/dashboard/inbox' }));

export const FOLLOWERS: T.Person[] = [1, 2].map((i) => ({ id: `fr${i}`, name: 'Eden Finn', when: 'Followed you 12 hours ago', following: false }));
export const FOLLOWING: T.Person[] = [1, 2].map((i) => ({ id: `fg${i}`, name: 'Eden Finn', when: 'You followed 12 hours ago', following: true }));

export const WALLET: T.Wallet = {
  balance: 0, incoming: 0, outgoing: 0,
  transactions: [
    { id: 't1', date: D(29), amount: 3000000, type: 'Withdraw', status: 'Successful' },
    { id: 't2', date: D(29), amount: 3000000, type: 'Deposit', status: 'Failed' },
    { id: 't3', date: D(29), amount: 3000000, type: 'Deposit', status: 'Pending' },
    { id: 't4', date: D(29), amount: 3000000, type: 'Deposit', status: 'Pending' },
    { id: 't5', date: D(29), amount: 3000000, type: 'Deposit', status: 'Pending' },
  ],
};

export const BANKS = ['Access Bank', 'First Bank', 'GTBank', 'Kuda', 'Opay', 'Paycom', 'Sterling Bank', 'UBA', 'Union Bank', 'Wema Bank', 'Zenith Bank'];
export const ACCOUNTS: T.Bank[] = [{ id: 'b1', accountName: 'Oludayo Solomon Idowu', accountNumber: '8023414491', bankName: 'Paycom' }];

export const CONVERSATIONS: T.Conversation[] = [
  { id: 'c1', name: 'Ethan Morire', date: '27/09/2025', active: true, messages: [
    { id: 'm1', from: 'me', text: 'Hi! Are you interested?', when: 'in less than a minute' },
    { id: 'm2', from: 'them', text: 'Hello', when: '7 days ago' } ] },
  { id: 'c2', name: 'Ethan Morire', date: '27/09/2025', active: false, messages: [] },
  { id: 'c3', name: 'Ethan Morire', date: '27/09/2025', active: false, messages: [] },
];

const st = ['Active', 'Active', 'Active', 'Active', 'Under Review', 'Under Review', 'Declined', 'Declined', 'Completed', 'Completed'] as const;
export const PROMOTIONS: T.Promotion[] = st.map((s, i) => ({ id: `pr${i}`, created: D(28), product: 'Lexus es350', category: 'Gadgets', status: s, start: '2025-10-01', end: '2025-10-01' }));

export const DISPUTE: T.Dispute = {
  ticketId: '000000000000000000', questionType: 'Fund released but product not as described',
  steps: [
    { title: 'Dispute Submitted', when: '10: 25PM, 12/09/25' },
    { title: 'Vendor Contacted', when: '10: 25PM, 12/09/25' },
    { title: 'Dispute in Progress', when: '10: 25PM, 12/09/25' },
    { title: 'Confirmed by Vendor', when: '10: 25PM, 12/09/25', note: 'Lorem ipsum dolor sit amet consectetur. Integer ornare quis pellentesque egestas. Proin enim penatibus gravida' },
  ],
};

export const APPEALS: T.Appeal[] = [
  { id: 'a1', title: 'Product Releases but not as Described...', status: 'Completed', messages: [] },
  { id: 'a2', title: 'Product Releases but not as Described...', status: 'Ongoing', messages: [] },
  { id: 'a3', title: 'Transaction Dispute Appeal', status: 'Ongoing', messages: [
    { id: 'am1', from: 'them', author: 'Admin', text: 'Hi! Are you interested?', when: 'in less than a minute' },
    { id: 'am2', from: 'me', author: 'Jane(Seller)', text: 'Hello', when: '7 days ago' } ] },
];

export const ME: T.User = { name: 'Jane Scott', email: 'Janescott@gmail.com', phone: '+234 802 3414 491', avatar: '/assets/dash-avatar.png' };
