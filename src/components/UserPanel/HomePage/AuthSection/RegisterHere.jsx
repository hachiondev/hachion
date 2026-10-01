"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "./LoginSection/Login.css";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { MdKeyboardArrowRight } from "react-icons/md";
import google from "@/assets/google-new.webp";
import LoginBanner from "@/assets/loginbackground.webp";
import { API_BASE_URL } from "@/lib/apiBase";
import { sharedCookieAttrs } from "@/lib/authCookies";

const getStep1 = () => {
  const raw =
    typeof window !== "undefined"
      ? localStorage.getItem("registerStep1") ?? localStorage.getItem("registeruserData")
      : null;
  return raw ? JSON.parse(raw) : null;
};

// Ported from the CRA app's src/Components/UserPanel/HomePage/AuthSection/RegisterHere.jsx
// (Sign Up step 2/3 — "Set Password & Verify", between the basic-details
// form and the OTP-confirmation step). This is the page Register.jsx's
// "Create Account" button navigates to; it not existing at all in this
// Next.js app was the root cause of "Sign Up is not working" — any user
// who got past step 1 landed on a 404 and could never actually create an
// account. The captcha canvas the original had was already fully
// commented out (dead code) — dropped rather than ported.
const RegisterHere = () => {
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};
    if (!password.trim()) newErrors.password = "Password is required.";
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
        router.push("/register");
        return;
      }
      const res = await fetch(`${API_BASE_URL}/api/v1/user/send-otp?email=${encodeURIComponent(step1.email)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      let data = {};
      try {
        data = await res.json();
      } catch {
        // response wasn't JSON — handled by the ok+message fallback below
      }
      const looksLikeOtpSent =
        data?.otp || (typeof data?.message === "string" && data.message.toLowerCase().includes("otp"));
      if (res.ok && looksLikeOtpSent) {
        const finalData = { ...step1, password };
        localStorage.setItem("registeruserData", JSON.stringify(finalData));
        router.push("/registerverification");
      } else {
        // Restored to a plain alert() for every /send-otp failure — including
        // "already exists" — matching the original CRA behavior. Was briefly
        // routed back to Create Account with an inline message instead;
        // reverted back to the window.alert() per explicit instruction.
        const msg = data?.message || "Failed to send OTP. Please try again.";
        alert(msg);
      }
    } catch (err) {
      alert(`Error while sending OTP: ${err?.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  // This "Sign Up with Google" button previously redirected straight to
  // Google without ever setting the "flow" cookie Register.jsx sets before
  // its own Google button (see setSharedCookie there). The backend's OAuth2
  // success handler reads that cookie to decide signup vs. login and
  // defaults to "login" when it's missing - so a user landing here (e.g.
  // directly, or after step 1) and clicking this button had their signup
  // silently treated as a login attempt and bounced back with
  // "not registered", even though they were in the middle of signing up.
  const SHARED_DOMAIN = "hachion.co";
  const loginWithGoogle = () => {
    document.cookie = "flow=signup; Max-Age=300; " + sharedCookieAttrs(`Domain=${SHARED_DOMAIN}; Path=/; SameSite=Lax; Secure`);
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  };

  return (
    <div className="home-background">
      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Set Password &amp; Verify
            </li>
          </ol>
        </nav>
      </div>

      <Image src={LoginBanner} alt="Login Banner" className="login-banner" priority />

      <div className="login container">
        <div className="login-left">
          <div className="login-top">
            <h1 className="login-continue">Set Password &amp; Verify</h1>
            <div className="login-mid">
              <label className="login-label" htmlFor="registerHerePassword">
                Password<span className="star">*</span>
              </label>
              <div className="register-field">
                <div className="password-field">
                  <input
                    id="registerHerePassword"
                    type={passwordType}
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="eye-icon"
                    role="button"
                    tabIndex={0}
                    aria-label={passwordType === "password" ? "Show password" : "Hide password"}
                    onClick={() => setPasswordType(passwordType === "password" ? "text" : "password")}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      setPasswordType(passwordType === "password" ? "text" : "password")
                    }
                  >
                    {passwordType === "password" ? <AiFillEye /> : <AiFillEyeInvisible />}
                  </span>
                </div>
                {errors.password && <p className="error-field-message">{errors.password}</p>}
              </div>

              <div className="d-flex align-items-center mb-3" style={{ margin: "0.2vh 2vh" }}>
                <div className="form-check form-switch align-items-center remember-me">
                  <input className="form-check-input" type="checkbox" id="rememberMeSwitch" />
                  <label className="form-check-label" htmlFor="rememberMeSwitch" style={{ fontSize: "12px" }}>
                    Remember me
                  </label>
                </div>
              </div>

              <div className="d-grid gap-2">
                <button type="button" className="register-btn" onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? "Processing..." : "Next"}
                </button>
              </div>

              <hr style={{ width: "90%", margin: "20px" }} />

              <div className="d-grid gap-2">
                <button className="other-btn" type="button" onClick={loginWithGoogle}>
                  <Image src={google} alt="login-with-google" className="icon-btn-img" width={20} height={20} />
                  or Sign Up with Google
                </button>
              </div>
            </div>
          </div>

          <p className="go-to-register">
            Already have an account? <Link href="/login" className="link-to-register">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterHere;
