import { Container, Row, Col, Nav } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router";
import { mockDesigns } from "../mockData/mockDesigns";

type LibraryTab = "saved" | "purchased";

// MOCK TEMPORANEO: senza entità SavedDesign/Order reali ancora,
// simuliamo le due liste prendendo alcuni id fissi da mockDesigns.
// Da sostituire con dati reali (filtrati per userId) quando arriva il backend.
const mockSavedIds = ["d1", "d3", "d5"];
const mockPurchasedIds = ["d2", "d4"];

const LibraryPage = () => {
  const [activeTab, setActiveTab] = useState<LibraryTab>("saved");

  const designsToShow = mockDesigns.filter((design) =>
    activeTab === "saved"
      ? mockSavedIds.includes(design.id)
      : mockPurchasedIds.includes(design.id),
  );

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Your library</h1>

      <Nav variant="tabs" className="mb-4">
        <Nav.Item>
          <Nav.Link
            active={activeTab === "saved"}
            onClick={() => setActiveTab("saved")}
          >
            Saved
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === "purchased"}
            onClick={() => setActiveTab("purchased")}
          >
            Purchased
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {designsToShow.length === 0 ? (
        <p className="text-muted">
          {activeTab === "saved"
            ? "You haven't saved any design yet."
            : "You haven't purchased any design yet."}
        </p>
      ) : (
        <Row className="g-3">
          {designsToShow.map((design) => (
            <Col key={design.id} xs={6} md={4} lg={3}>
              <Link
                to={`/details/${design.id}`}
                className="text-decoration-none text-reset"
              >
                <div className="border rounded overflow-hidden h-100">
                  <img
                    src={design.photoUrls[0]}
                    alt={design.title}
                    className="w-100 object-fit-cover"
                    style={{ height: "120px" }}
                  />
                  <div className="p-2">
                    <p className="small fw-medium mb-0 text-truncate">
                      {design.title}
                    </p>
                  </div>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default LibraryPage;
