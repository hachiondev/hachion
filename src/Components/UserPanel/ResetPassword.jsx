import React, { useState } from 'react';
import './Login.css';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import Footer from './Footer';
import StickyBar from './StickyBar';
import LoginBanner from '../../Assets/loginbackground.webp';
import { MdKeyboardArrowRight } from 'react-icons/md';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordType, setPasswordType] = useState('password');
  const [confirmPasswordType, setConfirmPasswordType] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const [registerMessage, setRegisterMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const navigate = useNavigate();

  
  const userDataString = localStorage.getItem('registeruserData');
  const registeruserData = userDataString ? JSON.parse(userDataString) : { email: '' };
  const email = registeruserData.email || '';

  
  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordType(confirmPasswordType === 'password' ? 'text' : 'password');
  };

  
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setRegisterMessage('Please fill in all fields.');
      setMessageType('error');
      return;
    }

    if (newPassword !== confirmPassword) {
      setRegisterMessage('Passwords do not match.');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setRegisterMessage('');
    setMessageType('');

    try {
      const response = await fetch('https://api.test.hachion.co/api/v1/user/reset-password', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          newPassword: newPassword,       
          confirmPassword: confirmPassword
        }),
      });

      const text = await response.text();
      if (response.ok) {
        setRegisterMessage('Password reset successfully!');
        setMessageType('success');

        setTimeout(() => navigate('/login'), 1500);
      } else {
        setRegisterMessage(text || 'Failed to reset password.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setRegisterMessage('Something went wrong. Please try again.');
      setMessageType('error');
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
                Create New Password
              </li>
            </ol>
          </nav>
        </div>

        <img src={LoginBanner} alt='Login Banner' className='login-banner' />

        <div className='login container'>
          <div className="login-left">
            <div className="login-top">
              <h4 className='login-continue'>Create New Password</h4>

              <div className="login-mid">
                <label className="login-label">New Password</label>
                <div className="password-field">
                  <input
                    type={passwordType}
                    className="form-control"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                    placeholder="Confirm new password"
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
                  onClick={handleResetPassword}   
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Password'}
                </button>

                {registerMessage && (
                  <div
                    style={{
                      color: messageType === 'success' ? 'green' : 'red',
                      marginTop: '8px',
                      fontSize: '13px',
                      textAlign: 'center',
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
      </div>
    </>
  );
};

export default ResetPassword;
