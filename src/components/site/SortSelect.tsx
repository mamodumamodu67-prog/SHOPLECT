'use client';
export default function SortSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <select name="sort" className="chip-select" defaultValue={defaultValue} aria-label="Sort results" onChange={(e) => e.currentTarget.form?.requestSubmit()}>
      <option value="">Sort: Best Match</option>
      <option value="price-asc">Sort: Price low to high</option>
      <option value="price-desc">Sort: Price high to low</option>
    </select>
  );
}
