import React, { useState } from 'react';
import logo from '../../Assets/logo.png';
import LoginSide from './LoginSide';
import success from '../../Assets/success.gif';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { RiCloseCircleLine } from 'react-icons/ri';
import axios from 'axios';  // Add axios for making API calls

const ForgotPassword = () => {
  const [email, setEmail] = useState('');  // To store email input
  const [message, setMessage] = useState('');  // To store response message
  const [isSuccess, setIsSuccess] = useState(false);  // To track success/failure
  const navigate = useNavigate();

  // Handle login redirection
  const handleLogin = () => {
    // Remove modal backdrop
    document.body.classList.remove('modal-open');
    document.querySelector('.modal-backdrop')?.remove();
    
    // Navigate to login page
    navigate('/login');
  };

  // Handle the "Send" button click and make API call
  const handleSendClick = async () => {
    try {
      // Call the API with the email
      const response = await axios.put(`https://api.hachion.co/api/v1/user/forgotpassword?email=${email}`);
      
      // If successful, show success message
      if (response.status === 200) {
        setIsSuccess(true);
        setMessage('Password reset link sent to your email');
      }
    } catch (error) {
      // If there's an error, show failure message
      setIsSuccess(false);
      setMessage('Failed to send reset link. Please try again.');
    }
  };

  return (
    <>
      <div className='login'>
        <div className='login-left'>
          <div className='login-top'>
            <img src={logo} alt='logo' className='login-logo' />
            <h3 className='recover'>Recover your password</h3>

            <div className='login-mid'>
              <label className='login-label'>
                Email ID<span className='star'>*</span>
              </label>
              <div className='input-group mb-2'>
                <input
                  type='email'
                  className='form-control'
                  id='floatingInput'
                  placeholder='abc@gmail.com'
                  value={email}  // Bind email state to input
                  onChange={(e) => setEmail(e.target.value)}  // Update email state
                />
              </div>

              <div className='d-flex'>
                <button
                  type='button'
                  className='register-btn'
                  data-bs-toggle='modal'
                  data-bs-target='#exampleModal'
                  onClick={handleSendClick}
                >
                  Send
                </button>

                <div
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
                </div>
              </div>
            </div>
          </div>
        </div>
        <LoginSide />
      </div>
    </>
  );
};

export default ForgotPassword;