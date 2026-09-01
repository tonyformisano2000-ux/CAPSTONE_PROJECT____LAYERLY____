import { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import apiFetch from "../../api/apiClient";
import type { User } from "../../types";
import "../../generalCss.css";

const DesignersComponent = () => {
  const navigate = useNavigate();
  const [designers, setDesigners] = useState<User[]>([]);

  useEffect(() => {
    apiFetch("/users")
      .then((allUsers: User[]) => {
        setDesigners(allUsers.filter((u) => u.role === "DESIGNER").slice(0, 6));
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <Container className="my-3">
      <Row>
        <h2>Check out our top designers!</h2>
        {designers.map((designer) => {
          return (
            <div
              key={designer.id}
              className="btn d-flex flex-column justify-content-center align-items-start col-lg-2 col-sm-4 mt-4"
              onClick={() => navigate(`/designer/${designer.id}`)}
            >
              <img
                src={designer.profilePhotoUrl}
                className="object-fit-cover rounded-circle"
              />
              <h3 className="text-center">
                {designer.firstName} {designer.lastName}
              </h3>
              {designer.designerLevel === "AMATEUR" ? (
                <p className="text-center">Amatorial designer</p>
              ) : (
                <p className="text-center">PRO designer</p>
              )}
            </div>
          );
        })}
      </Row>
    </Container>
  );
};

export default DesignersComponent;
