import React, { useState, useEffect } from 'react';
import './Admin.css';
import logo from '../../Assets/image 133.png';
import { IoSearch } from "react-icons/io5";
import { BsEnvelopeFill } from "react-icons/bs";
import { IoMdNotifications } from "react-icons/io";
import ProfileImage from '../../Assets/profile1.jfif';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { FaUserAlt } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";

const AdminNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [adminName, setAdminName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve username from local storage
    const storedName = localStorage.getItem('adminUsername');
    if (storedName) {
      setAdminName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminEmail"); // Remove email
    navigate("/adminlogin"); // Redirect to login page
  };

  return (
    <>
      <div className='admin-nav'>
        <img src={logo} alt='logo' />
        <div className='admin-nav-middle'>
          <div className="search-div" role="search">
            <input className="search-input" type="search" placeholder="Enter Courses, Category or Keywords" aria-label="Search" />
            <button className="btn-search" type="submit"><IoSearch style={{ fontSize: '2rem' }} /></button>
          </div>
        </div>
        <div className='admin-nav-right'>
          <div className='icon-container'>
            <BsEnvelopeFill style={{color:'#00AEEF',fontSize:'24px'}}/>
          </div>
          <div className='icon-container'>
            <IoMdNotifications style={{color:'#00AEEF',fontSize:'24px'}}/>
          </div>
          
          <div className='user-info'>
            <div className="btn-group">
              <Avatar alt={adminName} src={ProfileImage} />
              <div className="dropdown">
                <Link className="btn-logout dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {adminName} {/* Display username */}
                </Link>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="#"> <FaUserAlt className="dropdown-icon-admin"/> Dashboard</Link></li>
                  <li><Link className="dropdown-item" to="#"> <IoMdSettings className="dropdown-icon-admin" /> Settings</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="/adminlogin" onClick={handleLogout}><IoLogOut className="dropdown-icon-admin"/> Logout</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminNavbar;
