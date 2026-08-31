import { Container, Row, Col } from "react-bootstrap"
import { useParams } from "react-router";
import PhotoComponent from "../components/DetailPageComponents/PhotosComponent";
import InfoDetailComponent from "../components/DetailPageComponents/InfoDetailComponent"
import { useState } from "react";
import { useEffect } from "react";
import apiFetch from "../api/apiClient";
import type { Design } from "../types";
const Detail =()=>{
    const [design, setDesign] = useState<Design | null>(null);
const {id}=useParams();// metto id tra le graffe perché useparams restituisce un oggetto, con le graffe faccio "deconstructoring"

useEffect(() => {
  if (!id) return;
  apiFetch(`/designs/${id}`)
    .then(setDesign)
    .catch((err) => console.error(err));
}, [id]);
if (!design){return(<h1 className="text-center fw-bolder">DESIGN NOT FOUND.</h1>)}
    return(
    <Container className="my-4">
<Row>
    <Col md="6">
   <PhotoComponent design={design}/>
    </Col>
    <Col md="6">
    <InfoDetailComponent design={design}/>
    </Col>
</Row>
    </Container>)
}
export default Detail