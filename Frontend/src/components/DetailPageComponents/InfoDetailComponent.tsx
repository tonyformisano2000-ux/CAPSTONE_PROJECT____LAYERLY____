import type { Design } from "../../types";
import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router";

interface DesignProp {
  design: Design;
}

const InfoDetailComponent = ({ design }: DesignProp) => {
  const published = design.publishedAt.split("-");
  return (
    <>
      <Row className="ms-4 mt-3 d-flex flex-column">
        <Row>
          <h1 className=""> {design.title} </h1>
          <Col className="col-3">
            <h6>rated {design.rating}/5 </h6>
          </Col>
          <Col className="col-8 d-flex justify-content-end align-middle">
            <span className="h6 text-nowrap">
              published on {published[1]}/{published[0]} by -
            </span>
            <Link
              to={`/designer/${design.designerId}`}
              className="text-decoration-none text-nowrap"
            >
              {design.designerName}
            </Link>
          </Col>
        </Row>
        <Row className="my-4">
          <h5>{design.subtitle}</h5>
          <text>{design.description}</text>
        </Row>
        <Row>
          <h5>More about my design</h5>
          <h6>Technology: {design.technology}</h6>
        </Row>
        <Row className="my-3 d-flex justify-content-between">
          <h3>Price: {design.price.toFixed(2)}€</h3>
          <Button className="btn btn-lg ">Download</Button>
        </Row>
      </Row>
    </>
  );
};
export default InfoDetailComponent;
