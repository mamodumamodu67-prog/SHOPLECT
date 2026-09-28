import Link from 'next/link';
import Icon from './Icon';

export function ProductImage({ src, alt = '', className = '' }: { src?: string; alt?: string; className?: string }) {
  // Product photos come from the backend. Until then a neutral placeholder is shown.
  return src ? <img className={`pimg ${className}`} src={src} alt={alt} loading="lazy" /> : <div className={`pimg ph ${className}`} role="img" aria-label={alt || 'No image'}><Icon name="camera" size={36} strokeWidth={1.2} /></div>;
}

const TONE: Record<string, string> = {
  Delivered: 'ok', Successful: 'ok', Active: 'ok', Completed: 'ok', 'In Stock': 'ok',
  Pending: 'warn', 'Under Review': 'warn', Ongoing: 'warn',
  Cancelled: 'bad', Failed: 'bad', Declined: 'bad', Disputed: 'bad', Sold: 'bad',
  'In Escrow': 'info',
};
export const StatusBadge = ({ status }: { status: string }) => <span className={`badge ${TONE[status] || 'info'}`}>{status}</span>;

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: { label: string; href: string } }) {
  return (
    <div className="empty">
      <h2>{title}</h2>
      {text && <p>{text}</p>}
      {action && <Link href={action.href} className="btn">{action.label}</Link>}
    </div>
  );
}

export const Loading = () => <p className="muted center" role="status" style={{ padding: 40 }}>Loading…</p>;
export const ErrorNote = ({ msg }: { msg: string }) => <p className="err-note" role="alert">{msg}</p>;

export function Tabs<T extends string>({ tabs, value, onChange, label }: { tabs: readonly T[]; value: T; onChange: (t: T) => void; label: string }) {
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {tabs.map((t) => <button key={t} role="tab" aria-selected={value === t} className={value === t ? 'on' : ''} onClick={() => onChange(t)}>{t}</button>)}
    </div>
  );
}
