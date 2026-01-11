import { useNavigate } from "react-router-dom";
import "../styles/giftDiscovery.css";

const giftOptions = [
  { title: "Birthday", icon: "🎂", occasion: "birthday" },
  { title: "Anniversary", icon: "❤️", occasion: "anniversary" },
  { title: "Home Décor", icon: "🖼️", occasion: "decor" },
  { title: "Stationery", icon: "📒", occasion: "stationery" },
  { title: "Corporate", icon: "🎁", occasion: "corporate" },
];

const GiftDiscovery = () => {
  const navigate = useNavigate();

  const handleClick = (gift) => {
    navigate(`/search?occasion=${gift.occasion}`);
  };

  return (
    <section className="gift-strip">
      <div className="gift-strip-inner">
        {giftOptions.map((gift, index) => (
          <div
            key={index}
            className="gift-strip-item"
            onClick={() => handleClick(gift)}
          >
            <span className="gift-strip-icon">{gift.icon}</span>
            <span className="gift-strip-text">{gift.title}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GiftDiscovery;
