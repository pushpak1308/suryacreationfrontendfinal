import { useNavigate } from "react-router-dom";
import "../styles/cta.css";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="cta-premium">
      <div className="cta-premium-inner">
        <h2>Craft a Gift That Truly Matters</h2>

        <p>
          Premium personalized gifts designed to leave a lasting impression.
        </p>

        <button
          className="cta-premium-btn"
          onClick={() => navigate("/products")}
        >
          Start Creating
        </button>
      </div>
    </section>
  );
};

export default CTA;
