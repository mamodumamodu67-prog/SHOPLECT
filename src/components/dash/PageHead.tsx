import Link from 'next/link';

export default function PageHead({ title, action }: { title: string; action?: { label: string; href?: string; onClick?: () => void } }) {
  return (
    <div className="dhead">
      <h1>{title}</h1>
      {action && (action.href ? <Link href={action.href} className="btn">{action.label}</Link> : <button className="btn" onClick={action.onClick}>{action.label}</button>)}
    </div>
  );
}
