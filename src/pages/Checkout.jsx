import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCart } from "../utils/cartUtils";
import Navbar from "../components/Navbar";
import "../styles/checkout.css";

/* ✅ Load Razorpay script */
const loadRazorpay = () =>
  new Promise((resolve) => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Checkout = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [paymentMode, setPaymentMode] = useState("COD");
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
      .get("https://surya-creations.onrender.com/api/user/me", {
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

  /* ✅ Variant safe (new + old format) */
  const getVariantInfo = (item) => {
    const v = item.variant || {};
    return {
      material: v.material || v.value || "",
      shape: v.shape || "",
      size: v.size || "",
    };
  };

  /* ================= ORDER ITEMS ================= */
  const orderItems = items.map((item) => {
    const v = getVariantInfo(item);
    return {
      productId: item.productId,
      productName: item.productName,
      material: v.material,
      shape: v.shape,
      size: v.size,
      cartQty: item.cartQty,
      price: item.price,
      image: item.image,
      customImages: item.customImages || [],
    };
  });

  /* ================= VALIDATION ================= */
  const isAddressValid =
    address.name &&
    address.mobile &&
    address.mobile.length === 10 &&
    address.address;

    /* ================= PLACE ORDER ================= */
    
    const paymentLock = useRef(false);
    const razorpayInstance = useRef(null);
  const placeOrder = async () => {
    if (!isAddressValid) {
      alert("Please complete delivery address");
      return;
    }

    // ✅ HARD LOCK
    if (paymentLock.current) return;
    paymentLock.current = true;

    if (isPlacingOrder) return;

    setIsPlacingOrder(true);

    try {
      const token = localStorage.getItem("token");

      // ✅ CREATE ORDER IN DB FIRST
      const orderRes = await axios.post(
        "https://surya-creations.onrender.com/api/orders",
        {
          items: orderItems,
          total,
          deliveryAddress: address,
          paymentMode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const orderId = orderRes.data.id;
      sessionStorage.setItem("LAST_ORDER_ID", orderId);

      // ✅ COD FLOW
      if (paymentMode === "COD") {
        alert("Order placed successfully (Cash on Delivery)");

        if (isBuyNow) {
          sessionStorage.removeItem("BUY_NOW_ITEM");
        } else {
          localStorage.removeItem("cart");
          window.dispatchEvent(new Event("storage"));
        }

        navigate(`/order-success?orderId=${orderId}`);
        paymentLock.current = false;
        return;
      }

      /* ================= ONLINE PAYMENT ================= */

      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert("Razorpay SDK failed to load. Check your internet.");
        setIsPlacingOrder(false);
        paymentLock.current = false;
        return;
      }

      // ✅ fetch key
      const keyRes = await axios.get(
        "https://surya-creations.onrender.com/api/payment/key"
      );
      const razorpayKey = keyRes.data.key;

      // ✅ create razorpay order
      const paymentRes = await axios.post(
        "https://surya-creations.onrender.com/api/payment/create",
        { amount: Math.round(total), orderId }
      );

      const razorpayOrder = paymentRes.data;

      const options = {
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Surya Creations",
        description: "Order Payment",
        order_id: razorpayOrder.id,

        handler: async function (response) {
          try {
            await axios.post(
              "https://surya-creations.onrender.com/api/payment/verify",
              {
                orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            alert("Payment successful 🎉 Order confirmed!");

            if (isBuyNow) {
              sessionStorage.removeItem("BUY_NOW_ITEM");
            } else {
              localStorage.removeItem("cart");
              window.dispatchEvent(new Event("storage"));
            }

            navigate(`/order-success?orderId=${orderId}`);
          } catch (err) {
            console.error(err);
            alert("Payment done ✅ but verification failed ❌.");
            navigate(`/order-success?orderId=${orderId}`);
          } finally {
            setIsPlacingOrder(false);
            paymentLock.current = false;
          }
        },

        modal: {
          ondismiss: function () {
            setIsPlacingOrder(false);
            paymentLock.current = false;
          },
        },

        theme: { color: "#000" },

        prefill: {
          name: address.name,
          contact: address.mobile,
        },
      };

      // ✅ close old instance if any
      if (razorpayInstance.current) {
        try {
          razorpayInstance.current.close();
        } catch {}
        razorpayInstance.current = null;
      }

      razorpayInstance.current = new window.Razorpay(options);

      razorpayInstance.current.on("payment.failed", function () {
        alert("Payment failed ❌ Please try again.");
        setIsPlacingOrder(false);
        paymentLock.current = false;
      });

      razorpayInstance.current.open();
    } catch (err) {
      console.error(err);
      alert("Payment / Order failed");
      setIsPlacingOrder(false);
      paymentLock.current = false;
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

            {items.map((item, i) => {
              const v = getVariantInfo(item);

              return (
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
                        {v.material} • {v.shape} • {v.size}
                      </p>
                    </div>
                  </div>

                  <div className="checkout-item-price">
                    {item.cartQty} × ₹{item.price}
                  </div>
                </div>
              );
            })}
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
            {isPlacingOrder
              ? "Processing..."
              : paymentMode === "ONLINE"
              ? "Pay Now"
              : "Place Order"}
          </button>
        </div>
      </div>

      {/* FULL SCREEN LOADER */}
      {isPlacingOrder && (
        <div className="fullscreen-loader">
          <div className="loader-card">
            <div className="spinner" />
            <p>
              {paymentMode === "ONLINE"
                ? "Opening payment…"
                : "Placing your order…"}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;
