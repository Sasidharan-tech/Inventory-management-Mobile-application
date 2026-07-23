import { FiFilter, FiSearch } from 'react-icons/fi';

export default function SearchBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  categories = []
}) {
  return (
    <div className="surface grid gap-2.5 p-3.5 sm:p-4">
      <div className="relative">
        <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="input-shell pl-10 text-sm"
          placeholder="Search by name, category, or ID..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <FiFilter className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <select
            className="input-shell pl-9 text-xs cursor-pointer"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <select
          className="input-shell text-xs cursor-pointer"
          value={`${sortBy}-${sortOrder}`}
          onChange={(event) => {
            const [by, order] = event.target.value.split('-');
            onSortByChange(by);
            onSortOrderChange(order);
          }}
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="price-desc">Price (High → Low)</option>
          <option value="price-asc">Price (Low → High)</option>
          <option value="quantity-desc">Stock (High → Low)</option>
          <option value="quantity-asc">Stock (Low → High)</option>
        </select>
      </div>
    </div>
  );
}
