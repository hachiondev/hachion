import React, { useState, useEffect } from 'react';
import './Login.css';
import logo from '../../Assets/logo.png';
import LoginSide from './LoginSide';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const RegisterNext = () => {
  const [otp, setOtp] = useState(Array(4).fill("")); // OTP array initialized
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordType, setPasswordType] = useState('password');
  const [confirmPasswordType, setConfirmPasswordType] = useState('password');
  const [resendLoading, setResendLoading] = useState(false); // To manage resend OTP loading state
  const navigate = useNavigate();
  const [messageType, setMessageType] = useState("");
  const userDataString = localStorage.getItem('registeruserData');
  const registeruserData = userDataString ? JSON.parse(userDataString) : {  email: '' };
const [registerMessage, setRegisterMessage] = useState("");
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
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };
  

const verifyAccount = async (otpArray, password, confirmPassword) => {
    const otp = otpArray.join(""); 

    if (!otp || !password || !confirmPassword) {
        setRegisterMessage("Please fill in all fields");
        setMessageType("error");
        return;
    }

    if (password !== confirmPassword) {
        setRegisterMessage("Passwords do not match");
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
                otp: otp,
            }),
        });

        if (!verifyResponse.ok) {
            const error = await verifyResponse.text();
            setRegisterMessage(`Invalid OTP: ${error}`);
            setMessageType("error");
            throw error;
        }

        
        const registerResponse = await fetch("https://api.test.hachion.co/api/v1/user/register", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName: registeruserData.firstName,
                lastName: registeruserData.lastName,
                email: registeruserData.email,
                mobile: registeruserData.mobile,
                password: password,
                confirmPassword: confirmPassword
            }),
        });

        const message = await registerResponse.text();

        if (!registerResponse.ok) {
            setRegisterMessage(message || "Registration failed");
            setMessageType("error");
            throw message || "Registration failed";
        }

        setRegisterMessage("You are successfully registered!");
        setMessageType("success");
        setTimeout(() => navigate('/login'), 5000);
    } catch (error) {
        const msg = typeof error === "string" ? error : error.message || "An unexpected error occurred";
        setRegisterMessage(msg);
        // setTimeout(() => navigate('/login'), 5000);
    } finally {
        setIsLoading(false);
    }
};

  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordType(confirmPasswordType === 'password' ? 'text' : 'password');
  };
 
  const resendOtp = async () => {
    if (resendLoading) return;
    setResendLoading(true);

    const email = registeruserData.email; 

    try {
      const response = await fetch(`https://api.test.hachion.co/api/v1/user/regenerate-otp?email=${email}`, {
        method: "PUT",
      });

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
      // alert(`Error: ${error.message}`);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-left">
        <div className="login-top">
          <img src={logo} alt="logo" className="login-logo" />
          <h3 className="register-learning">Register to start learning</h3>

          <div className="steps">
            <h4 className="steps-head">Steps: </h4>
            <div className="step-one" onClick={() => navigate('/registerhere')}>
              <h6 className="steps-head-one">1</h6>
            </div>
            <hr width="45%" size="1" color="#00AAEF" />
            <div className="step-one">
              <h6 className="steps-head-one">2</h6>
            </div>
          </div>
          <div className="login-mid-name">
          <div className="otp-verify">
            <p className='tag' style={{marginBottom: '0'}}>Please check your inbox</p>
            <p className='tag'>OTP has been sent to  <span className='mail-to-register'>{registeruserData.email}</span></p>
            {/* <h6 className="enter-otp">Enter OTP: </h6> */}
            <div className="otp">
  {otp.map((digit, index) => (
    <input
      key={index}
      id={`otp-input-${index}`} // Assign unique ID
      className="otp-number"
      type="text"
      maxLength="1"
      value={digit}
      onChange={(e) => handleOtpChange(e, index)}
    />
  ))}
</div>
            <p className='go-to-register'> Didn't receive the OTP? <span className='link-to-register' onClick={resendOtp}> 
              {resendLoading ? "Resending..." : "Resend"}</span>
            </p>
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

            <label className="login-label">Confirm Password</label>
            <div className="password-field">
              <input
                type={confirmPasswordType}
                className="form-control"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span className="eye-icon" onClick={toggleConfirmPasswordVisibility}>
                {confirmPasswordType === 'password' ? <AiFillEye /> : <AiFillEyeInvisible />}
              </span>
            </div>
            <button
              type="button"
              className="register-btn"
              onClick={() => verifyAccount(otp, password, confirmPassword)}
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify and Register"}
            </button>
            {registerMessage && (
              <div
                style={{
                  color: messageType === "success" ? "green" : "red",
                  marginTop: "5px",
                  marginBottom: "5px"
                }}
              >
                {registerMessage}
            </div>
          )}
            </div>
            <p className='spam-msg'><span className="note">*Note :</span>If you don't see OTP in your inbox, Kindly check your spam folder.</p>
          </div>
        </div>
      </div>
      <LoginSide />
    </div>
  );
};

export default RegisterNext;
