import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Link, useLocation } from "react-router";
import apiFetch from "../api/apiClient";
import type { Design, CartItem } from "../types";

const OrderConfirmationPage = () => {
  const location = useLocation();
  const items = (location.state?.items ?? []) as CartItem[];
  const [designs, setDesigns] = useState<Design[]>([]);

  const total = items.reduce((sum, item) => sum + item.priceSnapshot, 0);
  const orderId = 123456; // placeholder, real id will come from backend

  useEffect(() => {
    if (items.length === 0) return;
    apiFetch("/designs")
      .then((all: Design[]) => {
        setDesigns(all.filter((d) => items.some((i) => i.designId === d.id)));
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <Container className="text-center mt-5" style={{ maxWidth: "500px" }}>
      <i
        className="bi bi-check-circle-fill text-success"
        style={{ fontSize: "64px" }}
      ></i>

      <h1 className="mt-3">Order confirmed</h1>
      <p className="text-muted">
        Thanks for your purchase! Your order #{orderId} has been received.
      </p>

      <div className="border rounded p-3 my-4 text-start">
        {items.length === 0 ? (
          <p className="text-muted mb-0">No details available.</p>
        ) : (
          <>
            {items.map((item) => {
              const design = designs.find((d) => d.id === item.designId);
              return (
                <div
                  key={item.designId}
                  className="d-flex justify-content-between mb-2"
                >
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
