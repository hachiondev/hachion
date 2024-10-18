import React,{useState} from 'react';
import './Admin.css';
import logo from '../../Assets/image 133.png';
import { RiMenuUnfold3Line } from "react-icons/ri";
import { IoSearch } from "react-icons/io5";
import { BsEnvelopeFill } from "react-icons/bs";
import { IoMdNotifications } from "react-icons/io";
import ProfileImage from '../../Assets/profile1.jfif';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { FaUserAlt } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";


const AdminNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = () => {
   
    setIsLoggedIn(false);
  };

  return (
   <>
   <div className='admin-nav'>
     <img src={logo} alt='logo' />
     <div className='admin-nav-middle'>
       <RiMenuUnfold3Line style={{color:'white',fontSize:'2rem',marginTop:'1.25vh'}}/>
       <div className="search-div" role="search">
         <input className="search-input" type="search" placeholder="Enter Courses, Category or Keywords" aria-label="Search" />
         <button className="btn-search" type="submit"><IoSearch style={{ fontSize: '2rem' }} /></button>
       </div>
     </div>
     <div className='admin-nav-right'>
       <div className='icon-container'>
         <BsEnvelopeFill style={{color:'#00AEEF',fontSize:'2rem'}}/>
       </div>
       <div className='icon-container'>
         <IoMdNotifications style={{color:'#00AEEF',fontSize:'2rem'}}/>
       </div>
      
       <div className='user-info'>
            <div className="btn-group">
            
              <Avatar alt="user_name" src={ProfileImage} />
              <div class="dropdown">
  <Link className="btn-logout dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
    Hachion
  </Link>

  <ul className="dropdown-menu">
    <li><Link className="dropdown-item" to={'/userdashboard'}> <FaUserAlt style={{color:'#00AEEF'}}/> Dashboard</Link></li>
    <li><Link className="dropdown-item" href="#"> <IoMdSettings style={{color:'#00AEEF'}}/> Settings</Link></li>
    <li><a className="dropdown-divider" /></li>
    <li><Link className="dropdown-item" href="#" onClick={handleLogout}><IoLogOut style={{color:'#00AEEF'}}/> Logout</Link></li>
  </ul>
</div>
  
</div>
</div>
     </div>
   </div>
   </>
  )
}

export default AdminNavbar;
