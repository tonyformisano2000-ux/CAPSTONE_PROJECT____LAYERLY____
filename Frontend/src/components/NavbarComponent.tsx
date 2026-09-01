import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import { DropdownButton } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../types/index";
import { useNavigate } from "react-router";
import Layerly_logo from "../assets/LAYERLY_logo.png";
import simpleUser from "../assets/Sample_User_Icon.png";
import { logoutAction } from "../redux/actions/authActions";
function NavbarComponent() {
  const logoURL = Layerly_logo;
  const navigate = useNavigate();
  const inTheCart = useSelector((state: RootState) => state.cart.content);
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = !!token;
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="bg-body-tertinary">
      <Container fluid className="d-flex justify-content-between">
        <Navbar.Brand onClick={() => navigate("/")}>
          <img
            src={logoURL}
            alt="Layerly Logo"
            style={{ height: "70px", marginLeft: "10px" }}
          />
        </Navbar.Brand>

        <Form
          className="d-flex align-items-center flex-grow-1"
          style={{ maxWidth: "40%" }}
        >
          <Form.Control
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
          />
          <Button variant="outline-success">Search</Button>
        </Form>

        <div className="d-flex align-items-center">
          <i
            className="bi bi-cart4 text-black fs-4 mx-3 mt-2 position-relative"
            onClick={() => navigate("/cart")}
          >
            {inTheCart.length > 0 && (
              <p
                className="position-absolute rounded-circle ms-1 text-white bg-danger top-0 start-50 d-flex justify-content-center"
                style={{ fontSize: "0.5rem", width: "15px", height: "15px" }}
              >
                {inTheCart.length}
              </p>
            )}
          </i>

          {isLoggedIn ? (
            <DropdownButton
              align="end"
              title={
                <>
                  <img
                    src={simpleUser}
                    alt="userIcon"
                    className="rounded-circle bg-secondary-subtle border border-secondary border-3"
                    style={{ height: "30px", width: "auto" }}
                  />
                  {user && <span className="ms-2 small">{user.firstName}</span>}
                </>
              }
              id="navbarScrollingDropdown"
              variant="white"
            >
              <Dropdown.Item onClick={() => navigate("/profile")}>
                My Profile
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/library")}>
                My Library
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item disabled>Business (coming soon!)</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </DropdownButton>
          ) : (
            <Button
              className="border border-danger bg-white text-danger"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}
        </div>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
