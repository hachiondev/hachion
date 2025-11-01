import React, { useEffect, useRef, useState } from "react";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { TbRefresh } from "react-icons/tb";
import { MdKeyboardArrowRight } from "react-icons/md";
import google from "../../Assets/google-new.png";
import LoginBanner from "../../Assets/loginbackground.png";
import Topbar from "./Topbar";
import NavbarTop from "./NavbarTop";
import Footer from "./Footer";
import StickyBar from "./StickyBar";

const getStep1 = () => {
  const raw =
    localStorage.getItem("registerStep1") ?? 
    localStorage.getItem("registeruserData"); 
  return raw ? JSON.parse(raw) : null;
};

const RegisterHere = () => {
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [userInput, setUserInput] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");
    const [registerMessage, setRegisterMessage] = useState("");
    const [messageType, setMessageType] = useState("");

  
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      initializeCaptcha(ctx);
    }
  }, []);

  const generateCaptchaText = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let text = "";
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return text;
  };

  const drawCaptchaOnCanvas = (ctx, captcha) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = "20px Arial";
    ctx.fillStyle = "#333";
    ctx.fillText(captcha, 10, 25);
  };

  const initializeCaptcha = (ctx) => {
    const captcha = generateCaptchaText();
    setCaptchaText(captcha);
    drawCaptchaOnCanvas(ctx, captcha);
    setUserInput("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!password.trim()) newErrors.password = "Password is required.";
    if (!userInput.trim()) {
      newErrors.captcha = "Captcha is required.";
    } else if (userInput !== captchaText) {
      newErrors.captcha = "Captcha does not match.";
      initializeCaptcha(canvasRef.current.getContext("2d"));
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async () => {
  if (!validateForm()) return;
  setIsLoading(true);

  try {
    
    const step1 = getStep1();
    if (!step1 || !step1.email) {
      alert("Your basic details are missing. Please start again.");
      setIsLoading(false);
      navigate("/register");
      return;
    }

    
    const res = await fetch(
      `https://api.test.hachion.co/api/v1/user/send-otp?email=${encodeURIComponent(step1.email)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    let data = {};
    try { data = await res.json(); } catch (_) {}

    const looksLikeOtpSent =
      data?.otp ||
      (typeof data?.message === "string" && data.message.toLowerCase().includes("otp"));

    if (res.ok && looksLikeOtpSent) {
      
      const finalData = { ...step1, password };
      localStorage.setItem("registeruserData", JSON.stringify(finalData));

      
      navigate("/registerverification");
    } else {
      const msg = data?.message || "Failed to send OTP. Please try again.";
      alert(msg);
    }
  } catch (err) {
    alert(`Error while sending OTP: ${err?.message || err}`);
  } finally {
    setIsLoading(false);
  }
};

  const loginWithGoogle = () => {
    window.location.href = `https://api.test.hachion.co/oauth2/authorization/google`;
  };

  return (
    <>
      <div className='home-background'>
      <Topbar />
      <NavbarTop />

      {/* Breadcrumb */}
      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Set Password & Verify
            </li>
          </ol>
        </nav>
      </div>

      {/* Banner */}
      <img src={LoginBanner} alt="Login Banner" className="login-banner" />

      {/* Register Content */}
      <div className='login container'>
        <div className="login-left">
          <div className="login-top">
            <h4 className="login-continue">Set Password & Verify</h4>
            <div className="login-mid">
              {/* Password */}
              <label className="login-label">
                Password<span className="star">*</span>
              </label>
              <div className="register-field">
                <div className="password-field">
                  <input
                    type={passwordType}
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="eye-icon"
                    onClick={() =>
                      setPasswordType(
                        passwordType === "password" ? "text" : "password"
                      )
                    }
                  >
                    {passwordType === "password" ? (
                      <AiFillEye />
                    ) : (
                      <AiFillEyeInvisible />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="error-field-message">{errors.password}</p>
                )}
              </div>

              {/* Captcha */}
              <label className="login-label">
                Enter Captcha<span className="star">*</span>
              </label>
              <div className="captcha-wrapper">
                <canvas ref={canvasRef} height="40" width="120"></canvas>
                <span
                  className="refresh-captcha-btn"
                  onClick={() =>
                    initializeCaptcha(canvasRef.current.getContext("2d"))
                  }
                >
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
                  onChange={(e) => setUserInput(e.target.value)}
                />
                </div>
                {errors.captcha && (
                  <p className="error-field-message">{errors.captcha}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="d-flex align-items-center mb-3" style={{margin: '0.2vh 2vh'}}>
              <div className="form-check form-switch align-items-center remember-me">
                <input className="form-check-input" type="checkbox" id="rememberMeSwitch" />
                <label className="form-check-label" htmlFor="rememberMeSwitch" style={{ fontSize: "12px" }}>
                  Remember me
                </label>
              </div>
              </div>

              {formError && <p className="error-field-message">{formError}</p>}
              {registerMessage && (
                <p className={messageType === "error" ? "error-field-message" : "success-message"}>
                  {registerMessage}
                </p>
              )}

              {/* Next Button */}
              <div className="d-grid gap-2">
                <button
                  type="button"
                  className="register-btn"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Next"}
                </button>
              </div>

              <hr style={{ width: "90%", margin: "20px" }} />

              {/* Google Signup */}
              <div className="d-grid gap-2">
                <button
                  className="other-btn"
                  type="button"
                  onClick={loginWithGoogle}
                >
                  <img
                    src={google}
                    alt="login-with-google"
                    className="icon-btn-img"
                  />
                  or Sign Up with Google
                </button>
              </div>
            </div>
          </div>

          {/* Already have an account */}
          <p className="go-to-register">
            Already have an account?{" "}
            <Link to="/login" className="link-to-register">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Footer & Sticky Bar */}
      {/* <Footer />
      <StickyBar /> */}
      </div>
    </>
  );
};

export default RegisterHere;

