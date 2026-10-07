import { Button, Col, Form, Alert } from "react-bootstrap";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import apiFetch from "../../api/apiClient";
import { loginSuccessAction } from "../../redux/actions/authActions";
import Layerly_logo from "../../assets/LAYERLY_logo.png";
interface LoginProps {
  modeSetter: () => void;
}

const loginZod = z.object({
  // il trim va PRIMA della validazione: altrimenti uno spazio incollato
  // insieme all'indirizzo lo fa risultare "invalid email"
  email: z
    .string()
    .trim()
    .min(1, "empty field")
    .pipe(z.email("invalid email")),
  pw: z.string("invalid charts detected").trim().nonempty("empty field"),
});

type loginFormData = z.infer<typeof loginZod>;

const LoginMode = ({ modeSetter }: LoginProps) => {
  const {
    register,
    handleSubmit,
    resetField,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<loginFormData>({ resolver: zodResolver(loginZod) });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmit = async (data: loginFormData) => {
    setLoginError(null);
    try {
      const result = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: data.email, password: data.pw }),
      });
      dispatch(loginSuccessAction(result.token, result.user));
      navigate("/");
    } catch (err) {
      console.error(err);
      setLoginError(
        err instanceof Error ? err.message : "Could not complete the login",
      );
      // svuoto solo la password: l'email resta cos'i' da poter ritentare
      resetField("pw");
      setFocus("pw");
    }
  };

  return (
    <Col className="col-5 d-flex flex-column align-items-center bg-light rounded-3 border border-light py-5 ">
      <img src={Layerly_logo} style={{height:"50px"}}/>
      <h1>Welcome back</h1>
      <p className=" text-dark">Log in to your Layerly account</p>
      <Form onSubmit={handleSubmit(onSubmit)} className="w-75">
        {loginError && (
          <Alert
            variant="danger"
            onClose={() => setLoginError(null)}
            dismissible
            className="py-2"
          >
            <i className="bi bi-exclamation-triangle me-2"></i>
            {loginError}
          </Alert>
        )}
        <Form.Group controlId="formGridEmail" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            {...register("email")}
            isInvalid={!!errors.email}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.email?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formGridPassword" className="mb-4">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            {...register("pw")}
            isInvalid={!!errors.pw}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.pw?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Button className="w-100" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log in"}
        </Button>
        <p className="mt-3 text-center">
          You don't have an account ?{" "}
          <span
            onClick={() => {
              modeSetter();
            }}
            className=" link-primary"
          >
            Register here
          </span>
        </p>
      </Form>
    </Col>
  );
};
export default LoginMode;
