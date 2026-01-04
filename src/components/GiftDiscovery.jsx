import { useNavigate } from "react-router-dom";
import "../styles/giftDiscovery.css";

const giftOptions = [
  {
    title: "Birthday",
    icon: "🎂",
    link: "/products?occasion=birthday",
  },
  {
    title: "Anniversary",
    icon: "❤️",
    link: "/products?occasion=anniversary",
  },
  {
    title: "Home Décor",
    icon: "🖼️",
    link: "/products?category=decor",
  },
  {
    title: "Stationery",
    icon: "📒",
    link: "/products?category=stationery",
  },
  {
    title: "Corporate",
    icon: "🎁",
    link: "/products?occasion=corporate",
  },
];

const GiftDiscovery = () => {
  const navigate = useNavigate();

  return (
    <section className="gift-strip">
      <div className="gift-strip-inner">
        {giftOptions.map((gift, index) => (
          <div
            key={index}
            className="gift-strip-item"
            onClick={() => navigate(gift.link)}
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
