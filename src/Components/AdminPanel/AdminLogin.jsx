import React, { useState } from 'react';
import './Admin.css';
import logo from '../../Assets/logo.png';
import LoginSide from '../UserPanel/LoginSide';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
  };
    
    try {
      const response = await axios.post('http://localhost:8080/api/v1/user/adminlogin', {
        email: email,
        password: password
      });
      console.log(response);
      if (response.status===200) {
        navigate('/admindashboardview');
        const loginuserData = { name: response.data.username, email: response.data.email };


        try {
            localStorage.setItem('adminloginuserData', JSON.stringify(loginuserData)); // Try saving to localStorage
            // console.log('User data saved to localStorage:', loginuserData); // Debugging line
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }

        // Navigate after saving data
    } else {
        setErrorMessage(response.data.message); // Show error message
    }
} catch (error) {
    console.error("Error during login", error);
    setErrorMessage("An error occurred during login");
} 



};

  return (
    <>
      <div className='login'>
        <div className='login-left'>
          <div className='login-top'>
            <img src={logo} alt='logo' className='login-logo' />
            <h3 className='welcome-back'>Welcome back!</h3>
            <h4 className='login-continue'>Login to Admin Dashboard</h4>

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

                <label className='login-label'>Password<span className='star'>*</span></label>
                <div className="input-group mb-2">
                  <input
                    type={passwordType}
                    className="form-control"
                    placeholder="Enter your password"
                    name='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {errorMessage && <p className='error-message'>{errorMessage}</p>} {/* Error message display */}

                <Link to='/adminforgot' style={{ textDecoration: 'none' }}>
                  <p className='forgot-password'>Forgot Password?</p>
                </Link>

                <div className="d-grid gap-2">
                  <button 
                    className="admin-login" 
                    type="submit"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
            <p className='go-to-register'>Don't have an account? <Link to='/adminregister' className='link-to-register'> Register </Link></p>
          </div>
        </div>
        <LoginSide />
      </div>
    </>
  );
};

export default AdminLogin;
