const Filters = ({ products, filters, setFilters }) => {
  /* ===============================
     SAFE UNIQUE HELPERS
     =============================== */
  const unique = (arr) => [...new Set(arr.filter(Boolean))];

  /* ===============================
     CATEGORY (slug based)
     =============================== */
  const categories = unique(products.map((p) => p.category?.toLowerCase()));

  /* ===============================
     VARIANT-LEVEL FILTERS
     =============================== */
  const materials = unique(
    products.flatMap((p) => p.variants.map((v) => v.variantValue))
  );

  const shapes = unique(
    products.flatMap((p) => p.variants.map((v) => v.shape))
  );

  const sizes = unique(products.flatMap((p) => p.variants.map((v) => v.size)));

  /* ===============================
     UI LABEL FORMATTER
     =============================== */
  const formatLabel = (text) =>
    text.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <aside className="filters">
      <h4>Filters</h4>

      {/* CATEGORY */}
      <label>Category</label>
      <select
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
      >
        <option value="">All</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {formatLabel(c)}
          </option>
        ))}
      </select>

      {/* MATERIAL */}
      <label>Material</label>
      <select
        value={filters.material}
        onChange={(e) => setFilters({ ...filters, material: e.target.value })}
      >
        <option value="">All</option>
        {materials.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      {/* SHAPE */}
      <label>Shape</label>
      <select
        value={filters.shape}
        onChange={(e) => setFilters({ ...filters, shape: e.target.value })}
      >
        <option value="">All</option>
        {shapes.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* SIZE */}
      <label>Size</label>
      <select
        value={filters.size}
        onChange={(e) => setFilters({ ...filters, size: e.target.value })}
      >
        <option value="">All</option>
        {sizes.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* PRICE */}
      <label>Max Price: ₹{filters.maxPrice}</label>
      <input
        type="range"
        min="100"
        max="10000"
        value={filters.maxPrice}
        onChange={(e) =>
          setFilters({
            ...filters,
            maxPrice: Number(e.target.value),
          })
        }
      />
    </aside>
  );
};

export default Filters;
