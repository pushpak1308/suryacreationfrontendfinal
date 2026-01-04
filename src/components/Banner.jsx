import { useEffect, useState } from "react";
import "../styles/banner.css";

const bannerData = [
  {
    imageUrl: "https://images.unsplash.com/photo-1512909006721-3d6018887383",
    heading: "Make Every Gift Personal",
    subheading: "Premium photo gifts & custom prints crafted with care",
    ctaText: "Create Your Gift",
    ctaLink: "/products",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    heading: "Memories That Last Forever",
    subheading: "Turn moments into meaningful keepsakes",
    ctaText: "Explore Collections",
    ctaLink: "/products",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1607082349566-187342175e2f",
    heading: "Designed to Be Remembered",
    subheading: "Luxury personalized gifts for every occasion",
    ctaText: "Shop Bestsellers",
    ctaLink: "/products",
  },
];

const Banner = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === bannerData.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-banner">
      {bannerData.map((slide, index) => (
        <div
          key={index}
          className={`hero-slide ${index === activeIndex ? "active" : ""}`}
          style={{
            backgroundImage: `url(${slide.imageUrl})`,
          }}
        >
          <div className="hero-overlay" />

          <div className="hero-content">
            <h1>{slide.heading}</h1>
            <p>{slide.subheading}</p>

            <a href={slide.ctaLink} className="hero-btn">
              {slide.ctaText}
            </a>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Banner;
