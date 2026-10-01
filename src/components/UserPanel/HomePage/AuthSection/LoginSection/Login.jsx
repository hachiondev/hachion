"use client";

import React, { useState, useEffect } from 'react';
import './Login.css';
import Link from 'next/link';
import Image from 'next/image';
import LoginBanner from '@/assets/loginbackground.webp';
import google from '@/assets/google-new.webp';
import axios from 'axios';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { getRedirectUrl, clearRedirectUrl } from '@/redirectAfterLogin';
import { API_BASE_URL } from "@/lib/apiBase";
import { sharedCookieAttrs } from "@/lib/authCookies";

const Login = () => {
  const [passwordType, setPasswordType] = useState('password');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessage1, setErrorMessage1] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const readCookie = name => {
    const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  };
  const clearCookie = name => {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
  };
  const dismissError = () => {
    setErrorMessage('');
  };
  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    const passwordTrimmed = password.trim();
    if (passwordTrimmed.length === 0) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    return {
      isValid,
      errors: newErrors
    };
  };
  const handleLogin = async e => {
    e.preventDefault();
    const validation = validateForm();
    if (!validation.isValid) return;
    dismissError();
    setIsLoading(true);
    const loginData = {
      email,
      password
    };
    try {
      let proceedLogin = true;

      // Check if already confirmed for this email (only ask once per session)
      const confirmedEmail = sessionStorage.getItem("statusConfirmedEmail");
      if (confirmedEmail !== email) {
        try {
          const statusResponse = await axios.get(`${API_BASE_URL}/get-status?email=${email}`);

          if (typeof statusResponse.data === "string" && statusResponse.data.toLowerCase().includes("disabled")) {
            proceedLogin = window.confirm("Your account is disabled. Are you sure you want to activate this student?");
            if (proceedLogin) {
              sessionStorage.setItem("statusConfirmedEmail", email);
            }
          }

          if (statusResponse.data?.status && statusResponse.data.status.toUpperCase() === "DISABLED") {
            proceedLogin = window.confirm("Your account is disabled. Are you sure you want to activate this student?");
            if (proceedLogin) {
              sessionStorage.setItem("statusConfirmedEmail", email);
            }
          }
        } catch (err) {
          if (err.response && err.response.data && typeof err.response.data === "string" && err.response.data.toLowerCase().includes("disabled")) {
            proceedLogin = window.confirm("Your account is disabled. Are you sure you want to activate this student?");
            if (proceedLogin) {
              sessionStorage.setItem("statusConfirmedEmail", email);
            }
          }
        }
      }
      if (!proceedLogin) {
        setIsLoading(false);
        return;
      }
      const response = await axios.post(`${API_BASE_URL}/api/v1/user/login`, loginData);
      if (response.data.status === true) {
        sessionStorage.removeItem("statusConfirmedEmail");
        const loginuserData = {
          name: response.data.userName,
          email: response.data.email,
          picture: ""
        };
        const kill = name => {
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

        const redirectPath = getRedirectUrl();
        clearRedirectUrl();

        window.location.href = redirectPath || '/courses';
      } else {
        const errorMsg = response.data.message || "Invalid credentials";
        setErrorMessage(errorMsg);
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error("Error during login", error);
      if (error.response) {
        setErrorMessage(error.response.data.message || "Invalid credentials");
      } else {
        setErrorMessage("An error occurred during login");
      }
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordType(prevType => prevType === 'password' ? 'text' : 'password');
  };
  const handleGoogleLogin = async () => {
    dismissError();
    clearCookie("auth_error");

    const currentUrl = window.location.pathname + window.location.search;
    localStorage.setItem('redirectAfterLogin', currentUrl);
    // Domain=hachion.co is required here (matches Register.jsx's
    // setSharedCookie) - this cookie is read by the backend's OAuth2
    // success handler on api.hachion.co after a top-level navigation away
    // from this page. Without an explicit Domain it is host-only for
    // whichever host served this page and never reaches api.hachion.co, so
    // the backend always falls back to its "login" default. That happened
    // to look harmless for this login button, but it meant the "flow"
    // cookie mechanism was silently broken - and on RegisterHere.jsx's
    // Google button, which needs flow=signup, the same host-only cookie
    // made every Google sign-up get treated as a login attempt. (localhost:
    // see sharedCookieAttrs.)
    document.cookie = "flow=login; Max-Age=300; " + sharedCookieAttrs("Domain=hachion.co; Path=/; SameSite=None; Secure");
    localStorage.setItem("pendingOAuth", "login");
    try {
      // redirect: "manual" stops the browser from following this endpoint's
      // logout-success redirect (which points at a non-app URL blocked by
      // CSP) — the response itself is unused here, only the server-side
      // session clear matters.
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
        redirect: "manual"
      });
    } catch {
      // best-effort session clear before starting a fresh OAuth flow
    }
    // No redirect_uri here: Spring builds it from the active profile's
    // spring.security.oauth2.client.registration.google.redirect-uri and
    // ignores any query parameter on this endpoint.
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get('error');
    if (!err) return;
    let msg = 'Login failed. Please try again.';
    if (err === 'EMAIL_NOT_REGISTERED') msg = 'Email not found. Please sign up first.';
    if (err === 'INVALID_EMAIL') msg = 'Invalid email from Google account.';
    if (err === 'GOOGLE_AUTH_FAILED') msg = 'Google sign-in was cancelled or failed. Please try again.';
    // Top-of-form banner (same one the auth_error cookie uses): errorMessage
    // is only rendered under the email/password fields when its text
    // mentions "email"/"password", so GOOGLE_AUTH_FAILED's message was set
    // but never shown - a failed Google login looked like nothing happened.
    setErrorMessage1(msg);
    // Same cleanup the auth_error cookie path already does below — the
    // error is captured into state, so ?error=... has no further reason to
    // sit in the address bar (it doesn't otherwise self-clear on this page).
    window.history.replaceState(null, '', window.location.pathname);
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
      if (raw) return;
      fetch(`${API_BASE_URL}/api/me`, {
        credentials: 'include'
      }).then(r => {
        if (!r.ok) return null;
        return r.json();
      }).then(u => {
        if (!u) return;
        const toStore = {
          name: u.name,
          email: u.email
        };
        if (u.picture) toStore.picture = u.picture;
        localStorage.setItem('loginuserData', JSON.stringify(toStore));
        if (u.token) {
          localStorage.setItem('authToken', u.token);
        }
        window.dispatchEvent(new Event('storage'));
      }).catch(err => {
        console.error('[auth bootstrap] /api/me fetch failed:', err);
      });
    } catch (e) {
      console.error('[auth bootstrap] Unexpected error:', e);
    }
  }, []);
  return <>
      <div className='home-background'>
        <div className='container'>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link> <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Login
              </li>
            </ol>
          </nav>
        </div>
        <Image src={LoginBanner} alt='Login Banner' className='login-banner' priority />

        <div className='login container'>
          <div className='login-left'>
            <div className='login-top'>
              <div className='login-mid'>
                <h1 className='login-continue'>Login</h1>

                {errorMessage1 && <p className="error-message-top">{errorMessage1}</p>}

                <label className='login-label' htmlFor="loginEmail">Email<span className='star'>*</span></label>
                <div className="register-field">
                  <div className="password-field">
                    <input id="loginEmail" type="email" className={`form-control ${errors.email || errorMessage && errorMessage.toLowerCase().includes('email') ? 'error-input' : ''}`} placeholder="Enter your Email" value={email} onChange={e => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors(prev => ({
                        ...prev,
                        email: ''
                      }));
                    }
                    if (errorMessage) {
                      setErrorMessage('');
                    }
                    if (errorMessage1) {
                      setErrorMessage1('');
                    }
                  }} onFocus={() => {
                    if (errors.email) {
                      setErrors(prev => ({
                        ...prev,
                        email: ''
                      }));
                    }
                    if (errorMessage) {
                      setErrorMessage('');
                    }
                  }} />
                  </div>
                  {(errors.email || errorMessage && errorMessage.toLowerCase().includes('email')) && <p className="error-field-message" style={{
                  color: '#dc3545',
                  marginTop: '4px',
                  display: 'block'
                }}>
                      {errors.email || errorMessage}
                    </p>}
                </div>

                <label className='login-label' htmlFor="loginPassword">Password<span className='star'>*</span></label>
                <div className="register-field">
                  <div className="password-field">
                    <input id="loginPassword" type={passwordType} className={`form-control ${errors.password || errorMessage && errorMessage.toLowerCase().includes('password') ? 'error-input' : ''}`} placeholder="Enter password" value={password} onChange={e => {
                    const newPassword = e.target.value;
                    setPassword(newPassword);

                    if (errors.password) {
                      setErrors(prev => ({
                        ...prev,
                        password: ''
                      }));
                    }
                    if (errorMessage) {
                      setErrorMessage('');
                    }
                  }} onFocus={() => {
                    if (errors.password) {
                      setErrors(prev => ({
                        ...prev,
                        password: ''
                      }));
                    }
                    if (errorMessage) {
                      setErrorMessage('');
                    }
                  }} />
                    <span className="eye-icon" role="button" tabIndex={0} aria-label={passwordType === 'password' ? 'Show password' : 'Hide password'} onClick={togglePasswordVisibility} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && togglePasswordVisibility()}>
                      {passwordType === 'password' ? <AiFillEye /> : <AiFillEyeInvisible />}
                    </span>
                  </div>

                  {(errors.password || errorMessage && errorMessage.toLowerCase().includes('password')) && <p className="error-field-message" style={{
                  color: '#dc3545',
                  marginTop: '4px',
                  display: 'block'
                }}>
                      {errors.password || errorMessage}
                    </p>}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="form-check form-switch align-items-center remember-me">
                    <input className="form-check-input" type="checkbox" id="rememberMeSwitch" />
                    <label className="form-check-label" htmlFor="rememberMeSwitch">
                      Remember me
                    </label>
                  </div>
                  <Link href="/forgotpassword" className="forgot-password">
                    Forgot Password?
                  </Link>
                </div>

                {/* Login Button */}
                <div className="d-grid gap-2">
                  <button className="login-btn" type="button" onClick={handleLogin} disabled={isLoading} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}>
                    {isLoading && <div className="login-spinner"></div>}
                    {isLoading ? 'Logging in...' : 'Login'}
                  </button>
                  <hr className='login-hr' />
                </div>

                {/* Google Login Button */}
                <div className="d-grid gap-2">
                  <button className="login-g-btn" type="button" onClick={handleGoogleLogin}>
                    <Image src={google} alt='login-with-google' className='icon-btn-img' width={20} height={20} />
                    or Sign in with Google
                  </button>
                </div>
              </div>
            </div>
            <p className='go-to-register'>
              Don&apos;t have an account? <Link href='/register' className='link-to-register'> Sign Up </Link>
            </p>
          </div>
        </div>
      </div>
    </>;
};
export default Login;
