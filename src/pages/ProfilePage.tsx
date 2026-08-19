import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { mockUser } from "../mockData/mockUsers";
import { mockDesigns } from "../mockData/mockDesigns";

type ProfileSection = "info" | "publish" | "history";

// MOCK TEMPORANEO: utente loggato finto, in attesa dell'auth reale
const currentUser = mockUser[0];
const mockPurchasedIds = ["d2", "d4"]; // stesso mock di LibraryPage, da unificare col backend

const MAX_PHOTOS = 8;

const infoSchema = z.object({
  firstName: z.string().trim().min(2, "At least 2 characters required"),
  lastName: z.string().trim().min(2, "At least 2 characters required"),
  location: z.string().trim().optional(),
});
type InfoFormData = z.infer<typeof infoSchema>;

const publishSchema = z.object({
  title: z.string().trim().min(2, "Title is required"),
  description: z.string().trim().optional(),
  technology: z.string().trim().min(2, "Technology is required"),
  price: z.number().nonnegative("Price cannot be negative"),
});
type PublishFormData = z.infer<typeof publishSchema>;

const ProfilePage = () => {
  const [section, setSection] = useState<ProfileSection>("info");
  const [photos, setPhotos] = useState<File[]>([]);
  const editIndexRef = useRef<number | null>(null); // se stiamo sostituendo una foto esistente, tiene traccia di quale indice
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register: registerInfo,
    handleSubmit: handleSubmitInfo,
    formState: { errors: infoErrors },
  } = useForm<InfoFormData>({
    resolver: zodResolver(infoSchema),
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      location: currentUser.location ?? "",
    },
  });

  const {
    register: registerPublish,
    handleSubmit: handleSubmitPublish,
    formState: { errors: publishErrors },
  } = useForm<PublishFormData>({
    resolver: zodResolver(publishSchema),
  });

  const onSaveInfo = (data: InfoFormData) => {
    console.log(data); // TODO: fetch di aggiornamento profilo
  };

  const onPublishDesign = (data: PublishFormData) => {
    console.log(data, photos); // TODO: fetch di creazione design (multipart, con i file)
  };

  const openFilePicker = (indexToReplace: number | null = null) => {
    editIndexRef.current = indexToReplace;
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const replaceIndex = editIndexRef.current;

    if (replaceIndex !== null) {
      // stiamo sostituendo una foto esistente a quell'indice
      const updated = [...photos];
      updated[replaceIndex] = file;
      setPhotos(updated);
    } else {
      // aggiunta di una nuova foto
      setPhotos([...photos, file]);
    }

    editIndexRef.current = null;
    e.target.value = ""; // reset input, permette di riselezionare lo stesso file due volte di fila
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotos(photos.filter((_, index) => index !== indexToRemove));
  };

  const purchasedDesigns = mockDesigns.filter((design) => mockPurchasedIds.includes(design.id));

  return (
    <Container className="mt-4">
      <Row>
        <Col md={3}>
          <div className="d-flex flex-column align-items-center mb-4">
            <Image
              src={currentUser.profilePhotoUrl}
              roundedCircle
              style={{ width: "64px", height: "64px", objectFit: "cover" }}
              className="mb-2"
            />
            <p className="fw-medium mb-0">
              {currentUser.firstName} {currentUser.lastName}
            </p>
            <p className="text-muted small">{currentUser.email}</p>
          </div>

          <div className="d-flex flex-column gap-1">
            <Button
              variant={section === "info" ? "light" : "outline-light"}
              className="text-start text-dark"
              onClick={() => setSection("info")}
            >
              <i className="bi bi-person me-2"></i>Personal info
            </Button>
            <Button
              variant={section === "publish" ? "light" : "outline-light"}
              className="text-start text-dark"
              onClick={() => setSection("publish")}
            >
              <i className="bi bi-upload me-2"></i>Publish design
            </Button>
            <Button
              variant={section === "history" ? "light" : "outline-light"}
              className="text-start text-dark"
              onClick={() => setSection("history")}
            >
              <i className="bi bi-receipt me-2"></i>Purchase history
            </Button>
          </div>
        </Col>

        <Col md={9}>
          {section === "info" && (
            <>
              <h2 className="h4 mb-3">Personal info</h2>
              <Form onSubmit={handleSubmitInfo(onSaveInfo)} style={{ maxWidth: "400px" }}>
                <Form.Group className="mb-3" controlId="firstName">
                  <Form.Label>First name</Form.Label>
                  <Form.Control {...registerInfo("firstName")} isInvalid={!!infoErrors.firstName} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="lastName">
                  <Form.Label>Last name</Form.Label>
                  <Form.Control {...registerInfo("lastName")} isInvalid={!!infoErrors.lastName} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="location">
                  <Form.Label>Location</Form.Label>
                  <Form.Control {...registerInfo("location")} isInvalid={!!infoErrors.location} />
                </Form.Group>
                <Button type="submit" variant="primary">
                  Save changes
                </Button>
              </Form>
            </>
          )}

          {section === "publish" && (
            <>
              <h2 className="h4 mb-3">Publish a new design</h2>

              {/* input file nativo, nascosto, condiviso da tutte le card */}
              <Form.Control
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />

              <Row className="g-3 mb-4" style={{ maxWidth: "600px" }}>
                {photos.length < MAX_PHOTOS && (
                  <Col xs={3}>
                    <div
                      onClick={() => openFilePicker(null)}
                      className="border rounded d-flex flex-column align-items-center justify-content-center text-muted"
                      style={{ height: "100px", cursor: "pointer" }}
                    >
                      <i className="bi bi-plus-lg fs-3"></i>
                      <span className="small">Add photo</span>
                    </div>
                  </Col>
                )}

                {photos.map((photo, index) => (
                  <Col xs={3} key={index}>
                    <div className="border rounded overflow-hidden" style={{ height: "100px" }}>
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`upload-${index}`}
                        className="w-100 h-75 object-fit-cover"
                      />
                      <div className="d-flex justify-content-around align-items-center h-25 bg-light">
                        <i
                          className="bi bi-pencil small"
                          style={{ cursor: "pointer" }}
                          onClick={() => openFilePicker(index)}
                        ></i>
                        <i
                          className="bi bi-trash small text-danger"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleRemovePhoto(index)}
                        ></i>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>

              <Form onSubmit={handleSubmitPublish(onPublishDesign)} style={{ maxWidth: "500px" }}>
                <Form.Group className="mb-3" controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control {...registerPublish("title")} isInvalid={!!publishErrors.title} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={3} {...registerPublish("description")} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="technology">
                  <Form.Label>Technology</Form.Label>
                  <Form.Control placeholder="FDM, Resin..." {...registerPublish("technology")} isInvalid={!!publishErrors.technology} />
                </Form.Group>
                <Form.Group className="mb-4" controlId="price">
                  <Form.Label>Price (€)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    {...registerPublish("price", { valueAsNumber: true })}
                    isInvalid={!!publishErrors.price}
                  />
                </Form.Group>
                <Button type="submit" variant="primary">
                  Publish
                </Button>
              </Form>
            </>
          )}

          {section === "history" && (
            <>
              <h2 className="h4 mb-3">Purchase history</h2>
              {purchasedDesigns.length === 0 ? (
                <p className="text-muted">No purchases yet.</p>
              ) : (
                purchasedDesigns.map((design) => (
                  <div key={design.id} className="d-flex justify-content-between border-bottom py-2">
                    <span>{design.title}</span>
                    <span className="text-muted">{design.price.toFixed(2)} €</span>
                  </div>
                ))
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;