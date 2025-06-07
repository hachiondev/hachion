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

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#FFFFFF',
    border: '3px solid #00AEEF',
    color: '#00AEEF',
    width: 30,
    height: 30,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
}));

const LargeAvatar = styled(Avatar)({
  width: 100,
  height: 100,
  border: '4px solid #00AEEF',
  backgroundColor: '#ffffff'
});

const UserProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [profileImage, setProfileImage] = useState(null);
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
  const [isUpdating, setIsUpdating] = useState(false);  // Added for loading state
const [passwordUpdateMessage, setPasswordUpdateMessage] = useState('');
  
  
  const countries = [
    { name: 'India', code: '+91', flag: 'IN' },
    { name: 'United States', code: '+1', flag: 'US' },
    { name: 'United Kingdom', code: '+44', flag: 'GB' },
    { name: 'Thailand', code: '+66', flag: 'TH' },
    { name: 'Canada', code: '+1', flag: 'CA' },
    { name: 'Australia', code: '+61', flag: 'AU' },
    { name: 'Germany', code: '+49', flag: 'DE' },
    { name: 'France', code: '+33', flag: 'FR' },
    { name: 'United Arab Emirates', code: '+971', flag: 'AE' },
    { name: 'Qatar', code: '+974', flag: 'QA' },
    { name: 'Japan', code: '+81', flag: 'JP' },
    { name: 'China', code: '+86', flag: 'CN' },
    { name: 'Russia', code: '+7', flag: 'RU' },
    { name: 'South Korea', code: '+82', flag: 'KR' },
    { name: 'Brazil', code: '+55', flag: 'BR' },
    { name: 'Mexico', code: '+52', flag: 'MX' },
    { name: 'South Africa', code: '+27', flag: 'ZA' },
    { name: 'Netherlands', code: '+31', flag: 'NL' }
  ];

  const defaultCountry = countries.find((c) => c.flag === "US");
  
    
    useEffect(() => {
      fetch("https://ipwho.is/")
        .then((res) => res.json())
        .then((data) => {
          const userCountryCode = data?.country_code;
          const matchedCountry = countries.find((c) => c.flag === userCountryCode);
          if (matchedCountry) {
            setSelectedCountry(matchedCountry);
          }
        })
        .catch(() => {
        
        });
    }, []);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    closeMenu();
    mobileInputRef.current?.focus();
  };
  
  const locationName = countries.find(c => c.flag === selectedCountry?.flag)?.name || '';

  useEffect(() => {
    const storedUser = localStorage.getItem('loginuserData');  
    console.log("Stored user data from localStorage:", storedUser);
  
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const parsedEmail = parsedUser.email;
      console.log("Parsed email:", parsedEmail);
  
      axios.get(`https://api.hachion.co/api/v1/user/myprofile`, {
        params: { email: parsedEmail }
      })
      .then((response) => {
        console.log("Response from backend:", response.data);
        const data = response.data;
        setName(data.name);
        setEmail(data.email);
        setMobileNumber(data.mobile);
        // setLocation(countries.name);
        // setSelectedCountry({ code: data.countryCode, flag: data.countryFlag });
        // setProfileImage(data.profileImageUrl || null);
      })
      .catch((error) => {
        console.error('Failed to fetch user profile', error);
      });
    }
  }, []);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleResetPassword = (e) => {
    e.preventDefault();
    const email = document.getElementById('inputEmail')?.value;
    if (!email) {
      alert("User email not found.");
      return;
    }
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
  
    setIsUpdating(true); 
  
    axios.post('https://api.hachion.co/api/v1/user/reset-password', {
      email,
      password: passwords.oldPassword,
      newPassword: passwords.newPassword,
      confirmPassword: passwords.confirmPassword
    })
    .then(response => {
      setIsUpdating(false);  
      setPasswordUpdateMessage('Password updated successfully.');  
      alert(response.data);  
    })
    .catch(error => {
      setIsUpdating(false);  
      setPasswordUpdateMessage('Failed to reset password.');  
      console.error("Reset password error:", error);
      alert("Failed to reset password");
    });
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
      setProfileImage(URL.createObjectURL(file));
    }
  };
  
  const removeImage = () => {
    setProfileImage(null);
  };

  return (
    <>
      <div className="courses-enrolled">
        <nav className='dashboard-nav'>My Profile</nav>
      </div>
      <div className="resume-div">
      <div className="write-review">
        <form className='review-form-content'>
          <div className="input-row">
            <div className="profile">
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  profileImage ? (
                    <FiX size={16} color="red" onClick={removeImage} />
                  ) : (
                    <label htmlFor="imageUpload">
                      <FiCamera size={16} />
                      <input
                        type="file"
                        id="imageUpload"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                      />
                    </label>
                  )
                }
              >
                <LargeAvatar src={profileImage}>
                  {!profileImage && <FaUserAlt size={50} color="#00AEEF" />}
                </LargeAvatar>
              </StyledBadge>
            </div>
            
            <div className="col-md-5">
              <label htmlFor="inputName" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            </div>

            <div className="input-row">
            <div className="col-md-5">
              <label htmlFor="inputEmail" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="col-md-5">
              <label className="form-label">Mobile Number</label>
              <div className="input-wrapper" style={{ position: 'relative' }}>
    <button
      variant="text"
      onClick={openMenu}
      className='mobile-button'
    >
      <Flag code={selectedCountry.flag} className="country-flag me-1" />
      <span style={{ marginRight: '5px' }}>{selectedCountry.code}</span>
      <AiFillCaretDown />
    </button>
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
      {countries.map((country) => (
        <MenuItem key={country.code} onClick={() => handleCountrySelect(country)}>
          <Flag code={country.flag} className="country-flag me-2" />
          {country.name} ({country.code})
        </MenuItem>
      ))}
    </Menu>
                <input
                  type="tel"
                  className="form-control"
                  ref={mobileInputRef}
                  // id='enroll2'
                  placeholder="Enter your mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                style={{paddingLeft: '100px',}}/>
              </div>
            </div>
            </div>
          {/* <div className="center">
            <button className='update-btn'>Update</button>
          </div> */}

          <div className="password-title">Reset Password</div>
          <div className="input-row">
<div className="me-3 password-input-wrapper">
  <label htmlFor="oldPassword" className="form-label">Old Password</label>
  <div className="password-field">
    <input
      type={showPasswords.oldPassword ? 'text' : 'password'}
      className="form-control"
      name="oldPassword"
      value={passwords.oldPassword}
      onChange={handlePasswordChange}
    />
    <span className="eye-icon" onClick={() => togglePasswordVisibility('oldPassword')}>
      {showPasswords.oldPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
    </span>
  </div>
</div>

<div className="me-3 password-input-wrapper">
  <label htmlFor="newPassword" className="form-label">New Password</label>
  <div className="password-field">
    <input
      type={showPasswords.newPassword ? 'text' : 'password'}
      className="form-control"
      name="newPassword"
      value={passwords.newPassword}
      onChange={handlePasswordChange}
    />
    <span className="eye-icon" onClick={() => togglePasswordVisibility('newPassword')}>
      {showPasswords.newPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
    </span>
  </div>
</div>

<div className="me-3 password-input-wrapper">
  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
  <div className="password-field">
    <input
      type={showPasswords.confirmPassword ? 'text' : 'password'}
      className="form-control"
      name="confirmPassword"
      value={passwords.confirmPassword}
      onChange={handlePasswordChange}
    />
    <span className="eye-icon" onClick={() => togglePasswordVisibility('confirmPassword')}>
      {showPasswords.confirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
    </span>
  </div>
</div>
</div>
{passwordUpdateMessage && <div className="message">{passwordUpdateMessage}</div>}

    <div className="center">
    <button className='update-btn' onClick={handleResetPassword}>Update</button>

    </div>
        </form>
      </div>
      </div>
    </>
  );
};

export default UserProfile;
