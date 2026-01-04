import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as cartUtils from "../utils/cartUtils";
import "../styles/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!localStorage.getItem("token");
  const isProductPage = location.pathname.startsWith("/product/");

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(cartUtils.getCartCount());

    const onStorageChange = () => {
      setCartCount(cartUtils.getCartCount());
    };

    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  const handleLogin = () => navigate("/login");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  const handleCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to view cart");
      navigate("/login");
    } else {
      navigate("/cart");
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        {/* BACK BUTTON (Mobile Product Page Only) */}
        {isProductPage && (
          <button
            className="nav-back-btn"
            onClick={() => navigate("/")}
            aria-label="Back to home"
          >
            ←
          </button>
        )}

        {/* LOGO */}
        <div className="logo" onClick={() => navigate("/")}>
          Surya Creations
        </div>
      </div>

      <div className="nav-actions">
        <button className="cart-btn" onClick={handleCart}>
          Cart
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>

        {isLoggedIn && (
          <button onClick={() => navigate("/orders")}>My Orders</button>
        )}

        {!isLoggedIn ? (
          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>
        ) : (
          <button className="login-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
