"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import PopupInterest1 from "@/components/UserPanel/PopupInterest1";
import PopupInterest2 from "@/components/UserPanel/PopupInterest2";
import PopupInterest3 from "@/components/UserPanel/PopupInterest3";
import PopupInterest4 from "@/components/UserPanel/PopupInterest4";
import { MdKeyboardArrowRight } from "react-icons/md";
import LoginBanner from "@/assets/loginbackground.webp";
import "./LoginSection/Login.css";

const OTP_LENGTH = 4;

// Ported from the CRA app's src/Components/UserPanel/HomePage/AuthSection/RegisterNext.jsx
// (Sign Up's final step — OTP verification + account creation, mapped to
// /registerverification on the live site). Dropped 3 leftover debug
// console.log calls from the original's verifyAccount/handleSkip/
// handleSubmitPopup.
const RegisterNext = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [showInterestPopup, setShowInterestPopup] = useState(false);
  const [popupStep, setPopupStep] = useState(1);
  const [formData, setFormData] = useState({
    role: "",
    otherRole: "",
    goal: "",
    interests: [],
    learningMethods: [],
    trainingMode: "",
    skillLevel: "",
    lookingForJob: "",
    realTimeProjects: "",
    certificationOrPlacement: "",
    speakToCourseAdvisor: "",
    whereYouHeard: "",
  });

  const getRegisterUserData = () => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("registeruserData") : null;
    return raw ? JSON.parse(raw) : { email: "" };
  };
  const registeruserData = getRegisterUserData();

  function nukeAvatarCookies() {
    const variants = [
      "avatar=; Path=/; Max-Age=0",
      "avatar=; Domain=hachion.co; Path=/; Max-Age=0",
      "avatar=; Domain=.hachion.co; Path=/; Max-Age=0",
      "avatar=; Domain=hachion.co; Path=/; Max-Age=0; Secure; SameSite=Lax",
      "avatar=; Domain=.hachion.co; Path=/; Max-Age=0; Secure; SameSite=Lax",
    ];
    variants.forEach((v) => (document.cookie = v));
    localStorage.removeItem("avatar");
  }

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 1) {
      setOtp((prev) => {
        const newOtp = [...prev];
        newOtp[index] = value;
        return newOtp;
      });
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`)?.focus();
      }
    }
  };

  const verifyAccount = async (otpArray) => {
    setEmailExists(false);
    const otpJoined = otpArray.join("");
    if (otpJoined.length !== OTP_LENGTH) {
      setRegisterMessage(`Please enter all ${OTP_LENGTH} digits`);
      setMessageType("error");
      return;
    }
    setIsLoading(true);
    try {
      const verifyResponse = await fetch(`https://api.hachion.co/api/v1/user/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registeruserData.email, otp: otpJoined }),
      });
      if (!verifyResponse.ok) {
        const error = await verifyResponse.text();
        // Don't hardcode an "Invalid OTP:" prefix — /verify-otp also returns
        // unrelated failures as 400 (e.g. "Email does not exist in the
        // database."), and prefixing those produced a misleading
        // "Invalid OTP: Email does not exist..." message. Surface the
        // backend's own text as-is, matching how ForgotPassword.jsx and
        // RegisterHere.jsx already surface /verify-otp and /send-otp errors.
        setRegisterMessage(error || "Invalid OTP. Please try again.");
        setMessageType("error");
        setIsLoading(false);
        return;
      }
      const registerResponse = await fetch(`https://api.hachion.co/api/v1/user/register`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: registeruserData.firstName,
          lastName: registeruserData.lastName,
          email: registeruserData.email,
          country: registeruserData.country,
          mobile: registeruserData.mobile,
          mode: "Online",
          password: registeruserData.password,
          confirmPassword: registeruserData.password,
        }),
      });
      const message = await registerResponse.text();
      if (!registerResponse.ok) {
        if (typeof message === "string" && message.toLowerCase().includes("email already exists")) {
          setEmailExists(true);
          setRegisterMessage("This email is already registered. Please log in, or use another email address.");
          setMessageType("error");
          // Frontend workaround: try to fetch profile and if found, treat as existing user and complete login locally.
          try {
            const profileResp = await fetch(`https://api.hachion.co/api/v1/user/myprofile?email=${registeruserData.email}`);
            if (profileResp.ok) {
              const profileData = await profileResp.json();
              const fullName = (profileData.name && String(profileData.name).trim()) || `${registeruserData.firstName || ""} ${registeruserData.lastName || ""}`.trim() || "User";
              const toStore = {
                name: fullName,
                email: profileData.email || registeruserData.email,
              };
              localStorage.setItem("loginuserData", JSON.stringify(toStore));
              window.dispatchEvent(new Event("storage"));
              setEmailExists(false);
              setRegisterMessage("Existing account detected — you are now logged in.");
              setMessageType("success");
              nukeAvatarCookies();
              setIsLoading(false);
              setTimeout(() => setShowInterestPopup(true), 800);
              return;
            }
          } catch (e) {
            console.error("Profile fetch after email-exists failed:", e);
          }
          setIsLoading(false);
          return;
        }
        setRegisterMessage(message || "Registration failed");
        setMessageType("error");
        setIsLoading(false);
        return;
      }
      setRegisterMessage("You are successfully registered!");
      setMessageType("success");
      nukeAvatarCookies();
      localStorage.removeItem("pendingOAuth");
      const fullName = `${registeruserData.firstName || ""} ${registeruserData.lastName || ""}`.trim() || "User";
      localStorage.setItem("loginuserData", JSON.stringify({ name: fullName, email: registeruserData.email }));
      window.dispatchEvent(new Event("storage"));
      setTimeout(() => setShowInterestPopup(true), 1000);
    } catch (error) {
      setRegisterMessage(typeof error === "string" ? error : error?.message || "An unexpected error occurred");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (resendLoading) return;
    setResendLoading(true);
    setEmailExists(false);
    try {
      const response = await fetch(
        `https://api.hachion.co/api/v1/user/regenerate-otp?email=${encodeURIComponent(registeruserData.email)}`,
        { method: "PUT" }
      );
      if (response.ok) {
        setRegisterMessage("OTP sent successfully!");
        setMessageType("success");
        // The previously-entered digits are for an OTP the backend just
        // overwrote server-side (regenerate-otp always issues a fresh code)
        // — leaving them on screen invites the user to resubmit a now-stale
        // OTP and get a confusing "Invalid OTP" error. Clear + refocus,
        // matching ForgotPassword.jsx's handleResendOtp.
        setOtp(Array(OTP_LENGTH).fill(""));
        document.getElementById("otp-input-0")?.focus();
      } else {
        const error = await response.text();
        throw new Error(error || "Failed to resend OTP");
      }
    } catch (error) {
      setRegisterMessage(error.message);
      setMessageType("error");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSkip = () => {
    const fullName = `${registeruserData.firstName || ""} ${registeruserData.lastName || ""}`.trim() || "User";
    nukeAvatarCookies();
    localStorage.removeItem("pendingOAuth");
    localStorage.setItem("loginuserData", JSON.stringify({ name: fullName, email: registeruserData.email }));
    window.dispatchEvent(new Event("storage"));
    localStorage.setItem("user", JSON.stringify(registeruserData));
    router.push("/");
  };

  const handleNext = () => setPopupStep((prev) => prev + 1);
  const handleBack = () => setPopupStep((prev) => prev - 1);

  const handleSubmitPopup = async () => {
    try {
      const profileResponse = await axios.get(`https://api.hachion.co/api/v1/user/myprofile?email=${registeruserData.email}`);
      const profileData = profileResponse.data;
      nukeAvatarCookies();
      localStorage.removeItem("pendingOAuth");
      const nameFromServer = profileData.name && String(profileData.name).trim();
      const localName = nameFromServer || `${registeruserData.firstName || ""} ${registeruserData.lastName || ""}`.trim() || "User";
      localStorage.setItem(
        "loginuserData",
        JSON.stringify({ name: localName, email: profileData.email || registeruserData.email })
      );
      window.dispatchEvent(new Event("storage"));
      const payload = {
        studentId: profileData.studentId || "STU123",
        studentName: profileData.name || "Lakshmi",
        studentEmail: profileData.email || "abc@gmail.com",
        mobile: profileData.mobile || "8106447416",
        currentRole: formData.role === "Other" ? formData.otherRole : formData.role,
        primaryGoal: formData.goal,
        areasOfInterest: formData.interests.join(", "),
        preferToLearn: formData.learningMethods,
        preferredTrainingMode: formData.trainingMode,
        currentSkill: formData.skillLevel,
        lookingForJob: formData.lookingForJob || "",
        realTimeProjects: formData.realTimeProjects || "",
        certificationOrPlacement: formData.certificationOrPlacement || "",
        speakToCourseAdvisor: formData.speakToCourseAdvisor || "",
        whereYouHeard: formData.whereYouHeard || "",
      };
      await axios.post(`https://api.hachion.co/popup-onboarding`, payload);
      localStorage.setItem("userPreferences", JSON.stringify(payload));
      localStorage.setItem("user", JSON.stringify(registeruserData));
      router.push("/");
    } catch (err) {
      console.error("Error saving onboarding:", err);
    }
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
              Enter OTP
            </li>
          </ol>
        </nav>
      </div>
      <Image src={LoginBanner} alt="Login Banner" className="login-banner" priority />
      <div className="login container">
        <div className="login-left">
          <div className="login-top">
            <h1 className="login-continue">Register to start learning</h1>
            <div className="otp-verify">
              <div className="tag">Please check your inbox OTP has been sent to</div>
              <div className="tag">
                <span className="mail-to-register">{registeruserData.email}</span>
              </div>
              <div className="otp">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    className="otp-number"
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    aria-label={`OTP digit ${index + 1}`}
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                  />
                ))}
              </div>

              <button type="button" className="register-btn" onClick={() => verifyAccount(otp)} disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify and Register"}
              </button>
              {registerMessage && (
                <div style={{ color: messageType === "success" ? "green" : "red", marginTop: "5px", marginBottom: "5px" }}>
                  {registerMessage}
                  {emailExists && (
                    <>
                      {" "}
                      <Link href="/login" className="link-to-register">Log in</Link>
                    </>
                  )}
                </div>
              )}
              <div className="go-to-register">
                <button
                  type="button"
                  className="link-to-register"
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                  onClick={resendOtp}
                  disabled={resendLoading}
                >
                  {resendLoading ? "Resending..." : "Resend OTP"}
                </button>
              </div>
            </div>
            <p className="spam-msg">
              <span className="note">*Note :</span> If you don&apos;t see OTP in your inbox, kindly check your spam folder.
            </p>
          </div>
        </div>

        {showInterestPopup && (
          <>
            {popupStep === 1 && (
              <PopupInterest1 formData={formData} onChange={handleFormChange} onNext={handleNext} onSkip={handleSkip} />
            )}
            {popupStep === 2 && (
              <PopupInterest2 formData={formData} onChange={handleFormChange} onNext={handleNext} onBack={handleBack} />
            )}
            {popupStep === 3 && (
              <PopupInterest3 formData={formData} onChange={handleFormChange} onNext={handleNext} onBack={handleBack} />
            )}
            {popupStep === 4 && (
              <PopupInterest4 formData={formData} onChange={handleFormChange} onSubmit={handleSubmitPopup} onBack={handleBack} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterNext;
