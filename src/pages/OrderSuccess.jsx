import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/orderSuccess.css";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const orderId = sessionStorage.getItem("LAST_ORDER_ID");


  return (
    <>
      <Navbar />

      <div className="success-page">
        <div className="success-card">
          {/* CHECK ICON */}
          <div className="success-icon">✓</div>

          <h2>Order Placed Successfully</h2>

          <p className="success-text">
            Thank you for shopping with <strong>Surya Creations</strong>.
          </p>

          {orderId && (
            <p className="order-id">
              Order ID: <strong>#{orderId}</strong>
            </p>
          )}

          <div className="success-actions">
            <button className="primary-btn" onClick={() => navigate("/orders")}>
              View Order
            </button>

            <button className="secondary-btn" onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
