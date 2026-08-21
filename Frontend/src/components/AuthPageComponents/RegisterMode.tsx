import { Button, Col, Form } from "react-bootstrap";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface RegisterProps {
  modeSetter: () => void;
}

const registerZod = z
  .object({
    firstName: z.string().trim().min(2, "At least 2 characters required").nonempty("empty field"),
    lastName: z.string().trim().min(2, "At least 2 characters required").nonempty("empty field"),
    email: z.email("invalid email").trim().nonempty("empty field"),
    pw: z.string().min(6, "Password must be at least 6 characters").trim().nonempty("empty field"),
    confirmPw: z.string().trim().nonempty("empty field"),
  })
  .refine((data) => data.pw === data.confirmPw, {
    message: "Passwords don't match",
    path: ["confirmPw"],
  });

type registerFormData = z.infer<typeof registerZod>;

const RegisterMode = ({ modeSetter }: RegisterProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<registerFormData>({
    resolver: zodResolver(registerZod),
  });

  const onSubmit = (data: registerFormData) => {
    // TODO fetch
    console.log(data);
  };

  return (
    <Col className="col-5 d-flex flex-column align-items-center bg-light rounded-3 border border-light py-5">
      <img src="../assets/LAYERLY_logo.png" style={{ height: "50px" }} />
      <h1>Create account</h1>
      <p className="text-dark">Join Layerly today</p>
      <Form onSubmit={handleSubmit(onSubmit)} className="w-75">
        <Form.Group controlId="formGridFirstName" className="mb-3">
          <Form.Label>First name</Form.Label>
          <Form.Control {...register("firstName")} isInvalid={!!errors.firstName}></Form.Control>
        </Form.Group>
        <Form.Group controlId="formGridLastName" className="mb-3">
          <Form.Label>Last name</Form.Label>
          <Form.Control {...register("lastName")} isInvalid={!!errors.lastName}></Form.Control>
        </Form.Group>
        <Form.Group controlId="formGridEmail" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control {...register("email")} isInvalid={!!errors.email}></Form.Control>
        </Form.Group>
        <Form.Group controlId="formGridPassword" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" {...register("pw")} isInvalid={!!errors.pw}></Form.Control>
        </Form.Group>
        <Form.Group controlId="formGridConfirmPassword" className="mb-4">
          <Form.Label>Confirm password</Form.Label>
          <Form.Control type="password" {...register("confirmPw")} isInvalid={!!errors.confirmPw}></Form.Control>
        </Form.Group>
        <Button className="w-100" type="submit">
          Sign up
        </Button>
        <p className="mt-3 text-center">
          Already have an account?{" "}
          <span onClick={() => modeSetter()} className="link-primary">
            Log in here
          </span>
        </p>
      </Form>
    </Col>
  );
};

export default RegisterMode;