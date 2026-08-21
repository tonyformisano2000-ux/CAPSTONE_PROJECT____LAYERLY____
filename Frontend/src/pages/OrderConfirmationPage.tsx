import { Container } from "react-bootstrap";
import { Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import type { RootState } from "../redux/store";
import { emptyCartAction } from "../redux/actions";
import { mockDesigns } from "../mockData/mockDesigns";

const OrderConfirmationPage = () => {
  const content = useSelector((state: RootState) => state.cart.content);
  const dispatch = useDispatch();

  const total = content.reduce((sum, item) => sum + item.priceSnapshot, 0);
  const orderId = 123456; // placeholder, real id will come from backend

  useEffect(() => {
    dispatch(emptyCartAction());
  }, []);

  return (
    <Container className="text-center mt-5" style={{ maxWidth: "500px" }}>
      <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "64px" }}></i>

      <h1 className="mt-3">Order confirmed</h1>
      <p className="text-muted">
        Thanks for your purchase! Your order #{orderId} has been received.
      </p>

      <div className="border rounded p-3 my-4 text-start">
        {content.length === 0 ? (
          <p className="text-muted mb-0">No details available.</p>
        ) : (
          <>
            {content.map((item) => {
              const design = mockDesigns.find((d) => d.id === item.designId);
              return (
                <div key={item.designId} className="d-flex justify-content-between mb-2">
                  <span>{design?.title ?? "Design"}</span>
                  <span>{item.priceSnapshot.toFixed(2)} €</span>
                </div>
              );
            })}
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span>Total</span>
              <span>{total.toFixed(2)} €</span>
            </div>
          </>
        )}
      </div>

      <div className="d-flex gap-2 justify-content-center">
        <Link to="/catalog" className="btn btn-primary">
          Keep exploring
        </Link>
      </div>
    </Container>
  );
};

export default OrderConfirmationPage;