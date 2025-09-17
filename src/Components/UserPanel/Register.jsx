// import React, { useEffect, useRef, useState } from 'react';
// import "./Login.css";
// import { Link, useNavigate } from "react-router-dom";
// import { Menu, MenuItem } from '@mui/material';
// import Flag from 'react-world-flags';
// import { AiFillCaretDown } from 'react-icons/ai';
// import { countries, getDefaultCountry } from '../../countryUtils';
// import LoginBanner from '../../Assets/loginbackground.png';
// import google from '../../Assets/google-new.png';
// import Topbar from './Topbar';
// import NavbarTop from './NavbarTop';
// import Footer from './Footer';
// import StickyBar from './StickyBar';
// import { MdKeyboardArrowRight } from 'react-icons/md';
// import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
// import { TbRefresh } from "react-icons/tb";

// const Register = () => {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
  // const [registerMessage, setRegisterMessage] = useState("");
  // const [messageType, setMessageType] = useState(""); 
//   const navigate = useNavigate();
//   const [anchorEl, setAnchorEl] = useState(null);
//   const mobileInputRef = useRef(null);
//   const [captchaInput, setCaptchaInput] = useState("");
//   const [otpMessage, setOtpMessage] = useState("");
//   const [formError, setFormError] = useState("");
//   const [passwordType, setPasswordType] = useState('password');
//   const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());
//   const [captchaText, setCaptchaText] = useState('');
//   const [userInput, setUserInput] = useState('');
//   const canvasRef = useRef(null);
//   const [errors, setErrors] = useState({});
  
// const [me, setMe] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     role: "",
//     otherRole: "",
//     goal: "",
//     interests: [],
//     learningMethods: [],
//     trainingMode: "",
//     skillLevel: "",
//     lookingForJob: "",
//     realTimeProjects: "",
//     certificationOrPlacement: "",
//     speakToCourseAdvisor: "",
//     whereYouHeard: ""
//   });

//   const handleFormChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   useEffect(() => {
//     fetch("https://ipwho.is/")
//       .then((res) => res.json())
//       .then((data) => {
//         const userCountryCode = data?.country_code;
//         const matchedCountry = countries.find((c) => c.flag === userCountryCode);
//         if (matchedCountry) {
//           setSelectedCountry(matchedCountry);
//         }
//       })
//       .catch(() => {});
//   }, []);

//   const handleCountrySelect = (country) => {
//     setSelectedCountry(country);
//     closeMenu();
//     mobileInputRef.current?.focus();
//   };

//   const openMenu = (event) => setAnchorEl(event.currentTarget);
//   const closeMenu = () => setAnchorEl(null);

//   const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// useEffect(() => {
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');
//         initializeCaptcha(ctx);
//     }, []);

//     const generateRandomChar = (min, max) =>
//         String.fromCharCode(Math.floor
//             (Math.random() * (max - min + 1) + min));

//     const generateCaptchaText = () => {
//         let captcha = '';
//         for (let i = 0; i < 2; i++) {
//             captcha += generateRandomChar(65, 90);
//             captcha += generateRandomChar(97, 122);
//             captcha += generateRandomChar(48, 57);
//         }
//         return captcha.split('').sort(
//             () => Math.random() - 0.5).join('');
//     };

//     const drawCaptchaOnCanvas = (ctx, captcha) => {
//         ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//         const textColors = ['rgb(0,0,0)', 'rgb(130,130,130)'];
//         const letterSpace = 150 / captcha.length;
//         for (let i = 0; i < captcha.length; i++) {
//             const xInitialSpace = 25;
//             ctx.font = '20px Roboto Mono';
//             ctx.fillStyle = textColors[Math.floor(
//                 Math.random() * 2)];
//             ctx.fillText(
//                 captcha[i],
//                 xInitialSpace + i * letterSpace,
//                 Math.floor(Math.random() * 16 + 25),
//                 100
//             );
//         }
//     };

//     const initializeCaptcha = (ctx) => {
//         setUserInput('');
//         const newCaptcha = generateCaptchaText();
//         setCaptchaText(newCaptcha);
//         drawCaptchaOnCanvas(ctx, newCaptcha);
//     };

//     const handleUserInputChange = (e) => {
//         setUserInput(e.target.value);
//     };

//   const validateForm = () => {
//   const newErrors = {};

//   if (!firstName.trim()) newErrors.firstName = "First name is required.";
//   if (!email.trim()) {
//     newErrors.email = "Email is required.";
//   } else if (!isValidEmail(email)) {
//     newErrors.email = "Please enter a valid email address.";
//   }
//   if (!mobile.trim()) {
//     newErrors.mobile = "Mobile number is required.";
//   } else if (!/^\d{10}$/.test(mobile)) {
//     newErrors.mobile = "Enter a valid mobile number (10 digits).";
//   }
//   if (!password.trim()) newErrors.password = "Password is required.";
//   if (!userInput.trim()) {
//     newErrors.captcha = "Captcha is required.";
//   } else if (userInput !== captchaText) {
//     newErrors.captcha = "Captcha does not match.";
//     const ctx = canvasRef.current.getContext("2d");
//     initializeCaptcha(ctx);
//   }

//   setErrors(newErrors);
//   return Object.keys(newErrors).length === 0;
// };

//     const fetchMe = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`https://api.test.hachion.co/api/me`, {
//         credentials: "include",
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setMe(data);
//       } else {
//         setMe(null);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMe();
//   }, []);

//   const loginWithGoogle = () => {
    
//     window.location.href = `https://api.test.hachion.co/oauth2/authorization/google`;
//   };


//   const handleClick = async () => {
//   setOtpMessage("");

//   if (!validateForm()) return;

//   setIsLoading(true);

//   const sanitizedMobile = mobile.trim().replace(/^(\+)?/, '');
//   const fullMobileNumber = `${selectedCountry.code} ${sanitizedMobile}`;

//   const data = { firstName, lastName, email, mobile: fullMobileNumber, country: selectedCountry.name, password };

//   try {
//     const response = await fetch(
//       `https://api.test.hachion.co/api/v1/user/send-otp?email=${email}`,
//       { method: "POST", headers: { "Content-Type": "application/json" } }
//     );

//     const responseData = await response.json().catch(() => ({}));
//     console.log("OTP responseData:", responseData);

//    if (response.ok && (responseData?.otp || responseData?.message?.includes("OTP"))) {
//   setOtpMessage("OTP sent to your email.");
//   localStorage.setItem("registeruserData", JSON.stringify(data));

//   console.log("Navigating to /registerverification with data:", data);
//   navigate('/registerverification'); 
// }
//  else {
//       setErrors({ api: responseData?.message || "Failed to send OTP. Please try again." });
//     }
//   } catch (error) {
//     setErrors({ api: `An error occurred: ${error.message}` });
//   } finally {
//     setIsLoading(false);
//   }
// };


//   const togglePasswordVisibility = () => {
//     setPasswordType(passwordType === 'password' ? 'text' : 'password');
//   };

//   return (
//     <>
//       <Topbar />
//       <NavbarTop />
//       <div className="blogs-header">
//         <nav aria-label="breadcrumb">
//           <ol className="breadcrumb">
//             <li className="breadcrumb-item">
//               <a href="/">Home</a> <MdKeyboardArrowRight />
//             </li>
//             <li className="breadcrumb-item active" aria-current="page">
//               Create Account
//             </li>
//           </ol>
//         </nav>
//       </div>

//       <img src={LoginBanner} alt="Login Banner" className="login-banner" />

//       <div className="login">
//         <div className="login-left">
//           <div className="login-top">
//             <h4 className="login-continue">Create Account</h4>
//             <div className="login-mid">
//               {/* First Name */}
//               <label className="login-label">
//                 First Name<span className="star">*</span>
//               </label>
//               <div className="register-field">
//                 <div className="password-field">
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Enter your first name"
//                   value={firstName}
//                   onChange={(e) => setFirstName(e.target.value)}
//                 />
//               </div>
//               {errors.firstName && <p className="error-field-message">{errors.firstName}</p>}
//               </div>

//               {/* Last Name */}
//               <label className="login-label">
//                 Last Name
//               </label>
//               <div className="register-field">
//               <div className="password-field">
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Enter your last name"
//                   value={lastName}
//                   onChange={(e) => setLastName(e.target.value)}
//                 />
//               </div>
//               </div>
//               {/* Email */}
//               <label className="login-label">
//                 Email ID<span className="star">*</span>
//               </label>
//               <div className="register-field">
//               <div className="password-field">
//                 <input
//                   type="email"
//                   className="form-control"
//                   placeholder="abc@gmail.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>
//               {errors.email && <p className="error-field-message">{errors.email}</p>}
//               </div>
//               {/* Mobile */}
//               <label className="login-label">
//                 Phone Number<span className="star">*</span>
//               </label>
//               <div className="register-field">
//               <div className="password-field" style={{ position: "relative" }}>
//                 <button onClick={openMenu} className="mobile-button">
//                   <Flag code={selectedCountry.flag} className="country-flag me-1" />
//                   <span style={{ marginRight: "5px", fontSize: "small" }}>
//                     {selectedCountry.flag} ({selectedCountry.code})
//                   </span>
//                   <AiFillCaretDown />
//                 </button>

//                 <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
//                   {countries.map((country) => (
//                     <MenuItem key={country.code} onClick={() => handleCountrySelect(country)}>
//                       <Flag code={country.flag} className="country-flag me-2" />
//                       {country.name} ({country.code})
//                     </MenuItem>
//                   ))}
//                 </Menu>

//                 <input
//                   type="tel"
//                   className="form-control"
//                   ref={mobileInputRef}
//                   value={mobile}
//                   onChange={(e) => setMobile(e.target.value)}
//                   placeholder="Enter your mobile number"
//                   style={{ paddingLeft: "120px", border: "none" }}
//                   autoComplete="tel-national"
//                   inputMode="numeric"
//                   pattern="[0-9]*"
//                 />
//               </div>
//               {errors.mobile && <p className="error-field-message">{errors.mobile}</p>}
//               </div>
//               {/* Password */}
//               <label className="login-label">Password<span className="star">*</span></label>
//               <div className="register-field">
//               <div className="password-field">
//                 <input
//                   type={passwordType}
//                   className="form-control"
//                   placeholder="Enter password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <span className="eye-icon" onClick={togglePasswordVisibility}>
//                   {passwordType === 'password' ? <AiFillEye /> : <AiFillEyeInvisible />}
//                 </span>
//               </div>
//               {errors.password && <p className="error-field-message">{errors.password}</p>}
//               </div>

//               <label className="login-label">
//                 Enter Captcha<span className="star">*</span>
//               </label>

//               <div className="captcha-wrapper">
//                     <canvas ref={canvasRef} className="password-field" style={{backgroundColor: 'none'}}
//                         height="40">

//                     </canvas>
//                     <span className="refresh-captcha-btn" id="reload-button" onClick={
//                         () => initializeCaptcha(
//                             canvasRef.current.getContext('2d'))}>
//                        <TbRefresh />
//                     </span>
//                 </div>
//                 <div className="register-field">
//                 <div className="password-field">
//                 <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Enter captcha here"
//                     value={userInput}
//                     onChange={handleUserInputChange}/>
//                     </div>
//                     {errors.captcha && <p className="error-field-message">{errors.captcha}</p>}
//                     </div>

              // <div className="d-flex align-items-center mb-3" style={{margin: '0.2vh 2vh'}}>
              // <div className="form-check form-switch align-items-center remember-me">
              //   <input className="form-check-input" type="checkbox" id="rememberMeSwitch" />
              //   <label className="form-check-label" htmlFor="rememberMeSwitch" style={{ fontSize: "12px" }}>
              //     Remember me
              //   </label>
              // </div>
              // </div>

              // {formError && <p className="error-field-message">{formError}</p>}
              // {registerMessage && (
              //   <p className={messageType === "error" ? "error-field-message" : "success-message"}>
              //     {registerMessage}
              //   </p>
              // )}

//               <div className="d-grid gap-2">
//                 <button type="button" className="register-btn" onClick={handleClick} disabled={isLoading}>
//                   {isLoading ? "Creating..." : "Create Account"}
//                 </button>
//               </div>
//               <hr style={{width: '90%', margin: '20px'}}/>
//               <div className="d-grid gap-2">
//                 {/* <button className="other-btn" type="button">
//                   <img src={google} alt="login-with-google" className="icon-btn-img" />
//                   or Sign Up with Google
//                 </button> */}
//                 <button className="other-btn" type="button" onClick={loginWithGoogle}>
//   <img src={google} alt="login-with-google" className="icon-btn-img" />
//   or Sign Up with Google
// </button>
//               </div>
//             </div>
//             </div>

//             <p className="go-to-register">
//               Already have an account?{" "}
//               <Link to="/login" className="link-to-register">
//                 Login
//               </Link>
//             </p>
//           </div>
//         </div>

//       <Footer />
//       <StickyBar />
//     </>
//   );
// };

// export default Register;

import React, { useEffect, useRef, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { Menu, MenuItem } from "@mui/material";
import Flag from "react-world-flags";
import { AiFillCaretDown } from "react-icons/ai";
import { countries, getDefaultCountry } from "../../countryUtils";
import LoginBanner from "../../Assets/loginbackground.png";
import google from "../../Assets/google-new.png";
import Topbar from "./Topbar";
import NavbarTop from "./NavbarTop";
import Footer from "./Footer";
import StickyBar from "./StickyBar";
import { MdKeyboardArrowRight } from "react-icons/md";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const mobileInputRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());

  useEffect(() => {
    fetch("https://ipwho.is/")
      .then((res) => res.json())
      .then((data) => {
        const userCountryCode = data?.country_code;
        const matchedCountry = countries.find((c) => c.flag === userCountryCode);
        if (matchedCountry) setSelectedCountry(matchedCountry);
      })
      .catch(() => {});
  }, []);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setAnchorEl(null);
    mobileInputRef.current?.focus();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(mobile)) {
      newErrors.mobile = "Enter a valid mobile number (10 digits).";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClick = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    const sanitizedMobile = mobile.trim().replace(/^(\+)?/, "");
    const fullMobileNumber = `${selectedCountry.code} ${sanitizedMobile}`;

    const userData = {
      firstName,
      lastName,
      email,
      mobile: fullMobileNumber,
      country: selectedCountry.name,
    };

    // ✅ Save step1 data & go to next screen
    localStorage.setItem("registerStep1", JSON.stringify(userData));
    navigate("/registerhere");

    setIsLoading(false);
  };

  const loginWithGoogle = () => {
    window.location.href = `https://api.test.hachion.co/oauth2/authorization/google`;
  };

  return (
    <>
      <Topbar />
      <NavbarTop />

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
              <div className="register-field">
                <div className="password-field">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                </div>
                {errors.firstName && (
                  <p className="error-field-message">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <label className="login-label">Last Name</label>
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
              <div className="register-field">
                <div className="password-field">
                <input
                  type="email"
                  className="form-control"
                  placeholder="abc@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                </div>
                {errors.email && (
                  <p className="error-field-message">{errors.email}</p>
                )}
              </div>

              {/* Mobile */}
              <label className="login-label">
                Phone Number<span className="star">*</span>
              </label>
              <div className="register-field">
                <div className="password-field" style={{ position: "relative" }}>
                <button
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  className="mobile-button"
                >
                  <Flag
                    code={selectedCountry.flag}
                    className="country-flag me-1"
                  />
                  <span style={{ marginRight: "5px", fontSize: "small" }}>
                    {selectedCountry.flag} ({selectedCountry.code})
                  </span>
                  <AiFillCaretDown />
                </button>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  {countries.map((country) => (
                    <MenuItem
                      key={country.code}
                      onClick={() => handleCountrySelect(country)}
                    >
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
              {errors.mobile && (
                <p className="error-field-message">{errors.mobile}</p>
              )}
              </div>

              <div className="d-grid gap-2">
                <button
                  type="button"
                  className="register-btn"
                  onClick={handleClick}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Account"}
                </button>
              </div>

              <hr style={{ width: "90%", margin: "20px" }} />

              <div className="d-grid gap-2">
                <button className="other-btn" type="button" onClick={loginWithGoogle}>
                  <img
                    src={google}
                    alt="login-with-google"
                    className="icon-btn-img"
                  />
                  or Sign Up with Google
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
    </>
  );
};

export default Register;
