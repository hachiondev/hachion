import React, { useState } from 'react';
import '../UserPanel/Home.css';
import logo from '../../Assets/logo.png';
import { Link } from 'react-router-dom';
import LoginSide from '../UserPanel/LoginSide';
import lock from '../../Assets/Component 1.png';
import { useFormik } from 'formik';
import { LoginSchema } from '../Schemas';

const initialValues = {
  email: "",
  password: ""
};

const Login = () => {
  const [passwordType, setPasswordType] = useState('password');
 

  const { values, errors, handleBlur, touched, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values) => {
   
      console.log(values);
    }
  });


  const togglePasswordVisibility = () => {
    setPasswordType(prevType => prevType === 'password' ? 'text' : 'password');
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
              <form onSubmit={handleSubmit}>
                <label className='login-label'>Email ID<span className='star'>*</span></label>
                <div className="input-group mb-2">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="abc@gmail.com"
                    name='email'
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                 
                </div>
                {errors.email && touched.email ? (<p className='form-error'>{errors.email}</p>) : null}
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
                    <img src={lock} alt='lock' />
                  </span>
                </div>
                {errors.password && touched.password ? (<p className='form-error'>{errors.password}</p>) : null}

                <Link to='/forgotpassword' style={{ textDecoration: 'none' }}>
                  <p className='forgot-password'>Forgot Password?</p>
                </Link>
 
                <div className="d-grid gap-2">
                  <button className="admin-login" type="submit" >Login</button>
                </div>
              </form>
    </div>
    </div>

          

        </div>
        <LoginSide />
      </div>
    </>
  );
}

export default Login;
