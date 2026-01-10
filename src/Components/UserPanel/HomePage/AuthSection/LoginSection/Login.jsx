import React, { useState, useRef, useEffect } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import LoginBanner from '../../../../../Assets/loginbackground.webp';
import google from '../../../../../Assets/google-new.webp';
import axios from 'axios';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { TbRefresh } from "react-icons/tb";

const initialValues = {
  email: "",
  password: ""
};

const Login = () => {
  const [passwordType, setPasswordType] = useState('password');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessage1, setErrorMessage1] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const canvasRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const readCookie = (name) => {
    const m = document.cookie.match(
      new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
    );
    return m ? decodeURIComponent(m[1]) : null;
  };
  const clearCookie = (name) => {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
  };
  const dismissError = () => {
    setErrorMessage('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const validation = validateForm();
    if (!validation.isValid) return;

    dismissError();
    setIsLoading(true); // Start loading

    const loginData = { email, password };

    try {
      const response = await axios.post('https://api.test.hachion.co/api/v1/user/login', loginData);

      console.log('Response Data:', response.data);

      if (response.data.status === true) {
        console.log('SUCCESS - Redirecting...');

        const loginuserData = {
          name: response.data.userName,
          email: response.data.email,
          picture: ""
        };

        const kill = (name) => {
          document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
          document.cookie = `${name}=; Domain=hachion.co; Path=/; Max-Age=0; SameSite=Lax; Secure`;
          document.cookie = `${name}=; Domain=.hachion.co; Path=/; Max-Age=0; SameSite=Lax; Secure`;
        };

        try {
          localStorage.setItem('loginuserData', JSON.stringify(loginuserData));
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('authSource', 'manual');
          localStorage.removeItem('pendingOAuth');
          localStorage.removeItem('avatar');

          kill('avatar');
          kill('flow');
          kill('auth_error');
          window.dispatchEvent(new Event('storage'));
        } catch (err) {
          console.error('Error saving to localStorage:', err);
        }

        const redirectPath = localStorage.getItem('redirectAfterLogin') || '/coursedetails';
        localStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectPath;

      } else {
        console.log('FAILED - Showing error message');
        const errorMsg = response.data.message || "Invalid credentials";
        setErrorMessage(errorMsg);
        setIsLoading(false); // Stop loading on error
        return;
      }

    } catch (error) {
      console.error("Error during login", error);

      if (error.response) {
        setErrorMessage(error.response.data.message || "Invalid credentials");
      } else {
        setErrorMessage("An error occurred during login");
      }
      setIsLoading(false); // Stop loading on error
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    initializeCaptcha(ctx);
  }, []);

  const generateRandomChar = (min, max) =>
    String.fromCharCode(Math.floor(Math.random() * (max - min + 1) + min));

  const generateCaptchaText = () => {
    let captcha = '';
    for (let i = 0; i < 2; i++) {
      captcha += generateRandomChar(65, 90);
      captcha += generateRandomChar(97, 122);
      captcha += generateRandomChar(48, 57);
    }
    return captcha.split('').sort(() => Math.random() - 0.5).join('');
  };

  const drawCaptchaOnCanvas = (ctx, captcha) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const textColors = ['rgb(0,0,0)', 'rgb(130,130,130)'];
    const letterSpace = 150 / captcha.length;
    for (let i = 0; i < captcha.length; i++) {
      const xInitialSpace = 25;
      ctx.font = '20px Roboto Mono';
      ctx.fillStyle = textColors[Math.floor(Math.random() * 2)];
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

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password validation
    const passwordTrimmed = password.trim();

    if (passwordTrimmed.length === 0) {
      newErrors.password = "Password is required.";
    }

    // Captcha validation
    if (!userInput.trim()) {
      newErrors.captcha = "Captcha is required.";
    } else if (userInput !== captchaText) {
      newErrors.captcha = "Captcha does not match.";
      const ctx = canvasRef.current.getContext("2d");
      initializeCaptcha(ctx);
    }

    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;
    return { isValid, errors: newErrors };
  };

  const togglePasswordVisibility = () => {
    setPasswordType(prevType => prevType === 'password' ? 'text' : 'password');
  };

  const handleGoogleLogin = async () => {
    dismissError();
    clearCookie("auth_error");

    document.cookie = "flow=login; Max-Age=300; Path=/; SameSite=None; Secure";
    localStorage.setItem("pendingOAuth", "login");

    try {
      await fetch("https://api.test.hachion.co/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch { }

    let url = "https://api.test.hachion.co/oauth2/authorization/google";

    if (window.location.hostname === "localhost") {
      url += `?redirect_uri=${encodeURIComponent("http://localhost:3000/login/oauth2/code/google")}`;
    }

    window.location.href = url;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get('error');
    if (!err) return;

    let msg = 'Login failed. Please try again.';
    if (err === 'EMAIL_NOT_REGISTERED') msg = 'Email not found. Please sign up first.';
    if (err === 'INVALID_EMAIL') msg = 'Invalid email from Google account.';
    setErrorMessage(msg);
  }, []);

  useEffect(() => {
    const code = readCookie("auth_error");
    if (!code) return;

    let msg = 'Login failed. Please try again.';
    if (code === 'not_registered') {
      msg = 'No account found for this Google email. Please sign up first.';
    }
    setErrorMessage1(msg);
    clearCookie("auth_error");
  }, []);

  useEffect(() => {
    // debugger
    try {
      const raw = localStorage.getItem('loginuserData');
      if (raw) return;

      fetch('https://api.test.hachion.co/api/me', { credentials: 'include' })
        .then(r => {
          if (!r.ok) return null;
          return r.json();
        })
        .then(u => {
          if (!u) return;

          const toStore = { name: u.name, email: u.email };
          if (u.picture) toStore.picture = u.picture;

          localStorage.setItem('loginuserData', JSON.stringify(toStore));

          if (u.token) {
            localStorage.setItem('authToken', u.token);
          }

          window.dispatchEvent(new Event('storage'));
        })
        .catch(err => {
          console.error('[auth bootstrap] /api/me fetch failed:', err);
        });
    } catch (e) {
      console.error('[auth bootstrap] Unexpected error:', e);
    }
  }, []);

  return (
    <>
      <div className='home-background'>
        <div className='container'>
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
        <img src={LoginBanner} alt='Login Banner' className='login-banner' />

        <div className='login container'>
          <div className='login-left'>
            <div className='login-top'>
              <div className='login-mid'>
                <h4 className='login-continue'>Login</h4>

                {/* // Email Field */}
                <label className='login-label'>Email<span className='star'>*</span></label>
                <div className="register-field">
                  <div className="password-field">
                    <input
                      type="email"
                      className={`form-control ${(errors.email || (errorMessage && errorMessage.toLowerCase().includes('email'))) ? 'error-input' : ''}`}
                      placeholder="Enter your Email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        // Clear email errors when user types
                        if (errors.email) {
                          setErrors(prev => ({ ...prev, email: '' }));
                        }
                        if (errorMessage) {
                          setErrorMessage('');
                        }
                      }}
                      onFocus={() => {
                        if (errors.email) {
                          setErrors(prev => ({ ...prev, email: '' }));
                        }
                        if (errorMessage) {
                          setErrorMessage('');
                        }
                      }}
                    />
                  </div>
                  {/* Show email validation errors OR API errors about email */}
                  {(errors.email || (errorMessage && errorMessage.toLowerCase().includes('email'))) && (
                    <p className="error-field-message" style={{
                      color: '#dc3545',
                      marginTop: '4px',
                      display: 'block'
                    }}>
                      {errors.email || errorMessage}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <label className='login-label'>Password<span className='star'>*</span></label>
                <div className="register-field">
                  <div className="password-field">
                    <input
                      type={passwordType}
                      className={`form-control ${(errors.password || (errorMessage && errorMessage.toLowerCase().includes('password'))) ? 'error-input' : ''}`}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => {
                        const newPassword = e.target.value;
                        setPassword(newPassword);

                        // Clear password errors when user types
                        if (errors.password) {
                          setErrors(prev => ({ ...prev, password: '' }));
                        }
                        if (errorMessage) {
                          setErrorMessage('');
                        }
                      }}
                      onFocus={() => {
                        if (errors.password) {
                          setErrors(prev => ({ ...prev, password: '' }));
                        }
                        if (errorMessage) {
                          setErrorMessage('');
                        }
                      }}
                    />
                    <span className="eye-icon" onClick={togglePasswordVisibility}>
                      {passwordType === 'password' ? <AiFillEye /> : <AiFillEyeInvisible />}
                    </span>
                  </div>

                  {/* Show password validation errors OR API errors about password */}
                  {(errors.password || (errorMessage && errorMessage.toLowerCase().includes('password'))) && (
                    <p className="error-field-message" style={{
                      color: '#dc3545',
                      marginTop: '4px',
                      display: 'block'
                    }}>
                      {errors.password || errorMessage}
                    </p>
                  )}
                </div>

                {/* Captcha Field */}
                <label className="login-label">Enter Captcha<span className="star">*</span></label>
                <div className="captcha-wrapper">
                  <canvas
                    ref={canvasRef}
                    className="password-field"
                    style={{ backgroundColor: 'none' }}
                    height="40"
                  />
                  <span
                    className="refresh-captcha-btn"
                    id="reload-button"
                    onClick={() => initializeCaptcha(canvasRef.current.getContext('2d'))}
                  >
                    <TbRefresh />
                  </span>
                </div>
                <div className="register-field">
                  <div className="password-field">
                    <input
                      type="text"
                      className={`form-control ${errors.captcha ? 'error-input' : ''}`}
                      placeholder="Enter captcha here"
                      value={userInput}
                      onChange={handleUserInputChange}
                    />
                  </div>
                  {errors.captcha && (
                    <p className="error-field-message" style={{ color: '#dc3545', marginTop: '4px' }}>
                      {errors.captcha}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="form-check form-switch align-items-center remember-me">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMeSwitch"
                    />
                    <label className="form-check-label" htmlFor="rememberMeSwitch">
                      Remember me
                    </label>
                  </div>
                  <Link to="/forgotpassword" className="forgot-password">
                    Forgot Password?
                  </Link>
                </div>

                {/* Login Button */}
                <div className="d-grid gap-2">
                  <button
                    className="login-btn"
                    type="button"
                    onClick={handleLogin}
                    disabled={isLoading}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      opacity: isLoading ? 0.7 : 1,
                      cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isLoading && <div className="login-spinner"></div>}
                    {isLoading ? 'Logging in...' : 'Login'}
                  </button>
                  <hr className='login-hr' />
                </div>

                {/* Google Login Button */}
                <div className="d-grid gap-2">
                  <button className="login-g-btn" type="button" onClick={handleGoogleLogin}>
                    <img src={google} alt='login-with-google' className='icon-btn-img' />
                    or Sign in with Google
                  </button>
                </div>

                {/* Show API error messages (wrong password, wrong email, etc.) */}
                {/* {errorMessage && (
                  <p className="error-field-message" style={{ 
                    marginTop: '15px', 
                    textAlign: 'center',
                    color: '#dc3545',
                    display: 'block'
                  }}>
                    {errorMessage}
                  </p>
                )} */}

                {/* Add test buttons for debugging */}
                {/* <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
                  <h5 style={{ fontSize: '14px', marginBottom: '10px' }}>Test Scenarios:</h5>
                  
                  <button
                    type="button"
                    onClick={() => {
                      // Test wrong password
                      setEmail("devisidharth6@gmail.com");
                      setPassword("WRONGPASSWORD123");
                      setUserInput(captchaText);
                      console.log("Set for testing: Wrong password");
                    }}
                    style={{ 
                      margin: '5px', 
                      padding: '8px 12px', 
                      fontSize: '12px',
                      backgroundColor: '#dc3545', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px' 
                    }}
                  >
                    Test Wrong Password
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      // Test non-existent email
                      setEmail("nonexistent@example.com");
                      setPassword("anypassword");
                      setUserInput(captchaText);
                      console.log("Set for testing: Non-existent email");
                    }}
                    style={{ 
                      margin: '5px', 
                      padding: '8px 12px', 
                      fontSize: '12px',
                      backgroundColor: '#fd7e14', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px' 
                    }}
                  >
                    Test Wrong Email
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      // Test empty password
                      setEmail("devisidharth6@gmail.com");
                      setPassword("");
                      setUserInput(captchaText);
                      console.log("Set for testing: Empty password");
                    }}
                    style={{ 
                      margin: '5px', 
                      padding: '8px 12px', 
                      fontSize: '12px',
                      backgroundColor: '#0dcaf0', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px' 
                    }}
                  >
                    Test Empty Password
                  </button>
                </div> */}
              </div>
            </div>
            <p className='go-to-register'>
              Don't have an account? <Link to='/register' className='link-to-register'> Sign Up </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;