import React, { useEffect, useState } from 'react';
import './Admin.css';
import logo from '../../Assets/image 133.png';
import { IoSearch } from 'react-icons/io5';
import { BsEnvelopeFill } from 'react-icons/bs';
import { IoMdNotifications, IoMdSettings } from 'react-icons/io';
import { IoLogOut } from 'react-icons/io5';
import { FaUserAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import ProfileImage from '../../Assets/profile1.jfif';
const AdminNavbar = () => {
  const [adminName, setAdminName] = useState('Admin');
  const navigate = useNavigate();
  useEffect(() => {
    const storedName = localStorage.getItem('adminUsername');
    if (storedName) setAdminName(storedName);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminEmail');
    navigate('/adminlogin');
  };
  return (
    <nav className='admin-nav'>
      <img src={logo} alt='logo' className='admin-logo' />
      <div className='admin-nav-middle'>
        <form className='search-div' role='search'>
          <input
            className='search-input'
            type='search'
            placeholder='Enter Courses, Category or Keywords'
            aria-label='Search'
          />
          <button className='btn-search' type='submit'>
            <IoSearch className='icon-search' />
          </button>
        </form>
      </div>
      <div className='admin-nav-right'>
        <div className='icon-container'>
          <BsEnvelopeFill className='admin-icon' />
        </div>
        <div className='icon-container'>
          <IoMdNotifications className='admin-icon' />
        </div>
        <div className='user-info'>
          <div className='btn-group'>
            <Avatar alt={adminName} src={ProfileImage} />
            <div className='dropdown'>
              <button
                className='btn-logout dropdown-toggle'
                type='button'
                data-bs-toggle='dropdown'
                aria-expanded='false'
              >
                {adminName}
              </button>
              <ul className='dropdown-menu'>
                <li>
                  <Link className='dropdown-item' to='#'>
                    <FaUserAlt className='dropdown-icon-admin' /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link className='dropdown-item' to='#'>
                    <IoMdSettings className='dropdown-icon-admin' /> Settings
                  </Link>
                </li>
                <li>
                  <hr className='dropdown-divider' />
                </li>
                <li>
                  <button className='dropdown-item' onClick={handleLogout}>
                    <IoLogOut className='dropdown-icon-admin' /> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default AdminNavbar;