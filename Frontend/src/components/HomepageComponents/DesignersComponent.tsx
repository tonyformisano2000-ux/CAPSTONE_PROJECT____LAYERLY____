import { useState, useEffect } from "react";
import { Container, Row, Col, Badge } from "react-bootstrap";
import { Link } from "react-router";
import apiFetch from "../../api/apiClient";
import type { User } from "../../types";
import defaultAvatar from "../../assets/Sample_User_Icon.png";
import "../../generalCss.css";

const DesignersComponent = () => {
  const [designers, setDesigners] = useState<User[]>([]);

  useEffect(() => {
    // /users arriva gia' ordinato dal piu' recente, quindi lo slice tiene i 6 nuovi
    apiFetch("/users")
      .then((allUsers: User[]) => {
        setDesigners(allUsers.filter((u) => u.role === "DESIGNER").slice(0, 6));
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <Container className="my-3">
      <h2 className="h4 mb-3">Check out our newest designers!</h2>

      {designers.length === 0 ? (
        <p className="text-muted">No designers to show.</p>
      ) : (
        <Row className="g-3">
          {designers.map((designer) => (
            <Col key={designer.id} xs={6} md={4} lg={2}>
              <Link
                to={`/designer/${designer.id}`}
                className="text-decoration-none text-reset"
              >
                <div className="h-100 d-flex flex-column align-items-center text-center">
                  <img
                    src={designer.profilePhotoUrl || defaultAvatar}
                    className="rounded-circle object-fit-cover mb-2 img-fluid"
                    style={{ width: "140px", height: "140px" }}
                  />
                  <p className="fw-medium mb-1 w-100">
                    {designer.firstName} {designer.lastName}
                  </p>
                  <Badge
                    bg={
                      designer.designerLevel === "PROFESSIONAL"
                        ? "primary"
                        : "secondary"
                    }
                  >
                    {designer.designerLevel === "PROFESSIONAL"
                      ? "PRO"
                      : "Amatorial"}
                  </Badge>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default DesignersComponent;
