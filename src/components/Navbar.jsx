import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../utils/UserContext';
import "./Navbar.css"
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes, faSquarePlus, faChartPie } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo/logo_transparent_cut.png'; 

const get_user_url = 'http://127.0.0.1:8000/user/me';

function Nabvar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);

  // const [user, setUser] = useState(null);
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     const token = localStorage.getItem('access_token');
  //     console.log(token)
  //     const response = await fetch(get_user_url, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`,
  //       },
  //     });
  //     console.log(response)
  //     if (response.ok) {
  //       const userData = await response.json();
  //       console.log("userData:", userData)
  //       setUser(userData);
  //     } else {
  //       console.error('Error fetching user data:', response.status, response.statusText);
  //     }
  //   };
  //   fetchUserData();
  // }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const closeMenu = () => {
    setMenuOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('access_token'); // remove the token from local storage
    setUser(null); // set the user state back to null
    closeMenu(); // close the menu
  };

  return (
    <nav>
      <div className="nav-left">
        <Link to="/">
          Manee
          {/* <img src={logo} alt="AlphaMasters Logo" className="logo" /> */}
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
          {user ? (
            <>
              <Link to="/my_page" onClick={closeMenu}>
                My Page
              </Link>
              <Link to="/" onClick={logout}>
                Sign Out
              </Link>
            </>
          ) : (
            <>
              <Link to="/sign_up" onClick={closeMenu}>
                Sign Up
              </Link>
              <Link to="/sign_in" onClick={closeMenu}>
                Sign In
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Nabvar;
