import React, { useState,useEffect } from 'react';
import { PiLineVerticalThin } from "react-icons/pi";
import { IoIosMail } from "react-icons/io";
import whatsapp from '../../Assets/logos_whatsapp-icon.png';
import './Home.css';
import { Link } from 'react-router-dom';
import {IoLogOut} from 'react-icons/io5';
import profile1 from '../../Assets/profile1.jfif';
import Avatar from '@mui/material/Avatar';
import { FaUserAlt } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { AuthContext } from '../../AuthContext';


const Topbar = () => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Logic to handle logout
    window.location.href = '/login';  // Redirect to login page after logout
  };

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:8080/user', {
          credentials: 'include'  // Ensures cookies (including session) are sent
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data);  // Set the user data (e.g., name, email)
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);
  return (
    <>
      <div className='topbar'>
        <div className='topbar-left'>
          <p className='query-title'>Have any query?</p>
          {/* <div className='training-mail'> */}
            <img src={whatsapp} alt='whatsapp-icon' className='whatsapp-icon' />
            <p className='whatsapp-number'> +919490323388</p>
            <PiLineVerticalThin  className='line-vertical'/>
         
          {/* <div className='training-mail'> */}
            <IoIosMail className='training-mail-icon' />
            <p className='training-email'>trainings@hachion.co</p>
          </div>
       

        {/* Conditional Rendering Based on Login Status */}
        {isLoggedIn ? (
          <>
          <div className='topbar-right'>
          <div className='user-info'>
            <div className="btn-group">
              <Avatar src={userData?.picture || profile1} alt="user_name" />
              <div className="dropdown">
  <Link className="btn-logout dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false" onClick={handleLogout}>
  {userData?.name || 'Hachion'}
  </Link>

  <ul className="dropdown-menu">
    <li><Link className="dropdown-item" to={'/userdashboard'}><FaUserAlt style={{color:'#00AEEF'}}/> Dashboard</Link></li>
    <li><Link className="dropdown-item" href="#"><IoMdSettings style={{color:'#00AEEF'}}/> Settings</Link></li>
    <li><a className="dropdown-divider" /></li>
    <li><Link className="dropdown-item" href="#" onClick={handleLogout}> <IoLogOut style={{color:'#00AEEF'}}/> Logout</Link></li>
  </ul>
</div>
          </div>
          </div>
          </div>

          </> ) : (
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
    </>
  );
};

export default Topbar;
