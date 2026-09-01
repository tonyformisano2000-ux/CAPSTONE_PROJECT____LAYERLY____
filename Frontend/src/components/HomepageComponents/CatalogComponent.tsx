import { Card, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import "../../generalCss.css";
import type { RootState } from "../../types/index";
import { addToCartAction, removeFromCartAction } from "../../redux/actions";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import apiFetch from "../../api/apiClient";
import type { Design } from "../../types";
const CatalogComponent = () => {
  const dispatch = useDispatch();
  const inTheCart = useSelector((state: RootState) => state.cart.content);
  const [designs, setDesigns] = useState<Design[]>([]);

  useEffect(() => {
    apiFetch("/designs")
      .then(setDesigns)
      .catch((err) => console.error(err));
  }, []);

  return (
    <Container className="my-3">
      <Row>
        {designs.slice(0, 6).map((design) => {
          return (
            <Card
              key={design.id}
              className="col-lg-4 col-md-6 p-3 px-1 border-0 overflow-hidden"
            >
              <Row className="g-0 h-100">
                <Col className="col-6 h-100">
                  <Card.Img
                    src={design.photoUrls[0]}
                    className="object-fit-cover h-100 w-100"
                  />
                </Col>
                <Col className="col-6">
                  <Card.Body className="h-100 w-100 d-flex flex-column">
                    <Card.Title>{design.title}</Card.Title>

                    <Link
                      to={`/designer/${design.designerId}`}
                      className="text-decoration-none"
                    >
                      {design.designerName}
                    </Link>
                    <div className="text-muted small">
                      {new Date(design.publishedAt).toLocaleDateString("it-IT")}
                    </div>

                    <Card.Text className="flex-grow-1 multiline-truncate">
                      {design.description}
                    </Card.Text>
                  </Card.Body>
                </Col>
              </Row>
              <div className="mt-6 d-flex justify-content-between">
                <h6 className="align-self-center">
                  download for {design.price.toFixed(2)}€
                </h6>
                <div className="d-flex align-items-center">
                  {inTheCart.some((item) => item.designId === design.id) ? (
                    <i
                      className="btn p-0 border-0 bi bi-plus-circle-fill me-1 fs-4"
                      onClick={() => dispatch(removeFromCartAction(design.id))}
                    />
                  ) : (
                    <i
                      className="btn p-0 border-0 bi bi-plus-circle me-1 fs-4"
                      onClick={() => dispatch(addToCartAction(design.id))}
                    />
                  )}
                  <Link
                    to={`/details/${design.id}`}
                    type="button"
                    className="btn btn-primary btn-sm me-4 rounded-pill"
                  >
                    See details
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </Row>
    </Container>
  );
};

export default CatalogComponent;
