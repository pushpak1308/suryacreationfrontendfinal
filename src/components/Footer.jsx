import { useNavigate } from "react-router-dom";
import "../styles/footer.css";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* BRAND */}
        <div className="footer-col brand">
          <h3>Surya Creations</h3>
          <p>Premium personalized gifts & photo prints.</p>
        </div>

        {/* LINKS */}
        <div className="footer-col">
          <span onClick={() => navigate("/")}>Home</span>
          <span onClick={() => navigate("/products")}>Shop</span>
          <span onClick={() => navigate("/orders")}>My Orders</span>
        </div>

        {/* CONTACT */}
        <div className="footer-col contact">
          <span>📞 +91 99999 99999</span>
          <span>✉ support@suryacreations.in</span>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Surya Creations
      </div>
    </footer>
  );
};

export default Footer;
