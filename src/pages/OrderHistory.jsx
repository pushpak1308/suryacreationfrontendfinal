import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import OrderTimeline from "../components/OrderTimeline";
import "../styles/orderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setOrders(res.data))
      .catch(() => alert("Failed to load orders"));
  }, [navigate]);

  const cancelOrder = (orderId, e) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    axios
      .put(
        `http://localhost:8000/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: "CANCELLED",
                  statusHistory: [
                    ...(o.statusHistory || []),
                    {
                      status: "CANCELLED",
                      updatedAt: new Date().toISOString(),
                    },
                  ],
                }
              : o
          )
        );
      })
      .catch(() => alert("Unable to cancel order"));
  };

  return (
    <>
      <Navbar />

      <div className="orders-page">
        <h2 className="orders-title">My Orders</h2>

        {orders.length === 0 && (
          <p className="orders-empty">No orders found.</p>
        )}

        {orders.map((order) => {
          const isExpanded = expandedOrderId === order.id;

          return (
            <div
              key={order.id}
              className={`order-card ${isExpanded ? "expanded" : ""}`}
              onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
            >
              {/* HEADER */}
              <div className="order-header">
                <div>
                  <p className="order-id">Order #{order.id}</p>
                  <p className="order-date">
                    Placed on {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="order-header-right">
                  <span
                    className={`payment-chip ${order.paymentMode?.toLowerCase()}`}
                  >
                    {order.paymentMode}
                  </span>

                  <span
                    className={`order-status ${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* TOTAL */}
              <div className="order-total">
                Total Amount: <strong>₹{order.totalAmount}</strong>
              </div>

              {/* EXPANDABLE CONTENT */}
              {isExpanded && (
                <div className="order-details">
                  <OrderTimeline history={order.statusHistory || []} />

                  <div className="order-items">
                    {order.items.map((item, i) => (
                      <div className="order-item" key={i}>
                        <div className="order-item-left">
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="order-item-img"
                          />
                          <div className="order-item-info">
                            <p className="order-item-name">
                              {item.productName}
                            </p>
                            <p className="order-item-variant">
                              {item?.shape} • {item?.size}
                            </p>
                          </div>
                        </div>

                        <div className="order-item-right">
                          × {item.cartQty} — ₹{item.price}
                        </div>
                      </div>
                    ))}
                  </div>

                  {["CREATED", "PROCESSING"].includes(order.status) && (
                    <button
                      className="cancel-order-btn"
                      onClick={(e) => cancelOrder(order.id, e)}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default OrderHistory;
