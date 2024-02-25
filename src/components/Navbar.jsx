import React from "react";
import { randomAvatar } from "../utils";
import { Navbar, Container, Image, NavDropdown, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import logout from "../hooks/user.actions"

function Navigationbar() {
  const navigate = useNavigate();

  /*
  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login/");
  };
  */
  const handleLogout = () => {
    logout().then(() => {
      navigate("/login");
    }).catch(error => {
      console.error("Logout failed:", error);
      // Optionally, display an error message to the user
    });
  };


  return (
    <Navbar bg="primary" variant="dark">
      <Container>
        <Navbar.Brand className="fw-bold" href="#home">
          Home
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <NavDropdown
              title={
                <Image
                  src={randomAvatar()}
                  roundedCircle
                  width={36}
                  height={36}
                />
              }
            >
              <NavDropdown.Item href="#">Profile</NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigationbar;
