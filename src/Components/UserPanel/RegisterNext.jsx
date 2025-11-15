import React, { useState, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import PopupInterest1 from './PopupInterest1';
import PopupInterest2 from './PopupInterest2';
import PopupInterest3 from './PopupInterest3';
import PopupInterest4 from './PopupInterest4';
import axios from "axios";
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import Footer from './Footer';
import StickyBar from './StickyBar';
import { MdKeyboardArrowRight } from 'react-icons/md';
import LoginBanner from '../../Assets/loginbackground.webp';

const RegisterNext = () => {
  const [otp, setOtp] = useState(Array(4).fill("")); 
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordType, setPasswordType] = useState('password');
  const [confirmPasswordType, setConfirmPasswordType] = useState('password');
  const [resendLoading, setResendLoading] = useState(false); 
  const navigate = useNavigate();
  const [messageType, setMessageType] = useState("");
  const userDataString = localStorage.getItem('registeruserData');
  const registeruserData = userDataString ? JSON.parse(userDataString) : {  email: '' };
const [registerMessage, setRegisterMessage] = useState("");
const [showInterestPopup, setShowInterestPopup] = useState(false);
const [popupStep, setPopupStep] = useState(1);
const [errors, setErrors] = useState({});
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
  whereYouHeard: ""
});


function nukeAvatarCookies() {
  const variants = [
    "avatar=; Path=/; Max-Age=0",
    "avatar=; Domain=hachion.co; Path=/; Max-Age=0",
    "avatar=; Domain=.hachion.co; Path=/; Max-Age=0",
    "avatar=; Domain=hachion.co; Path=/; Max-Age=0; Secure; SameSite=Lax",
    "avatar=; Domain=.hachion.co; Path=/; Max-Age=0; Secure; SameSite=Lax",
  ];
  variants.forEach(v => (document.cookie = v));
  localStorage.removeItem("avatar");
}

const handleFormChange = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));
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
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };


const verifyAccount = async (otpArray) => {
  const otp = otpArray.join("");

  if (!otp) {
    setRegisterMessage("Please fill in all fields");
    setMessageType("error");
    return;
  }

  setIsLoading(true);

  try {
    
    const verifyResponse = await fetch("https://api.test.hachion.co/api/v1/user/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: registeruserData.email,
        otp: otp,
      }),
    });

    if (!verifyResponse.ok) {
      const error = await verifyResponse.text();
      setRegisterMessage(`Invalid OTP: ${error}`);
      setMessageType("error");
      throw error;
    }

    
    const registerResponse = await fetch("https://api.test.hachion.co/api/v1/user/register", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: registeruserData.firstName,
        lastName:  registeruserData.lastName,
        email:     registeruserData.email,
        country:   registeruserData.country,
        mobile:    registeruserData.mobile,
        mode:      "Online",
        password:  registeruserData.password,
        confirmPassword: confirmPassword
      }),
    });

    const message = await registerResponse.text();

    if (!registerResponse.ok) {
      setRegisterMessage(message || "Registration failed");
      setMessageType("error");
      throw message || "Registration failed";
    }

    
    setRegisterMessage("You are successfully registered!");
    setMessageType("success");

    nukeAvatarCookies();
    localStorage.removeItem("pendingOAuth");

    const fullName =
      `${registeruserData.firstName || ""} ${registeruserData.lastName || ""}`.trim() || "User";
    const toStore = { name: fullName, email: registeruserData.email };

    localStorage.setItem("loginuserData", JSON.stringify(toStore));
    console.log("[register] wrote loginuserData:", toStore);

    
    window.dispatchEvent(new Event("storage"));

    setTimeout(() => {
      setShowInterestPopup(true);
    }, 1000);
  } catch (error) {
    const msg = typeof error === "string" ? error : error.message || "An unexpected error occurred";
    setRegisterMessage(msg);
  } finally {
    setIsLoading(false);
  }
};

  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordType(confirmPasswordType === 'password' ? 'text' : 'password');
  };
 
  const resendOtp = async () => {
    if (resendLoading) return;
    setResendLoading(true);

    const email = registeruserData.email; 

    try {
      const response = await fetch(`https://api.test.hachion.co/api/v1/user/regenerate-otp?email=${email}`, {
        method: "PUT",
      });

      if (response.ok) {
        setRegisterMessage("OTP sent successfully!");
        setMessageType("success");
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
  const fullName =
    `${registeruserData.firstName || ""} ${registeruserData.lastName || ""}`.trim() || "User";

  nukeAvatarCookies();
  localStorage.removeItem("pendingOAuth");

  const toStore = { name: fullName, email: registeruserData.email };
  localStorage.setItem("loginuserData", JSON.stringify(toStore));
  console.log("[register] wrote loginuserData on skip:", toStore);

  window.dispatchEvent(new Event("storage"));

  localStorage.setItem("user", JSON.stringify(registeruserData));
  navigate("/");
};


const handleNext = () => setPopupStep(prev => prev + 1);
const handleBack = () => setPopupStep(prev => prev - 1);


const handleSubmitPopup = async () => {
  try {
    const profileResponse = await axios.get(
      `https://api.test.hachion.co/api/v1/user/myprofile?email=${registeruserData.email}`
    );
    const profileData = profileResponse.data;

    nukeAvatarCookies();
    localStorage.removeItem("pendingOAuth");

    
    const nameFromServer = profileData.name && String(profileData.name).trim();
    const localName =
      nameFromServer ||
      `${registeruserData.firstName || ""} ${registeruserData.lastName || ""}`.trim() ||
      "User";

    const loginUser = {
      name:  localName,
      email: profileData.email || registeruserData.email
    };

    localStorage.setItem("loginuserData", JSON.stringify(loginUser));
    console.log("[register] updated loginuserData from profile:", loginUser);

    
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
      whereYouHeard: formData.whereYouHeard || ""
    };

    await axios.post("https://api.test.hachion.co/popup-onboarding", payload);

    localStorage.setItem("userPreferences", JSON.stringify(payload));
    localStorage.setItem("user", JSON.stringify(registeruserData));

    navigate("/");
  } catch (err) {
    console.error("Error saving onboarding:", err);
  }
};

  return (
    <>
    <div className='home-background'>
        <Topbar />
        <NavbarTop />
        <div className='container'>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="/">Home</a> <MdKeyboardArrowRight />
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Enter OTP
                      </li>
                    </ol>
                  </nav>
                </div>
            <img src={LoginBanner} alt='Login Banner' className='login-banner'/>
    <div className='login container'>
      <div className="login-left">
        <div className="login-top">
          <h4 className="login-continue">Register to start learning</h4>
          <div className="otp-verify">
            {/* <p className='tag'>Please check your inbox</p> */}
            <div className='tag'> Please check your inbox OTP  has been sent to</div>
            <div className='tag'>
            <span className='mail-to-register'>{registeruserData.email}</span>
            </div>
            <div className="otp">
  {otp.map((digit, index) => (
    <input
      key={index}
      id={`otp-input-${index}`} 
      className="otp-number"
      type="text"
      maxLength="1"
      value={digit}
      onChange={(e) => handleOtpChange(e, index)}
    />
  ))}
</div>
            
            <button
              type="button"
              className="register-btn"
              onClick={() => verifyAccount(otp)}
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify and Register"}
            </button>
            {errors.otp && <p className="error-field-message">{errors.otp}</p>}
            {registerMessage && (
              <div
                style={{
                  color: messageType === "success" ? "green" : "red",
                  marginTop: "5px",
                  marginBottom: "5px"
                }}
              >
                {registerMessage}
            </div>
          )}
            <div className='go-to-register'>
                  <span className='link-to-register' onClick={resendOtp}>
                    {resendLoading ? "Resending..." : "Resend OTP"}
                  </span>
                </div>
                </div>
            <p className='spam-msg'><span className="note">*Note :</span>If you don't see OTP in your inbox, Kindly check your spam folder.</p>
          </div>
        </div>

      {showInterestPopup && (
  <>
    {popupStep === 1 && (
      <PopupInterest1
        formData={formData}
        onChange={handleFormChange}
        onNext={handleNext}
        onSkip={handleSkip}
      />
    )}
    {popupStep === 2 && (
      <PopupInterest2
        formData={formData}
        onChange={handleFormChange}
        onNext={handleNext}
        onBack={handleBack}
      />
    )}
    {popupStep === 3 && (
      <PopupInterest3
        formData={formData}
        onChange={handleFormChange}
        onNext={handleNext}
        onBack={handleBack}
      />
    )}
    {popupStep === 4 && (
      <PopupInterest4
        formData={formData}
        onChange={handleFormChange}
        onSubmit={handleSubmitPopup}
        onBack={handleBack}
      />
    )}
  </>
)}
    </div>
    {/* <Footer />
      <StickyBar /> */}
      </div>
    </>
  );
};

export default RegisterNext;
