import { Container, Row, Col, Form, Button, Image, Badge } from "react-bootstrap";
import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router";
import { userUpdatedAction } from "../redux/actions/authActions";
import defaultAvatar from "../assets/Sample_User_Icon.png";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import apiFetch, { apiUpload } from "../api/apiClient";
import type { RootState, Order, Design } from "../types";

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
  price: z
    .number({ error: "Price is required" })
    .nonnegative("Price cannot be negative"),
});
type PublishFormData = z.infer<typeof publishSchema>;

const ProfilePage = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [section, setSection] = useState<ProfileSection>("info");
  const [photos, setPhotos] = useState<File[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [myDesigns, setMyDesigns] = useState<Design[]>([]);
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const isDesigner = currentUser?.role === "DESIGNER";
  const dispatch = useDispatch();
  const editIndexRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // se l'utente non ha ancora scelto una foto si mostra l'icona segnaposto
  const avatarSrc = currentUser?.profilePhotoUrl || defaultAvatar;

  const handleAvatarSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      setIsUploadingAvatar(true);
      const formData = new FormData();
      formData.append("photo", file);
      const updatedUser = await apiUpload("/users/me/photo", formData);
      dispatch(userUpdatedAction(updatedUser));
    } catch (err) {
      console.error(err);
      alert(
        `Photo upload failed: ${
          err instanceof Error ? err.message : "unknown error"
        }`,
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

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
    reset: resetPublish,
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

  // designerId arriva come numero dal backend mentre in AuthState l'id e' una
  // stringa: il confronto va fatto convertendo, altrimenti la lista resta vuota
  const loadMyDesigns = useCallback(() => {
    if (!currentUser) return;
    apiFetch("/designs")
      .then((allDesigns: Design[]) => {
        setMyDesigns(
          allDesigns.filter(
            (d) => String(d.designerId) === String(currentUser.id),
          ),
        );
      })
      .catch((err) => console.error(err));
  }, [currentUser]);

  useEffect(() => {
    loadMyDesigns();
  }, [loadMyDesigns]);

  const handleDeleteDesign = async (design: Design) => {
    if (!window.confirm(`Do you want to delete "${design.title}"?`)) return;

    try {
      setDeletingId(design.id);
      await apiFetch(`/designs/${design.id}`, { method: "DELETE" });
      setMyDesigns((current) => current.filter((d) => d.id !== design.id));
    } catch (err) {
      console.error(err);
      alert(
        `Delete failed: ${
          err instanceof Error ? err.message : "unknown error"
        }`,
      );
    } finally {
      setDeletingId(null);
    }
  };

  const onSaveInfo = (data: InfoFormData) => {
    console.log(data); // TODO: endpoint di aggiornamento profilo non ancora implementato lato backend
  };

  const onPublishDesign = async (data: PublishFormData) => {
    if (photos.length === 0) {
      alert("Add at least one photo before publishing the design.");
      return;
    }

    try {
      setIsPublishing(true);
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      formData.append("technology", data.technology);
      formData.append("price", data.price.toString());
      photos.forEach((photo) => formData.append("photos", photo));

      await apiUpload("/designs", formData);
      setPhotos([]);
      resetPublish();
      // torna alla griglia con il nuovo design gia' presente
      setShowPublishForm(false);
      loadMyDesigns();
      alert("Design published successfully");
    } catch (err) {
      console.error(err);
      alert(
        `Publishing failed: ${
          err instanceof Error ? err.message : "unknown error"
        }`,
      );
    } finally {
      setIsPublishing(false);
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
              src={avatarSrc}
              roundedCircle
              style={{ width: "64px", height: "64px", objectFit: "cover" }}
              className="mb-2 border"
            />
            <p className="fw-medium mb-0">
              {currentUser.firstName} {currentUser.lastName}
            </p>
            <p className="text-muted small mb-2">{currentUser.email}</p>
            <Badge bg={isDesigner ? "primary" : "secondary"} className="mb-1">
              <i
                className={`bi ${
                  isDesigner ? "bi-brush" : "bi-bag"
                } me-1`}
              ></i>
              {isDesigner ? "Designer account" : "Customer account"}
            </Badge>
            <p className="text-muted small text-center mb-0">
              {isDesigner
                ? "You can publish your own designs"
                : "Only a Designer account can publish designs"}
            </p>
          </div>

          <div className="d-flex flex-column gap-1">
            <Button
              variant={section === "info" ? "light" : "outline-light"}
              className="text-start text-dark"
              onClick={() => setSection("info")}
            >
              <i className="bi bi-person me-2"></i>Personal info
            </Button>
            {isDesigner && (
              <Button
                variant={section === "publish" ? "light" : "outline-light"}
                className="text-start text-dark"
                onClick={() => {
                  setSection("publish");
                  setShowPublishForm(false);
                }}
              >
                <i className="bi bi-collection me-2"></i>Designs
              </Button>
            )}
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

              <div
                className="mb-4 p-3 border rounded d-flex align-items-center gap-3"
                style={{ maxWidth: "400px" }}
              >
                <div
                  className="rounded-circle overflow-hidden border flex-shrink-0 d-flex align-items-center justify-content-center"
                  style={{ width: "96px", height: "96px" }}
                >
                  <img
                    src={avatarSrc}
                    className="img-fluid w-100 h-100 object-fit-cover"
                  />
                </div>
                <div>
                  <p className="fw-medium mb-1">Profile photo</p>
                  <p className="text-muted small mb-2">
                    {currentUser.profilePhotoUrl
                      ? "Pick a new image to replace the current one."
                      : "No photo uploaded: the placeholder icon is shown."}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    ref={avatarInputRef}
                    onChange={handleAvatarSelect}
                    className="d-none"
                  />
                  <Button
                    variant="outline-primary"
                    size="sm"
                    disabled={isUploadingAvatar}
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    <i className="bi bi-camera me-2"></i>
                    {isUploadingAvatar
                      ? "Uploading..."
                      : currentUser.profilePhotoUrl
                        ? "Change photo"
                        : "Choose photo"}
                  </Button>
                </div>
              </div>

              <div className="mb-4 p-3 border rounded" style={{ maxWidth: "400px" }}>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="fw-medium">Account type</span>
                  <Badge bg={isDesigner ? "primary" : "secondary"}>
                    {isDesigner ? "DESIGNER" : "CUSTOMER"}
                  </Badge>
                </div>
                <p className="text-muted small mb-0 mt-2">
                  {isDesigner
                    ? "As a Designer you can publish and manage your designs from the \"Designs\" section."
                    : "Customer accounts can buy and download designs, but cannot publish them."}
                </p>
              </div>
              <Form
                onSubmit={handleSubmitInfo(onSaveInfo)}
                style={{ maxWidth: "400px" }}
              >
                <Form.Group className="mb-3" controlId="firstName">
                  <Form.Label>First name</Form.Label>
                  <Form.Control
                    {...registerInfo("firstName")}
                    isInvalid={!!infoErrors.firstName}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="lastName">
                  <Form.Label>Last name</Form.Label>
                  <Form.Control
                    {...registerInfo("lastName")}
                    isInvalid={!!infoErrors.lastName}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="location">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    {...registerInfo("location")}
                    isInvalid={!!infoErrors.location}
                  />
                </Form.Group>
                <Button type="submit" variant="primary">
                  Save changes
                </Button>
              </Form>
            </>
          )}

          {section === "publish" && isDesigner && (
            <>
              <h2 className="h4 mb-3">Designs</h2>

              <Row className="g-3 mb-4">
                {/* prima card: apre il form di pubblicazione */}
                <Col xs={6} md={4} lg={3}>
                  <div
                    onClick={() => setShowPublishForm(true)}
                    className={`border rounded h-100 d-flex flex-column align-items-center justify-content-center text-muted ${
                      showPublishForm ? "border-primary text-primary" : ""
                    }`}
                    style={{
                      minHeight: "160px",
                      cursor: "pointer",
                      backgroundColor: "#e9ecef",
                    }}
                  >
                    <i className="bi bi-plus-lg" style={{ fontSize: "2.5rem" }}></i>
                    <span className="small text-center px-2">
                      Publish new design
                    </span>
                  </div>
                </Col>

                {myDesigns.map((design) => (
                  <Col key={design.id} xs={6} md={4} lg={3}>
                    <div className="border rounded overflow-hidden h-100 d-flex flex-column">
                      <img
                        src={design.photoUrls[0]}
                        alt={design.title}
                        className="w-100 object-fit-cover"
                        style={{ height: "100px" }}
                      />
                      <div className="p-2 flex-grow-1">
                        <p className="small fw-medium mb-1 text-truncate">
                          {design.title}
                        </p>
                        <span className="small text-muted">
                          {design.price.toFixed(2)}€
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center gap-1 p-2 pt-0">
                        <Link
                          to={`/details/${design.id}`}
                          className="btn btn-outline-primary btn-sm"
                          title="See detail"
                        >
                          <i className="bi bi-eye"></i>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          className="text-white"
                          title="Delete"
                          disabled={deletingId === design.id}
                          onClick={() => handleDeleteDesign(design)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>

              {showPublishForm && (
                <>
              <h3 className="h5 mb-3">Publish a new design</h3>

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
                    <div
                      className="border rounded overflow-hidden"
                      style={{ height: "100px" }}
                    >
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

              <Form
                onSubmit={handleSubmitPublish(onPublishDesign)}
                style={{ maxWidth: "500px" }}
              >
                <Form.Group className="mb-3" controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    {...registerPublish("title")}
                    isInvalid={!!publishErrors.title}
                  />
                  <Form.Control.Feedback type="invalid">
                    {publishErrors.title?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    {...registerPublish("description")}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="technology">
                  <Form.Label>Technology</Form.Label>
                  <Form.Control
                    placeholder="FDM, Resin..."
                    {...registerPublish("technology")}
                    isInvalid={!!publishErrors.technology}
                  />
                  <Form.Control.Feedback type="invalid">
                    {publishErrors.technology?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-4" controlId="price">
                  <Form.Label>Price (€)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    {...registerPublish("price", { valueAsNumber: true })}
                    isInvalid={!!publishErrors.price}
                  />
                  <Form.Control.Feedback type="invalid">
                    {publishErrors.price?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <div className="d-flex gap-2">
                  <Button type="submit" variant="primary" disabled={isPublishing}>
                    {isPublishing ? "Publishing..." : "Publish"}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    disabled={isPublishing}
                    onClick={() => {
                      setShowPublishForm(false);
                      setPhotos([]);
                      resetPublish();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
                </>
              )}
            </>
          )}

          {section === "history" && (
            <>
              <h2 className="h4 mb-3">Purchase history</h2>
              {orders.length === 0 ? (
                <p className="text-muted">No purchases yet.</p>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="d-flex justify-content-between border-bottom py-2"
                  >
                    <span>
                      Order #{order.id} ({order.status})
                    </span>
                    <span className="text-muted">
                      {order.total.toFixed(2)} €
                    </span>
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
