import { Card, Container, Row, Col } from "react-bootstrap";
import { mockDesigns } from "../../mockData/mockDesigns";
import { mockUser } from "../../mockData/mockUsers";
import { Link } from "react-router";
import "../../generalCss.css"

const CatalogComponent = () => {
  return (
    <Container>
      <Row>
        {mockDesigns.slice(0, 6).map((design) => {
          const designer = mockUser.find((user) => user.id === design.designerId);

          return (
            <Card key={design.id} className="col-4 p-3 px-1 border-0 overflow-hidden" >
              <Row className="g-0 h-100">
                <Col className="col-6 h-100">
                  <Card.Img src={design.photoUrls[0]} className="object-fit-cover h-100 w-100" />
                </Col>
                <Col className="col-6">
                  <Card.Body className="h-100 w-100 d-flex flex-column">
                    <Card.Title>{design.title}</Card.Title>

                    <Link to={`/designer/${design.designerId}`} className="text-decoration-none">
                      {designer?.firstName} {designer?.lastName}
                    </Link>
                    <div className="text-muted small">
                      {new Date(design.publishedAt).toLocaleDateString('it-IT')}
                    </div>

                    <Card.Text className="flex-grow-1 multiline-truncate">{design.description}</Card.Text>
                  </Card.Body>
                </Col>
              </Row>
              <div className="mt-6 d-flex justify-content-between">
<h6 className="align-self-center">download for {design.price}€</h6>
<button type="button" className="btn btn-primary btn-sm w-25 align-self-center me-3">See details</button>
              </div>
            </Card>
          );
        })}
      </Row>
    </Container>
  );
};

export default CatalogComponent;