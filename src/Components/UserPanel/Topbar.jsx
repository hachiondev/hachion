import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { FaUserAlt } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { PiLineVerticalThin } from "react-icons/pi";
import { IoLogOut } from 'react-icons/io5';
import profile1 from '../../Assets/profile1.jfif';
import whatsapp from '../../Assets/logos_whatsapp-icon.png';
import './Home.css';

const Topbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check localStorage for user data on component mount
    const storedUserData = localStorage.getItem('loginuserData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));  // Parse and store the user data
      setIsLoggedIn(true);  // Set the user as logged in
    }
  }, []);  // This effect runs only once on component mount

  const handleLogout = () => {
    localStorage.removeItem('loginuserData'); // Clear user data
    setIsLoggedIn(false);
    setUserData(null);
  };

  return (
    <div className='topbar'>
      <div className='topbar-left'>
        <p className='query-title'>Have any query?</p>
        <img src={whatsapp} alt='whatsapp-icon' className='whatsapp-icon' />
        <p className='whatsapp-number'> +919490323388</p>
        <PiLineVerticalThin className='line-vertical' />
        <p className='training-email'>trainings@hachion.co</p>
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
                      <FaUserAlt style={{ color: '#00AEEF' }} /> Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to={'/settings'}>
                      <IoMdSettings style={{ color: '#00AEEF' }} /> Settings
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item" to="#" onClick={handleLogout}>
                      <IoLogOut style={{ color: '#00AEEF' }} /> Logout
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
              <button className='login-div-content'>Login</button>
            </Link>
            <PiLineVerticalThin style={{ color: 'white', fontSize: '2rem' }} />
            <Link to='/register' className='login-link-home'>
              <button className='login-div-content'>Register</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topbar;
