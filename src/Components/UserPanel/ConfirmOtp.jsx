import React, { useState, useEffect, useRef } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import Footer from './Footer';
import StickyBar from './StickyBar';
import LoginBanner from '../../Assets/loginbackground.webp';
import { MdKeyboardArrowRight } from 'react-icons/md';

const ConfirmOtp = () => {
  const [otp, setOtp] = useState(Array(4).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");

  const inputRefs = useRef([]);            // <-- refs for the 4 inputs
  const navigate = useNavigate();

  const userDataString = localStorage.getItem('registeruserData');
  const registeruserData = userDataString ? JSON.parse(userDataString) : { email: '' };

  // Focus first OTP box on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 1);
    setOtp(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });

    // auto-advance
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyAccount = async (otpArray) => {
    const joined = otpArray.join("");
    if (joined.length < 4) {
      setRegisterMessage("Please enter all 4 digits.");
      setMessageType("error");
      return;
    }

    setIsLoading(true);

    try {
      const verifyResponse = await fetch("https://api.test.hachion.co/api/v1/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registeruserData.email,
          otp: joined,
        }),
      });

      if (!verifyResponse.ok) {
        // Read server message but present a single, clean error
        // (prevents duplicates like "Invalid OTP: Invalid OTP.")
        await verifyResponse.text(); // we don't surface raw text
        setRegisterMessage("Invalid OTP.");
        setMessageType("error");

        // Clear inputs and refocus first box
        setOtp(Array(4).fill(""));
        setTimeout(() => inputRefs.current[0]?.focus(), 0);
        return;
      }

      // ✅ Success
      setRegisterMessage("OTP Verified Successfully!");
      setMessageType("success");

      setTimeout(() => {
        navigate("/resetpassword");
      }, 1500);

    } catch (error) {
      console.error("Verify error:", error);
      setRegisterMessage("Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (resendLoading) return;
    setResendLoading(true);

    try {
      const response = await fetch(
        `https://api.test.hachion.co/api/v1/user/regenerate-otp?email=${registeruserData.email}`,
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
                Enter OTP
              </li>
            </ol>
          </nav>
        </div>
        <img src={LoginBanner} alt='Login Banner' className='login-banner' />
        <div className='login container'>
          <div className="login-left">
            <div className="login-top">
              <h4 className='login-continue'>Enter OTP</h4>

              <div className="otp-verify">
                <p className='tag'>We will send you OTP in given email to reset your password.</p>

                <div className="otp">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-input-${index}`}
                      className="otp-number"
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      ref={(el) => (inputRefs.current[index] = el)}
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
                <span>*Note : </span> If you don't see OTP in your inbox, kindly check your spam folder.
              </p>
            </div>
          </div>
        </div>

        {/* <Footer />
        <StickyBar /> */}
      </div>
    </>
  );
};

export default ConfirmOtp;
