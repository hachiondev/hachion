// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import Avatar from '@mui/material/Avatar';
// import { FaUserAlt } from "react-icons/fa";
// import { IoMdSettings } from "react-icons/io";
// import { PiLineVerticalThin } from "react-icons/pi";
// import { IoIosMail } from "react-icons/io";
// import { IoLogOut } from 'react-icons/io5';
// import profile1 from '../../Assets/profile2.png';
// import whatsapp from '../../Assets/logos_whatsapp-icon.png';
// import './Home.css';
// import axios from 'axios';

// const Topbar = () => {
//   const navigate = useNavigate();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [whatsappNumber, setWhatsappNumber] = useState('+1 (732) 485-2499');
//   const [whatsappLink, setWhatsappLink] = useState('https://wa.me/17324852499');
// const [profileImage, setProfileImage] = useState(null);

//   useEffect(() => {
//     const detectUserCountry = async () => {
//       try {
//         const res = await fetch('https://ipwho.is/');
//         if (!res.ok) throw new Error('Failed to fetch location data');

//         const data = await res.json();
//         if (data.country_code === 'IN') {
//           setWhatsappNumber('+91-949-032-3388');
//           setWhatsappLink('https://wa.me/919490323388');
//         } else {
//           setWhatsappNumber('+1 (732) 485-2499');
//           setWhatsappLink('https://wa.me/17324852499');
//         }
//       } catch (error) {
               
//         setWhatsappNumber('+1 (732) 485-2499');
//         setWhatsappLink('https://wa.me/17324852499');
//       }
//     };

//     detectUserCountry();

//   const storedUser = localStorage.getItem('loginuserData');  
//   if (storedUser) {
//     const parsedUser = JSON.parse(storedUser);
//     setUserData(parsedUser); 
//     setIsLoggedIn(true);
//     const parsedEmail = parsedUser.email;

//     axios.get(`https://api.test.hachion.co/api/v1/user/myprofile`, {
//       params: { email: parsedEmail }
//     })
//     .then((response) => {
//       const data = response.data;
//       if (data.profileImage) {
//         const fullImageUrl = `https://api.test.hachion.co/api/v1/user/profile/${data.profileImage}`;
        
//         setProfileImage(fullImageUrl);
//       } 
//     })
   
//   } 
// }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('loginuserData');
//     setIsLoggedIn(false);
//     setUserData(null);
//     navigate('/login');
//   };

//   return (
//     <div className='topbar'>
//       <div className='topbar-left'>
//         <p className='query-title'>Have any query?</p>
//         <div className="whatsapp-container">
//           <a
//             href={whatsappLink}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="whatsapp-link"
//             aria-label={`Chat with us on WhatsApp at ${whatsappNumber}`}
//           >
//             <img
//               src={whatsapp}
//               alt=""
//               className="whatsapp-icon"
//               aria-hidden="true"
//             />
//             <p className="whatsapp-number">{whatsappNumber}</p>
//           </a>
//         </div>
//         <PiLineVerticalThin className='line-vertical' />
//         <IoIosMail className='training-mail-icon' />
//         <p className='training-email'>
//           <a
//             href="https://mail.google.com/mail/?view=cm&to=trainings@hachion.co"
//             target="_blank"
//             rel="noopener noreferrer"
//             aria-label="Send an email to trainings@hachion.co using Gmail"
//             title="Email trainings@hachion.co"
//           >
//             trainings@hachion.co
//           </a>
//         </p>
//       </div>

//       {isLoggedIn ? (
//         <div className='topbar-right'>
//           <div className='user-info'>
//             <div className="btn-group">
//              <Avatar
//   src={profileImage || profile1}
//   alt="user_name"
// />
//               <div className="dropdown">
//                 <Link
//                   className="btn-logout dropdown-toggle"
//                   role="button"
//                   data-bs-toggle="dropdown"
//                   aria-expanded="false"
//                 >
//                   {userData?.name || 'Hachion User'}
//                 </Link>
//                 <ul className="dropdown-menu">
//                   <li>
//                     <Link className="dropdown-item" to="/userdashboard">
//                       <FaUserAlt className="dropdown-icon-top" /> Dashboard
//                     </Link>
//                   </li>
//                   <li>
//                     <Link className="dropdown-item" to="/userdashboard/Settings">
//                       <IoMdSettings className="dropdown-icon-top" /> Settings
//                     </Link>
//                   </li>
//                   {/* <li><hr className="dropdown-divider" /></li> */}
//                  <li>
//   <button
//     className="dropdown-item"
//     type="button"
//     onClick={handleLogout}
//      style={{ cursor: 'pointer' }}
//   >
//     <IoLogOut className="dropdown-icon-top" /> Logout
//   </button>
// </li>

//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className='topbar-right'>
//           <div className='login-div'>
//           <Link to='/login' className='login-div-content accessible-button'>Login</Link>
//           {/* <PiLineVerticalThin className="login-separator" />
//           <Link to='/register' className='login-div-content accessible-button'>Register</Link> */}
//         </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Topbar;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoIosMail } from "react-icons/io";
import { FaPhone } from "react-icons/fa6";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Style.css';

const Topbar = () => {
  const [whatsappNumber, setWhatsappNumber] = useState('+1 (732) 485-2499');
  const [whatsappLink, setWhatsappLink] = useState('https://wa.me/17324852499');

  useEffect(() => {
    const detectUserCountry = async () => {
      try {
        const res = await fetch('https://ipwho.is/');
        if (!res.ok) throw new Error('Failed to fetch location data');

        const data = await res.json();
        if (data.country_code === 'IN') {
          setWhatsappNumber('+91-949-032-3388');
          setWhatsappLink('https://wa.me/919490323388');
        } else {
          setWhatsappNumber('+1 (732) 485-2499');
          setWhatsappLink('https://wa.me/17324852499');
        }
      } catch (error) {
        setWhatsappNumber('+1 (732) 485-2499');
        setWhatsappLink('https://wa.me/17324852499');
      }
    };

    detectUserCountry();
  }, []);

  return (
    <div
      className="container-fluid d-flex justify-content-between align-items-center text-white px-3 px-md-5"
      style={{ background: "#0C8EBF", height: "45px" }}
    >
      {/* Left Section */}
      <div className="d-flex align-items-center">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="d-flex align-items-center text-decoration-none text-white me-3"
          aria-label={`Chat with us on WhatsApp at ${whatsappNumber}`}
        >
          <FaPhone className="me-1 topbar-icon text-white" />
          <span className="fw-normal topbar-text">{whatsappNumber}</span>
        </a>

        <a
          href="https://mail.google.com/mail/?view=cm&to=trainings@hachion.co"
          target="_blank"
          rel="noopener noreferrer"
          className="d-flex align-items-center text-decoration-none text-white"
          aria-label="Send an email to trainings@hachion.co using Gmail"
        >
          <IoIosMail className="me-1 topbar-icon text-white" />
          <span className="fw-normal topbar-text">trainings@hachion.co</span>
        </a>
      </div>

      {/* Right Section */}
      <div className="d-none d-md-block">
        <Link
          to="/corporate"
          className="btn btn-md text-white text-nowrap "
        >
          Corporate Training
        </Link>
      </div>
    </div>
  );
};

export default Topbar;
