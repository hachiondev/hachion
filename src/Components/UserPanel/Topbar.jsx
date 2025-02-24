import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { FaUserAlt } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { PiLineVerticalThin } from "react-icons/pi";
import { IoIosMail } from "react-icons/io";
import { IoLogOut } from 'react-icons/io5';
import profile1 from '../../Assets/profile2.png';
import whatsapp from '../../Assets/logos_whatsapp-icon.png';
import './Home.css';

const Topbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    console.log("Checking for stored user data in localStorage...");

    // Check localStorage for user data on component mount
    const storedUserData = localStorage.getItem('loginuserData');
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);  
      setIsLoggedIn(true);  
      console.log("User data found:", parsedData);
    } else {
      console.log("No user data found. User is not logged in.");
    }
  }, []);  

  const handleLogout = () => {
    console.log("Logging out user...");
    localStorage.removeItem('loginuserData'); // Clear user data
    setIsLoggedIn(false);
    setUserData(null);
    console.log("User logged out successfully.");
  };

  return (
    <div className='topbar'>
      <div className='topbar-left'>
        <p className='query-title'>Have any query?</p>
        <div className="whatsapp-container">
      <a 
        href="https://wa.me/17324852499" 
        target="_blank" 
        rel="noopener noreferrer"
        className="whatsapp-link"
      >
        <img src={whatsapp} alt="whatsapp-icon" className="whatsapp-icon" />
        <p className="whatsapp-number">+1 (732) 485-2499</p>
      </a>
    </div>
        <PiLineVerticalThin className='line-vertical' />
        <IoIosMail className='training-mail-icon'/>
        <p className='training-email'>
  <a href="https://mail.google.com/mail/?view=cm&to=trainings@hachion.co" 
    target="_blank" 
    rel="noopener noreferrer">trainings@hachion.co</a>
</p>
      </div>

      {/* Conditional Rendering Based on Login Status */}
      {isLoggedIn ? (
        <div className='topbar-right'>
          <div className='user-info'>
            <div className="btn-group">
              <Avatar src={userData?.picture || profile1} alt="user_name" />
              <div className="dropdown">
                <Link
                  className="btn-logout dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {userData?.name || 'Hachion User'}
                </Link>

                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to={'/userdashboard'}>
                      <FaUserAlt className="dropdown-icon"/> Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      <IoMdSettings className="dropdown-icon"/> Settings
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item" href="#" onClick={handleLogout}>
                      <IoLogOut className="dropdown-icon"/> Logout
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='topbar-right'>
          <div className='login-div'>
            <Link to='/login' className='login-link-home'>
              <button className='login-div-content' onClick={() => console.log("Login button clicked")}>Login</button>
            </Link>
            <PiLineVerticalThin style={{ color: 'white', fontSize: '2rem' }} />
            <Link to='/register' className='login-link-home'>
              <button className='login-div-content' onClick={() => console.log("Register button clicked")}>Register</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topbar;