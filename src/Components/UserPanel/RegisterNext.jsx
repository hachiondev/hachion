import React, { useState, useEffect } from 'react';
import './Login.css';
import logo from '../../Assets/logo.png';
import LoginSide from './LoginSide';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import PopupInterest1 from './PopupInterest1';
import PopupInterest2 from './PopupInterest2';
import PopupInterest3 from './PopupInterest3';
import PopupInterest4 from './PopupInterest4';
import axios from "axios";
import TopBarNew from './TopBarNew';
import NavBar from './NavBar';
import Footer from './Footer';
import StickyBar from './StickyBar';
import { MdKeyboardArrowRight } from 'react-icons/md';
import LoginBanner from '../../Assets/loginbackground.png';

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

const verifyAccount = async (otpArray, password, confirmPassword) => {
    const otp = otpArray.join(""); 

    if (!otp || !password || !confirmPassword) {
        setRegisterMessage("Please fill in all fields");
        setMessageType("error");
        return;
    }

    if (password !== confirmPassword) {
        setRegisterMessage("Passwords do not match");
        setMessageType("error");
        return;
    }

    setIsLoading(true);

    try {
        
        const verifyResponse = await fetch("https://api.hachion.co/api/v1/user/verify-otp", {
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

        
        const registerResponse = await fetch("https://api.hachion.co/api/v1/user/register", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName: registeruserData.firstName,
                lastName: registeruserData.lastName,
                email: registeruserData.email,
                country: registeruserData.country,
                mobile: registeruserData.mobile,
                mode: "Online",
                password: password,
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
        setTimeout(() => {
          setShowInterestPopup(true);
        }, 1000);
    } catch (error) {
        const msg = typeof error === "string" ? error : error.message || "An unexpected error occurred";
        setRegisterMessage(msg);
        // setTimeout(() => navigate('/login'), 5000);
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
      const response = await fetch(`https://api.hachion.co/api/v1/user/regenerate-otp?email=${email}`, {
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
  localStorage.setItem("user", JSON.stringify(registeruserData));
  navigate("/");
};

const handleNext = () => setPopupStep(prev => prev + 1);
const handleBack = () => setPopupStep(prev => prev - 1);


const handleSubmitPopup = async () => {
  
   try {
    
    const profileResponse = await axios.get(
      `https://api.hachion.co/api/v1/user/myprofile?email=${registeruserData.email}`
    );

    const profileData = profileResponse.data;

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

    await axios.post("https://api.hachion.co/popup-onboarding", payload);

    
    localStorage.setItem("userPreferences", JSON.stringify(payload));
    localStorage.setItem("user", JSON.stringify(registeruserData));

    
    navigate("/");
  } catch (err) {
    console.error("Error saving onboarding:", err);
  }
};
  return (
    <>
        <TopBarNew />
        <NavBar />
        <div className='blogs-header'>
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
    <div className="login">
      <div className="login-left">
        <div className="login-top">
          <h4 className="login-continue">Register to start learning</h4>
          <div className="otp-verify">
            <p className='tag'>Please check your inbox</p>
            <p className='tag'>OTP has been sent to<span className='mail-to-register'>{registeruserData.email}</span></p>
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
            <p className='go-to-register'> Didn't receive the OTP? <span className='link-to-register' onClick={resendOtp}> 
              {resendLoading ? "Resending..." : "Resend"}</span>
            </p>
            
            <button
              type="button"
              className="register-btn"
              onClick={() => verifyAccount(otp)}
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify and Register"}
            </button>
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
    <Footer />
      <StickyBar />
    </>
  );
};

export default RegisterNext;
