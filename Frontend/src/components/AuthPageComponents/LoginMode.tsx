import { Button, Col, Form,} from "react-bootstrap"
import {z} from "zod"
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import apiFetch  from "../../api/apiClient";
import  {loginSuccessAction}  from "../../redux/actions/authActions";
interface LoginProps{
modeSetter:()=>void;
}

const loginZod=z.object({
    email: z.email("invalid email").trim().nonempty("empty field"),
    pw: z.string("invalid charts detected").trim().nonempty("empty field"),
})



type loginFormData=z.infer<typeof loginZod>

const LoginMode=({modeSetter}:LoginProps)=>{
    const {register, handleSubmit, formState:{errors}}=useForm<loginFormData>({resolver:zodResolver(loginZod)})
const dispatch=useDispatch();
const navigate=useNavigate();

  const onSubmit = async (data: loginFormData) => {
  try {
    const result = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: data.email, password: data.pw }),
    });
    dispatch(loginSuccessAction(result.token, result.user));
    navigate('/');
  } catch (err) {
    console.error(err);
  }
}

    return(
    <Col className="col-5 d-flex flex-column align-items-center bg-light rounded-3 border border-light py-5 ">
    <img src="../../assets/LAYERLY_logo.png" alt=" Logo img" style={{height:"50px"}}/>
    <h1>Welcome back</h1>
    <p className=" text-dark">Log in to your Layerly account</p>
    <Form onSubmit={handleSubmit(onSubmit)} className="w-75">
        <Form.Group controlId="formGridEmail" className="mb-3" >
            <Form.Label>Email</Form.Label>
            <Form.Control {...register("email")} isInvalid={!!errors.email}></Form.Control>
        </Form.Group>
        <Form.Group controlId="formGridPassword" className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control {...register("pw")} isInvalid={!!errors.pw}></Form.Control>
        </Form.Group>
        <Button className="w-100" type="submit"> Log in</Button>
        <p className="mt-3 text-center">You don't have an account ? <span onClick={()=>{modeSetter()}} className=" link-primary">Register here</span></p>
    </Form>
    </Col>)
}
export default LoginMode