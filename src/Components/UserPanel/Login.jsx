// import React, { useState } from 'react';
// import './Login.css';
// import logo from '../../Assets/logo.png';
// import linkedin from '../../Assets/linkedin.png';
// import apple from '../../Assets/Apple.png';
// import { Link, useNavigate } from 'react-router-dom';
// import LoginSide from './LoginSide';
// import captcha from '../../Assets/captcha.png';
// import google from '../../Assets/google_symbol.svg.png';
// import facebook from '../../Assets/facebook_symbol.svg.png';
// import { useFormik } from 'formik';
// import axios from 'axios';
// import { LoginSchema } from '../Schemas';
// import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
// import Topbar from './Topbar';

// const initialValues = {
//   email: "",
//   password: ""
// };

// const Login = () => {
//    const [passwordType, setPasswordType] = useState('password');
//    const[email,setEmail]=useState("");
//    const [password,setPassword]=useState("");
//    const [errorMessage, setErrorMessage] = useState('');
//    const [isCaptchaChecked, setIsCaptchaChecked] = useState(false);
//    const [captchaError, setCaptchaError] = useState('');
//    const navigate=useNavigate();
//    const handleLogin = async (e) => {
//     e.preventDefault();
  
//     if (!isCaptchaChecked) {
//       setCaptchaError("Captcha validation is mandatory to login.");
//       return;
//     }
  
//     const loginData = {
//       email: email,
//       password: password,
//     };
  
//     try {
//       const response = await axios.post('https://api.test.hachion.co/api/v1/user/login', loginData);
//       console.log(response.data);
  
//       if (response.data.status) {
//         const loginuserData = { name: response.data.userName, email: response.data.email };
  
//         try {
//           localStorage.setItem('loginuserData', JSON.stringify(loginuserData));
//           localStorage.setItem('authToken', response.data.token); 
//         } catch (error) {
//           console.error('Error saving to localStorage:', error);
//         }
  
//         const redirectPath = localStorage.getItem('redirectAfterLogin') || '/coursedetails';
//         localStorage.removeItem('redirectAfterLogin');
//         window.location.href = redirectPath;
//       } else {
//         setErrorMessage(response.data.message);
//       }
//     } catch (error) {
//       console.error("Error during login", error);
//       setErrorMessage("An error occurred during login");
//     }
//   };  

//   const googleLogin = () => {
//     window.open('https://api.test.hachion.co/oauth2/authorization/google', '_self');
//   };

//   const facebookLogin = () => {
//     window.location.href = 'https://api.test.hachion.co/oauth2/authorization/facebook';  
//   };

//   const linkedinLogin = () => {
//     window.location.href = 'https://api.test.hachion.co/oauth2/authorization/linkedin';  
//   };

//   const appleLogin = () => {
//     window.location.href = 'https://api.test.hachion.co/oauth2/authorization/apple';  
//   };
//   const togglePasswordVisibility = () => {
//     setPasswordType(prevType => prevType === 'password' ? 'text' : 'password');
//   };

//   return (
//     <>
//       <div className='login'>
//         <div className='login-left'>
//           <div className='login-top'>
//             <img src={logo} alt='logo' className='login-logo' />
//             <h3 className='welcome-back'>Welcome back!</h3>
//             <h4 className='login-continue'>Login to continue learning</h4>
//             <div className='login-mid'>  
//                 <label className='login-label'>Email ID<span className='star'>*</span></label>
//                 <div className="input-group mb-2">
//                   <input
//                     type="email"
//                     className="form-control"
//                     placeholder="abc@gmail.com"
//                     value={email}
//                     onChange={(e)=>setEmail(e.target.value)}/>
//                     </div>

//                 <label className='login-label'>Password<span className='star'>*</span></label>
//                 <div className="password-field">
//                   <input
//                     type={passwordType}
//                     className="form-control"
//                     placeholder="Enter your password"
//                     value={password}
//                     onChange={(e)=>setPassword(e.target.value)}
//                   />
//                   <span className="eye-icon" onClick={togglePasswordVisibility}>
//                     {passwordType === 'password' ? <AiFillEye /> : <AiFillEyeInvisible />}
//                   </span>
//                 </div>
                
//                 <div className='forgot-align'> 
//                   <Link to='/forgotpassword' className='forgot-password'> Forgot Password? </Link>
//                 </div>
//                 <div className="form-check">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   id="flexCheckDefault"
//                   onChange={(e) => {
//                     setIsCaptchaChecked(e.target.checked);
//                     if (e.target.checked) setCaptchaError('');
//                   }}
//                 />
//                 <label className="form-check-label" htmlFor="flexCheckDefault">
//                   I'm not a robot
//                 </label>
//                 <img src={captcha} alt='captcha' className='captcha' />
//               </div>
//                 <div className="d-grid gap-2">
//                 <button
//                 className="register-btn"
//                 type="submit"
//                 onClick={handleLogin}
//               >
//                 Login
//               </button>
//                 </div>
//               {errorMessage && <p className="error-message">{errorMessage}</p>}
//               {captchaError && <p className="error-message">{captchaError}</p>}
//             </div>
//             <p className='go-to-register'>Don't have an account? <Link to='/register' className='link-to-register'> Register </Link></p>
//           </div>
//         </div>
//         <LoginSide />
//       </div>
//     </>
//   );
// }

// export default Login;

import React, { useState, useRef, useEffect } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import LoginBanner from '../../Assets/loginbackground.png';
import google from '../../Assets/google-new.png';
import axios from 'axios';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import Footer from './Footer';
import StickyBar from './StickyBar';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { TbRefresh } from "react-icons/tb";

const initialValues = {
  email: "",
  password: ""
};

const Login = () => {
   const [passwordType, setPasswordType] = useState('password');
   const[email,setEmail]=useState("");
   const [password,setPassword]=useState("");
   const [errorMessage, setErrorMessage] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const canvasRef = useRef(null);
  const [errors, setErrors] = useState({});
   const navigate=useNavigate();
   const handleLogin = async (e) => {
    if (!validateForm()) return;
    e.preventDefault();
  
    const loginData = {
      email: email,
      password: password,
    };
  
    try {
      const response = await axios.post('https://api.test.hachion.co/api/v1/user/login', loginData);
      console.log(response.data);
  
      if (response.data.status) {
        const loginuserData = { name: response.data.userName, email: response.data.email };
  
        try {
          localStorage.setItem('loginuserData', JSON.stringify(loginuserData));
          localStorage.setItem('authToken', response.data.token); 
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }
  
        const redirectPath = localStorage.getItem('redirectAfterLogin') || '/coursedetails';
        localStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectPath;
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error during login", error);
      setErrorMessage("An error occurred during login");
    }
  };  

  useEffect(() => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          initializeCaptcha(ctx);
      }, []);
  
      const generateRandomChar = (min, max) =>
          String.fromCharCode(Math.floor
              (Math.random() * (max - min + 1) + min));
  
      const generateCaptchaText = () => {
          let captcha = '';
          for (let i = 0; i < 2; i++) {
              captcha += generateRandomChar(65, 90);
              captcha += generateRandomChar(97, 122);
              captcha += generateRandomChar(48, 57);
          }
          return captcha.split('').sort(
              () => Math.random() - 0.5).join('');
      };
  
      const drawCaptchaOnCanvas = (ctx, captcha) => {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          const textColors = ['rgb(0,0,0)', 'rgb(130,130,130)'];
          const letterSpace = 150 / captcha.length;
          for (let i = 0; i < captcha.length; i++) {
              const xInitialSpace = 25;
              ctx.font = '20px Roboto Mono';
              ctx.fillStyle = textColors[Math.floor(
                  Math.random() * 2)];
              ctx.fillText(
                  captcha[i],
                  xInitialSpace + i * letterSpace,
                  Math.floor(Math.random() * 16 + 25),
                  100
              );
          }
      };
  
      const initializeCaptcha = (ctx) => {
          setUserInput('');
          const newCaptcha = generateCaptchaText();
          setCaptchaText(newCaptcha);
          drawCaptchaOnCanvas(ctx, newCaptcha);
      };
  
      const handleUserInputChange = (e) => {
          setUserInput(e.target.value);
      };
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
    const validateForm = () => {
    const newErrors = {};
  
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password.trim()) newErrors.password = "Password is required.";
    if (!userInput.trim()) {
      newErrors.captcha = "Captcha is required.";
    } else if (userInput !== captchaText) {
      newErrors.captcha = "Captcha does not match.";
      const ctx = canvasRef.current.getContext("2d");
      initializeCaptcha(ctx);
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const togglePasswordVisibility = () => {
    setPasswordType(prevType => prevType === 'password' ? 'text' : 'password');
  };

  return (
    <>
    <Topbar />
    <NavbarTop />
    <div className='blogs-header'>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">Home</a> <MdKeyboardArrowRight />
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Login
                  </li>
                </ol>
              </nav>
            </div>
        <img src={LoginBanner} alt='Login Banner' className='login-banner'/>
      <div className='login'>
        <div className='login-left'>
          <div className='login-top'>
            <h4 className='login-continue'>Login</h4>
            <div className='login-mid'>  
                <label className='login-label'>Email<span className='star'>*</span></label>
                <div className="register-field">
                <div className="password-field">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}/>
                    </div>
                    {errors.email && <p className="error-field-message">{errors.email}</p>}
                    </div>
                <label className='login-label'>Password<span className='star'>*</span></label>
                <div className="register-field">
                <div className="password-field">
                  <input
                    type={passwordType}
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                  />
                  <span className="eye-icon" onClick={togglePasswordVisibility}>
                    {passwordType === 'password' ? <AiFillEye /> : <AiFillEyeInvisible />}
                  </span>
                </div>
                {errors.password && <p className="error-field-message">{errors.password}</p>}
                </div>
                
              <label className="login-label">
                Enter Captcha<span className="star">*</span>
              </label>

              <div className="captcha-wrapper">
                    <canvas ref={canvasRef} className="password-field" style={{backgroundColor: 'none'}}
                        height="40">

                    </canvas>
                    <span className="refresh-captcha-btn" id="reload-button" onClick={
                        () => initializeCaptcha(
                            canvasRef.current.getContext('2d'))}>
                       <TbRefresh />
                    </span>
                </div>
                <div className="register-field">
                <div className="password-field">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter captcha here"
                    value={userInput}
                    onChange={handleUserInputChange}/>
                    </div>
                    {errors.captcha && <p className="error-field-message">{errors.captcha}</p>}
                    </div>
                
                <div className="d-flex justify-content-between align-items-center mb-3" style={{margin: '0.2vh 1.1vh'}}>
                {/* Remember Me Toggle */}
                <div className="form-check form-switch align-items-center remember-me">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMeSwitch"
                  />
                  <label className="form-check-label" htmlFor="rememberMeSwitch" style={{fontSize: '12px'}}>
                    Remember me
                  </label>
                </div>

                {/* Forgot Password Link */}
                <Link to="/forgotpassword" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>

                <div className="d-grid gap-2">
                <button
                className="register-btn"
                type="submit"
                onClick={handleLogin}
              >
                Login
              </button>
              <hr style={{width: '90%', margin: '20px'}}/>
                </div>
                <div className="d-grid gap-2">
                <button
                className="other-btn"
                type="submit"
                onClick={handleLogin}
              >
                <img src={google} alt='login-with-google' className='icon-btn-img'/>
                 or Sign in with Google
              </button>
                </div>
                </div>
              {errorMessage && <p className="error-field-message">{errorMessage}</p>}
            </div>
            <p className='go-to-register'>Don't have an account? <Link to='/register' className='link-to-register'> Sign Up </Link></p>
        </div>
      </div>
      <Footer />
      <StickyBar />
    </>
  );
}

export default Login;