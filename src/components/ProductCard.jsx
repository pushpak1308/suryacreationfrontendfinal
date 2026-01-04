import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product.slug}`)}
    >
      <img src={product.imageUrl} alt={product.name} />
      <h4>{product.name}</h4>
      <p>₹{product.basePrice}</p>
    </div>
  );
};

export default ProductCard;
