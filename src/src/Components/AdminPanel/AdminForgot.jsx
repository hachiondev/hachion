import React, { useState } from 'react';
import './Admin.css';
import { useNavigate } from 'react-router-dom';
import { RiCloseCircleLine } from 'react-icons/ri';
import success from '../../Assets/success.gif';
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setModalVisible(true);
  };
  const handleModalClose = () => {
    setModalVisible(false);
    navigate('/adminlogin');
  };
  return (
    <div className='login'>
      <div className='login-left'>
        <div className='login-top'>
          <h3 className='register-head'>Recover your password</h3>
          <div className='login-mid'>
            <form onSubmit={handleFormSubmit}>
              <label className='login-label'>
                Email ID<span className='star'>*</span>
              </label>
              <div className='input-group mb-2'>
                <input
                  type='email'
                  className='form-control'
                  placeholder='abc@gmail.com'
                  name='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className='d-grid gap-2'>
                <button className='admin-login' type='submit'>
                  Send
                </button>
              </div>
            </form>
          </div>
          {modalVisible && (
            <div className='custom-modal'>
              <div className='custom-modal-dialog'>
                <div className='custom-modal-content'>
                  <button
                    className='close-btn'
                    aria-label='Close'
                    onClick={handleModalClose}>
                    <RiCloseCircleLine />
                  </button>
                  <div className='modal-body'>
                    <img src={success} alt='Success' className='success-gif' />
                    <p className='modal-para'>Password sent to your Email</p>
                  </div>
                  <button
                    type='button'
                    className='button-login'
                    onClick={handleModalClose}>
                    Login
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
