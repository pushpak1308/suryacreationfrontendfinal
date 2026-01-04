import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, removeFromCart } from "../utils/cartUtils";
import Navbar from "../components/Navbar";
import "../styles/cart.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  /* ===== AUTH GUARD ===== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  /* ===== LOAD CART ===== */
  useEffect(() => {
    setCart(getCart());
  }, []);

  const updateQty = (index, delta) => {
    const updated = [...cart];
    const item = updated[index];

    const newQty = item.cartQty + delta;

    if (newQty < 1) return;
    if (item.variant.availableQty && newQty > item.variant.availableQty) return;

    item.cartQty = newQty;
    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated);
    window.dispatchEvent(new Event("storage"));
  };

  const handleRemove = (index) => {
    removeFromCart(index);
    setCart(getCart());
    window.dispatchEvent(new Event("storage"));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.cartQty, 0);

  const isCartInvalid = cart.some(
    (item) =>
      item.variant.availableQty && item.cartQty > item.variant.availableQty
  );

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

          {cart.map((item, index) => (
            <div key={index} className="cart-item">
              {/* PRODUCT IMAGE */}
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

                <p>
                  {item.variant.material} • {item.variant.shape} •{" "}
                  {item.variant.size}
                </p>

                {/* CUSTOM IMAGES (NEW) */}
                {item.customImages?.length > 0 && (
                  <div className="cart-custom-images">
                    {item.customImages.map((img, i) => (
                      <img key={i} src={img} alt="custom upload" />
                    ))}
                  </div>
                )}

                {/* AVAILABLE */}
                <div className="cart-availability-row">
                  Available: <span>{item.variant.availableQty ?? "-"}</span>
                </div>

                {/* QTY CONTROLS */}
                <div className="cart-qty-row">
                  <span>Quantity:</span>
                  <div className="cart-qty-controls">
                    <button
                      disabled={item.cartQty <= 1}
                      onClick={() => updateQty(index, -1)}
                    >
                      −
                    </button>
                    <span>{item.cartQty}</span>
                    <button
                      disabled={
                        item.variant.availableQty &&
                        item.cartQty >= item.variant.availableQty
                      }
                      onClick={() => updateQty(index, +1)}
                    >
                      +
                    </button>
                  </div>
                </div>
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
          ))}

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
    