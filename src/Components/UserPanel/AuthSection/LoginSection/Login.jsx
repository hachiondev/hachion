import React, { useState, useRef, useEffect } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import LoginBanner from '../../../../Assets/loginbackground.webp';
import google from '../../../../Assets/google-new.webp';
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

  const readCookie = (name) => {
    const m = document.cookie.match(
      new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
    );
    return m ? decodeURIComponent(m[1]) : null;
  };
  const clearCookie = (name) => {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
  };
  const dismissError = () => { if (errorMessage1) setErrorMessage1(''); };

  const handleLogin = async (e) => {
    if (!validateForm()) return;
    e.preventDefault();
    dismissError();

    const loginData = { email, password };

    try {
      const response = await axios.post('https://api.test.hachion.co/api/v1/user/login', loginData);
      console.log(response.data);

      if (response.data.status) {

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

 const handleGoogleLogin = async () => {
  dismissError();
  clearCookie("auth_error");

  // Cookie fix (safe for both local + server)
  document.cookie =
    "flow=login; Max-Age=300; Path=/; SameSite=None; Secure";

  localStorage.setItem("pendingOAuth", "login");

  try {
    await fetch("https://api.test.hachion.co/logout", {
      method: "POST",
      credentials: "include"
    });
  } catch {}

  let url = "https://api.test.hachion.co/oauth2/authorization/google";

  // 🔥 LOCAL ONLY: this runs only in localhost, never on server
  if (window.location.hostname === "localhost") {
    url +=
      `?redirect_uri=${encodeURIComponent(
        "http://localhost:3000/login/oauth2/code/google"
      )}`;
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
    try {
      const raw = localStorage.getItem('loginuserData');
      console.log('[auth bootstrap] localStorage.loginuserData =', raw);
      if (raw) {
        console.log('[auth bootstrap] Found existing user in localStorage → skip /api/me');
        return;
      }
      console.log('[auth bootstrap] No user in localStorage → calling /api/me (credentials: include)');
      fetch('https://api.hachion.co/api/me', { credentials: 'include' })
        .then(r => {
          console.log('[auth bootstrap] /api/me status =', r.status);
          if (!r.ok) return null;
          return r.json();
        })
        .then(u => {
          console.log('[auth bootstrap] /api/me json =', u);
          if (!u) return;

          const toStore = { name: u.name, email: u.email };
          if (u.picture) toStore.picture = u.picture;

          localStorage.setItem('loginuserData', JSON.stringify(toStore));
          console.log('[auth bootstrap] Wrote loginuserData to localStorage =', toStore);

          if (u.token) {
            localStorage.setItem('authToken', u.token);
            console.log('[auth bootstrap] Wrote authToken to localStorage');
          } else {
            console.log('[auth bootstrap] No token provided by backend (session cookies are fine)');
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

              {errorMessage1 && (
                <p className="error-field-message" onClick={dismissError} style={{ cursor: 'pointer' }}>
                  {errorMessage1}
                </p>
              )}
              <div className='login-mid'>
                <h4 className='login-continue'>Login</h4>
                <label className='login-label'>Email<span className='star'>*</span></label>
                <div className="register-field">
                  <div className="password-field">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your Email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); dismissError(); }}
                      onFocus={dismissError}
                      onInput={dismissError}
                    />
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
                      onChange={(e) => { setPassword(e.target.value); dismissError(); }}
                      onFocus={dismissError}
                      onInput={dismissError}
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
                  <canvas ref={canvasRef} className="password-field" style={{ backgroundColor: 'none' }}
                    height="40">
                    onClick={dismissError}
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
                      onChange={handleUserInputChange} />
                  </div>
                  {errors.captcha && <p className="error-field-message">{errors.captcha}</p>}
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  {/* Remember Me Toggle */}
                  <div className="form-check form-switch align-items-center remember-me">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMeSwitch"
                    />
                    <label className="form-check-label" htmlFor="rememberMeSwitch" style={{ fontSize: '12px' }}>
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
                    className="login-btn"
                    type="button"
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                  <hr className='login-hr' />
                </div>
                <div className="d-grid gap-2">
                  <button
                    className="login-g-btn"
                    type="button"
                    onClick={handleGoogleLogin}
                  >
                    <img src={google} alt='login-with-google' className='icon-btn-img' />
                    or Sign in with Google
                  </button>
                </div>
              </div>
              {errorMessage && <p className="error-field-message">{errorMessage}</p>}
            </div>
            <p className='go-to-register'>Don't have an account? <Link to='/register' className='link-to-register'> Sign Up </Link></p>
          </div>
        </div>
        {/* <Footer />
      <StickyBar /> */}
      </div>
    </>
  );
}

export default Login;