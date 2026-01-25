import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, removeFromCart } from "../utils/cartUtils";
import Navbar from "../components/Navbar";
import "../styles/cart.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  /* ================= LOAD CART ================= */
  useEffect(() => {
    setCart(getCart());
  }, []);

  /* ================= QTY UPDATE ================= */
  const updateQty = (index, delta) => {
    const updated = [...cart];
    const item = updated[index];

    const minQty = item.enforceMinQuantity ? item.minOrderQuantity : 1;
    const newQty = item.cartQty + delta;

    if (newQty < minQty) return;

    item.cartQty = newQty;
    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated);
    window.dispatchEvent(new Event("storage"));
  };

  /* ================= REMOVE ================= */
  const handleRemove = (index) => {
    removeFromCart(index);
    setCart(getCart());
    window.dispatchEvent(new Event("storage"));
  };

  /* ================= TOTAL ================= */
  const total = cart.reduce((sum, item) => sum + item.price * item.cartQty, 0);

  /* ================= VALIDATION ================= */
  const isCartInvalid = cart.some((item) => {
    if (!item.enforceMinQuantity) return false;
    return item.cartQty < item.minOrderQuantity;
  });

  /* ================= VARIANT DISPLAY (NEW + OLD SUPPORT) ================= */
  const getVariantText = (item) => {
    const v = item.variant || {};

    // ✅ OLD FORMAT SUPPORT
    const material = v.material || "";

    // ✅ NEW FORMAT SUPPORT
    const value = v.value || "";

    const shape = v.shape || "";
    const size = v.size || "";

    // If new format exists use that else old
    const variantValue = value || material || "-";

    return `${variantValue} • ${shape} • ${size}`;
  };

  return (
    <>
      <Navbar />

      <div className="cart-page">
        <div className="cart-divider" />

        <div className="cart-container">
          <h2 className="cart-title">Your Cart</h2>

          {cart.length === 0 && (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <button onClick={() => navigate("/")}>Continue Shopping</button>
            </div>
          )}

          {cart.map((item, index) => {
            const minQty = item.enforceMinQuantity ? item.minOrderQuantity : 1;

            const isBelowMin =
              item.enforceMinQuantity && item.cartQty < item.minOrderQuantity;

            return (
              <div key={index} className="cart-item">
                {/* IMAGE */}
                <div
                  className="cart-item-image"
                  onClick={() => navigate(`/product/${item.productId}`)}
                >
                  <img src={item.image} alt={item.productName} />
                </div>

                {/* INFO */}
                <div className="cart-item-info">
                  <h4
                    className="clickable"
                    onClick={() => navigate(`/product/${item.productId}`)}
                  >
                    {item.productName}
                  </h4>

                  {/* ✅ UPDATED VARIANT DISPLAY */}
                  <p>{getVariantText(item)}</p>

                  {/* CUSTOM IMAGES */}
                  {item.customImages?.length > 0 && (
                    <div className="cart-custom-images">
                      {item.customImages.map((img, i) => (
                        <img key={i} src={img} alt="custom upload" />
                      ))}
                    </div>
                  )}

                  {/* MOQ INFO */}
                  {item.enforceMinQuantity && (
                    <div className="cart-min-qty">
                      Minimum order: <b>{item.minOrderQuantity}</b>
                    </div>
                  )}

                  {/* QTY */}
                  <div className="cart-qty-row">
                    <span>Quantity:</span>
                    <div className="cart-qty-controls">
                      <button
                        disabled={item.cartQty <= minQty}
                        onClick={() => updateQty(index, -1)}
                      >
                        −
                      </button>
                      <span>{item.cartQty}</span>
                      <button onClick={() => updateQty(index, +1)}>+</button>
                    </div>
                  </div>

                  {/* WARNING */}
                  {isBelowMin && (
                    <div className="cart-warning">
                      Minimum {item.minOrderQuantity} quantity required
                    </div>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="cart-item-actions">
                  <div className="cart-price">₹{item.price * item.cartQty}</div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          {cart.length > 0 && (
            <div className="cart-summary">
              <div className="cart-total">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button
                className="checkout-btn"
                disabled={isCartInvalid}
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
