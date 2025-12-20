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
import { useNavigate, Link } from 'react-router-dom';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
dayjs.extend(customParseFormat);

const API_BASE = (process.env.REACT_APP_API_BASE || "https://api.hachion.co").replace(/\/+$/,"");
const resolveImageUrl = (img) => {
  if (!img) return "";
  if (/^https?:\/\//i.test(img)) return img;
  const path = img.startsWith("/") ? img : `/${img}`;
  return `${API_BASE}${path}`;
};
const profileToPicture = (resp, storedUser = {}) => {
  if (resp?.profileImageUrl) return resolveImageUrl(resp.profileImageUrl);
  if (resp?.profileImage)   return resolveImageUrl(`/api/v1/user/profile/${resp.profileImage}`);
  return storedUser.picture || "";
};

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


const tzAbbrFromIana = (iana) => {
  if (!iana) return '';
  const hardcoded = {
    'Asia/Kolkata': 'IST',
    'Asia/Calcutta': 'IST',
  };
  if (hardcoded[iana]) return hardcoded[iana];
  try {
    
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: iana,
      timeZoneName: 'short'
    }).formatToParts(new Date());
    const name = parts.find(p => p.type === 'timeZoneName')?.value || '';
    return name.replace(/^GMT/, 'UTC'); 
  } catch {
    return iana;
  }
};


const buildLocation = ({ city, region, country }) =>
  [city, region, country].filter(Boolean).join(', ');


const countryToCurrencyMap = {
  IN: 'INR', US: 'USD', GB: 'GBP', AU: 'AUD', CA: 'CAD', AE: 'AED', JP: 'JPY', EU: 'EUR',
  TH: 'THB', DE: 'EUR', FR: 'EUR', QA: 'QAR', CN: 'CNY', RU: 'RUB', KR: 'KRW', BR: 'BRL',
  MX: 'MXN', ZA: 'ZAR', NL: 'EUR',
};

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
  const [facebook, setFacebook] = useState('');
const [twitter, setTwitter] = useState('');
const [linkedin, setLinkedin] = useState('');
const [website, setWebsite] = useState('');
const [github, setGithub] = useState('');


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

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [canChangePassword, setCanChangePassword] = useState(true);


  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    closeMenu();
    mobileInputRef.current?.focus();
  };

  const formatDobForApi = (dobDisplay) => {
    if (!dobDisplay) return '';
    const d = dayjs(dobDisplay, 'DD-MM-YYYY', true);
    return d.isValid() ? d.format('DD-MM-YYYY') : '';
  };

  const parseDobFromApi = (apiDob) => {
    if (!apiDob) return '';
    const d = dayjs(apiDob, ['DD-MM-YYYY','YYYY-MM-DD', dayjs.ISO_8601], true);
    return d.isValid() ? d.format('DD-MM-YYYY') : '';
  };

  const isFileLike = (val) => val && typeof val !== 'string' && (val instanceof File || val instanceof Blob);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const emailEl = document.getElementById('inputEmail');
    const emailVal = emailEl?.value || email;
    if (!emailVal) {
      setErrorMessage('❌ User email not found.');
      return;
    }

    try {
      const payload = {
        email: emailVal,
        firstName: (firstName || '').trim(),
        lastName: (lastName || '').trim(),
         name: (name || '').trim(), 

        dob: formatDobForApi(dob),
        gender: (gender || '').trim(),
        location: (location || '').trim(),
        timeZone: (timeZone || '').trim(),
        address: (address || '').trim(),
        bio: (bio || '').trim(),
      };

      const form = new FormData();
      form.append(
        'data',
        new Blob([JSON.stringify(payload)], { type: 'application/json' })
      );

      
if (canChangePassword && isFileLike(profileImage)) {
  form.append('profileImage', profileImage);
}
      const resp = await axios.post(
        'https://api.hachion.co/api/v1/user/profile/update',
        form
      );

      const r = resp?.data || {};
      const storedUserRaw = localStorage.getItem('loginuserData');
      const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : {};
      const updatedUser = {
        ...storedUser,
        name:
          r.userName ||
          (name && name.trim()) ||
          `${(firstName || '').trim()} ${(lastName || '').trim()}`.trim(),
        email: r.email || storedUser.email,
        profileImage:     r.profileImage     ?? storedUser.profileImage,
        profileImageUrl:  r.profileImageUrl  ?? storedUser.profileImageUrl,
      };
      updatedUser.picture = profileToPicture(r, storedUser);
      localStorage.setItem('loginuserData', JSON.stringify(updatedUser));
      window.dispatchEvent(new CustomEvent('profile-updated', { detail: updatedUser }));
      if (updatedUser.picture) setProfileImage(updatedUser.picture);

      if (r.profileImageUrl) {
        const fullUrl = r.profileImageUrl.startsWith('http')
          ? r.profileImageUrl
          : `https://api.hachion.co${r.profileImageUrl}`;
        setProfileImage(fullUrl);
      }
      setName(
        r.userName ||
          (name && name.trim()) ||
          `${(firstName || '').trim()} ${(lastName || '').trim()}`.trim()
      );

      setSuccessMessage('✅ Profile updated successfully.');
      setErrorMessage('');
    } catch (err) {
      setErrorMessage('❌ Failed to update profile.');
      setSuccessMessage('');
    }
  };

  
  useEffect(() => {
    const storedUser = localStorage.getItem('loginuserData');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const parsedEmail = parsedUser.email;

      axios.get(`https://api.hachion.co/api/v1/user/myprofile`, {
        params: { email: parsedEmail }
      })
      .then((response) => {
        const data = response.data;

        setName(data.name || '');
        if (data.name) {
          const parts = data.name.trim().split(/\s+/);
          setFirstName(parts[0] || '');
          setLastName(parts.slice(1).join(' ') || '');
        }

        setEmail(data.email || '');
        setMobileNumber(data.mobile || '');
        setInitialMobile(data.mobile || '');

        setGender(data.gender || '');
        setLocation(data.location || '');
        setTimeZone(data.timeZone || '');
        setAddress(data.address || '');
        setBio(data.bio || '');
        setDob(parseDobFromApi(data.dob));
        const provider = data.primaryProvider || data.provider || null;
const hasPw = (typeof data.passwordSet === 'boolean') ? data.passwordSet
            : (typeof data.passwordEnabled === 'boolean') ? data.passwordEnabled
            : undefined;


if (provider === 'GOOGLE') {
  setCanChangePassword(false);
} else if (hasPw === false) {
  setCanChangePassword(false);
} else if (hasPw === true || provider === 'LOCAL') {
  setCanChangePassword(true);
}

        if (data.profileImage) {
          const fullImageUrl = `https://api.hachion.co/api/v1/user/profile/${data.profileImage}`;
          setProfileImage(fullImageUrl);
        }
      })
      .catch(() => {
        
      });
    }
  }, []);

  
  useEffect(() => {
    (async () => {
      try {
        const geoResponse = await axios.get('https://ipinfo.io/json?token=82aafc3ab8d25b');
        const { city, region, country, timezone } = geoResponse?.data || {};

        
        if (!location && (city || region || country)) {
          setLocation(buildLocation({ city, region, country }));
        }
        if (!timeZone && timezone) {
          setTimeZone(tzAbbrFromIana(timezone)); 
        }

        
        if (country && countryToCurrencyMap[country]) {
          localStorage.setItem('userCurrency', countryToCurrencyMap[country]); 
        }
      } catch {
        
      }
    })();
    
  }, []); 
const handleSocialSave = async () => {
  setSuccessMessage('');
  setErrorMessage('');

  const storedUserRaw = localStorage.getItem('loginuserData');
  const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : {};
  const emailVal = storedUser.email;

  if (!emailVal) {
    setErrorMessage('❌ User email not found.');
    return;
  }

  const payload = {
    facebook: (facebook || '').trim(),
    twitter: (twitter || '').trim(),
    linkedin: (linkedin || '').trim(),
    website: (website || '').trim(),
    github: (github || '').trim(),
  };

  try {
    await axios.patch(
      'https://api.hachion.co/api/v1/user/social-links',
      payload,
      { params: { email: emailVal } }
    );

    
    setSuccessMessage('✅ Social links updated successfully.');
    setErrorMessage('');
  } catch (err) {
    setErrorMessage('❌ Failed to update social links.');
    setSuccessMessage('');
  }
};

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
      await axios.get(`https://api.hachion.co/check-mobile?mobile=${encodedMobile}`);
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

  
  const storedUserRaw = localStorage.getItem('loginuserData');
  const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : {};
  const emailFromStorage = storedUser.email;
  const emailVal = email || emailFromStorage;

  if (!emailVal) {
    setErrorMessage("❌ User email not found.");
    return;
  }

  const isPasswordChanged =
    passwords.newPassword && passwords.oldPassword && passwords.confirmPassword;

  if (isPasswordChanged && passwords.newPassword !== passwords.confirmPassword) {
    setErrorMessage("❌ New password and confirm password do not match.");
    return;
  }

  const formData = new FormData();

  const requestObject = {
    email: emailVal,
    password: passwords.oldPassword,
    newPassword: passwords.newPassword,
    confirmPassword: passwords.confirmPassword,
    userName: name,
    mobile: mobileNumber
  };

  formData.append(
    "data",
    new Blob([JSON.stringify(requestObject)], { type: "application/json" })
  );

  if (profileImage && typeof profileImage !== 'string') {
    formData.append("profileImage", profileImage);
  }

  setIsUpdating(true);

  try {
    const response = await axios.post(
      'https://api.hachion.co/api/v1/user/reset-password',
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setIsUpdating(false);
    setSuccessMessage("✅ Profile updated successfully.");

    const storedUserRaw2 = localStorage.getItem('loginuserData');
    const storedUser2 = storedUserRaw2 ? JSON.parse(storedUserRaw2) : {};
    const r = response?.data || {};
    const updatedUser = {
      ...storedUser2,
      name,
      profileImage:    r.profileImage    ?? storedUser2.profileImage,
      profileImageUrl: r.profileImageUrl ?? storedUser2.profileImageUrl,
    };
    updatedUser.picture = profileToPicture(r, storedUser2);
    localStorage.setItem('loginuserData', JSON.stringify(updatedUser));
    window.dispatchEvent(new CustomEvent('profile-updated', { detail: updatedUser }));
    if (updatedUser.picture) setProfileImage(updatedUser.picture);

    if (isPasswordChanged) {
      setTimeout(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('loginuserData');
        navigate('/login');
      }, 3000);
    }

  } catch {
    setIsUpdating(false);
    setErrorMessage("❌ Failed to update profile.");
  }
};

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => setAnchorEl(null);

  
const handleImageUpload = (e) => {

  if (!canChangePassword) return;
  const file = e.target.files[0];
  if (file) setProfileImage(file);
};

  
  const removeImage = () => {
  
  if (!canChangePassword) return;
  setProfileImage(null);
};


  return (
    <>
      {/* <div className="dashboard-activity-title">
        {["Profile", "Password", "Social Share"].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div> */}
<div className="dashboard-activity-title">
  {(canChangePassword ? ["Profile", "Password", "Social Share"] : ["Profile", "Social Share"]).map((tab) => (
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

              {/* <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  badgeContent={
                    profileImage ? (
                      <FiX size={16} color="red" onClick={removeImage} style={{ cursor: "pointer" }} />
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
              <label htmlFor="imageUpload" className="upload-image-text">
                {profileImage ? "Edit profile photo" : "Upload profile photo"}
              </label> */}
              {canChangePassword ? (
  <>
    <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        badgeContent={
          profileImage ? (
            <FiX size={16} color="red" onClick={removeImage} style={{ cursor: "pointer" }} />
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
    <label htmlFor="imageUpload" className="upload-image-text">
      {profileImage ? "Edit profile photo" : "Upload profile photo"}
    </label>
  </>
) : (
  <>
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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
    <p className="upload-image-text" style={{ color: '#888', cursor: 'not-allowed' }}>
      Profile photo synced from Google
    </p>
  </>
)}

            </div>

            <div className="instructor-fields">
              <div>
                <label className="login-label">First Name</label>
                <div className="register-field">
                  <div className="password-field">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                      value={firstName || name}
                      onChange={(e) => setFirstName(e.target.value)}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="login-label">Last Name</label>
                <div className="register-field">
                  <div className="password-field">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="instructor-fields">
              <div>
                <label className="login-label">Email</label>
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
                <label className="login-label">Phone Number</label>
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
                      readOnly
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
                <label className="login-label">Date of Birth</label>
                <div className="register-field">
                  <div className="password-field">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      format="DD-MM-YYYY"
                      value={dob ? dayjs(dob, 'DD-MM-YYYY', true) : null}
                      onChange={(newValue) =>
                        setDob(newValue ? dayjs(newValue).format('DD-MM-YYYY') : '')
                      }
                      slotProps={{
                        textField: {
                          variant: 'outlined',
                          placeholder: 'Select your DOB',
                          fullWidth: true,
                          InputProps: {
                            sx: {
                              borderRadius: '8px',
                              fontSize: '16px',
                              width: '360px',
                              height: '48px',
                              backgroundColor: '#fff',
                              '& input': {
                                padding: '10px 12px',
                              },
                            },
                          },
                        },
                      }}
                      sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#fff',
                          },
                          '&:hover fieldset': {
                            borderColor: '#00AEEF',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#00AEEF',
                            borderWidth: '1.5px',
                          },
                        },
                        '& .MuiIconButton-root': {
                          color: '#00AEEF',
                        },
                      }}
                    />
                  </LocalizationProvider>
                  </div>
                </div>
              </div>

              <div>
                <label className="login-label">Gender</label>
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
                <label className="login-label">Location</label>
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
                <label className="login-label">Time Zone</label>
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
              <label className="login-label">Correspondence address</label>
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
              <label className="login-label">Bio</label>
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
              {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
              {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}

              <button className="update-profile-btn" onClick={handleProfileSave} type="button">
                Save Changes
              </button>

              <Link to="" className="home-browse-button">
                Discard
              </Link>
            </div>
          </form>
        </div>
      )}

      {canChangePassword && activeTab === "Password" && (
        <div className="write-review">
          <div className="dashboard-nav">Update Password</div>
          <div>
            <label className="login-label">Current Password</label>
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

          <label className="login-label">New Password</label>
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

          <label className="login-label">Re-type New Password</label>
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
{/* 
      {activeTab === "Social Share" && (
        <div className="write-review">
          <div className="dashboard-nav">Social Details</div>
          <div>
            <label className="login-label">Facebook</label>
            <div className="register-field">
              <div className="form-field">
                <input type="text" className="form-control" placeholder="Enter your link" />
              </div>
            </div>
          </div>
          <div>
            <label className="login-label">Twitter</label>
            <div className="register-field">
              <div className="form-field">
                <input type="text" className="form-control" placeholder="Enter your link" />
              </div>
            </div>
          </div>
          <div>
            <label className="login-label">LinkedIn</label>
            <div className="register-field">
              <div className="form-field">
                <input type="text" className="form-control" placeholder="Enter your link" />
              </div>
            </div>
          </div>
          <div>
            <label className="login-label">Website</label>
            <div className="register-field">
              <div className="form-field">
                <input type="text" className="form-control" placeholder="Enter your link" />
              </div>
            </div>
          </div>
          <div>
            <label className="login-label">GitHub</label>
            <div className="register-field">
              <div className="form-field">
                <input type="text" className="form-control" placeholder="Enter your link" />
              </div>
            </div>
          </div>
          {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
          {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}

          <button className='update-profile-btn'>Save Changes</button>
        </div>
      )} */}
      {activeTab === "Social Share" && (
  <div className="write-review">
    <div className="dashboard-nav">Social Details</div>

    <div>
      <label className="login-label">Facebook</label>
      <div className="register-field">
        <div className="form-field">
          <input
            type="text"
            className="form-control"
            placeholder="Enter your link"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
          />
        </div>
      </div>
    </div>

    <div>
      <label className="login-label">Twitter</label>
      <div className="register-field">
        <div className="form-field">
          <input
            type="text"
            className="form-control"
            placeholder="Enter your link"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
          />
        </div>
      </div>
    </div>

    <div>
      <label className="login-label">LinkedIn</label>
      <div className="register-field">
        <div className="form-field">
          <input
            type="text"
            className="form-control"
            placeholder="Enter your link"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
          />
        </div>
      </div>
    </div>

    <div>
      <label className="login-label">Website</label>
      <div className="register-field">
        <div className="form-field">
          <input
            type="text"
            className="form-control"
            placeholder="Enter your link"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
      </div>
    </div>

    <div>
      <label className="login-label">GitHub</label>
      <div className="register-field">
        <div className="form-field">
          <input
            type="text"
            className="form-control"
            placeholder="Enter your link"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
          />
        </div>
      </div>
    </div>

    {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
    {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}

    <button
      className="update-profile-btn"
      type="button"
      onClick={handleSocialSave}
    >
      Save Changes
    </button>
  </div>
)}

    </>
  );
};

export default UserProfile;
