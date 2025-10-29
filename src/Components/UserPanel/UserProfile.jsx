// import React, { useState, useRef, useEffect } from 'react';
// import { styled } from '@mui/material/styles';
// import Badge from '@mui/material/Badge';
// import Avatar from '@mui/material/Avatar';
// import { FiCamera, FiX } from "react-icons/fi";
// import { FaUserAlt } from "react-icons/fa";
// import { AiFillCaretDown } from 'react-icons/ai';
// import { Menu, MenuItem, Button } from '@mui/material';
// import Flag from 'react-world-flags';
// import axios from 'axios';
// import './Dashboard.css';
// import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
// import { useNavigate } from 'react-router-dom';

// const StyledBadge = styled(Badge)(({ theme }) => ({
//   '& .MuiBadge-badge': {
//     backgroundColor: '#FFFFFF',
//     border: '3px solid #00AEEF',
//     color: '#00AEEF',
//     width: 30,
//     height: 30,
//     borderRadius: '50%',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     cursor: 'pointer',
//   },
// }));

// const LargeAvatar = styled(Avatar)({
//   width: 100,
//   height: 100,
//   border: '4px solid #00AEEF',
//   backgroundColor: '#ffffff'
// });

// const UserProfile = () => {
//   const navigate = useNavigate();

//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [profileImage, setProfileImage] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const mobileInputRef = useRef(null);
//   const [selectedCountry, setSelectedCountry] = useState({
//     code: '+1',
//     flag: 'US',
//     name: 'United States',
//   });
//   const [passwords, setPasswords] = useState({
//     oldPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [showPasswords, setShowPasswords] = useState({
//   oldPassword: false,
//   newPassword: false,
//   confirmPassword: false
// });
// const togglePasswordVisibility = (field) => {
//   setShowPasswords(prev => ({
//     ...prev,
//     [field]: !prev[field]
//   }));
// };
//   const [isUpdating, setIsUpdating] = useState(false);  
//   const [successMessage, setSuccessMessage] = useState("");
//     const [errorMessage, setErrorMessage] = useState("");
//   const [mobileError, setMobileError] = useState('');
// const [initialMobile, setInitialMobile] = useState('');

//   const handleCountrySelect = (country) => {
//     setSelectedCountry(country);
//     closeMenu();
//     mobileInputRef.current?.focus();
//   };

// useEffect(() => {
//   const storedUser = localStorage.getItem('loginuserData');  
//   if (storedUser) {
//     const parsedUser = JSON.parse(storedUser);
//     const parsedEmail = parsedUser.email;

//     axios.get(`https://api.test.hachion.co/api/v1/user/myprofile`, {
//       params: { email: parsedEmail }
//     })
//     .then((response) => {
//       const data = response.data;
//       setName(data.name);
//       setEmail(data.email);
//       setMobileNumber(data.mobile);
//       setInitialMobile(data.mobile); 

//       if (data.profileImage) {
//         const fullImageUrl = `https://api.test.hachion.co/api/v1/user/profile/${data.profileImage}`;
//         setProfileImage(fullImageUrl);
//       }
//     })
//     .catch((error) => {
      
//     });
//   }
// }, []);


//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;
//     setPasswords((prev) => ({ ...prev, [name]: value }));
//   };
  
// const validateMobile = async (value) => {
//   if (!value || value === initialMobile) {
//     setMobileError('');
//     return;
//   }

//   try {
//     const encodedMobile = encodeURIComponent(value);
//     const response = await axios.get(`https://api.test.hachion.co/check-mobile?mobile=${encodedMobile}`);

//     setMobileError('');
//   } catch (error) {
//     if (error.response && error.response.status === 409) {
//       setMobileError('❌ Mobile number already exists.');
//     } else {
//       setMobileError('❌ Failed to validate mobile number.');
//     }
//   }
// };

// const handleResetPassword = async (e) => {
//   e.preventDefault();
//   setSuccessMessage('');
//   setErrorMessage('');

//   const email = document.getElementById('inputEmail')?.value;
//   if (!email) {
//     setErrorMessage("❌ User email not found.");
//     return;
//   }
//   const isPasswordChanged = passwords.newPassword && passwords.oldPassword && passwords.confirmPassword;

//   if (isPasswordChanged && passwords.newPassword !== passwords.confirmPassword) {
//     setErrorMessage("❌ New password and confirm password do not match.");
//     return;
//   }

//   const formData = new FormData();

//   const requestObject = {
//     email,
//     password: passwords.oldPassword,
//     newPassword: passwords.newPassword,
//     confirmPassword: passwords.confirmPassword,
//     userName: name,
//     mobile: mobileNumber
//   };

//   formData.append("data", new Blob([JSON.stringify(requestObject)], { type: "application/json" }));

//   if (profileImage && typeof profileImage !== 'string') {
//     formData.append("profileImage", profileImage);
//   }

//   setIsUpdating(true);

//   try {
//     const response = await axios.post('https://api.test.hachion.co/api/v1/user/reset-password', formData, {
//       headers: { "Content-Type": "multipart/form-data" }
//     });

//     setIsUpdating(false);
//     setSuccessMessage("✅ Profile updated successfully.");

//     const storedUser = JSON.parse(localStorage.getItem('loginuserData'));
//     const updatedUser = { ...storedUser, name };
    
//     if (response.data?.profileImageUrl) {
//       updatedUser.profileImage = response.data.profileImageUrl;
//       setProfileImage(response.data.profileImageUrl); 
//     }

//     localStorage.setItem('loginuserData', JSON.stringify(updatedUser));

//     if (isPasswordChanged) {
      
//       setTimeout(() => {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('loginuserData');
//         navigate('/login');
//       }, 3000);
//     }

//   } catch (error) {
//     setIsUpdating(false);
//     setErrorMessage("❌ Failed to update profile.");
    
//   }
// };
//   const openMenu = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const closeMenu = () => {
//     setAnchorEl(null);
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
     
//       setProfileImage(file);
//     }
//   };
  
//   const removeImage = () => {
//     setProfileImage(null);
//   };

//   return (
//     <>
//       <div className="courses-enrolled">
//         <nav className='dashboard-nav'>My Profile</nav>
//       </div>
//       <div className="resume-div">
//       <div className="write-review">
//         <form className='review-form-content'>
//           <div className="input-row">
//             <div className="profile">
//   <input
//     type="file"
//     id="imageUpload"
//     accept="image/*"
//     style={{ display: 'none' }}
//     onChange={handleImageUpload}
//   />

//   <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
//     <StyledBadge
//       overlap="circular"
//       anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//       badgeContent={
//         profileImage ? (
//           <FiX size={16} color="red" onClick={removeImage} style={{ cursor: 'pointer' }} />
//         ) : (
//           <FiCamera size={16} />
//         )
//       }
//     >
//       <LargeAvatar
//         src={
//           profileImage
//             ? typeof profileImage === 'string'
//               ? profileImage
//               : URL.createObjectURL(profileImage)
//             : undefined
//         }
//       >
//         {!profileImage && <FaUserAlt size={50} color="#00AEEF" />}
//       </LargeAvatar>
//     </StyledBadge>
//   </label>
// </div>

            
//             <div className="col-md-5">
//               <label htmlFor="inputName" className="form-label">Name</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter your name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>
//             </div>

//             <div className="input-row">
//             <div className="col-md-5">
//               <label htmlFor="inputEmail" className="form-label">Email</label>
//               <input
//                id="inputEmail"
//                 type="email"
//                 className="form-control"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 readOnly
//               />
//             </div>
//             <div className="col-md-5">
//               <label className="form-label">Mobile Number</label>
//               <div className="input-wrapper" >
        
//               <input
//   type="tel"
//   className="form-control"
//   ref={mobileInputRef}
//   placeholder="Enter your mobile number"
//   value={mobileNumber}
//   onChange={(e) => setMobileNumber(e.target.value)}
//   onBlur={(e) => validateMobile(e.target.value)}
// />
// {mobileError && (
//   <p style={{ color: 'red', fontWeight: 'bold', marginTop: '5px' }}>{mobileError}</p>
// )}
//               </div>
//             </div>
//             </div>
          
//           <div className="dashboard-nav">Reset Password</div>
//           <div className="input-row">
// <div className="me-3 password-input-wrapper">
//   <label htmlFor="oldPassword" className="form-label">Old Password</label>
//   <div className="dashboard-field">
//     <input
//       type={showPasswords.oldPassword ? 'text' : 'password'}
//       className="form-control"
//       name="oldPassword"
//       value={passwords.oldPassword}
//       onChange={handlePasswordChange}
//     />
//     <span className="eye-icon" onClick={() => togglePasswordVisibility('oldPassword')}>
//       {showPasswords.oldPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
//     </span>
//   </div>
// </div>

// <div className="me-3 password-input-wrapper">
//   <label htmlFor="newPassword" className="form-label">New Password</label>
//   <div className="dashboard-field">
//     <input
//       type={showPasswords.newPassword ? 'text' : 'password'}
//       className="form-control"
//       name="newPassword"
//       value={passwords.newPassword}
//       onChange={handlePasswordChange}
//     />
//     <span className="eye-icon" onClick={() => togglePasswordVisibility('newPassword')}>
//       {showPasswords.newPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
//     </span>
//   </div>
// </div>

// <div className="me-3 password-input-wrapper">
//   <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
//   <div className="dashboard-field">
//     <input
//       type={showPasswords.confirmPassword ? 'text' : 'password'}
//       className="form-control"
//       name="confirmPassword"
//       value={passwords.confirmPassword}
//       onChange={handlePasswordChange}
//     />
//     <span className="eye-icon" onClick={() => togglePasswordVisibility('confirmPassword')}>
//       {showPasswords.confirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
//     </span>
//   </div>
// </div>
// </div>

// {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
//       {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}

//     <div className="center">
//     <button className='update-btn' onClick={handleResetPassword}>Update</button>

//     </div>
//         </form>
//       </div>
//       </div>
//     </>
//   );
// };

// export default UserProfile;

import React, { useState, useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import { FiCamera, FiX } from "react-icons/fi";
import { FaUserAlt } from "react-icons/fa";
import { AiFillCaretDown } from 'react-icons/ai';
import { Menu, MenuItem, Button } from '@mui/material';
import Flag from 'react-world-flags';
import axios from 'axios';
import './Dashboard.css';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#FFFFFF',
    border: '2px solid #00AEEF',
    color: '#00AEEF',
    width: 25,
    height: 25,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
}));

const LargeAvatar = styled(Avatar)({
  width: 70,
  height: 70,
  padding: 12,
  border: '3px solid #00AEEF',
  backgroundColor: '#ffffff'
});

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Profile");
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [location, setLocation] = useState('');
  const [dob, setDob] = useState('');
  const [timeZone, setTimeZone] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const mobileInputRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState({
    code: '+1',
    flag: 'US',
    name: 'United States',
  });
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
  oldPassword: false,
  newPassword: false,
  confirmPassword: false
});
const togglePasswordVisibility = (field) => {
  setShowPasswords(prev => ({
    ...prev,
    [field]: !prev[field]
  }));
};
  const [isUpdating, setIsUpdating] = useState(false);  
  const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  const [mobileError, setMobileError] = useState('');
const [initialMobile, setInitialMobile] = useState('');

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    closeMenu();
    mobileInputRef.current?.focus();
  };

useEffect(() => {
  const storedUser = localStorage.getItem('loginuserData');  
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    const parsedEmail = parsedUser.email;

    axios.get(`https://api.test.hachion.co/api/v1/user/myprofile`, {
      params: { email: parsedEmail }
    })
    .then((response) => {
      const data = response.data;
      setName(data.name);
      setEmail(data.email);
      setMobileNumber(data.mobile);
      setInitialMobile(data.mobile); 

      if (data.profileImage) {
        const fullImageUrl = `https://api.test.hachion.co/api/v1/user/profile/${data.profileImage}`;
        setProfileImage(fullImageUrl);
      }
    })
    .catch((error) => {
      
    });
  }
}, []);


  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };
  
const validateMobile = async (value) => {
  if (!value || value === initialMobile) {
    setMobileError('');
    return;
  }

  try {
    const encodedMobile = encodeURIComponent(value);
    const response = await axios.get(`https://api.test.hachion.co/check-mobile?mobile=${encodedMobile}`);

    setMobileError('');
  } catch (error) {
    if (error.response && error.response.status === 409) {
      setMobileError('❌ Mobile number already exists.');
    } else {
      setMobileError('❌ Failed to validate mobile number.');
    }
  }
};

const handleResetPassword = async (e) => {
  e.preventDefault();
  setSuccessMessage('');
  setErrorMessage('');

  const email = document.getElementById('inputEmail')?.value;
  if (!email) {
    setErrorMessage("❌ User email not found.");
    return;
  }
  const isPasswordChanged = passwords.newPassword && passwords.oldPassword && passwords.confirmPassword;

  if (isPasswordChanged && passwords.newPassword !== passwords.confirmPassword) {
    setErrorMessage("❌ New password and confirm password do not match.");
    return;
  }

  const formData = new FormData();

  const requestObject = {
    email,
    password: passwords.oldPassword,
    newPassword: passwords.newPassword,
    confirmPassword: passwords.confirmPassword,
    userName: name,
    mobile: mobileNumber
  };

  formData.append("data", new Blob([JSON.stringify(requestObject)], { type: "application/json" }));

  if (profileImage && typeof profileImage !== 'string') {
    formData.append("profileImage", profileImage);
  }

  setIsUpdating(true);

  try {
    const response = await axios.post('https://api.test.hachion.co/api/v1/user/reset-password', formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    setIsUpdating(false);
    setSuccessMessage("✅ Profile updated successfully.");

    const storedUser = JSON.parse(localStorage.getItem('loginuserData'));
    const updatedUser = { ...storedUser, name };
    
    if (response.data?.profileImageUrl) {
      updatedUser.profileImage = response.data.profileImageUrl;
      setProfileImage(response.data.profileImageUrl); 
    }

    localStorage.setItem('loginuserData', JSON.stringify(updatedUser));

    if (isPasswordChanged) {
      
      setTimeout(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('loginuserData');
        navigate('/login');
      }, 3000);
    }

  } catch (error) {
    setIsUpdating(false);
    setErrorMessage("❌ Failed to update profile.");
    
  }
};
  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
     
      setProfileImage(file);
    }
  };
  
  const removeImage = () => {
    setProfileImage(null);
  };

  return (
    <>
      <div className="dashboard-activity-title">
        {["Profile", "Password", "Social Share"].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {activeTab === "Profile" && (
      <div className="write-review">
        <nav className='dashboard-nav'>Profile Details</nav>
        <form>
            <div className="profile">
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />

          <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              badgeContent={
                profileImage ? (
                  <FiX
                        size={16}
                        color="red"
                        onClick={removeImage}
                        style={{ cursor: "pointer" }}
                      />
                    ) : null
                  }
            >
              <LargeAvatar
                src={
                  profileImage
                    ? typeof profileImage === 'string'
                      ? profileImage
                      : URL.createObjectURL(profileImage)
                    : undefined
                }
              >
                {!profileImage && <FaUserAlt size={50} color="#00AEEF" />}
              </LargeAvatar>
            </StyledBadge>
          </label>
          <label
                htmlFor="imageUpload"
                className="upload-image-text"
              >
                {profileImage ? "Edit profile photo" : "Upload profile photo"}
              </label>
        </div>
            <div className="instructor-fields">
            <div>
              <label className="login-label">
              First Name</label><span className="star">*</span>
              <div className="register-field">
                <div className="password-field">
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            </div>
            </div>

            <div>
              <label className="login-label">
              Last Name</label><span className="star">*</span>
              <div className="register-field">
                <div className="password-field">
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            </div>
            </div>
            </div>

            <div className="instructor-fields">
            <div>
              <label className="login-label">
              Email</label><span className="star">*</span>
              <div className="register-field">
                <div className="password-field">
              <input
               id="inputEmail"
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly
              />
            </div>
            </div>
            </div>

            <div>
              <label className="login-label">
                Phone Number<span className="star">*</span>
              </label>
              <div className="register-field">
                <div className="password-field" style={{ position: "relative" }}>
              <input
                  type="tel"
                  className="form-control"
                  ref={mobileInputRef}
                  placeholder="Enter your mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  onBlur={(e) => validateMobile(e.target.value)}
                />
                {mobileError && (
                  <p style={{ color: 'red', fontWeight: 'bold', marginTop: '5px' }}>{mobileError}</p>
                )}
              </div>
            </div>
            </div>
            </div>

            <div className="instructor-fields">
            <div>
              <label className="login-label">
              Date of Birth</label><span className="star">*</span>
              <div className="register-field">
                <div className="password-field">
              <input
                type="text"
                className="form-control"
                placeholder="Enter your DOB"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            </div>
            </div>

            <div>
              <label className="login-label">
              Gender</label><span className="star">*</span>
              <div className="register-field">
                <div className="password-field">
              <input
                type="text"
                className="form-control"
                placeholder="Enter your gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
            </div>
            </div>
            </div>
            </div>

            <div className="instructor-fields">
            <div>
              <label className="login-label">
              Location</label><span className="star">*</span>
              <div className="register-field">
                <div className="password-field">
              <input
                type="text"
                className="form-control"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            </div>
            </div>

            <div>
              <label className="login-label">
              Time Zone</label><span className="star">*</span>
              <div className="register-field">
                <div className="password-field">
              <input
                type="text"
                className="form-control"
                placeholder="Enter your timeZone"
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
              />
            </div>
            </div>
            </div>
            </div>

            <div>
            <label className="login-label">
             Correspondence address<span className="star">*</span>
            </label>
            <div className="register-field">
              <div className="password-field">
                <textarea
                  className="form-control"
                  placeholder="Type Correspondence address...."
                  rows={4}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="login-label">
             Bio<span className="star">*</span>
            </label>
            <div className="register-field">
              <div className="password-field">
                <textarea
                  className="form-control"
                  placeholder="Type Your Bio...."
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>
          </div>

        <div>
        <button className="update-profile-btn" >
        Save Changes
      </button>
        <Link to="" className="home-browse-button">
         Discard
        </Link>
       </div>
       </form>
       </div>
       )}

      {activeTab === "Password" && (
          <div className="write-review">
          <div className="dashboard-nav">Update Password</div>
          <div>
          <label className="login-label">
              Current Password</label>
              <div className="register-field">
                <div className="form-field">
              <input
                type={showPasswords.oldPassword ? 'text' : 'password'}
                className="form-control"
                name="oldPassword"
                placeholder="Current Password"
                value={passwords.oldPassword}
                onChange={handlePasswordChange}
              />
              <span className="eye-icon" onClick={() => togglePasswordVisibility('oldPassword')}>
                {showPasswords.oldPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>
          </div>
          </div>

          <label className="login-label">
              New Password</label>
              <div className="register-field">
                <div className="form-field">
              <input
                type={showPasswords.newPassword ? 'text' : 'password'}
                className="form-control"
                name="newPassword"
                placeholder="New Password"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
              />
              <span className="eye-icon" onClick={() => togglePasswordVisibility('newPassword')}>
                {showPasswords.newPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>
          </div>

          <label className="login-label">
              Re-type New Password</label>
              <div className="register-field">
                <div className="form-field">
            <input
              type={showPasswords.confirmPassword ? 'text' : 'password'}
              className="form-control"
              name="confirmPassword"
              placeholder="Re-type New Password"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
            />
            <span className="eye-icon" onClick={() => togglePasswordVisibility('confirmPassword')}>
              {showPasswords.confirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>
        </div>

            {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}

          <button className='update-profile-btn' onClick={handleResetPassword}>Update Password</button>
      </div>
      )}

      {activeTab === "Social Share" && (
        <div className="write-review">
          <div className="dashboard-nav">Social Details</div>
          <div>
              <label className="login-label">
              Facebook</label>
              <div className="register-field">
                <div className="form-field">
              <input
                type="text"
                className="form-control"
                placeholder="Enter your link"
              />
            </div>
            </div>
            </div>
            <div>
              <label className="login-label">
              Twitter</label>
              <div className="register-field">
                <div className="form-field">
              <input
                type="text"
                className="form-control"
                placeholder="Enter your link"
              />
            </div>
            </div>
            </div>
            <div>
              <label className="login-label">
              LinkedIn</label>
              <div className="register-field">
                <div className="form-field">
              <input
                type="text"
                className="form-control"
                placeholder="Enter your link"
              />
            </div>
            </div>
            </div>
            <div>
              <label className="login-label">
              Website</label>
              <div className="register-field">
                <div className="form-field">
              <input
                type="text"
                className="form-control"
                placeholder="Enter your link"
              />
            </div>
            </div>
            </div>
            <div>
              <label className="login-label">
              GitHub</label>
              <div className="register-field">
                <div className="form-field">
              <input
                type="text"
                className="form-control"
                placeholder="Enter your link"
              />
            </div>
            </div>
            </div>
          <button className='update-profile-btn'>Save Changes</button>
        </div>
      )}
    </>
  );
};

export default UserProfile;
