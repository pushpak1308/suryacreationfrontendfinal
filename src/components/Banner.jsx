import { useEffect, useState } from "react";
import "../styles/banner.css";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  /* FETCH BANNERS */
  useEffect(() => {
    fetch("https://surya-creations.onrender.com/api/banners")
      .then((res) => res.json())
      .then(setBanners)
      .catch(() => setBanners([]));
  }, []);

  /* SLIDER INTERVAL */
  useEffect(() => {
    if (!banners.length) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 4000); // slightly slower = premium feel

    return () => clearInterval(interval);
  }, [banners]);

  if (!banners.length) return null;

  return (
    <section className="hero-banner">
      {banners.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero-slide ${index === activeIndex ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.imageUrl})` }}
        >
          <div className="hero-overlay" />

          <div className="hero-content">
            <h1 className="animate-text">{slide.heading}</h1>
            <p className="animate-text delay">{slide.subheading}</p>

            {slide.ctaLink && (
              <a href={slide.ctaLink} className="hero-btn animate-btn">
                {slide.ctaText || "Explore"}
              </a>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Banner;
