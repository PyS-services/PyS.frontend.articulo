// src/components/NavBar.jsx
import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Importamos Link

const NavBar = () => {
  return (
    <Navbar style={{ backgroundColor: '#343a40' }} expand="lg" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ color: '#ffffff', textDecoration: 'none' }}>
          Piasentin y Soto
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Puedes agregar más elementos de navegación aquí si lo necesitas */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
