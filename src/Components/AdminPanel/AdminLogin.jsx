import React, { useState } from 'react';
import './Admin.css';
// import logo from '../../Assets/logo.webp';
// import LoginSide from '../UserPanel/LoginSide';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordType, setPasswordType] = useState('password');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://api.test.hachion.co/api/v1/user/adminlogin', {
        email,
        password,
      });

      if (response.status === 200 && response.data.status) {
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        sessionStorage.setItem('adminEmail', email);
        console.log('Login successful, navigating to dashboard...');
        navigate('/admindashboardview');
      } else {
        setErrorMessage(response.data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage(error.response?.data?.message || 'Invalid credentials');
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  return (
    <div className="login">
      <div className="login-left">
        <div className="login-top">
          {/* <img src={logo} alt="logo" className="logo" /> */}
          <h3 className="welcome-back">Welcome back!</h3>
          <h4 className="login-continue">Login to Admin Dashboard</h4>
          <div className="login-mid">
            <form onSubmit={handleFormSubmit}>
              <label className="login-label">
                Email ID<span className="star">*</span>
              </label>
              <div className="input-group mb-2">
                <input
                  type="email"
                  className="form-control"
                  placeholder="abc@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <label className="login-label">
                Password<span className="star">*</span>
              </label>
              <div className="input-group mb-2">
                <input
                  type={passwordType}
                  className="form-control"
                  placeholder="Enter your password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  className="input-group-text"
                  type="button"
                  onClick={togglePasswordVisibility}
                >
                  {passwordType === 'password' ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
              </div>
              
              
              <div className="d-flex justify-content-end align-items-center mb-3 p-2">
              <Link to="/adminforgot" className="forgot-password">
                Forgot Password?
              </Link>
              </div>

              <div className="d-grid gap-2">
                <button className="admin-login" type="submit">
                  Login
                </button>
              </div>
              </form>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>

          <p className="go-to-register">
            Don't have an account?{' '}
            <Link to="/adminregister" className="link-to-register">
              Register
            </Link>
          </p>
        </div>
      
      {/* <LoginSide /> */}
    </div>
  );
};

export default AdminLogin;
