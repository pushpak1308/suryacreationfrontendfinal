import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./admin.css";

const AdminNavbar = () => {
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    axios
      .get(
        "https://surya-creations.onrender.com/api/admin/orders/pending-count"
      )
      .then((res) => setPendingCount(res.data.count))
      .catch(() => {});
  }, []);

  const isActive = (path) =>
    location.pathname.startsWith(path) ? "active" : "";

  return (
    <nav className="admin-navbar">
      <div className="admin-brand">
        Surya Creations — <span>Admin</span>
      </div>

      <div className="admin-links">
        <Link to="/admin" className={isActive("/admin")}>
          Dashboard
        </Link>

        <Link
          to="/admin/add-product"
          className={isActive("/admin/add-product")}
        >
          Add Product
        </Link>

        <Link to="/admin/products" className={isActive("/admin/products")}>
          Product List
        </Link>

        <Link to="/admin/orders" className={isActive("/admin/orders")}>
          Orders
          {pendingCount > 0 && (
            <span className="order-badge">{pendingCount}</span>
          )}
        </Link>
        <Link to="/admin/users" className={isActive("/admin/users")}>
          Users
        </Link>

        <Link to="/">Go to Store</Link>
      </div>
    </nav>
  );
};

export default AdminNavbar;
