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
    name: "Miniature Frames",
    image:
      "https://res.cloudinary.com/dier6hkbz/image/upload/v1767285352/Screenshot_2026-01-01_220515_vaqyo7.png",
  },
  {
    name: "Labels",
    image:
      "https://res.cloudinary.com/dier6hkbz/image/upload/v1767280524/Sheet-label_1725451536_mrfmqg.webp",
  },
  {
    name: "Customized Gifts",
    image:
      "https://res.cloudinary.com/dier6hkbz/image/upload/v1767282790/Screenshot_2026-01-01_212239_cibwbf.png",
  },
  {
    name: "Customized Frames",
    image:
      "https://res.cloudinary.com/dier6hkbz/image/upload/v1767282478/Screenshot_2026-01-01_211722_hhzdtl.png",
  },
  {
    name: "Custom Acrylic Frames",
    image:
      "https://res.cloudinary.com/dier6hkbz/image/upload/v1767282888/Screenshot_2026-01-01_212417_j3cy2i.png",
  },
  {
    name: "Combos and Hampers",
    image:
      "https://res.cloudinary.com/dier6hkbz/image/upload/v1767282991/Screenshot_2026-01-01_212604_y3uwcn.png",
  },
  {
    name: "Stickers",
    image:
      "https://res.cloudinary.com/dier6hkbz/image/upload/v1767284452/WhatsApp_Image_2025-12-14_at_6.41.37_PM_jnwknl.jpg",
  },
  {
    name: "Gifts",
    image:
      "https://res.cloudinary.com/dier6hkbz/image/upload/v1767283590/Screenshot_2026-01-01_213557_dmxmgi.png",
  },
  {
    name: "Photo Frames",
    image:
      "https://res.cloudinary.com/dier6hkbz/image/upload/v1767283656/Screenshot_2026-01-01_213708_ugqhqv.png",
  },
  {
    name: "Clocks",
    image:
      "https://res.cloudinary.com/dier6hkbz/image/upload/v1767284613/Screenshot_2026-01-01_215307_btzimn.png",
  },
  {
    name: "Historical Paintings",
    image:
      "https://res.cloudinary.com/dier6hkbz/image/upload/v1767284820/WhatsApp_Image_2025-12-14_at_7.08.14_PM_1_xikgmk.jpg",
  },
  {
    name: "Scenery",
    image:
      "https://res.cloudinary.com/dier6hkbz/image/upload/v1767284979/WhatsApp_Image_2025-12-14_at_7.10.49_PM_szse95.jpg",
  },
  {
    name: "Albums",
    image:
      "https://res.cloudinary.com/dier6hkbz/image/upload/v1767285607/WhatsApp_Image_2025-12-14_at_4.44.44_PM_jkx8bg.jpg",
  },
  {
    name: "Business Needs",
    image:
      "https://res.cloudinary.com/dier6hkbz/image/upload/v1767285136/Screenshot_2026-01-01_220150_j7n3ok.png",
  },
  {
    name: "Packaging Boxes",
    image:
      "https://res.cloudinary.com/dier6hkbz/image/upload/v1767280357/5.1_1920x_ra0n6y.webp",
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
