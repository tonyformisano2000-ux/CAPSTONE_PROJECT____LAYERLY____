import { Container, Row, Col } from "react-bootstrap";
import { Form, Button, Alert } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../types/index";
import { useNavigate } from "react-router";
import apiFetch from "../api/apiClient";
import { emptyCartAction } from "../redux/actions";

const paymentZod = z.object({
  fullName: z
    .string()
    .min(2, "At least 2 characters must be entered")
    .trim()
    .nonempty("At least 2 characters must be entered"),
  email: z
    .email("Email format not accepted")
    .trim()
    .nonempty("Email field is empty"),
  address: z.string().trim().nonempty("Address field is empty"),
  city: z.string().trim().nonempty("City field is empty"),
  country: z.string().trim().nonempty("Country field is empty"),
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, "card number must have at least 16 digits")
    .trim()
    .nonempty("Card number field is empty"), //.regex(/^\d{16}$/ significa inserire esattamente 16 cifre numeriche, al contrario di length
  cvc: z
    .string()
    .trim()
    .regex(/^\d{3}$/, "CVC number must have at least 3 digits")
    .nonempty("CVC field is empty"),
});

const PaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state: RootState) => state.cart.content);
  const token = useSelector((state: RootState) => state.auth.token);
  const total = cart.reduce((sum, item) => sum + item.priceSnapshot, 0);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  type PaymentFormData = z.infer<typeof paymentZod>;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({ resolver: zodResolver(paymentZod) });
  //                                 ^^^^^^^^^^^^^^^^^^
  // doppio deconstructor, dallggetto useForm prendi formState e da formstate prendi errors

  // si arriva qui anche scrivendo /payment a mano: senza token si torna al login.
  // replace evita che "indietro" riporti su /payment e rifaccia il redirect
  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true, state: { from: "/payment" } });
    }
  }, [token, navigate]);

  // i dati del form non servono all'API: il pagamento e' simulato
  const onSubmit = async () => {
    setPaymentError(null);
    try {
      const designIds = cart.map((item) => item.designId);
      const orderedItems = [...cart];

      await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify({ designIds }),
      });

      dispatch(emptyCartAction());
      navigate("/orderConfirmation", { state: { items: orderedItems } });
    } catch (err) {
      console.error(err);
      setPaymentError(
        err instanceof Error ? err.message : "Could not complete the payment",
      );
    }
  };

  // evita di mostrare il form per un attimo prima del redirect
  if (!token) return null;

  return (
    <>
      <Container>
        <Row>
          <Col className="col-6">
            <h1 className="text-center">Payment page</h1>
            <Form onSubmit={handleSubmit(onSubmit)}>
              {paymentError && (
                <Alert
                  variant="danger"
                  onClose={() => setPaymentError(null)}
                  dismissible
                  className="py-2"
                >
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {paymentError}
                </Alert>
              )}
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridName">
                  <Form.Label>Insert your full name </Form.Label>
                  <Form.Control
                    {...register("fullName")}
                    isInvalid={!!errors.fullName}
                    placeholder="Name and Surname"
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    {...register("email")}
                    isInvalid={!!errors.email}
                    placeholder="email"
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group className="mb-3 col" controlId="formGridAddress1">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    {...register("address")}
                    isInvalid={!!errors.address}
                    placeholder="1234 Main St"
                  />
                </Form.Group>

                <Form.Group className="mb-3 col-3" controlId="formGridCity">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    {...register("city")}
                    isInvalid={!!errors.city}
                    placeholder="Rome"
                  />
                </Form.Group>
                <Form.Group className="mb-3 col-3" controlId="formGridCountry">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    {...register("country")}
                    isInvalid={!!errors.country}
                    placeholder="Italy"
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group className="mb-3 col" controlId="formGridCardNumber">
                  <Form.Label>Card number</Form.Label>
                  <Form.Control
                    {...register("cardNumber")}
                    isInvalid={!!errors.cardNumber}
                    placeholder="LTxx xxxx xxxx xx34"
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formCardCVC">
                  <Form.Label>CVC</Form.Label>
                  <Form.Control {...register("cvc")} isInvalid={!!errors.cvc} />
                </Form.Group>
              </Row>
              <Row>
                <Button
                  variant="primary"
                  type="submit"
                  className="col-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Submit and pay"}
                </Button>
              </Row>
            </Form>
          </Col>

          <Col className="col-6">
            <h4>Order summary</h4>
            {cart.map((item) => {
              return (
                <Row key={item.designId} className="mb-2 align-items-center">
                  <Col xs={8}>{item.title ?? "Design not found"}</Col>
                  <Col xs={4} className="text-end">
                    {item.priceSnapshot.toFixed(2)} €
                  </Col>
                </Row>
              );
            })}

            <hr />

            <Row className="fw-bold">
              <Col xs={8}>Total</Col>
              <Col xs={4} className="text-end">
                {total.toFixed(2)} €
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default PaymentPage;
