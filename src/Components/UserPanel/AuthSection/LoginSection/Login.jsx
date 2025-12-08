import React, { useState, useEffect } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import LoginBanner from "../../../../Assets/loginbackground.webp";
import google from "../../../../Assets/google-new.webp";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { MdKeyboardArrowRight } from "react-icons/md";
import { TbRefresh } from "react-icons/tb";import { useLoginMutation } from "../../../../Api/hooks/LoginApi/useLogin";
import { useCaptcha } from "../../../../Api/hooks/LoginApi/useCaptcha";


const Login = () => {
  const navigate = useNavigate();

  // TanStack mutation
  const { mutate: loginMutate, isPending } = useLoginMutation();

  // captcha hook
  const { captchaText, userInput, setUserInput, canvasRef, refreshCaptcha } = useCaptcha();

  // fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");

  // errors
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validateForm = () => {
    const errs = {};

    if (!email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Invalid email.";

    if (!password.trim()) errs.password = "Password is required.";

    if (!userInput.trim()) errs.captcha = "Captcha is required.";
    else if (userInput !== captchaText) {
      errs.captcha = "Captcha does not match.";
      refreshCaptcha();
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = () => {
    if (!validateForm()) return;

    loginMutate(
      { email, password },
      {
        onSuccess: (res) => {
          if (!res.status) {
            setServerError(res.message);
            return;
          }

          const user = {
            name: res.userName,
            email: res.email,
            picture: "",
          };

          localStorage.setItem("loginuserData", JSON.stringify(user));
          localStorage.setItem("authToken", res.token);
          localStorage.setItem("authSource", "manual");

          const redirect = localStorage.getItem("redirectAfterLogin") || "/coursedetails";
          localStorage.removeItem("redirectAfterLogin");

          window.location.href = redirect;
        },
        onError: () => {
          setServerError("Login failed. Try again.");
        },
      }
    );
  };

  const togglePasswordVisibility = () => {
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  };

  return (
    <div className="home-background">
      <div className="container">
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

      <img src={LoginBanner} alt="Login Banner" className="login-banner" />

      <div className="login container">
        <div className="login-left">
          <div className="login-top">
            {serverError && <p className="error-field-message">{serverError}</p>}

            <div className="login-mid">
              <h4 className="login-continue">Login</h4>
              {/* Email */}
              <label className="login-label">
                Email<span className="star">*</span>
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="error-field-message">{errors.email}</p>}

              {/* Password */}
              <label className="login-label">
                Password<span className="star">*</span>
              </label>

              <div className="password-field">
                <input
                  type={passwordType}
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="eye-icon" onClick={togglePasswordVisibility}>
                  {passwordType === "password" ? <AiFillEye /> : <AiFillEyeInvisible />}
                </span>
              </div>

              {errors.password && <p className="error-field-message">{errors.password}</p>}

              {/* Captcha */}
              <label className="login-label">
                Enter Captcha<span className="star">*</span>
              </label>

              <div className="captcha-wrapper">
                <canvas ref={canvasRef} height="40" className="password-field"></canvas>

                <span className="refresh-captcha-btn" onClick={refreshCaptcha}>
                  <TbRefresh />
                </span>
              </div>

              <input
                type="text"
                className="form-control"
                placeholder="Enter captcha"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              {errors.captcha && <p className="error-field-message">{errors.captcha}</p>}

              {/* Actions */}
              <button className="register-btn" onClick={handleLogin} disabled={isPending}>
                {isPending ? "Logging in..." : "Login"}
              </button>

              <hr />

              <button className="other-btn">
                <img src={google} alt="google" className="icon-btn-img" />
                Sign in with Google
              </button>
            </div>

            <p className="go-to-register">
              Don't have an account?{" "}
              <Link to="/register" className="link-to-register">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
