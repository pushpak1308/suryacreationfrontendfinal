import { useNavigate } from "react-router-dom";
import "../styles/categories.css";

const categories = [
  {
    name: "Photo Frames",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
    link: "/products?category=frames",
  },
  {
    name: "Photo Gifts",
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383",
    link: "/products?category=photo-gifts",
  },
  {
    name: "Notepads",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8",
    link: "/products?category=notepads",
  },
  {
    name: "Stickers",
    image: "https://images.unsplash.com/photo-1602526432604-029a709e131c",
    link: "/products?category=stickers",
  },
  {
    name: "Wall Art",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    link: "/products?category=wall-art",
  },
];

const Categories = () => {
  const navigate = useNavigate();

  return (
    <section className="premium-categories">
      <h2 className="categories-title">Browse Categories</h2>

      <div className="categories-row">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="category-card"
            onClick={() => navigate(cat.link)}
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
