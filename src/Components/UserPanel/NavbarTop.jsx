import React, { useState, useEffect } from 'react';
import logo from '../../Assets/logo.png';
import { IoSearch } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";
import './Home.css';

const NavbarTop = () => {
  const [activeLink, setActiveLink] = useState(null);
  const [searchVisible, setSearchVisible] = useState(true); // Controls search bar visibility on larger screens
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false); // Controls mobile search bar visibility
  const [isDrawerOpen, setDrawerOpen] = useState(false);
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

  // Set searchVisible to false on mobile screen resize
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.matchMedia('(max-width: 480px)').matches;
      if (isMobile) {
        setSearchVisible(false); // Hide search bar on mobile screens
      } else {
        setSearchVisible(true); // Show search bar on larger screens
        setMobileSearchOpen(false); // Reset mobile search state
      }
    };

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Call the function initially to set the correct visibility
    handleResize();

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        {/* Logo */}
        {!isMobileSearchOpen && (
          <>
            <img
              src={logo}
              alt="logo"
              onClick={handleClick}
              style={{ cursor: 'pointer' }}
            />
          </>
        )}

         {/* Right section containing search and hamburger */}
        <div className="right-icons">
        {/* Search bar visibility based on screen size */}
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
              <MdCancel style={{ fontSize: '20px' }} />
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
          <>
            <button className="drawer-toggle-btn" onClick={toggleDrawer}>
              <GiHamburgerMenu style={{ fontSize: '24px', marginLeft: '1px' }} />
            </button>
          </>
        )}
        </div>

        {/* Drawer content, only visible when isDrawerOpen is true */}
        {isDrawerOpen && (
          <div className="mobile-drawer">
          <img
          src={logo}
          alt="logo"
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
        />
            <div className="drawer-item" onClick={() => navigate('/corporate')}>
              Corporate Training
            </div>
            <div className="drawer-item" onClick={() => navigate('/course')}>
              Courses
            </div>
            <div className="drawer-item">Hire from Us</div>
            <div>
              <button className="drawer-button" onClick={() => navigate('/login')}>Login
              </button>
            </div>
            <div>
              <button className="drawer-button" onClick={() => navigate('/register')}> Register
              </button>
            </div>
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