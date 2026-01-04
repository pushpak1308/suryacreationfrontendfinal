import { useEffect, useState } from "react";
import { getAllProducts } from "../services/ProductService";
import { useNavigate } from "react-router-dom";
import "../styles/featuredProducts.css";

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts()
      .then((data) => {
        setProducts(data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="featured-section">
        <p style={{ textAlign: "center" }}>Loading products...</p>
      </section>
    );
  }

  return (
    <section className="featured-section">
      <div className="featured-header">
        <div>Best Sellers</div>
        <p>Handpicked favorites our customers adore</p>
      </div>

      <div className="featured-row">
        {products.slice(0, 6).map((product) => (
          <div
            className="featured-card"
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <div className="featured-img-wrap">
              <img src={product.imageUrl} alt={product.name} loading="lazy" />
            </div>

            <div className="featured-info">
              <h3>{product.name}</h3>
              <p className="featured-category">{product.category}</p>

              {product.variants?.length > 0 && (
                <p className="featured-price">₹{product.variants[0].price}</p>
              )}

              <button
                className="featured-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/product/${product.id}`);
                }}
              >
                View Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
