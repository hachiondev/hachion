import React from 'react';
import logo from '../../Assets/logo.png';
import LoginSide from './LoginSide';
import success from '../../Assets/success.gif';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { RiCloseCircleLine } from 'react-icons/ri';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Remove modal backdrop
    document.body.classList.remove('modal-open');
    document.querySelector('.modal-backdrop')?.remove();
    
    // Navigate to login page
    navigate('/login');
  };

  const handleSendClick = () => {
    // Trigger the modal and after it closes, navigate to /login
    setTimeout(() => {
      handleLogin();
    }, 2000); // Adjust delay as needed or add event listener for modal close
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
                      >
                        <RiCloseCircleLine />
                      </button>

                      <div className='modal-body'>
                        <img
                          src={success}
                          alt='Success'
                          className='success-gif'
                        />
                        <p className='modal-para'>
                          Password sent to your Email
                        </p>
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
