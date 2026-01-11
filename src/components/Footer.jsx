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

          {/* SOCIAL ICONS */}
          <div className="footer-socials">
            <a
              href="https://www.instagram.com/suryacreations.co?igsh=YjNmY2p3OHpqNHI4"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <img src="/icons/instagram.svg" alt="Instagram" />
            </a>

            <a
              href="https://www.facebook.com/share/184hRKuATE/?mibextid=wwXIfr"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <img src="/icons/facebook.svg" alt="Facebook" />
            </a>

            <a
              href="https://wa.me/916239085932"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
            >
              <img src="/icons/whatsapp.svg" alt="WhatsApp" />
            </a>
          </div>
        </div>

        {/* LINKS */}
        <div className="footer-col">
          <span onClick={() => navigate("/")}>Home</span>
          <span onClick={() => navigate("/products")}>Shop</span>
          <span onClick={() => navigate("/orders")}>My Orders</span>
        </div>

        {/* CONTACT */}
        <div className="footer-col contact">
          <span>📞 +91 62390 85932</span>
          <span>✉ splmansa002@gmail.com</span>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Surya Creations. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
