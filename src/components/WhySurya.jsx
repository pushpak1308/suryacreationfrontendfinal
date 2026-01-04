import "../styles/whySurya.css";

const reasons = [
  {
    icon: "🎨",
    title: "Premium Print Quality",
    desc: "Sharp details, rich colors & flawless finish",
  },
  {
    icon: "🖼️",
    title: "Crafted with Care",
    desc: "Every product is made to feel personal",
  },
  {
    icon: "🚚",
    title: "Safe & Fast Delivery",
    desc: "Secure packaging and timely dispatch",
  },
  {
    icon: "❤️",
    title: "Loved by Customers",
    desc: "Trusted for thoughtful gifting experiences",
  },
];

const WhySurya = () => {
  return (
    <section className="why-surya">
      <h2 className="why-title">Why Surya Creations</h2>

      <div className="why-row">
        {reasons.map((item, index) => (
          <div key={index} className="why-card">
            <span className="why-icon">{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhySurya;
