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
import TopBarNew from './TopBarNew';
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
  const navigate = useNavigate();

      const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

  
  const handleSendClick = async () => {
  setFormError("");
  setOtpMessage("");

  if (!email) {
    setFormError("Please fill in email field.");
    return;
  }

  if (!isValidEmail(email)) {
    setFormError("Please enter a valid email address.");
    return;
  }

  setIsLoading(true);

  const data = { email };

  try {
    const response = await fetch(
      `https://api.hachion.co/api/v1/user/forgotpassword?email=${email}`,
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
    }
  } catch (error) {
    setFormError(`An error occurred: ${error.message}`);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <>
    <TopBarNew />
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
      <div className='login'>
        <div className='login-left'>
          <div className='login-top'>
            <h4 className='login-continue'>Forgot Password</h4>
            <p className='forgotpassword-text'>We will send you an OTP in given Email to reset your password.</p>
            <div className='login-mid'>
              <label className='login-label'>
                Email ID<span className='star'>*</span>
              </label>
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
               
              </div>
            </div>
        </div>
        </div>
      <Footer />
      <StickyBar />
    </>
  );
};

export default ForgotPassword;