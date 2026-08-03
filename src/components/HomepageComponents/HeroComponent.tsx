import Carousel from 'react-bootstrap/Carousel';
import heroSlides from "../../mockData/mockCarousel"
function HeroComponent() {
  return (
    <Carousel>
    {heroSlides.map((slide)=>{
    return(
    <Carousel.Item key={slide.id}>
        <img src={slide.imageUrl} className='img-fluid' alt='mock1'/>
        <Carousel.Caption>
          <h3>{slide.title}</h3>
          <p>{slide.subtitle}</p>
        </Carousel.Caption>
      </Carousel.Item>)
    
    })}
    </Carousel>
  );
}

export default HeroComponent;