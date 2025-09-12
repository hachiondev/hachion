import React, { useState, useEffect } from 'react';
import './Login.css';
import logo from '../../Assets/logo.png';
import LoginSide from './LoginSide';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import Footer from './Footer';
import StickyBar from './StickyBar';
import LoginBanner from '../../Assets/loginbackground.png';
import { MdKeyboardArrowRight } from 'react-icons/md';

const ConfirmOtp = () => {
  const [otp, setOtp] = useState(Array(4).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");

  const navigate = useNavigate();

  const userDataString = localStorage.getItem('registeruserData');
  const registeruserData = userDataString ? JSON.parse(userDataString) : { email: '' };

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 1) {
      setOtp((prev) => {
        const newOtp = [...prev];
        newOtp[index] = value;
        return newOtp;
      });

      if (value && index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const verifyAccount = async (otpArray) => {
    const otp = otpArray.join("");
    if (!otp) {
      setRegisterMessage("Please fill in all fields");
      setMessageType("error");
      return;
    }

    setIsLoading(true);

    try {
      const verifyResponse = await fetch("https://api.hachion.co/api/v1/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registeruserData.email,
          otp: otp,
        }),
      });

      if (!verifyResponse.ok) {
        const error = await verifyResponse.text();
        setRegisterMessage(`Invalid OTP: ${error}`);
        setMessageType("error");
        throw error;
      }

      // ✅ Success
      setRegisterMessage("OTP Verified Successfully!");
      setMessageType("success");

      // Redirect after success
      setTimeout(() => {
        navigate("/resetpassword");
      }, 1500);

    } catch (error) {
      console.error("Verify error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (resendLoading) return;
    setResendLoading(true);

    try {
      const response = await fetch(
        `https://api.hachion.co/api/v1/user/regenerate-otp?email=${registeruserData.email}`,
        { method: "PUT" }
      );

      if (response.ok) {
        setRegisterMessage("OTP sent successfully!");
        setMessageType("success");
      } else {
        const error = await response.text();
        throw new Error(error || "Failed to resend OTP");
      }
    } catch (error) {
      setRegisterMessage(error.message);
      setMessageType("error");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <Topbar />
      <NavbarTop />
      <div className='blogs-header'>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Enter OTP
            </li>
          </ol>
        </nav>
      </div>
      <img src={LoginBanner} alt='Login Banner' className='login-banner'/>
      <div className='login'>
        <div className="login-left">
          <div className="login-top">
            <h4 className='login-continue'>Enter OTP</h4>
            {/* <div className="login-mid-name"> */}
              <div className="otp-verify">
                <p className='tag'>We will send you  OTP in given email to reset your password.</p>
                {/* <p className='tag'>
                  OTP has been sent to
                  <span className='mail-to-register'>{registeruserData.email}</span>
                </p> */}

                <div className="otp">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-input-${index}`}
                      className="otp-number"
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(e, index)}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="register-btn"
                  onClick={() => verifyAccount(otp)}
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Confirm OTP"}
                </button>

                {registerMessage && (
                  <div
                    style={{
                      color: messageType === "success" ? "green" : "red",
                      marginTop: "5px",
                      fontSize: "12px",
                    }}
                  >
                    {registerMessage}
                  </div>
                )}
              

              <div className='go-to-register'>
                  <span className='link-to-register' onClick={resendOtp}>
                    {resendLoading ? "Resending..." : "Resend OTP"}
                  </span>
                </div>
                </div>

              <p className='spam-msg'>
                <span className="note">*Note : </span> If you don't see OTP in your inbox, kindly check your spam folder.
              </p>
            </div>
          </div>
        </div>

      <Footer />
      <StickyBar />
    </>
  );
};

export default ConfirmOtp;
