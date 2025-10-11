import React, { useState } from 'react';
import logo from '../../Assets/logo.png';
import LoginSide from './LoginSide';
import success from '../../Assets/success.gif';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { RiCloseCircleLine } from 'react-icons/ri';
import axios from 'axios';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import Topbar from './Topbar';
import { Link } from 'react-router-dom';
import NavbarTop from './NavbarTop';
import Footer from './Footer';
import StickyBar from './StickyBar';
import { MdKeyboardArrowRight } from 'react-icons/md';
import LoginBanner from '../../Assets/loginbackground.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

      const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const validateForm = () => {
    const newErrors = {};
  
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSendClick = async () => {
  setFormError("");
  setOtpMessage("");

  if (!validateForm()) return;

  setIsLoading(true);

  const data = { email };

  try {
    const response = await fetch(
      `https://api.test.hachion.co/api/v1/user/forgotpassword?email=${email}`,
      {
        method: "PUT",
      }
    );

    const contentType = response.headers.get("Content-Type");
    let responseData;

    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      responseData = { message: text };
      setErrorMessage(response.data.message);
    }

    console.log("Forgot Password responseData:", responseData);

    if (response.ok && responseData?.message?.includes("OTP")) {
      setFormError("");
      setOtpMessage("OTP sent to your email.");
      localStorage.setItem("registeruserData", JSON.stringify(data));
      setTimeout(() => navigate("/confirm-otp"), 3000);
    } else {
      const errorMsg =
        responseData?.message || "Failed to send OTP. Please try again.";
      setFormError(errorMsg);
      setErrorMessage(response.data.message);
    }
  } catch (error) {
    setFormError(`An error occurred: ${error.message}`);
    setErrorMessage("An error occurred during login");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <>
    <div className='home-background'>
    <Topbar />
    <NavbarTop />
    <div className='blogs-header'>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">Home</a> <MdKeyboardArrowRight />
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Forgot Password
                  </li>
                </ol>
              </nav>
            </div>
        <img src={LoginBanner} alt='Login Banner' className='login-banner'/>
      <div className='login container'>
        <div className='login-left'>
          <div className='login-top'>
            <h4 className='login-continue'>Forgot Password</h4>
            <p className='forgotpassword-text'>We will send you an OTP in given Email to reset your password.</p>
            <div className='login-mid'>
              <label className='login-label'>
                Email ID<span className='star'>*</span>
              </label>
              <div className="register-field">
              <div className="password-field">
                <input
                  type='email'
                  className='form-control'
                  id='floatingInput'
                  placeholder='abc@gmail.com'
                  value={email}  
                  onChange={(e) => setEmail(e.target.value)}  
                />
              </div>
              {errors.email && <p className="error-field-message">{errors.email}</p>}
              </div>
              <div className="d-grid gap-2">
                <button
                  type='button'
                  className='register-btn'
                  // data-bs-toggle='modal'
                  // data-bs-target='#exampleModal'
                  onClick={handleSendClick}
                >
                  Send OTP
                </button>
                </div>
               {errorMessage && <p className="error-field-message">{errorMessage}</p>}
              </div>
            </div>
        </div>
        </div>
      {/* <Footer />
      <StickyBar /> */}
      </div >
    </>
  );
};

export default ForgotPassword;