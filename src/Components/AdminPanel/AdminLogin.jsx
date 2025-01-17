import React, { useState } from 'react';
import './Admin.css';
import logo from '../../Assets/logo.png';
import LoginSide from '../UserPanel/LoginSide';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const navigate = useNavigate();

  // State for form inputs and error message
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordType, setPasswordType] = useState('password'); // For toggling password visibility
  const [errorMessage, setErrorMessage] = useState('');

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent form reload
  
    try {
      // Make a POST request to the login API
      const response = await axios.post('http://160.153.175.69:8080/HachionUserDashboad/api/v1/user/adminlogin', {
        email,
        password,
      });
  
      console.log('API Response:', response.data); // Debugging log
  
      // Check if login is successful
      if (response.status === 200 && response.data.status) {
        console.log('Login successful, navigating to dashboard...');
        navigate('/admindashboardview'); // Navigate to admin dashboard
      } else {
        console.log('Login failed:', response.data.message); // Debugging log
        setErrorMessage(response.data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      // Handle errors from the API or network issues
      console.error('Error during login:', error);
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Invalid credentials');
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
    }
  };
  

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
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
                  <button type="button" onClick={togglePasswordVisibility}>
                    {passwordType === 'password' ? 'Show' : 'Hide'}
                  </button>
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