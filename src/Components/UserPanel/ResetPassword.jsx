import React, { useState } from 'react';
import './Login.css';
import logo from '../../Assets/logo.png';
import LoginSide from './LoginSide';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import TopBarNew from './TopBarNew';
import NavbarTop from './NavbarTop';
import Footer from './Footer';
import StickyBar from './StickyBar';
import LoginBanner from '../../Assets/loginbackground.png';
import { MdKeyboardArrowRight } from 'react-icons/md';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordType, setPasswordType] = useState('password');
  const [confirmPasswordType, setConfirmPasswordType] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const [registerMessage, setRegisterMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const navigate = useNavigate();

  const userDataString = localStorage.getItem('registeruserData');
  const registeruserData = userDataString ? JSON.parse(userDataString) : { email: '' };

  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordType(confirmPasswordType === 'password' ? 'text' : 'password');
  };

  
  const verifyAccount = async (password, confirmPassword) => {
    if (!password || !confirmPassword) {
      setRegisterMessage('Please fill in all fields');
      setMessageType('error');
      return;
    }

    if (password !== confirmPassword) {
      setRegisterMessage('Passwords do not match');
      setMessageType('error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://api.hachion.co/api/v1/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registeruserData.email,
          password,
          confirmPassword
        }),
      });

      if (response.ok) {
        setRegisterMessage('Password reset successfully!');
        setMessageType('success');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        const errorText = await response.text();
        setRegisterMessage(errorText || 'Failed to reset password');
        setMessageType('error');
      }
    } catch (error) {
      setRegisterMessage(error.message);
      setMessageType('error');
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
              Create New Password
            </li>
          </ol>
        </nav>
      </div>
      <img src={LoginBanner} alt='Login Banner' className='login-banner'/>
      <div className='login'>
        <div className="login-left">
          <div className="login-top">
            <h4 className='login-continue'>Create New Password</h4>
          <div className="login-mid">
            <label className="login-label">New Password</label>
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

            <div className="d-flex align-items-center mb-3" style={{margin: '0.2vh 2vh'}}>
              <div className="form-check form-switch align-items-center remember-me">
                <input className="form-check-input" type="checkbox" id="rememberMeSwitch" />
                <label className="form-check-label" htmlFor="rememberMeSwitch" style={{ fontSize: "12px" }}>
                  Remember me
                </label>
              </div>
              </div>

            <button
              type="button"
              className="register-btn"
              onClick={() => verifyAccount(password, confirmPassword)}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Password'}
            </button>

            {registerMessage && (
              <div
                style={{
                  color: messageType === 'success' ? 'green' : 'red',
                  marginTop: '5px',
                  marginBottom: '5px',
                }}
              >
                {registerMessage}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
      <Footer />
      <StickyBar />
    </>
  );
};

export default ResetPassword;
