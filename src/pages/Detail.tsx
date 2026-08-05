import { Container, Row, Col } from "react-bootstrap"
import { useParams } from "react-router";
import { mockDesigns } from "../mockData/mockDesigns";
import PhotoComponent from "../components/DetailPageComponents/PhotosComponent";
import InfoDetailComponent from "../components/DetailPageComponents/InfoDetailComponent"
import { mockUser } from "../mockData/mockUsers";
const Detail =()=>{
const {id}=useParams();// metto id tra le graffe perché useparams restituisce un oggetto, con le graffe faccio "deconstructoring"
const design=mockDesigns.find((design)=>design.id==id)
const designer=mockUser.filter((designer)=>designer.role==="DESIGNER").find((designer)=>designer.id===design?.designerId)
if (!design){return(<h1 className="text-center fw-bolder">DESIGN NOT FOUND.</h1>)}
if (!designer){return <h1 className="text-center fw-bolder">THIS DESIGNER IS NO LONGER WITH US R.I.P </h1>}
    return(
    <Container className="my-4">
<Row>
    <Col md="6">
   <PhotoComponent design={design}/>
    </Col>
    <Col md="6">
    <InfoDetailComponent design={design} designer={designer}/>
    </Col>
</Row>
    </Container>)
}
export default Detail