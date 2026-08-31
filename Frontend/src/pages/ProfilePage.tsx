import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import apiFetch, { apiUpload } from "../api/apiClient";
import type { RootState, Order } from "../types";

type ProfileSection = "info" | "publish" | "history";

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
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [section, setSection] = useState<ProfileSection>("info");
  const [photos, setPhotos] = useState<File[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const editIndexRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register: registerInfo,
    handleSubmit: handleSubmitInfo,
    formState: { errors: infoErrors },
  } = useForm<InfoFormData>({
    resolver: zodResolver(infoSchema),
    defaultValues: {
      firstName: currentUser?.firstName ?? "",
      lastName: currentUser?.lastName ?? "",
      location: "",
    },
  });

  const {
    register: registerPublish,
    handleSubmit: handleSubmitPublish,
    formState: { errors: publishErrors },
  } = useForm<PublishFormData>({
    resolver: zodResolver(publishSchema),
  });

  useEffect(() => {
    if (!currentUser) return;
    apiFetch(`/orders/customer/${currentUser.id}`)
      .then(setOrders)
      .catch((err) => console.error(err));
  }, [currentUser]);

  const onSaveInfo = (data: InfoFormData) => {
    console.log(data); // TODO: endpoint di aggiornamento profilo non ancora implementato lato backend
  };

  const onPublishDesign = async (data: PublishFormData) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      formData.append('technology', data.technology);
      formData.append('price', data.price.toString());
      photos.forEach((photo) => formData.append('photos', photo));

      await apiUpload('/designs', formData);
      setPhotos([]);
      alert('Design published!');
    } catch (err) {
      console.error(err);
    }
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
      const updated = [...photos];
      updated[replaceIndex] = file;
      setPhotos(updated);
    } else {
      setPhotos([...photos, file]);
    }

    editIndexRef.current = null;
    e.target.value = "";
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotos(photos.filter((_, index) => index !== indexToRemove));
  };

  if (!currentUser) {
    return (
      <Container className="mt-5">
        <h1>You must be logged in to view this page.</h1>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col md={3}>
          <div className="d-flex flex-column align-items-center mb-4">
            <Image
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
              {orders.length === 0 ? (
                <p className="text-muted">No purchases yet.</p>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="d-flex justify-content-between border-bottom py-2">
                    <span>Order #{order.id} ({order.status})</span>
                    <span className="text-muted">{order.total.toFixed(2)} €</span>
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