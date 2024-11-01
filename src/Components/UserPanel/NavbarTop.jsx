import React, { useState, useEffect } from 'react';
import logo from '../../Assets/logo.png';
import { IoSearch } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";
import profile1 from '../../Assets/profile1.jfif';
import Avatar from '@mui/material/Avatar';
import { FaUserAlt } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import {IoLogOut} from 'react-icons/io5';
import './Home.css';

const NavbarTop = () => {
  const [activeLink, setActiveLink] = useState(null);
  const [searchVisible, setSearchVisible] = useState(true);
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Manage login state
  const navigate = useNavigate();

  // Function to toggle drawer
  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  // Function to handle active navigation link
  const handleNavClick = (link) => {
    setActiveLink(link);
  };

  const handleClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Set login state to false on logout
    setDrawerOpen(false); // Close drawer after logout
  };

  // Set searchVisible to false on mobile screen resize
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.matchMedia('(max-width: 480px)').matches;
      if (isMobile) {
        setSearchVisible(false);
      } else {
        setSearchVisible(true);
        setMobileSearchOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call initially
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        {/* Logo */}
        {!isMobileSearchOpen && (
          <img
            src={logo}
            alt="logo"
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
          />
        )}

        {/* Right section containing search and hamburger */}
        <div className="right-icons">
          {searchVisible ? (
            <div className="search-div-home" role="search">
              <input
                className="search-input-home"
                type="search"
                placeholder="Enter Courses, Category or Keywords"
                aria-label="Search"
              />
              <button className="btn-search-home">
                <IoSearch style={{ fontSize: '1.8rem' }} />
              </button>
            </div>
          ) : isMobileSearchOpen ? (
            <div className="search-div-mobile">
              <input
                className="search-input-mobile"
                type="search"
                placeholder="Enter Courses, Category or Keywords"
                aria-label="Search"
              />
              <button className="btn-search-mobile">
                <IoSearch style={{ fontSize: '24px' }} />
              </button>
              <button
                className="btn-cancel-mobile"
                onClick={() => setMobileSearchOpen(false)}
              >
                <MdCancel />
              </button>
            </div>
          ) : (
            <button
              className="btn-search-icon-mobile"
              onClick={() => setMobileSearchOpen(true)}
            >
              <IoSearch style={{ fontSize: '24px' }} />
            </button>
          )}

          {/* Hamburger menu */}
          {!isMobileSearchOpen && (
            <button className="drawer-toggle-btn" onClick={toggleDrawer}>
              <GiHamburgerMenu style={{ fontSize: '24px', marginLeft: '1px' }} />
            </button>
          )}
        </div>

        {/* Drawer content, only visible when isDrawerOpen is true */}
        {isDrawerOpen && (
          <div className="mobile-drawer">
            <button
              className="drawer-cancel-icon"
              onClick={() => setDrawerOpen(false)}
            >
              <MdCancel />
            </button>
            <img
              src={logo}
              alt="logo"
              onClick={handleClick}
              style={{ cursor: 'pointer' }}
            />

            {/* Conditional rendering for login/logout */}
            {isLoggedIn ? (
              <>
            <div className="profile">
            <div className="dropdown">
              <div className="user-name">
              <Avatar alt="user_name" src={profile1} /> Hachion
              </div>
                <div className="drawer-item" onClick={() => navigate('/userdashboard')}>
                <FaUserAlt style={{color:'#00AEEF'}}/> Dashboard
                </div>
                <div className="drawer-item" onClick={() => navigate('/userdashboard')}>
                <IoMdSettings style={{color:'#00AEEF'}}/> Settings
                </div>

                <div className="drawer-item" onClick={() => navigate('/corporate')}>
              Corporate Training
            </div>
            <div className="drawer-item" onClick={() => navigate('/course')}>
              Courses
            </div>
            <div className="drawer-item">Hire from Us</div>

              <button className="drawer-button" onClick={() => handleLogout()}>
                <IoLogOut /> Logout
                </button>
                </div>
                </div>
              </>
            ) : (
              <>
                  <div className="drawer-item" onClick={() => navigate('/corporate')}>
                  Corporate Training
                </div>
                <div className="drawer-item" onClick={() => navigate('/course')}>
                  Courses
                </div>
                <div className="drawer-item">Hire from Us</div>

                <button className="drawer-button" onClick={() => navigate('/login')}>
                  Login
                </button>
                <button className="drawer-button" onClick={() => navigate('/register')}>
                  Register
                </button>
              </>
            )}
          </div>
        )}

        <div className="navbar-nav">
          <button
            className={`nav-item ${activeLink === 'corporate' ? 'active' : ''}`}
            onClick={() => handleNavClick('corporate')}
          >
            <Link to="/corporate" className="nav-item-link">
              Corporate Training
            </Link>
          </button>
          <button
            className={`nav-item ${activeLink === 'course' ? 'active' : ''}`}
            onClick={() => handleNavClick('course')}
          >
            <Link to="/course" className="nav-item-link">
              Courses
            </Link>
          </button>
          <button
            className={`nav-item ${activeLink === 'hire' ? 'active' : ''}`}
            onClick={() => handleNavClick('hire')}
          >
            <Link to="#" className="nav-item-link">
              Hire from Us
            </Link>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarTop;
