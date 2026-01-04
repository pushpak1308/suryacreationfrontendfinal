import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import MobileFilters from "../components/MobileFilters";

import "../styles/searchResults.css";

const SearchResults = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const query = params.get("q")?.toLowerCase() || "";

  const [products, setProducts] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: "",
    material: "",
    shape: "",
    size: "",
    maxPrice: 10000,
  });

  /* ===============================
     FETCH + SEARCH (DEBOUNCED)
     =============================== */
  useEffect(() => {
    const timer = setTimeout(() => {
      fetch("https://surya-creations.onrender.com/api/products")
        .then((res) => res.json())
        .then((data) => {
          const searched = data.filter((p) =>
            p.name.toLowerCase().includes(query)
          );
          setProducts(searched);
        })
        .catch(console.error);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  /* ===============================
     FILTER LOGIC
     =============================== */
  const filteredProducts = products.filter((product) => {
    // Category
    if (filters.category && product.category !== filters.category) return false;

    // Min price from variants
    const minPrice = Math.min(...product.variants.map((v) => v.price));
    if (minPrice > filters.maxPrice) return false;

    // Variant-level filters
    return product.variants.some((v) => {
      if (filters.material && v.variantValue !== filters.material) return false;
      if (filters.shape && v.shape !== filters.shape) return false;
      if (filters.size && v.size !== filters.size) return false;
      return true;
    });
  });

  return (
    <>
      {/* ✅ NAVBAR ONLY ON SEARCH PAGE */}
      <Navbar />

      <div className="search-page">
        {/* DESKTOP FILTERS */}
        <Filters
          products={products}
          filters={filters}
          setFilters={setFilters}
        />

        {/* RESULTS */}
        <div className="results">
          {/* SEARCH BAR */}
          <SearchBar />

          {/* MOBILE FILTER BUTTON */}
          <div className="mobile-filter-bar">
            <button onClick={() => setShowMobileFilters(true)}>Filters</button>
          </div>

          <h3>Results for “{query}”</h3>

          {/* RESULT COUNT */}
          <p className="result-count">
            {filteredProducts.length} products found
          </p>

          {/* ACTIVE FILTER CHIPS */}
          <div className="active-filters">
            {Object.entries(filters).map(([key, value]) =>
              value && key !== "maxPrice" ? (
                <span
                  key={key}
                  onClick={() => setFilters({ ...filters, [key]: "" })}
                >
                  {key}: {value} ✕
                </span>
              ) : null
            )}
          </div>

          {/* EMPTY STATE */}
          {filteredProducts.length === 0 && (
            <div className="empty-state">
              <p>No results found</p>
              <small>Try changing search terms or removing filters</small>
            </div>
          )}

          {/* PRODUCT GRID */}
          <div className="product-grid">
            {filteredProducts.map((p) => {
              const minPrice = Math.min(...p.variants.map((v) => v.price));

              return (
                <div
                  key={p.id}
                  className="product-card"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  <div className="product-image-wrapper">
                    <img src={p.imageUrl} alt={p.name} />
                  </div>

                  <div className="product-info">
                    <h4>{p.name}</h4>
                    <p>From ₹{minPrice}</p>
                    <span className="category-chip">{p.category}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE FILTER DRAWER */}
        <MobileFilters
          open={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
          products={products}
          filters={filters}
          setFilters={setFilters}
        />
      </div>
    </>
  );
};

export default SearchResults;
