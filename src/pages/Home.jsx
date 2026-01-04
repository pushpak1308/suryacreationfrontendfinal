import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import GiftDiscovery from "../components/GiftDiscovery";
import WhySurya from "../components/WhySurya";
import SearchBar from "../components/SearchBar";
import "../styles/home.css";

const Home = () => {
  return (
    <div className="home-page">
      <Navbar />
          <Banner />
          <SearchBar/>
      <GiftDiscovery />
      <Categories />
      <FeaturedProducts />
      <WhySurya />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
