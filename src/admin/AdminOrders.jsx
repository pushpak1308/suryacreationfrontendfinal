import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import AdminNavbar from "./AdminNavbar";
import OrderTimeline from "../components/OrderTimeline";
import "../styles/adminOrders.css";

const STATUS_FLOW = ["CREATED", "PROCESSING", "SHIPPED", "DELIVERED"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [preview, setPreview] = useState(null);

  const [params, setParams] = useSearchParams();
  const statusFilter = params.get("status") || "ALL";
  const fromDate = params.get("from");
  const toDate = params.get("to");

  useEffect(() => {
    axios
      .get("https://surya-creations.onrender.com/api/admin/orders")
      .then((res) => setOrders(res.data))
      .catch(console.error);
  }, []);

  /* ===============================
     STATUS COUNTS (BADGES)
     =============================== */
  const statusCounts = useMemo(() => {
    const counts = { ALL: orders.length };
    STATUS_FLOW.forEach((s) => (counts[s] = 0));

    orders.forEach((o) => {
      if (counts[o.status] !== undefined) {
        counts[o.status]++;
      }
    });

    return counts;
  }, [orders]);

  const exportCsv = () => {
    const params = new URLSearchParams();

    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (fromDate) params.set("from", fromDate);
    if (toDate) params.set("to", toDate);

    window.open(
      `https://surya-creations.onrender.com/api/admin/orders/export?${params.toString()}`,
      "_blank"
    );
  };

  /* ===============================
     FILTERED ORDERS
     =============================== */
  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== "ALL" && order.status !== statusFilter) {
      return false;
    }

    if (fromDate) {
      const created = new Date(order.createdAt);
      if (created < new Date(fromDate)) return false;
    }

    if (toDate) {
      const created = new Date(order.createdAt);
      if (created > new Date(toDate + "T23:59:59")) return false;
    }

    return true;
  });

  const updateStatus = (orderId, newStatus) => {
    axios
      .put(
        `https://surya-creations.onrender.com/api/admin/orders/${orderId}/status`,
        {
          status: newStatus,
        }
      )
      .then(() => {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      });
  };

  const downloadImages = async (orderId) => {
    const res = await fetch(
      `https://surya-creations.onrender.com/api/admin/orders/${orderId}/images/zip`
    );
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `order_${orderId}_images.zip`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <AdminNavbar />

      <div className="admin-page">
        <h2>Orders</h2>

        {/* ================= FILTER BAR ================= */}
        <div className="admin-filter-bar">
          {/* STATUS FILTERS */}
          <div className="admin-status-filters">
            {["ALL", ...STATUS_FLOW].map((s) => (
              <button
                key={s}
                className={statusFilter === s ? "active" : ""}
                onClick={() => {
                  const next = new URLSearchParams(params);
                  if (s === "ALL") next.delete("status");
                  else next.set("status", s);
                  setParams(next);
                }}
              >
                {s}
                <span className="status-badge">{statusCounts[s] || 0}</span>
              </button>
            ))}
            <button className="export-btn" onClick={exportCsv}>
              Export CSV
            </button>
          </div>

          {/* DATE RANGE */}
          <div className="admin-date-filter">
            <input
              type="date"
              value={fromDate || ""}
              onChange={(e) => {
                const next = new URLSearchParams(params);
                next.set("from", e.target.value);
                setParams(next);
              }}
            />
            <span>→</span>
            <input
              type="date"
              value={toDate || ""}
              onChange={(e) => {
                const next = new URLSearchParams(params);
                next.set("to", e.target.value);
                setParams(next);
              }}
            />

            {(fromDate || toDate) && (
              <button
                className="clear-filter"
                onClick={() => {
                  params.delete("from");
                  params.delete("to");
                  setParams(params);
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ================= ORDERS ================= */}
        {filteredOrders.map((order) => {
          const expanded = expandedId === order.id;

          return (
            <div key={order.id} className="admin-order-card">
              <div
                className="admin-order-header"
                onClick={() => setExpandedId(expanded ? null : order.id)}
              >
                <div>
                  <strong>Order #{order.id}</strong>
                  <p>
                    ₹{order.totalAmount} • {order.paymentMode}
                  </p>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <button
                    className="download-btn"
                    onClick={() => downloadImages(order.id)}
                  >
                    Download Images
                  </button>

                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                  >
                    {STATUS_FLOW.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {expanded && (
                <div className="admin-order-details">
                  <div className="admin-section">
                    <h4>Delivery</h4>
                    <p>{order.deliveryName}</p>
                    <p>{order.deliveryMobile}</p>
                    <p>{order.deliveryAddress}</p>
                  </div>

                  <div className="admin-section">
                    <h4>Status Timeline</h4>
                    <OrderTimeline history={order.statusHistory || []} />
                  </div>

                  <div className="admin-section">
                    <h4>Items</h4>

                    {order.items.map((item, i) => (
                      <div key={i} className="admin-item">
                        <div className="admin-item-top">
                          <img src={item.imageUrl} alt="" />
                          <div>
                            <strong>{item.productName}</strong>
                            <p>
                              {item.material} • {item.shape} • {item.size}
                            </p>
                            <p>
                              Qty: {item.cartQty} | ₹{item.price}
                            </p>
                          </div>
                        </div>

                        {item.customImages?.length > 0 && (
                          <div className="admin-custom-images">
                            {item.customImages.map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt=""
                                onClick={() => setPreview(img)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {preview && (
          <div className="admin-modal" onClick={() => setPreview(null)}>
            <img src={preview} alt="preview" />
            <button onClick={() => setPreview(null)}>×</button>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminOrders;
