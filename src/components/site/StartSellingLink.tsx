'use client';
import Link from 'next/link';
import { DASH } from '@/lib/routes';

/**
 * Figma has one generic Register form and one generic Dashboard — there's no separate "seller" account.
 * "Start Selling" / "Sell" always lead to the same place a seller actually needs: the Create a Shop step.
 * - Already signed in -> straight to Create a Shop.
 * - Not signed in -> register, then verify, then land on Create a Shop instead of the marketplace.
 */
export default function StartSellingLink({ className, children }: { className?: string; children: React.ReactNode }) {
  return <Link href={DASH.root} className={className}>{children}</Link>;
}
