import React, { useState } from 'react';
import './Admin.css';
import logo from '../../Assets/logo.png';
import LoginSide from '../UserPanel/LoginSide';
import { useNavigate } from 'react-router-dom';
import { RiCloseCircleLine } from 'react-icons/ri';
import success from '../../Assets/success.gif';

const AdminForgot = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // State for managing modal visibility

  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission

    // Simulate sending password reset email (you can replace with backend logic)
    console.log("Password reset request sent to:", email);

    // Show success modal after email is sent
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
          <img src={logo} alt='logo' className='login-logo' />
          <h3 className='register-head'>Recover your password</h3>

          <div className='login-mid'>
            <form onSubmit={handleFormSubmit}>
              <label className='login-label'>Email ID<span className='star'>*</span></label>
              <div className="input-group mb-2">
                <input
                  type="email"
                  className="form-control"
                  placeholder="abc@gmail.com"
                  name='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="d-grid gap-2">
                <button 
                  className="admin-login" 
                  type="submit"
                >
                  Send
                </button>
              </div>
            </form>
          </div>

          {/* Success Modal */}
          {modalVisible && (
            <div
              className='modal fade show'
              id='exampleModal'
              tabIndex='-1'
              aria-labelledby='exampleModalLabel'
              aria-hidden='false'
              style={{ display: 'block' }}
            >
              <div className='modal-dialog'>
                <div className='modal-content'>
                  <button
                    data-bs-dismiss='modal'
                    className='close-btn'
                    aria-label='Close'
                    onClick={handleModalClose}
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
                    onClick={handleModalClose}
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <LoginSide />
    </div>
  );
};

export default AdminForgot;