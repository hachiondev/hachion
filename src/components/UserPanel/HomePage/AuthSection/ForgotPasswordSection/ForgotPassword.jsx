"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LoginBanner from "@/assets/loginbackground.webp";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { MdKeyboardArrowRight } from "react-icons/md";
import "../LoginSection/Login.css";

const OTP_LENGTH = 4;
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (password) => /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);

// Both send-otp and verify-otp/reset-password return different response
// shapes (JSON vs plain text) depending on the endpoint, so responses are
// read as text first and parsed as JSON only if possible — mirrors the
// defensive response handling already used for /get-status in Login.jsx
// and Register.jsx.
async function readResponse(res) {
  const raw = await res.text();
  try {
    return { raw, json: JSON.parse(raw) };
  } catch {
    return { raw, json: null };
  }
}

const ForgotPassword = () => {
  const router = useRouter();
  const otpRefs = useRef([]);

  const [step, setStep] = useState("email"); // email | otp | reset | done
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const otp = otpDigits.join("");

  const resetMessages = () => {
    setErrorMessage("");
    setInfoMessage("");
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    resetMessages();
    if (!email.trim()) {
      setErrors({ email: "Email is required." });
      return;
    }
    if (!isValidEmail(email)) {
      setErrors({ email: "Please enter a valid email address." });
      return;
    }
    setErrors({});
    setIsLoading(true);
    try {
      // /api/v1/user/forgotpassword (not /send-otp — that endpoint is the
      // sign-up flow's, and rejects any email that already has an account,
      // which is every legitimate Forgot Password user). This one requires
      // an existing account and unconditionally (re)generates and emails a
      // fresh OTP every time it's called — the fix for "requesting a new
      // OTP for the same email doesn't send one."
      const res = await fetch(
        `https://api.hachion.co/api/v1/user/forgotpassword?email=${encodeURIComponent(email)}`,
        { method: "PUT" }
      );
      const { raw } = await readResponse(res);
      // This endpoint always answers HTTP 200 whether or not the account
      // exists — "not found" only shows up in the message body, so res.ok
      // alone can't distinguish success from failure here.
      const notFound = /not found/i.test(raw);
      if (res.ok && !notFound) {
        setInfoMessage(raw || "An OTP has been sent to your email.");
        setStep("otp");
        setOtpDigits(Array(OTP_LENGTH).fill(""));
      } else {
        setErrorMessage(raw || "We couldn't send an OTP to that email. Please check the address and try again.");
      }
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    resetMessages();
    if (otp.length !== OTP_LENGTH) {
      setErrorMessage(`Please enter the ${OTP_LENGTH}-digit OTP.`);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`https://api.hachion.co/api/v1/user/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const { raw } = await readResponse(res);
      if (res.ok) {
        setInfoMessage("");
        setStep("reset");
      } else {
        setErrorMessage(raw || "Invalid or expired OTP. Please try again.");
      }
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    resetMessages();
    setIsLoading(true);
    try {
      // Same endpoint ConfirmOtp.jsx's "Resend OTP" uses on the live site —
      // PUT, not POST, and always overwrites+resends regardless of whether
      // an OTP was already issued for this email.
      const res = await fetch(
        `https://api.hachion.co/api/v1/user/regenerate-otp?email=${encodeURIComponent(email)}`,
        { method: "PUT" }
      );
      const { raw } = await readResponse(res);
      if (res.ok && !/not found/i.test(raw)) {
        setInfoMessage(raw || "A new OTP has been sent to your email.");
        setOtpDigits(Array(OTP_LENGTH).fill(""));
        otpRefs.current[0]?.focus();
      } else {
        setErrorMessage(raw || "We couldn't resend the OTP. Please try again.");
      }
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    resetMessages();
    const newErrors = {};
    if (!isValidPassword(newPassword)) {
      newErrors.newPassword = "Password must be at least 8 characters and include a letter and a number.";
    }
    if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      // Matches the live site's ResetPassword.jsx payload exactly — this
      // endpoint doesn't take the otp at all (the earlier verify-otp step
      // already gates access to this step).
      const res = await fetch(`https://api.hachion.co/api/v1/user/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword, confirmPassword }),
      });
      const { raw } = await readResponse(res);
      if (res.ok) {
        setStep("done");
      } else {
        setErrorMessage(raw || "We couldn't reset your password. Please try again.");
      }
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="home-background">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link> <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item">
                <Link href="/login">Login</Link> <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Forgot Password
              </li>
            </ol>
          </nav>
        </div>
        <Image src={LoginBanner} alt="Login Banner" className="login-banner" priority />

        <div className="login container">
          <div className="login-left">
            <div className="login-top">
              <div className="login-mid" style={{ width: "100%" }}>
                <h1 className="login-continue">Reset your password</h1>

                {infoMessage && <p className="error-message-top" style={{ background: "#d1e7dd", color: "#0f5132", borderColor: "#badbcc" }}>{infoMessage}</p>}
                {errorMessage && <p className="error-message-top">{errorMessage}</p>}

                {step === "email" && (
                  <form onSubmit={handleSendOtp}>
                    <p className="tag" style={{ marginBottom: "12px" }}>
                      Enter the email associated with your account and we&apos;ll send you a one-time
                      code to reset your password.
                    </p>
                    <label className="login-label" htmlFor="fpEmail">
                      Email<span className="star">*</span>
                    </label>
                    <div className="register-field">
                      <div className="password-field">
                        <input
                          id="fpEmail"
                          type="email"
                          className={`form-control ${errors.email ? "error-input" : ""}`}
                          placeholder="Enter your Email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors({});
                          }}
                        />
                      </div>
                      {errors.email && <p className="error-field-message">{errors.email}</p>}
                    </div>

                    <div className="d-grid gap-2">
                      <button
                        className="login-btn"
                        type="submit"
                        disabled={isLoading}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                          opacity: isLoading ? 0.7 : 1,
                          cursor: isLoading ? "not-allowed" : "pointer",
                        }}
                      >
                        {isLoading && <div className="login-spinner"></div>}
                        {isLoading ? "Sending OTP..." : "Send OTP"}
                      </button>
                    </div>
                  </form>
                )}

                {step === "otp" && (
                  <form onSubmit={handleVerifyOtp}>
                    <p className="tag" style={{ marginBottom: "12px" }}>
                      Enter the {OTP_LENGTH}-digit code sent to <strong>{email}</strong>.
                    </p>
                    <div className="enter-otp">Enter OTP</div>
                    <div className="otp">
                      {otpDigits.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          className="otp-number text-center"
                          value={digit}
                          aria-label={`OTP digit ${index + 1}`}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        />
                      ))}
                    </div>

                    <div className="d-grid gap-2">
                      <button
                        className="login-btn"
                        type="submit"
                        disabled={isLoading}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                          opacity: isLoading ? 0.7 : 1,
                          cursor: isLoading ? "not-allowed" : "pointer",
                        }}
                      >
                        {isLoading && <div className="login-spinner"></div>}
                        {isLoading ? "Verifying..." : "Verify OTP"}
                      </button>
                    </div>
                    <p className="tag" style={{ marginTop: "10px" }}>
                      Didn&apos;t get the code?{" "}
                      <button
                        type="button"
                        className="link-to-register"
                        style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                        onClick={handleResendOtp}
                        disabled={isLoading}
                      >
                        Resend OTP
                      </button>
                    </p>
                  </form>
                )}

                {step === "reset" && (
                  <form onSubmit={handleResetPassword}>
                    <label className="login-label" htmlFor="fpNewPassword">
                      New Password<span className="star">*</span>
                    </label>
                    <div className="register-field">
                      <div className="password-field">
                        <input
                          id="fpNewPassword"
                          type={passwordType}
                          className={`form-control ${errors.newPassword ? "error-input" : ""}`}
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: "" }));
                          }}
                        />
                        <span
                          className="eye-icon"
                          role="button"
                          tabIndex={0}
                          aria-label={passwordType === "password" ? "Show password" : "Hide password"}
                          onClick={togglePasswordVisibility}
                          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && togglePasswordVisibility()}
                        >
                          {passwordType === "password" ? <AiFillEye /> : <AiFillEyeInvisible />}
                        </span>
                      </div>
                      {errors.newPassword && <p className="error-field-message">{errors.newPassword}</p>}
                    </div>

                    <label className="login-label" htmlFor="fpConfirmPassword">
                      Confirm Password<span className="star">*</span>
                    </label>
                    <div className="register-field">
                      <div className="password-field">
                        <input
                          id="fpConfirmPassword"
                          type={passwordType}
                          className={`form-control ${errors.confirmPassword ? "error-input" : ""}`}
                          placeholder="Re-enter new password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                          }}
                        />
                      </div>
                      {errors.confirmPassword && <p className="error-field-message">{errors.confirmPassword}</p>}
                    </div>

                    <div className="d-grid gap-2">
                      <button
                        className="login-btn"
                        type="submit"
                        disabled={isLoading}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                          opacity: isLoading ? 0.7 : 1,
                          cursor: isLoading ? "not-allowed" : "pointer",
                        }}
                      >
                        {isLoading && <div className="login-spinner"></div>}
                        {isLoading ? "Resetting..." : "Reset Password"}
                      </button>
                    </div>
                  </form>
                )}

                {step === "done" && (
                  <div>
                    <p className="tag" style={{ marginBottom: "16px" }}>
                      Your password has been reset successfully. You can now log in with your new
                      password.
                    </p>
                    <div className="d-grid gap-2">
                      <button className="login-btn" type="button" onClick={() => router.push("/login")}>
                        Back to Login
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {step !== "done" && (
              <p className="go-to-register">
                Remembered your password? <Link href="/login" className="link-to-register"> Login </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
