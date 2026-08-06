import { mockUser } from "../mockData/mockUsers"
import { useParams } from "react-router"
const DesignerPage =()=>{
    const {designerId}=useParams();
    const designer =mockUser.find((designer)=>designer.id===designerId)
    return(
    <h1>hello {designer?.firstName}</h1>
    )

}

export default DesignerPage