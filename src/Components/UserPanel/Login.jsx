import React, { useState } from 'react';
import './Login.css';
import logo from '../../Assets/logo.png';
import linkedin from '../../Assets/linkedin.png';
import apple from '../../Assets/Apple.png';
import { Link, useNavigate } from 'react-router-dom';
import LoginSide from './LoginSide';
import captcha from '../../Assets/captcha.png';
import google from '../../Assets/google_symbol.svg.png';
import facebook from '../../Assets/facebook_symbol.svg.png';
import { useFormik } from 'formik';
import axios from 'axios';
import { LoginSchema } from '../Schemas';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // For eye icons
import Topbar from './Topbar';

const initialValues = {
  email: "",
  password: ""
};

const Login = () => {
   const [passwordType, setPasswordType] = useState('password');
   const[email,setEmail]=useState("");
   const [password,setPassword]=useState("");
const navigate=useNavigate();
   const handleLogin=async(e)=>{
    localStorage.setItem('userData', JSON.stringify({  email}));
navigate('/home')
   }
//     console.log("value:", email,password)
//     const data={
//       "email": email,
//       "password":password
//     }
//     try{
//       const response=await axios.post("http://localhost:8080/api/v1/user/login",data);

//     if (response.data.status) {
//     alert("Login Success");
//     // localStorage.setItem('userData', JSON.stringify({  email}));

//     navigate('/home');
//     }
// // } else {
// //     alert(response.data.message || "Invalid credentials");
// // }

//     }
//     catch(error){
//       console.error(error);
//     }
//    }

  const googleLogin = () => {
    window.open('http://localhost:8080/oauth2/authorization/google', '_self');
  };

  const facebookLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/facebook';  // Backend Facebook OAuth
  };

  const linkedinLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/linkedin';  // Backend LinkedIn OAuth
  };

  const appleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/apple';  // Backend Apple OAuth
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordType(prevType => prevType === 'password' ? 'text' : 'password');
  };
  const handleAdminLogin=()=>{
    navigate('/adminlogin')
  }
  return (
    <>
      <div className='login'>
        <div className='login-left'>
          <div className='login-top'>
            <img src={logo} alt='logo' className='login-logo' />
            <h3 className='welcome-back'>Welcome back!</h3>
            <h4 className='login-continue'>Login to continue learning</h4>
<div className='login-mid'>
              
                <label className='login-label'>Email ID<span className='star'>*</span></label>
                <div className="input-group mb-2">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="abc@gmail.com"
              
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}/>
                    </div>



                <label className='login-label'>Password<span className='star'>*</span></label>
                <div className="input-group mb-2">
                  <input
                    type={passwordType}
                    className="form-control"
                    placeholder="Enter your password"
                   
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}

                  />
                  <span className="input-group-text" onClick={togglePasswordVisibility}>
                    {passwordType === 'password' ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </span>
                </div>
                {/* {errors.password && touched.password ? (<p className='form-error'>{errors.password}</p>) : null} */}

                <Link to='/forgotpassword' style={{ textDecoration: 'none' }}>
                  <p className='forgot-password'>Forgot Password?</p>
                </Link>

                
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexCheckDefault"
                  />
                  <label className="form-check-label" htmlFor="flexCheckDefault">
                    I'm not a robot
                  </label>
                  <img src={captcha} alt='captcha' className='captcha' />
                </div>

              {/* <div className="form-check">
                  <ReCAPTCHA
                    sitekey="YOUR_SITE_KEY" 
                    onChange={handleCaptchaChange}
                  />
                </div> */}

                <div className="d-grid gap-2">
                  <button className="register-btn" type="submit" onClick={handleLogin}>Login</button>
                </div>
             
            </div>

            <div className='login-with'>
              <hr width='20%' size='2' style={{ marginTop: '2vh' }}></hr>
              <p className='login-option'>Or Login with</p>
              <hr width='20%' size='2' style={{ marginTop: '2vh' }}></hr>
            </div>

            <div className='icon-holder'>
              <button className="social-login-btn" onClick={googleLogin}>
                <img src={google} alt='google'  />
              </button>
              <button className="social-login-btn" onClick={facebookLogin}>
                <img src={facebook} alt='facebook'/>
              </button>
              <button className="social-login-btn" onClick={linkedinLogin}>
                <img src={linkedin} alt='linkedin' />
              </button>
              <button className="social-login-btn" onClick={appleLogin}>
                <img src={apple} alt='apple' />
              </button>
            </div>

            <p className='go-to-register'>Don't have an account? <Link to='/register' className='link-to-register'> Register </Link></p>
          <button className='register-btn' onClick={handleAdminLogin}>Login with Admin</button>
          </div>
        </div>
        <LoginSide />
      </div>
    </>
  );
}

export default Login;
