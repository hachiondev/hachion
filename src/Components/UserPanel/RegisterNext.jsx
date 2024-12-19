import React, { useState, useEffect } from 'react';
import './Login.css';
import logo from '../../Assets/logo.png';
import LoginSide from './LoginSide';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const RegisterNext = () => {
  const [otp, setOtp] = useState(Array(4).fill(""));
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordType, setPasswordType] = useState('password');
  const [confirmPasswordType, setConfirmPasswordType] = useState('password');
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: '', email: '' });

  useEffect(() => {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        setUserData(JSON.parse(userDataString));
      } catch {
        alert('Error with stored user data. Please register again.');
        navigate('/registerhere');
      }
    } else {
      alert('No user data found. Please register again.');
      navigate('/registerhere');
    }
  }, [navigate]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, ""); // Allow digits only
    if (value.length <= 1) {
      setOtp((prev) => {
        const newOtp = [...prev];
        newOtp[index] = value;
        return newOtp;
      });
    }
  };

  const verifyAccount = async (email, otpArray, password, confirmPassword) => {
    const otp = otpArray.join("");

    if (!otp || !password || !confirmPassword || !email) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/user/verify-account?email=${email}&otp=${otp}&password=${password}&confirmPassword=${confirmPassword}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Verification failed");
      }

      const data = await response.text();
      alert("Registration successful");
      console.log(data);
      navigate('/login');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
    setIsLoading(false);
  };

  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordType(confirmPasswordType === 'password' ? 'text' : 'password');
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

          <div className="otp-verify">
            <h6 className="enter-otp">Enter OTP: </h6>
            <div className="otp">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  className="otp-number"
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                />
              ))}
            </div>
            <p className="forgot-password">Resend OTP</p>

            <label className="login-label">Password</label>
            <div className="input-group mb-2">
              <input
                type={passwordType}
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="toggle-password" onClick={togglePasswordVisibility}>
                {passwordType === 'password' ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>

            <label className="login-label">Confirm Password</label>
            <div className="input-group mb-2">
              <input
                type={confirmPasswordType}
                className="form-control"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span className="toggle-password" onClick={toggleConfirmPasswordVisibility}>
                {confirmPasswordType === 'password' ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>

            <button
              type="button"
              className="register-btn"
              onClick={() => verifyAccount(userData.email, otp, password, confirmPassword)}
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify and Register"}
            </button>
          </div>
        </div>
      </div>
      <LoginSide />
    </div>
  );
};

export default RegisterNext;
