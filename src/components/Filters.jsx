const Filters = ({ products, filters, setFilters }) => {
  const categories = [...new Set(products.map((p) => p.category))];

  const materials = [
    ...new Set(products.flatMap((p) => p.variants.map((v) => v.variantValue))),
  ];

  const shapes = [
    ...new Set(products.flatMap((p) => p.variants.map((v) => v.shape))),
  ];

  const sizes = [
    ...new Set(products.flatMap((p) => p.variants.map((v) => v.size))),
  ];

  return (
    <aside className="filters">
      <h4>Filters</h4>

      <label>Category</label>
      <select
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
      >
        <option value="">All</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

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
