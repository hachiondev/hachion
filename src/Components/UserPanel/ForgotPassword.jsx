import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Topbar from '../../Components/Layout/Topbar';
import NavbarTop from '../../Components/Layout/NavbarTop';
import Footer from '../../Components/Layout/Footer';
import StickyBar from '../../Components/Layout/StickyBar';
import { MdKeyboardArrowRight } from 'react-icons/md';
import LoginBanner from '../../Assets/loginbackground.webp';

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
  setOtpMessage("");
  setErrorMessage("");      
  setFormError("");

  if (!validateForm()) return;
  setIsLoading(true);

  const data = { email };

  try {
    const res = await fetch(
      `https://api.hachion.co/api/v1/user/forgotpassword?email=${encodeURIComponent(email)}`,
      { method: "PUT" }
    );

    
    const msg = (await res.text()).trim();
    console.log("forgotpassword:", { ok: res.ok, status: res.status, msg });

    const isSuccess = res.ok && /\botp\b/i.test(msg);

    if (isSuccess) {
      setFormError("");
      setOtpMessage("OTP sent to your email.");
      localStorage.setItem("registeruserData", JSON.stringify(data));
      setTimeout(() => navigate("/confirm-otp"), 1200);
    } else {
      const errorMsg = msg || "Failed to send OTP. Please try again.";
      setFormError(errorMsg);          
      setErrorMessage("");             
    }
  } catch (e) {
    setFormError(`An error occurred: ${e.message}`);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <>
    <div className='home-background'>
    <Topbar />
    <NavbarTop />
    <div className='container'>
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
                  
                  onClick={handleSendClick}
                >
                  Send OTP
                </button>
                {/* right below the button */}
{otpMessage && <p className="success-field-message">{otpMessage}</p>}
{formError && <p className="error-field-message">{formError}</p>}
{/* {errorMessage && <p className="error-field-message">{errorMessage}</p>} */}

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