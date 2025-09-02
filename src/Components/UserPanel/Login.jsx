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
//       const response = await axios.post('https://api.hachion.co/api/v1/user/login', loginData);
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
//     window.open('https://api.hachion.co/oauth2/authorization/google', '_self');
//   };

//   const facebookLogin = () => {
//     window.location.href = 'https://api.hachion.co/oauth2/authorization/facebook';  
//   };

//   const linkedinLogin = () => {
//     window.location.href = 'https://api.hachion.co/oauth2/authorization/linkedin';  
//   };

//   const appleLogin = () => {
//     window.location.href = 'https://api.hachion.co/oauth2/authorization/apple';  
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

import React, { useState } from 'react';
import './Login.css';
import logo from '../../Assets/logo.png';
import linkedin from '../../Assets/linkedin.png';
import apple from '../../Assets/Apple.png';
import { Link, useNavigate } from 'react-router-dom';
import captcha from '../../Assets/captcha.png';
import LoginBanner from '../../Assets/loginbackground.png';
import google from '../../Assets/google-new.png';
import facebook from '../../Assets/facebook_symbol.svg.png';
import { useFormik } from 'formik';
import axios from 'axios';
import { LoginSchema } from '../Schemas';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import Topbar from './Topbar';
import TopBarNew from './TopBarNew';
import NavBar from './NavBar';
import Footer from './Footer';
import StickyBar from './StickyBar';
import { MdKeyboardArrowRight } from 'react-icons/md';

const initialValues = {
  email: "",
  password: ""
};

const Login = () => {
   const [passwordType, setPasswordType] = useState('password');
   const[email,setEmail]=useState("");
   const [password,setPassword]=useState("");
   const [errorMessage, setErrorMessage] = useState('');
  //  const [isCaptchaChecked, setIsCaptchaChecked] = useState(false);
  //  const [captchaError, setCaptchaError] = useState('');
   const navigate=useNavigate();
   const handleLogin = async (e) => {
    e.preventDefault();
  
    // if (!isCaptchaChecked) {
    //   setCaptchaError("Captcha validation is mandatory to login.");
    //   return;
    // }
  
    const loginData = {
      email: email,
      password: password,
    };
  
    try {
      const response = await axios.post('https://api.hachion.co/api/v1/user/login', loginData);
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

  const googleLogin = () => {
    window.open('https://api.hachion.co/oauth2/authorization/google', '_self');
  };

  const facebookLogin = () => {
    window.location.href = 'https://api.hachion.co/oauth2/authorization/facebook';  
  };

  const linkedinLogin = () => {
    window.location.href = 'https://api.hachion.co/oauth2/authorization/linkedin';  
  };

  const appleLogin = () => {
    window.location.href = 'https://api.hachion.co/oauth2/authorization/apple';  
  };
  const togglePasswordVisibility = () => {
    setPasswordType(prevType => prevType === 'password' ? 'text' : 'password');
  };

  return (
    <>
    <TopBarNew />
    <NavBar />
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
                <label className='login-label'>Email / Phone Number<span className='star'>*</span></label>
                <div className="password-field">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your Email/Phone Number"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}/>
                    </div>

                <label className='login-label'>Password<span className='star'>*</span></label>
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
                {/* <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="flexCheckDefault"
                  onChange={(e) => {
                    setIsCaptchaChecked(e.target.checked);
                    if (e.target.checked) setCaptchaError('');
                  }}
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  I'm not a robot
                </label>
                <img src={captcha} alt='captcha' className='captcha' />
              </div> */}
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
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              {/* {captchaError && <p className="error-message">{captchaError}</p>} */}
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