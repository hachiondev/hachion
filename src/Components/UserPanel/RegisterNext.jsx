import React, { useState } from 'react';
import './Login.css';
import logo from '../../Assets/logo.png';
import { useFormik } from 'formik';
import { LoginSchema } from '../Schemas';
import LoginSide from './LoginSide';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // For eye icons

const initialValues = {
  password: "",
  confirm_password: ""
};

const RegisterNext = () => {
  const [passwordType, setPasswordType] = useState('password'); 
  const [confirmPasswordType, setConfirmPasswordType] = useState('password'); // For confirm password field
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/loginsuccess');
  };

  const { values, errors, handleBlur, touched, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      console.log(values);
      navigate('/loginsuccess');
    }
  });

  const togglePasswordVisibility = () => {
    setPasswordType(prevType => prevType === 'password' ? 'text' : 'password');
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordType(prevType => prevType === 'password' ? 'text' : 'password');
  };

  return (
    <>
      <div className='login'>
        <div className='login-left'>
          <div className='login-top'>
            <img src={logo} alt='logo' className='login-logo'/>
            <h3 className='register-learning'>Register to start learning</h3>

            <div className='steps'>
              <h4 className='steps-head'>Steps: </h4>
              <div className='step-one' onClick={() => navigate('/registerhere')}>
                <h6 className='steps-head-one'>1</h6>
              </div>
              <hr width='45%' size='1' color='#00AAEF'/>
              <div className='step-one'>
                <h6 className='steps-head-one'>2</h6>
              </div>
            </div>

            <div className='otp-verify'>
              <h6 className='enter-otp'>Enter OTP: </h6>
              <div className='otp'>
                <input className='otp-number' type='number'/>
                <input className='otp-number' type='number'/>
                <input className='otp-number' type='number'/>
                <input className='otp-number' type='number'/>
              </div>
              <p className='forgot-password'>Resend OTP</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className='login-mid'>
                <label className='login-label'>Password<span className='star'>*</span></label>
                <div className="input-group mb-2">
                  <input 
                    type={passwordType} 
                    className="form-control" 
                    placeholder="Enter your password"
                    name='password' 
                    value={values.password} 
                    onChange={handleChange} 
                    onBlur={handleBlur} 
                  />
                  <span className="input-group-text" onClick={togglePasswordVisibility}>
                    {passwordType === 'password' ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </span>
                </div>
                {errors.password && touched.password ? (<p className='form-error'>{errors.password}</p>):null}

                <label className='login-label'>Confirm Password<span className='star'>*</span></label>
                <div className="input-group mb-2">
                  <input 
                    type={confirmPasswordType} 
                    className="form-control" 
                    placeholder="Please confirm password"
                    name='confirm_password' 
                    value={values.confirm_password} 
                    onChange={handleChange} 
                    onBlur={handleBlur} 
                  />
                  <span className="input-group-text" onClick={toggleConfirmPasswordVisibility}>
                    {confirmPasswordType === 'password' ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </span>
                </div>
                {errors.confirm_password && touched.confirm_password ? (<p className='form-error'>{errors.confirm_password}</p>):null}
              </div>

              <button className='register-btn' onClick={handleClick}>Register</button>
            </form>
            <p className='login-with-hachion'>Do you have an account with Hachion? 
              <Link to='/login' className='link-to'>Click here to Login</Link>
            </p>
          </div>
        </div>
        <LoginSide/>
      </div>
    </>
  );
};

export default RegisterNext;
