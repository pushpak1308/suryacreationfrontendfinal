import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import MobileFilters from "../components/MobileFilters";

import "../styles/searchResults.css";

/* ===============================
   HELPERS
   =============================== */
const toSlug = (value = "") => value.toLowerCase().trim().replace(/\s+/g, "-");

const formatLabel = (slug = "") =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const SearchResults = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  /* ===============================
     QUERY PARAMS
     =============================== */
  const query = params.get("q")?.toLowerCase() || "";
  const occasion = params.get("occasion")?.toLowerCase() || "";
  const categoryParam = params.get("category")?.toLowerCase() || "";

  /* ===============================
     STATE
     =============================== */
  const [allProducts, setAllProducts] = useState([]); // RAW API
  const [products, setProducts] = useState([]); // URL-filtered
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: "",
    material: "",
    shape: "",
    size: "",
    maxPrice: 10000,
  });

  /* ===============================
     FETCH DATA (ONCE)
     =============================== */
  useEffect(() => {
    fetch("https://surya-creations.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => setAllProducts(data))
      .catch(console.error);
  }, []);

  /* ===============================
     APPLY URL FILTERS
     =============================== */
  useEffect(() => {
    let result = allProducts;

    if (query) {
      result = result.filter((p) => p.name.toLowerCase().includes(query));
    }

    if (occasion) {
      result = result.filter(
        (p) => p.occasion && p.occasion.toLowerCase() === occasion
      );
    }

    if (categoryParam) {
      result = result.filter(
        (p) => p.category && toSlug(p.category) === categoryParam
      );
    }

    setProducts(result);

    // Sync URL category into filter UI
    setFilters((prev) => ({
      ...prev,
      category: categoryParam || "",
    }));
  }, [allProducts, query, occasion, categoryParam]);

  /* ===============================
     UI FILTER LOGIC
     =============================== */
  const filteredProducts = products.filter((product) => {
    if (filters.category && toSlug(product.category) !== filters.category)
      return false;

    const minPrice = Math.min(...product.variants.map((v) => v.price));
    if (minPrice > filters.maxPrice) return false;

    return product.variants.some((v) => {
      if (filters.material && v.variantValue !== filters.material) return false;
      if (filters.shape && v.shape !== filters.shape) return false;
      if (filters.size && v.size !== filters.size) return false;
      return true;
    });
  });

  /* ===============================
     HEADING
     =============================== */
  const headingText = occasion
    ? `Gifts for ${formatLabel(occasion)}`
    : categoryParam
    ? `Category: ${formatLabel(categoryParam)}`
    : query
    ? `Results for “${query}”`
    : "All Products";

  return (
    <>
      <Navbar />

      <div className="search-page">
        {/* DESKTOP FILTERS */}
        <Filters
          products={products}
          filters={filters}
          setFilters={setFilters}
        />

        <div className="results">
          <SearchBar />

          <div className="mobile-filter-bar">
            <button onClick={() => setShowMobileFilters(true)}>Filters</button>
          </div>

          <h3>{headingText}</h3>

          <p className="result-count">
            {filteredProducts.length} products found
          </p>

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

          {filteredProducts.length === 0 && (
            <div className="empty-state">
              <p>No results found</p>
              <small>Try changing search terms or filters</small>
            </div>
          )}

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

        {/* MOBILE FILTERS */}
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
