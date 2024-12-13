import React, { useState } from 'react';
import './Admin.css';
import logo from '../../Assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Direct form submission handler without Formik for testing`
  const handleFormSubmit = async (event) => {
    event.preventDefault();  // Prevent default form submission
    console.log("Form submission triggered");  // Debugging log

    try {
      const response = await axios.post('http://localhost:8080/api/admin/login', {
        email: email,
        password: password
      });
      console.log("Response from backend:", response);  // Debugging response

      if (response.status === 200) {
        console.log("Login successful:", response.data);  // Success log
        navigate('/admindashboardview');
      }
    } catch (error) {
      console.error("Error during login:", error);  // Error log

      if (error.response && error.response.status === 401) {
        setErrorMessage('Invalid Username or Password');
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
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

                <Link to='/forgotpassword' style={{ textDecoration: 'none' }}>
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
          </div>
        </div>
        {/* Include LoginSide if necessary */}
      </div>
    </>
  );
};

export default Login;