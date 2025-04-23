import React, { useState } from "react";
import "./Login.css";
import logo from "../../Assets/logo.png";
import linkedin from "../../Assets/linkedin.png";
import apple from "../../Assets/Apple.png";
import { Link, useNavigate } from "react-router-dom";
import LoginSide from "./LoginSide";
import captcha from "../../Assets/captcha.png";
import google from "../../Assets/google_symbol.svg.png";
import facebook from "../../Assets/facebook_symbol.svg.png";
import { useFormik } from "formik";
import axios from "axios";
import { LoginSchema } from "../Schemas";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // For eye icons
import Topbar from "./Topbar";

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const [passwordType, setPasswordType] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isCaptchaChecked, setIsCaptchaChecked] = useState(false);
  const [captchaError, setCaptchaError] = useState("");

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isCaptchaChecked) {
      setCaptchaError("Captcha validation is mandatory to login.");
      return;
    }

    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        "https://api.hachion.co/api/v1/user/login",
        loginData
      );
      console.log(response.data);

      if (response.data.status) {
        const loginuserData = {
          name: response.data.userName,
          email: response.data.email,
        };

        try {
          localStorage.setItem("loginuserData", JSON.stringify(loginuserData));
          localStorage.setItem("authToken", response.data.token); // Save the token
        } catch (error) {
          console.error("Error saving to localStorage:", error);
        }

        const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
        window.location.href = redirectPath;
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error during login", error);
      setErrorMessage("An error occurred during login");
    }
  };

  // Display error message

  const googleLogin = () => {
    window.open("https://api.hachion.co/oauth2/authorization/google", "_self");
  };

  const facebookLogin = () => {
    window.location.href =
      "https://api.hachion.co/oauth2/authorization/facebook"; // Backend Facebook OAuth
  };

  const linkedinLogin = () => {
    window.location.href =
      "https://api.hachion.co/oauth2/authorization/linkedin"; // Backend LinkedIn OAuth
  };

  const appleLogin = () => {
    window.location.href = "https://api.hachion.co/oauth2/authorization/apple"; // Backend Apple OAuth
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };

  return (
    <>
      <div className="login">
        <div className="login-left">
          <div className="login-top">
            <img src={logo} alt="logo" className="login-logo" />

            <h3 className="welcome-back">Welcome back!</h3>
            <h4 className="login-continue">Login to continue learning</h4>
            <div className="login-mid">
              <label className="login-label">
                Email ID<span className="star">*</span>
              </label>
              <div className="input-group mb-2">
                <input
                  type="email"
                  className="form-control"
                  placeholder="abc@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <label className="login-label">
                Password<span className="star">*</span>
              </label>
              <div className="input-group mb-2">
                <input
                  type={passwordType}
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="input-group-text"
                  onClick={togglePasswordVisibility}
                >
                  {passwordType === "password" ? (
                    <AiFillEyeInvisible />
                  ) : (
                    <AiFillEye />
                  )}
                </span>
              </div>
              {/* {errors.password && touched.password ? (<p className='form-error'>{errors.password}</p>) : null} */}

              <Link to="/forgotpassword" style={{ textDecoration: "none" }}>
                <p className="forgot-password">Forgot Password?</p>
              </Link>

              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="flexCheckDefault"
                  onChange={(e) => {
                    setIsCaptchaChecked(e.target.checked);
                    if (e.target.checked) setCaptchaError("");
                  }}
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  I'm not a robot
                </label>
                <img src={captcha} alt="captcha" className="captcha" />
              </div>
              {captchaError && <p className="error-message">{captchaError}</p>}

              {/* <div className="form-check">
                  <ReCAPTCHA
                    sitekey="YOUR_SITE_KEY" 
                    onChange={handleCaptchaChange}
                  />
                </div> */}

              <div className="d-grid gap-2">
                <button
                  className="register-btn"
                  type="submit"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>
            </div>

            {/* <div className='login-with'> */}
            {/* <hr width='20%' size='2' style={{ marginTop: '2vh' }}></hr>
              <p className='login-option'>Or Login with</p>
              <hr width='20%' size='2' style={{ marginTop: '2vh' }}></hr>
            </div> */}

            {/* <div className='icon-holder'>
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
            </div> */}

            <p className="go-to-register">
              Don't have an account?{" "}
              <Link to="/register" className="link-to-register">
                {" "}
                Register{" "}
              </Link>
            </p>
          </div>
        </div>
        <LoginSide />
      </div>
    </>
  );
};

export default Login;
