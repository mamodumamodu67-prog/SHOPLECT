import type { Metadata } from 'next';
import SiteShell from '@/components/site/SiteShell';
import CategoryPanel from '@/components/site/CategoryPanel';
import ProductCard from '@/components/site/ProductCard';
import SortSelect from '@/components/site/SortSelect';
import { EmptyState } from '@/components/ui/bits';
import { catalogApi } from '@/lib/api';
export const metadata: Metadata = { title: 'Search products', robots: { index: false, follow: true } };

const PRESETS = [['Under 60k', '', '60000'], ['60 - 150k', '60000', '150000'], ['150 - 300k', '150000', '300000'], ['Above 300k', '300000', '']] as const;

export default async function SearchPage() {
  const q: string = '', category: string = '', sort: string = '';
  const min = undefined, max = undefined;
  const [categories, res] = await Promise.all([catalogApi.categories(), catalogApi.search({ q, category, min, max, sort })]);

  return (
    <SiteShell query={q}>
      <div className="wrap">
        <form method="get" className="search-layout">
          {q && <input type="hidden" name="q" value={q} />}
          {category && <input type="hidden" name="category" value={category} />}
          <aside className="filters" aria-label="Filters">
            <CategoryPanel categories={categories} active={category} />
            <div className="card filter-card">
              <h3>Price(NGN) <button className="link-btn" type="submit">Apply</button></h3>
              <div className="pair">
                <input className="f-input" name="min" inputMode="numeric" placeholder="Min" defaultValue={min ?? ''} aria-label="Minimum price" />
                <input className="f-input" name="max" inputMode="numeric" placeholder="Max" defaultValue={max ?? ''} aria-label="Maximum price" />
              </div>
              {PRESETS.map(([label, lo, hi]) => (
                <a key={label} className="f-radio" href={`?${new URLSearchParams({ ...(q && { q }), ...(category && { category }), ...(lo && { min: lo }), ...(hi && { max: hi }) })}`}>
                  <input type="radio" readOnly tabIndex={-1} checked={String(min ?? '') === lo && String(max ?? '') === hi} aria-hidden="true" />{label}
                </a>
              ))}
            </div>
          </aside>

          <section aria-label="Search results">
            <p style={{ fontSize: 18, padding: 12 }} aria-live="polite">
              <b style={{ fontWeight: 500 }}>{res.total} results</b>{q ? <> for {q}</> : null} within your location
            </p>
            <div className="spread" style={{ padding: '0 12px 16px' }}>
              <div className="chips"><span className="chip-select" style={{ display: 'inline-flex', alignItems: 'center', paddingRight: 8 }}>All Brand</span><span className="chip-select" style={{ display: 'inline-flex', alignItems: 'center', paddingRight: 8 }}>All Vendors</span></div>
              <SortSelect defaultValue={sort} />
            </div>
            {res.items.length ? (
              <div className="pgrid">{res.items.map((p) => <ProductCard key={p.id} p={p} />)}</div>
            ) : <EmptyState title="No results" text="Try a different keyword or remove some filters." />}
          </section>
        </form>
      </div>
    </SiteShell>
  );
}
