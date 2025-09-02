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
import NavBar from './NavBar';
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

  // const handleSendClick = async () => {
  //   try {
  //     // Call the API with the email
  //     const response = await axios.put(`https://api.hachion.co/api/v1/user/forgotpassword?email=${email}`);
      
  //     // If successful, show success message
  //     if (response.status === 200) {
  //       setIsSuccess(true);
  //       setMessage('Password reset link sent to your email');
  //     }
  //   } catch (error) {
  //     // If there's an error, show failure message
  //     setIsSuccess(false);
  //     setMessage('Failed to send reset link. Please try again.');
  //   }
  // };

      const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

  const handleSendClick = async () => {
    setFormError("");
    setOtpMessage("");

    if ( !email ) {
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
        `https://api.hachion.co/api/v1/user/send-otp?email=${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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

      console.log("OTP responseData:", responseData);

      if (response.ok && (responseData?.otp || responseData?.message?.includes("OTP"))) {
        setFormError("");
        setOtpMessage("OTP sent to your email.");
        localStorage.setItem("registeruserData", JSON.stringify(data));
        setTimeout(() => navigate('/confirm-otp'), 3000);
      } else {
        const errorMsg = responseData?.message || "Failed to send OTP. Please try again.";
        setFormError(errorMsg);
      }
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || error.response?.data || error.message;
      setFormError(`An error occurred: ${backendMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <TopBarNew />
    <NavBar />
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
                  value={email}  // Bind email state to input
                  onChange={(e) => setEmail(e.target.value)}  // Update email state
                />
              </div>

              <div className="d-grid gap-2">
                <button
                  type='button'
                  className='register-btn'
                  data-bs-toggle='modal'
                  data-bs-target='#exampleModal'
                  onClick={handleSendClick}
                >
                  Send OTP
                </button>
                </div>
                {/* <div
                  className='modal fade'
                  id='exampleModal'
                  tabIndex='-1'
                  aria-labelledby='exampleModalLabel'
                  aria-hidden='true'
                >
                  <div className='modal-dialog'>
                    <div className='modal-content'>
                      <button
                        data-bs-dismiss='modal'
                        className='close-btn'
                        aria-label='Close'
                        onClick={handleLogin}
                      >
                        <RiCloseCircleLine />
                      </button>

                      <div className='modal-body'>
                        {isSuccess ? (
                          <>
                            <img
                              src={success}
                              alt='Success'
                              className='success-gif'
                            />
                            <p className='modal-para'> Password sent to your Email</p>
                          </>
                        ) : (
                          <p className='modal-para'>{message}</p>
                        )}
                      </div>

                      <button
                        type='button'
                        className='button-login'
                        onClick={handleLogin}
                      >
                        Login
                      </button>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
        {/* </div>
        <LoginSide />
      </div> */}
        </div>
        </div>
      <Footer />
      <StickyBar />
    </>
  );
};

export default ForgotPassword;