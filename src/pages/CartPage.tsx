import { Container, Row, Col, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import type { RootState } from "../redux/store";
import { mockDesigns } from "../mockData/mockDesigns";
import { removeFromCartAction } from "../redux/actions";

const CartPage = () => {
  const content = useSelector((state: RootState) => state.cart.content);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = content.reduce((sum, item) => sum + item.priceSnapshot, 0);

  const handleRemove = (designId: string) => {
    dispatch(removeFromCartAction (designId) );
  };

  if (content.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <h1>your cart is empty!</h1>
        <Link to="/catalog" className="btn btn-primary mt-3">
          See Catalog
        </Link>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">My cart</h1>

      {content.map((item) => {
        const design = mockDesigns.find((d) => d.id === item.designId);

        return (
          <Row key={item.designId} className="align-items-center border-bottom py-3">
            <Col xs={2} md={1}>
              <img
                src={design?.photoUrls[0]}
                alt={design?.title}
                className="w-100 object-fit-cover rounded"
                style={{ height: "60px" }}
              />
            </Col>
            <Col xs={6} md={7}>
              <p className="mb-0 fw-medium">{design?.title ?? "Design non trovato"}</p>
            </Col>
            <Col xs={2} md={2} className="text-end">
              {item.priceSnapshot.toFixed(2)} €
            </Col>
            <Col xs={2} md={2} className="text-end">
              <Button variant="outline-danger" size="sm" onClick={() => handleRemove(item.designId)}>
                <i className="bi bi-trash"></i>
              </Button>
            </Col>
          </Row>
        );
      })}

      <Row className="mt-4">
        <Col className="text-end">
          <p className="fs-5 fw-bold">Totale: {total.toFixed(2)} €</p>
          <Button variant="primary" onClick={() => navigate("/payment")}>
            Pay & Download
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
