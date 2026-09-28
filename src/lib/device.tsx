'use client';
import { createContext, useContext, useEffect, useState } from 'react';

/**
 * One design, generated for every screen.
 * Classifies the live viewport and mirrors it onto <html> as data attributes, so CSS *and* components can react:
 *   data-device       mobile | tablet | laptop | desktop | wide
 *   data-tier         xs (≤359) · sm (360-479) · md (480-767) · lg (768-1023) · xl (1024-1279) · 2xl (1280-1439) · 3xl (1440-1919) · 4xl (≥1920)
 *   data-orientation  portrait | landscape
 *   data-input        touch | mouse
 *   data-short        true when a landscape phone / very short window (height ≤ 500)
 * The first paint is always correct because layout is driven by CSS media queries; this only adds behaviour.
 */
export type Device = 'mobile' | 'tablet' | 'laptop' | 'desktop' | 'wide';
export type Tier = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
export type Viewport = { width: number; height: number; device: Device; tier: Tier; orientation: 'portrait' | 'landscape'; touch: boolean; short: boolean };

export function classify(width: number, height: number, touch: boolean): Viewport {
  const tier: Tier = width <= 359 ? 'xs' : width <= 479 ? 'sm' : width <= 767 ? 'md' : width <= 1023 ? 'lg' : width <= 1279 ? 'xl' : width <= 1439 ? '2xl' : width <= 1919 ? '3xl' : '4xl';
  const device: Device = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : width < 1440 ? 'laptop' : width < 1920 ? 'desktop' : 'wide';
  return { width, height, tier, device, touch, orientation: width > height ? 'landscape' : 'portrait', short: height <= 500 && width > height };
}

const DEFAULT: Viewport = classify(1440, 900, false);
const Ctx = createContext<Viewport>(DEFAULT);
export const useDevice = () => useContext(Ctx);

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [vp, setVp] = useState<Viewport>(DEFAULT);
  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)');
    let raf = 0;
    const apply = () => {
      const v = classify(window.innerWidth, window.innerHeight, coarse.matches);
      const el = document.documentElement;
      el.dataset.device = v.device; el.dataset.tier = v.tier; el.dataset.orientation = v.orientation;
      el.dataset.input = v.touch ? 'touch' : 'mouse'; el.dataset.short = String(v.short);
      el.style.setProperty('--vh', `${window.innerHeight * 0.01}px`); // real height on mobile browsers with collapsing bars
      setVp((p) => (p.width === v.width && p.height === v.height && p.touch === v.touch ? p : v));
    };
    const onResize = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(apply); };
    apply();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    coarse.addEventListener?.('change', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); window.removeEventListener('orientationchange', onResize); coarse.removeEventListener?.('change', onResize); };
  }, []);
  return <Ctx.Provider value={vp}>{children}</Ctx.Provider>;
}

/** Render a different view per device class. Falls back downward: wide→desktop→laptop→tablet→mobile. */
export function Responsive({ mobile, tablet, laptop, desktop, wide }: { mobile?: React.ReactNode; tablet?: React.ReactNode; laptop?: React.ReactNode; desktop?: React.ReactNode; wide?: React.ReactNode }) {
  const { device } = useDevice();
  const order: Device[] = ['wide', 'desktop', 'laptop', 'tablet', 'mobile'];
  const views: Record<Device, React.ReactNode | undefined> = { mobile, tablet, laptop, desktop, wide };
  for (const d of order.slice(order.indexOf(device))) if (views[d] !== undefined) return <>{views[d]}</>;
  return <>{mobile ?? tablet ?? laptop ?? desktop ?? wide}</>;
}
