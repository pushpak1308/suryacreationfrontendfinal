import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCart } from "../utils/cartUtils";
import Navbar from "../components/Navbar";
import "../styles/checkout.css";

const Checkout = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [paymentMode, setPaymentMode] = useState("COD"); // default COD
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [address, setAddress] = useState({
    name: "",
    mobile: "",
    address: "",
  });

  /* ================= MODE ================= */
  const isBuyNow =
    new URLSearchParams(window.location.search).get("mode") === "buynow";

  /* ================= INIT ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (isBuyNow) {
      const buyNowItem = JSON.parse(sessionStorage.getItem("BUY_NOW_ITEM"));
      if (!buyNowItem) {
        navigate("/");
        return;
      }
      setItems([buyNowItem]);
    } else {
      setItems(getCart());
    }

    axios
      .get("http://localhost:8000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) =>
        setAddress({
          name: res.data.name || "",
          mobile: res.data.mobile || "",
          address: res.data.address || "",
        })
      )
      .catch(() => alert("Failed to load profile"));
  }, [navigate, isBuyNow]);

  /* ================= LOCK SCROLL WHILE LOADING ================= */
  useEffect(() => {
    document.body.style.overflow = isPlacingOrder ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isPlacingOrder]);

  /* ================= TOTAL ================= */
  const total = items.reduce((sum, item) => sum + item.price * item.cartQty, 0);

  /* ================= ORDER ITEMS ================= */
  const orderItems = items.map((item) => ({
    productId: item.productId,
    productName: item.productName,
    material: item.variant.material,
    shape: item.variant.shape,
    size: item.variant.size,
    cartQty: item.cartQty,
    price: item.price,
    image: item.image,
    customImages: item.customImages || [], // ✅ ADD THIS
  }));


  /* ================= VALIDATION ================= */
  const isAddressValid =
    address.name &&
    address.mobile &&
    address.mobile.length === 10 &&
    address.address;

  /* ================= PLACE ORDER ================= */
  const placeOrder = async () => {
    if (!isAddressValid) {
      alert("Please complete delivery address");
      return;
    }

    if (isPlacingOrder) return;

    setIsPlacingOrder(true);

    try {
      // CREATE ORDER
      const orderRes = await axios.post(
        "http://localhost:8000/api/orders",
        {
          items: orderItems,
          total,
          deliveryAddress: address,
          paymentMode,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // ONLINE PAYMENT
        const orderId = orderRes.data.id;
        sessionStorage.setItem("LAST_ORDER_ID", orderId);

      const paymentRes = await axios.post(
        "http://localhost:8000/api/payment/create",
        { amount: total, orderId }
      );

      // COD FLOW
      if (paymentMode === "COD") {
        alert("Order placed successfully (Cash on Delivery)");

        if (isBuyNow) {
          sessionStorage.removeItem("BUY_NOW_ITEM");
        } else {
          localStorage.removeItem("cart");
          window.dispatchEvent(new Event("storage"));
        }

        navigate(`/order-success?orderId=${orderId}`);
        return;
      }

      const razorpayOrder = paymentRes.data;

      const options = {
        key: "rzp_test_xxxxx",
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Surya Creations",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: function () {
          alert("Payment successful 🎉");

          if (isBuyNow) {
            sessionStorage.removeItem("BUY_NOW_ITEM");
          } else {
            localStorage.removeItem("cart");
            window.dispatchEvent(new Event("storage"));
          }

          navigate("/orders");
        },
        modal: {
          ondismiss: function () {
            setIsPlacingOrder(false);
          },
        },
        theme: { color: "#000" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
      setIsPlacingOrder(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="checkout-page">
        <div className="checkout-divider" />

        <div className="checkout-container">
          <h2 className="checkout-title">Checkout</h2>

          {/* DELIVERY ADDRESS */}
          <div className="checkout-card">
            <h3>Delivery Address</h3>

            <div className="checkout-form">
              <input
                type="text"
                placeholder="Full Name"
                value={address.name}
                onChange={(e) =>
                  setAddress({ ...address, name: e.target.value })
                }
              />

              <input
                type="tel"
                placeholder="Mobile Number"
                maxLength="10"
                value={address.mobile}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    mobile: e.target.value.replace(/\D/g, ""),
                  })
                }
              />

              <textarea
                placeholder="Full Address"
                rows="3"
                value={address.address}
                onChange={(e) =>
                  setAddress({ ...address, address: e.target.value })
                }
              />
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div className="checkout-card">
            <h3>Payment Method</h3>

            <div className="payment-option">
              <input
                type="radio"
                name="payment"
                checked={paymentMode === "COD"}
                onChange={() => setPaymentMode("COD")}
              />
              <label>💵 Cash on Delivery</label>
            </div>

            <div className="payment-option">
              <input
                type="radio"
                name="payment"
                checked={paymentMode === "ONLINE"}
                onChange={() => setPaymentMode("ONLINE")}
              />
              <label>📲 UPI / Online Payment</label>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="checkout-card">
            <h3>Order Summary</h3>

            {items.map((item, i) => (
              <div key={i} className="checkout-item">
                <div className="checkout-item-left">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="checkout-item-image"
                  />

                  <div>
                    <strong>{item.productName}</strong>
                    <p className="checkout-variant">
                      {item.variant.material} • {item.variant.shape} •{" "}
                      {item.variant.size}
                    </p>
                  </div>
                </div>

                <div className="checkout-item-price">
                  {item.cartQty} × ₹{item.price}
                </div>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="checkout-total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          {/* CTA */}
          <button
            className="place-order-btn"
            disabled={!isAddressValid || isPlacingOrder}
            onClick={placeOrder}
          >
            {isPlacingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>

      {/* FULL SCREEN LOADER */}
      {isPlacingOrder && (
        <div className="fullscreen-loader">
          <div className="loader-card">
            <div className="spinner" />
            <p>Placing your order…</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;
