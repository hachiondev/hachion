'use client';

import React, { useEffect, useState } from 'react';
import '../AdminPanel/Admin.css';
import { IoSearch } from 'react-icons/io5';
import { BsEnvelopeFill } from 'react-icons/bs';
import { IoMdNotifications, IoMdSettings } from 'react-icons/io';
import { IoLogOut } from 'react-icons/io5';
import { FaUserAlt } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
const logo = '/images/Logowhite.webp';
const ProfileImage = '/Hachion-logo.png';
const AdminNavbar = () => {
  const [adminName, setAdminName] = useState('Admin');
  const router = useRouter();
  useEffect(() => {
    const storedName = localStorage.getItem('adminUsername');
    if (storedName) setAdminName(storedName);
  }, []);
  const handleLogout = () => {
    sessionStorage.removeItem('isAdminLoggedIn');
    sessionStorage.removeItem('adminEmail');
    document.cookie = 'isAdminLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/adminlogin');
  };
  return (
    <nav className='admin-nav'>
      <img src={logo} alt='logo' className='admin-logo' width={221} height={77} />
      <div className='admin-nav-middle'>
        <form className='search-div' role='search'>
          <input
            className='search-input'
            type='search'
            placeholder='Enter Courses, Category or Keywords'
            aria-label='Search'
          />
          <button className='btn-search' type='submit' aria-label='Search'>
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
                  <Link className='dropdown-item' href='#'>
                    <FaUserAlt className='dropdown-icon-admin' /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link className='dropdown-item' href='#'>
                    <IoMdSettings className='dropdown-icon-admin' /> Settings
                  </Link>
                </li>
                <li>
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
