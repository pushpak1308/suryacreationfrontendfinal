import { useNavigate } from "react-router-dom";
import "../styles/categories.css";

/* Utility: name → slug */
const toSlug = (text) =>
  text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/'/g, "")
    .replace(/\s+/g, "-");

const categories = [
  {
    name: "Holi Special",
    image:
      "https://res.cloudinary.com/ddahsfbcb/image/upload/v1770657529/173090-holi_ajz6sf.jpg",
  },
  {
    name: "Miniature Frames",
    image:
      "https://res.cloudinary.com/ddahsfbcb/image/upload/v1769360167/Miniature_frames_rdodk8.jpg",
  },
  {
    name: "Labels",
    image:
      "https://res.cloudinary.com/ddahsfbcb/image/upload/v1769360144/Labels_k8h7ww.jpg",
  },
  {
    name: "Customized Gifts",
    image:
      "https://res.cloudinary.com/dier6hkbz/image/upload/v1767282790/Screenshot_2026-01-01_212239_cibwbf.png",
  },
  {
    name: "Customized Frames",
    image:
      "https://res.cloudinary.com/dier6hkbz/image/upload/v1767281931/WhatsApp_Image_2025-12-14_at_5.55.51_PM_znxtk9.jpg",
  },
  {
    name: "Custom Acrylic Frames",
    image:
      "https://res.cloudinary.com/ddahsfbcb/image/upload/v1769361269/mini_mint_olodki.jpg",
  },
  {
    name: "Combos and Hampers",
    image:
      "https://res.cloudinary.com/dier6hkbz/image/upload/v1767282991/Screenshot_2026-01-01_212604_y3uwcn.png",
  },
  {
    name: "Stickers",
    image:
      "https://res.cloudinary.com/ddahsfbcb/image/upload/v1769360497/stickers_ygpgdr.jpg",
  },
  {
    name: "Gifts",
    image:
      "https://res.cloudinary.com/ddahsfbcb/image/upload/v1769360513/gifts_ngnjlq.jpg",
  },
  {
    name: "Photo Frames",
    image:
      "https://res.cloudinary.com/ddahsfbcb/image/upload/v1769360534/frames_virbr3.jpg",
  },
  {
    name: "Clocks",
    image:
      "https://res.cloudinary.com/dier6hkbz/image/upload/v1767284613/Screenshot_2026-01-01_215307_btzimn.png",
  },
  {
    name: "Historical Paintings",
    image:
      "https://res.cloudinary.com/ddahsfbcb/image/upload/v1769360564/historical_svcazo.jpg",
  },
  {
    name: "Scenery",
    image:
      "https://res.cloudinary.com/ddahsfbcb/image/upload/v1769360585/scenery_hbhywl.jpg",
  },
  {
    name: "Albums",
    image:
      "https://res.cloudinary.com/ddahsfbcb/image/upload/v1769360607/albums_jp8kd0.jpg",
  },
  {
    name: "Business Needs",
    image:
      "https://res.cloudinary.com/ddahsfbcb/image/upload/v1769360628/bill_iuendy.jpg",
  },
  {
    name: "Packaging Boxes",
    image:
      "https://res.cloudinary.com/ddahsfbcb/image/upload/v1769360682/ChatGPT_Image_Jan_25_2026_10_23_50_PM_psak3m.png",
  },
];

const Categories = () => {
  const navigate = useNavigate();

  const handleClick = (name) => {
    const slug = toSlug(name);
    navigate(`/search?category=${slug}`);
  };

  return (
    <section className="premium-categories">
      <h2 className="categories-title">Browse Categories</h2>

      <div className="categories-row">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="category-card"
            onClick={() => handleClick(cat.name)}
          >
            <img src={cat.image} alt={cat.name} />
            <div className="category-overlay" />
            <span className="category-name">{cat.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
