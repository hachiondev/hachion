import React, { useState } from 'react';
import './Admin.css';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
const AdminRegister = () => {
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState('password');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordType((prev) => (prev === 'password' ? 'text' : 'password'));
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const response = await fetch('https://api.test.hachion.co/api/v1/user/adminregister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (response.ok && data.status) {
        alert('Registration successful');
        navigate('/adminlogin');
      } else {
        setErrorMessage(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className='login'>
      <div className='login-left'>
        <div className='login-top'>
          <h3 className='register-head'>Register to Admin Dashboard</h3>
          <div className='login-mid'>
            <form onSubmit={handleFormSubmit}>
              <label className='login-label'>
                Name<span className='star'>*</span>
              </label>
              <div className='input-group mb-2'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Enter your Name'
                  name='username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
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
              <label className='login-label'>
                Password<span className='star'>*</span>
              </label>
              <div className='input-group mb-2'>
                <input
                  type={passwordType}
                  className='form-control'
                  placeholder='Enter your password'
                  name='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type='button'
                  className='input-group-text'
                  onClick={togglePasswordVisibility}
                  aria-label='Toggle password visibility'
                >
                  {passwordType === 'password' ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
              </div>
              {errorMessage && <p className='error-message'>{errorMessage}</p>}
              <div className='d-grid gap-2'>
                <button className='admin-login' type='submit' disabled={isSubmitting}>
                  {isSubmitting ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>
          </div>
          <p className='login-link'>
            Do you have an account with Hachion?{' '}
            <Link to='/adminlogin' className='link-to'>
              Click here to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default AdminRegister;