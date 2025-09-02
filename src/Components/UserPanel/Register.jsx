// import React from 'react'
// import LoginSide from './LoginSide'
// import logo from '../../Assets/logo.png'
// import './Login.css'
// import email from '../../Assets/Group 39487.png'
// import {Link} from 'react-router-dom';

// const Register = () => {
//   const googleLogin = () => {
//     window.location.href = 'https://api.hachion.co/oauth2/authorization/google';  // Backend Google OAuth
//   };

//   return (
// <>
// <div className='login'>
// <div className='login-left'>
// <div className='login-top'>
//   <img src={logo} alt='logo' className='logo'/>
//   <h3 className='register-head'>Register to start learning</h3>
//   <h5 className='option'>Tap on any option to create an account</h5>
//   <div className='icon-places'>
//     <Link to='/registerhere' className='register-link-to'>
//    <div className='icon-text'>
//   <img src={email} alt='login-with-email' className='icon-text-img'/> 
//    <div className='icon-text-holder-email'>Sign-up with Email</div> 
//     </div></Link>
   
//   </div>
//   </div>
//   <p className='login-link'>Do you have an account with Hachion? <Link to='/login' className='link-to'>Click here to Login </Link></p>
// </div>

// <LoginSide/>
// </div>
  
//    </>
//   )
// }

// export default Register;

import React, { useEffect, useRef, useState } from 'react';
import "./Login.css";
import logo from "../../Assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Menu, MenuItem } from '@mui/material';
import Flag from 'react-world-flags';
import { AiFillCaretDown } from 'react-icons/ai';
import { countries, getDefaultCountry } from '../../countryUtils';
import LoginBanner from '../../Assets/loginbackground.png';
import google from '../../Assets/google-new.png';
import TopBarNew from './TopBarNew';
import NavBar from './NavBar';
import Footer from './Footer';
import StickyBar from './StickyBar';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import PopupInterest1 from './PopupInterest1';
import PopupInterest2 from './PopupInterest2';
import PopupInterest3 from './PopupInterest3';
import PopupInterest4 from './PopupInterest4';
import axios from "axios";

const RegisterHere = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registerMessage, setRegisterMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or error
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const mobileInputRef = useRef(null);
  const [formError, setFormError] = useState("");
  const [passwordType, setPasswordType] = useState('password');
  const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());
  const [showInterestPopup, setShowInterestPopup] = useState(false);
  const [popupStep, setPopupStep] = useState(1);

  const [formData, setFormData] = useState({
    role: "",
    otherRole: "",
    goal: "",
    interests: [],
    learningMethods: [],
    trainingMode: "",
    skillLevel: "",
    lookingForJob: "",
    realTimeProjects: "",
    certificationOrPlacement: "",
    speakToCourseAdvisor: "",
    whereYouHeard: ""
  });

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
      .catch(() => {});
  }, []);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    closeMenu();
    mobileInputRef.current?.focus();
  };

  const openMenu = (event) => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleClick = async () => {
    setFormError("");
    setRegisterMessage("");

    if (!firstName || !lastName || !email || !mobile || !password) {
      setFormError("Please fill in all required fields.");
      return;
    }

    if (!isValidEmail(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (!/^\d{6,15}$/.test(mobile)) {
      setFormError("Please enter a valid mobile number (6–15 digits).");
      return;
    }

    setIsLoading(true);

    const sanitizedMobile = mobile.trim().replace(/^(\+)?/, "");
    const fullMobileNumber = `${selectedCountry.code} ${sanitizedMobile}`;

    const registeruserData = {
      firstName,
      lastName,
      email,
      mobile: fullMobileNumber,
      country: selectedCountry.name,
      password: password,
    };

    try {
      const registerResponse = await fetch("https://api.hachion.co/api/v1/user/register", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: registeruserData.firstName,
          lastName: registeruserData.lastName,
          email: registeruserData.email,
          country: registeruserData.country,
          mobile: registeruserData.mobile,
          mode: "Online",
          password: password,
        }),
      });

      const message = await registerResponse.text();

      if (!registerResponse.ok) {
        setRegisterMessage(message || "Registration failed");
        setMessageType("error");
        throw new Error(message || "Registration failed");
      }

      setRegisterMessage("You are successfully registered!");
      setMessageType("success");

      setTimeout(() => {
        setShowInterestPopup(true);
      }, 1000);

      localStorage.setItem("user", JSON.stringify(registeruserData));
    } catch (error) {
      const msg = error.message || "An unexpected error occurred";
      setRegisterMessage(msg);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  const handleSkip = () => {
    navigate("/");
  };

  const handleNext = () => setPopupStep(prev => prev + 1);
  const handleBack = () => setPopupStep(prev => prev - 1);

  const handleSubmitPopup = async () => {
    try {
      const profileResponse = await axios.get(
        `https://api.hachion.co/api/v1/user/myprofile?email=${email}`
      );

      const profileData = profileResponse.data;

      const payload = {
        studentId: profileData.studentId || "STU123",
        studentName: profileData.name || `${firstName} ${lastName}`,
        studentEmail: profileData.email || email,
        mobile: profileData.mobile || mobile,
        currentRole: formData.role === "Other" ? formData.otherRole : formData.role,
        primaryGoal: formData.goal,
        areasOfInterest: formData.interests.join(", "),
        preferToLearn: formData.learningMethods,
        preferredTrainingMode: formData.trainingMode,
        currentSkill: formData.skillLevel,
        lookingForJob: formData.lookingForJob || "",
        realTimeProjects: formData.realTimeProjects || "",
        certificationOrPlacement: formData.certificationOrPlacement || "",
        speakToCourseAdvisor: formData.speakToCourseAdvisor || "",
        whereYouHeard: formData.whereYouHeard || ""
      };

      await axios.post("https://api.hachion.co/popup-onboarding", payload);

      localStorage.setItem("userPreferences", JSON.stringify(payload));

      navigate("/");
    } catch (err) {
      console.error("Error saving onboarding:", err);
    }
  };

  return (
    <>
      <TopBarNew />
      <NavBar />
      <div className="blogs-header">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Create Account
            </li>
          </ol>
        </nav>
      </div>

      <img src={LoginBanner} alt="Login Banner" className="login-banner" />

      <div className="login">
        <div className="login-left">
          <div className="login-top">
            <h4 className="login-continue">Create Account</h4>
            <div className="login-mid">
              {/* First Name */}
              <label className="login-label">
                First Name<span className="star">*</span>
              </label>
              <div className="password-field">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              {/* Last Name */}
              <label className="login-label">
                Last Name<span className="star">*</span>
              </label>
              <div className="password-field">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              {/* Email */}
              <label className="login-label">
                Email ID<span className="star">*</span>
              </label>
              <div className="password-field">
                <input
                  type="email"
                  className="form-control"
                  placeholder="abc@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Mobile */}
              <label className="login-label">
                Phone Number<span className="star">*</span>
              </label>
              <div className="password-field" style={{ position: "relative" }}>
                <button onClick={openMenu} className="mobile-button">
                  <Flag code={selectedCountry.flag} className="country-flag me-1" />
                  <span style={{ marginRight: "5px", fontSize: "small" }}>
                    {selectedCountry.flag} ({selectedCountry.code})
                  </span>
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
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter your mobile number"
                  style={{ paddingLeft: "120px", border: "none" }}
                  autoComplete="tel-national"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </div>

              {/* Password */}
              <label className="login-label">Password</label>
              <div className="password-field">
                <input
                  type={passwordType}
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="eye-icon" onClick={togglePasswordVisibility}>
                  {passwordType === 'password' ? <AiFillEye /> : <AiFillEyeInvisible />}
                </span>
              </div>

              {/* Remember me */}
              <div className="d-flex align-items-center mb-3" style={{margin: '0.2vh 2vh'}}>
              <div className="form-check form-switch align-items-center remember-me">
                <input className="form-check-input" type="checkbox" id="rememberMeSwitch" />
                <label className="form-check-label" htmlFor="rememberMeSwitch" style={{ fontSize: "12px" }}>
                  Remember me
                </label>
              </div>
              </div>

              {/* Error Message */}
              {formError && <p className="error-message">{formError}</p>}
              {registerMessage && (
                <p className={messageType === "error" ? "error-message" : "success-message"}>
                  {registerMessage}
                </p>
              )}

              {/* Submit */}
              <div className="d-grid gap-2">
                <button type="button" className="register-btn" onClick={handleClick} disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Account"}
                </button>
              </div>
              <hr style={{width: '90%', margin: '20px'}}/>
              <div className="d-grid gap-2">
                <button className="other-btn" type="button">
                  <img src={google} alt="login-with-google" className="icon-btn-img" />
                  or Sign in with Google
                </button>
              </div>
            </div>
            </div>

            <p className="go-to-register">
              Already have an account?{" "}
              <Link to="/login" className="link-to-register">
                Login
              </Link>
            </p>
          </div>
        </div>

      <Footer />
      <StickyBar />
      {showInterestPopup && (
        <>
          {popupStep === 1 && (
            <PopupInterest1
              formData={formData}
              onChange={handleFormChange}
              onNext={handleNext}
              onSkip={handleSkip}
            />
          )}
          {popupStep === 2 && (
            <PopupInterest2
              formData={formData}
              onChange={handleFormChange}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {popupStep === 3 && (
            <PopupInterest3
              formData={formData}
              onChange={handleFormChange}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {popupStep === 4 && (
            <PopupInterest4
              formData={formData}
              onChange={handleFormChange}
              onSubmit={handleSubmitPopup}
              onBack={handleBack}
            />
          )}
        </>
      )}
    </>
  );
};

export default RegisterHere;