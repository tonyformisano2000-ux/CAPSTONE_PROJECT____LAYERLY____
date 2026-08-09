import { Container, Row, Col, Badge } from "react-bootstrap";
import { useParams, Link } from "react-router";
import { mockUser } from "../mockData/mockUsers";
import { mockDesigns } from "../mockData/mockDesigns";

const DesignerPage = () => {
  const { id } = useParams();
  const designer = mockUser.find((user) => user.id === id);

  if (!designer) {
    return (
      <Container className="mt-5">
        <h1>Designer non trovato</h1>
      </Container>
    );
  }

  const designerDesigns = mockDesigns
    .filter((design) => design.designerId === designer.id)
    .slice(0, 6);

  return (
    <Container className="px-0">
      <div className="position-relative">
        <div
          style={{
            height: "180px",
            backgroundImage: `url(${designer.backgroundPhotoUrl ?? ""})`,
            backgroundColor: "#e9ecef",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Container className="border rounded-4">
          <img
            src={designer.profilePhotoUrl}
            alt={`${designer.firstName} ${designer.lastName}`}
            className="rounded-circle border border-4 border-white"
            style={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
              marginTop: "-60px",
            }}
          />

          <div className="mt-2 mb-4">
            <h1 className="mb-1">
              {designer.firstName} {designer.lastName}
            </h1>

            <div className="d-flex align-items-center flex-wrap gap-3 text-muted small">
              {designer.location && (
                <span>
                  <i className="bi bi-geo-alt me-1"></i>
                  {designer.location}
                </span>
              )}
              <span>
                <i className="bi bi-calendar3 me-1"></i>
                su Layerly da{" "}
                {new Date(designer.createdAt).toLocaleDateString("it-IT", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              {designer.designerLevel && (
                <Badge bg={designer.designerLevel === "PROFESSIONAL" ? "primary" : "secondary"}>
                  {designer.designerLevel === "PROFESSIONAL" ? "Designer professionale" : "Designer amatoriale"}
                </Badge>
              )}
            </div>

            {designer.tags && designer.tags.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mt-2">
                {designer.tags.map((tag) => (
                  <span key={tag} className="badge bg-light text-dark border">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Container>
      </div>

      <Container className="my-4">
        <h2 className="h4 mb-3">Design pubblicati</h2>

        {designerDesigns.length === 0 ? (
          <p className="text-muted">Nessun design pubblicato ancora.</p>
        ) : (
          <Row className="g-3">
            {designerDesigns.map((design) => (
              <Col key={design.id} xs={6} md={4} lg={3}>
                <Link to={`/details/${design.id}`} className="text-decoration-none text-reset">
                  <div className="border rounded overflow-hidden h-100">
                    <img
                      src={design.photoUrls[0]}
                      alt={design.title}
                      className="w-100 object-fit-cover"
                      style={{ height: "100px" }}
                    />
                    <div className="p-2">
                      <p className="small fw-medium mb-1 text-truncate">{design.title}</p>
                      <div className="d-flex justify-content-between align-items-center small text-muted">
                        <span>
                          <i className="bi bi-star-fill text-warning me-1"></i>
                          {design.rating}
                        </span>
                        <i className="bi bi-chat"></i>
                      </div>
                    </div>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </Container>
  );
};

export default DesignerPage;