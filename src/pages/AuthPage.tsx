import { Container, Row } from "react-bootstrap";
import { useState } from "react";
import LoginMode from "../components/AuthPageComponents/LoginMode";
import RegisterMode from "../components/AuthPageComponents/RegisterMode";

type AuthMode = "login" | "register";

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>("login");

  const modeSetter = () => setMode(mode === "login" ? "register" : "login");

  return (
    <Container fluid className="py-5">
      <Row className="justify-content-center">
        {mode === "login" ? (
          <LoginMode modeSetter={modeSetter} />
        ) : (
          <RegisterMode modeSetter={modeSetter} />
        )}
      </Row>
    </Container>
  );
};

export default AuthPage;