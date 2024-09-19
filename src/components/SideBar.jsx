// src/components/SideBar.jsx
import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './SideBar.css';

const SideBar = () => {
  const [isSubMenuOpen, setSubMenuOpen] = useState(false);

  const toggleSubMenu = () => {
    setSubMenuOpen(!isSubMenuOpen);
  };

  return (
    <div className="sidebar d-flex flex-column p-3">
      <Nav className="flex-column">
        <Nav.Link
          onClick={toggleSubMenu}
          className="menu-item"
          style={{ color: '#ecf0f1', cursor: 'pointer' }}
        >
          Artículo
        </Nav.Link>
        {isSubMenuOpen && (
          <div className="submenu">
            <Nav.Link as={Link} to="/importar" style={{ color: '#ffffff' }}>
              {'>>> Importar Lista Iveco'}
            </Nav.Link>
          </div>
        )}
      </Nav>
    </div>
  );
};

export default SideBar;
