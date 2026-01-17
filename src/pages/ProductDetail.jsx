import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cartUtils";
import Navbar from "../components/Navbar";
import "../styles/productDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const [selected, setSelected] = useState({
    variantValue: "",
    shape: "",
    size: "",
  });

  const [cartQty, setCartQty] = useState(1);
  const [price, setPrice] = useState(0);
  const [customImages] = useState([]);


  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    fetch(`https://surya-creations.onrender.com/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);

        const v = data.variants[0];

        setSelected({
          variantValue: v.variantValue,
          shape: v.shape,
          size: v.size,
        });

        setPrice(v.price);

        const initialQty =
          data.enforceMinQuantity && data.minOrderQuantity
            ? data.minOrderQuantity
            : 1;

        setCartQty(initialQty);
      });
  }, [id]);

  if (!product) return <p>Loading...</p>;

  /* ================= VARIANT GROUPING ================= */

  const variantsGroupedByType = product.variants.reduce((acc, v) => {
    if (!acc[v.variantType]) acc[v.variantType] = [];
    acc[v.variantType].push(v);
    return acc;
  }, {});

  const variantsByValue = product.variants.filter(
    (v) => v.variantValue === selected.variantValue
  );

  const availableShapes = [...new Set(variantsByValue.map((v) => v.shape))];

  const availableSizes = [
    ...new Set(
      variantsByValue
        .filter((v) => v.shape === selected.shape)
        .map((v) => v.size)
    ),
  ];

    /* ================= SELECTION HANDLERS ================= */
    

  const selectVariantValue = (value) => {
    const first = product.variants.find((v) => v.variantValue === value);

    if (!first) return;

    setSelected({
      variantValue: first.variantValue,
      shape: first.shape,
      size: first.size,
    });

    setPrice(first.price);

    setCartQty(
      product.enforceMinQuantity && product.minOrderQuantity
        ? product.minOrderQuantity
        : 1
    );
  };

  const selectOption = (field, value) => {
    let updated = { ...selected, [field]: value };

    if (field === "shape") {
      const first = variantsByValue.find((v) => v.shape === value);
      updated = { ...updated, size: first.size };
    }

    const match = product.variants.find(
      (v) =>
        v.variantValue === updated.variantValue &&
        v.shape === updated.shape &&
        v.size === updated.size
    );

    if (match) {
      setSelected({
        variantValue: match.variantValue,
        shape: match.shape,
        size: match.size,
      });
      setPrice(match.price);
    }
  };

  /* ================= MOQ ================= */

  const minQty = product.enforceMinQuantity ? product.minOrderQuantity : 1;

  const canProceed = cartQty >= minQty;

  /* ================= CART ================= */

  const handleAddToCart = () => {
    if (!canProceed) {
      alert(`Minimum order quantity is ${minQty}`);
      return;
    }

    addToCart({
      productId: product.id,
      productName: product.name,
      image: product.imageUrl,
      variant: {
        value: selected.variantValue,
        shape: selected.shape,
        size: selected.size,
      },
      price,
      cartQty,
      customImages,
      enforceMinQuantity: product.enforceMinQuantity,
      minOrderQuantity: product.minOrderQuantity,
    });

    window.dispatchEvent(new Event("storage"));
    alert("Added to cart");
  };

  const handleBuyNow = () => {
    if (!canProceed) {
      alert(`Minimum order quantity is ${minQty}`);
      return;
    }

    sessionStorage.setItem(
      "BUY_NOW_ITEM",
      JSON.stringify({
        productId: product.id,
        productName: product.name,
        image: product.imageUrl,
        variant: {
          value: selected.variantValue,
          shape: selected.shape,
          size: selected.size,
        },
        price,
        cartQty,
        customImages,
        enforceMinQuantity: product.enforceMinQuantity,
        minOrderQuantity: product.minOrderQuantity,
      })
    );

    navigate("/checkout?mode=buynow");
  };

  const renderOptions = (title, field, values) => (
    <div className="option-group">
      <div className="option-title">{title}</div>
      <div className="option-grid">
        {values.map((val) => (
          <div
            key={val}
            className={`option-card ${selected[field] === val ? "active" : ""}`}
            onClick={() => selectOption(field, val)}
          >
            {val}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Navbar />

      <div className="product-detail">
        <div className="product-wrapper">
          {/* IMAGE */}
          <div className="product-image">
            <img src={product.imageUrl} alt={product.name} />
          </div>

          {/* INFO */}
          <div className="product-info">
            <h2>{product.name}</h2>
            <p className="product-desc">{product.description}</p>

            {/* MOQ */}
            {product.enforceMinQuantity && (
              <div className="min-qty-info">
                Minimum order quantity: <b>{product.minOrderQuantity}</b>
              </div>
            )}

            {/* VARIANT TYPES AS HEADERS */}
            {Object.entries(variantsGroupedByType).map(([type, variants]) => (
              <div key={type} className="option-group">
                <div className="option-title">{type}</div>

                <div className="option-grid">
                  {[...new Set(variants.map((v) => v.variantValue))].map(
                    (value) => (
                      <div
                        key={value}
                        className={`option-card ${
                          selected.variantValue === value ? "active" : ""
                        }`}
                        onClick={() => selectVariantValue(value)}
                      >
                        {value}
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}

            {availableShapes.length > 0 &&
              renderOptions("Shape", "shape", availableShapes)}

            {availableSizes.length > 0 &&
              renderOptions("Size", "size", availableSizes)}

            {/* QTY */}
            <div className="qty-section">
              <div className="qty-selector">
                <button
                  disabled={cartQty <= minQty}
                  onClick={() => setCartQty((q) => Math.max(q - 1, minQty))}
                >
                  −
                </button>
                <span>{cartQty}</span>
                <button onClick={() => setCartQty((q) => q + 1)}>+</button>
              </div>
            </div>

            {/* PRICE */}
            <div className="price-box">₹{price}</div>

            {/* CTA */}
            <div className="cta-group">
              <button
                className="add-cart-btn"
                disabled={!canProceed}
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>

              <button
                className="buy-now-btn"
                disabled={!canProceed}
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
