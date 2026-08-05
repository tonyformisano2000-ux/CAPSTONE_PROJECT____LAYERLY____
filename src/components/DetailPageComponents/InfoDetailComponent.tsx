import type { Design, User} from "../../types";
import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router";
interface DesignDesignerProp{
  design:Design;
    designer:User;
}

const InfoDetailComponent=({design, designer}:DesignDesignerProp)=>{
    const published=design.publishedAt.split("-")
return(
    <>
<Row className="ms-4 mt-3 d-flex flex-column">
    <Row>
    <h1 className=""> {design.title} </h1>
    <Col className="col-3">
    <h6>rated {design.rating}/5 </h6>
    </Col>
<Col className="col-8 d-flex justify-content-end align-middle">
    <span className="h6 text-nowrap">published on {published[1]}/{published[0]} by -</span><Link to={`/designer/${designer.id}`} className="text-decoration-none text-nowrap" >{designer.firstName} {designer.lastName} <img src={designer.profilePhotoUrl} alt="Designer photo" className="rounded-circle" style={{height:"23px", width:"auto"}}/></Link>
    {designer.designerLevel==="PROFESSIONAL" && <p className="fw-bold">PRO</p>}
    </Col></Row>
    <Row className="my-4">
        <h5>{design.subtitle}</h5>
        <text>{design.description}</text>
    </Row>
    <Row>
<h5>More about my design</h5>
<h6>Technology: {design.technology}</h6>
    </Row>
    <Row className="my-3 d-flex justify-content-between">
    <h3>Price: {design.price}€</h3>
    <Button className="btn btn-lg ">Download</Button>

    </Row>
    </Row>
    </>
)
}
export default InfoDetailComponent