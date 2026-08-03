import {Container, Row } from "react-bootstrap";
import { mockUser } from "../../mockData/mockUsers";
import "../../generalCss.css"

const DesignersComponent = () => {
  return (
    <Container>
      <Row>
        {mockUser.filter((user)=>user.role=="DESIGNER").slice(0, 6).map((designer) => {
          return (
          <div className="d-flex flex-column justify-content-center col-2 mt-4">
        <img src={designer.profilePhotoUrl} className="object-fit-cover rounded-circle" />
        <h3 className="text-center">{designer.firstName} {designer.lastName}</h3>
        {designer.designerLevel=="AMATEUR"? <p className="text-center">Amatorial designer</p> : <p className="text-center">PRO designer</p>}
          </div>);
        })}
      </Row>
    </Container>
  );
};

export default DesignersComponent;