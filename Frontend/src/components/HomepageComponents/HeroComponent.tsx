import Carousel from "react-bootstrap/Carousel";
import heroSlides from "../../mockData/mockCarousel";

const HERO_HEIGHT = "420px";

function HeroComponent() {
  return (
    <Carousel>
      {heroSlides.map((slide) => {
        return (
          <Carousel.Item key={slide.id}>
            <div
              className="position-relative w-100"
              style={{ height: HERO_HEIGHT }}
            >
              <img
                src={slide.imageUrl}
                className="w-100 h-100 object-fit-cover"
                alt={slide.title}
              />
              {/* velo scuro: rende il testo leggibile qualunque sia la foto sotto */}
              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                  background:
                    "linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.65))",
                }}
              />
              <Carousel.Caption
                className="d-flex flex-column justify-content-center align-items-center"
                style={{ top: 0, bottom: 0, left: 0, right: 0 }}
              >
                <h2 className="fw-bold display-6 mb-2">{slide.title}</h2>
                <p className="fs-5 mb-0">{slide.subtitle}</p>
              </Carousel.Caption>
            </div>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
}

export default HeroComponent;
