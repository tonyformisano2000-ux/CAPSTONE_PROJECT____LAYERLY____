import { Row } from "react-bootstrap"
import type {Design } from "../../types"
import { useState } from "react";

interface DesignComponentProp{
  design:Design;
}

const PhotoComponent =(designObj:DesignComponentProp)=>{
    const design=designObj.design;
    const [currentImg, setCurrentImg]=useState<string>(design?.photoUrls[0] ?? 'https://placehold.co');
    return(
        <>
         <Row>
    <img src={currentImg} alt="selected image" className="col-12 object-fit-cover"/>
</Row>
<Row className="d-flex justify-content-center align-items-center">
{design && design.photoUrls.length > 1 && design.photoUrls.map((photoURL)=>{
    return(
<img src={photoURL} key={photoURL} className={`col-md-2, col-sm-4 object-fit-cover g-3 ${photoURL === currentImg && "shadow"}`} style={{
  transform: photoURL === currentImg ? 'scale(1.1)' : 'scale(1)',
  transition: 'width 0.2s ease'
}}
onClick={()=>{setCurrentImg(photoURL)}} />
    )
})} 

</Row></>
    )
}
// stlFileUrl: string;
// videoUrls?: string[];
export default PhotoComponent