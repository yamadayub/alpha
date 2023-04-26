import React, { useState } from 'react'
import "./Navbar.css"
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes, faSquarePlus, faChartPie } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo/logo_transparent_cut.png'; 

function Nabvar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav>
      <div className="nav-left">
        <Link to="/">
          <img src={logo} alt="AlphaMasters Logo" className="logo" />
        </Link>
        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} onClick={toggleMenu} className="menu-icon" />
      </div>

      {menuOpen && (
        <div className={`nav-right${menuOpen ? " open" : ""}`}>
          <Link to="/" onClick={closeMenu} >
            Home
          </Link>
          <Link to="/new" onClick={closeMenu} >
            Add A New Portfolio
          </Link>
          <Link to="/show" onClick={closeMenu} >
            Search Portfolio
          </Link>
          <Link to="/login" onClick={closeMenu} >
            Log In
          </Link>
        </div>
      )}
    </nav>
  )
}

export default Nabvar
