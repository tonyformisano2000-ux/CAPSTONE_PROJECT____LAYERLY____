import CatalogComponent from "../components/HomepageComponents/CatalogComponent";
import DesignersComponent from "../components/HomepageComponents/DesignersComponent";
import HeroComponent from "../components/HomepageComponents/HeroComponent";

const Homepage = () => {
  return (
    <>
      <HeroComponent />
      <CatalogComponent />
      <DesignersComponent />
    </>
  );
};
export default Homepage;
