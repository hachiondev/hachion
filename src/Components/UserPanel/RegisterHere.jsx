import React, { useState } from "react";
import "./Login.css";
import logo from "../../Assets/logo.png";
import LoginSide from "./LoginSide";
import { Link, useNavigate } from "react-router-dom";

const RegisterHere = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false); // For loading state
  const navigate = useNavigate();

  // Basic email validation regex
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleClick = async () => {
    if (!name || !email) {
      alert("Please fill in both fields.");
      return;
    }
  
    if (!isValidEmail(email)) {
      alert("Please enter a valid email.");
      return;
    }
  
    setIsLoading(true); // Start loading state
  
    const data = {
      name,
      email,
    };
  
    try {
      const response = await fetch("http://localhost:8080/api/v1/user/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const contentType = response.headers.get("Content-Type");
  
      if (response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const responseData = await response.json();
          alert(`OTP sent to your email: ${responseData.message}`);
        } else {
          const responseText = await response.text();
          alert(`OTP sent to your email: ${responseText}`);
        }
  
        // Store user data in localStorage and navigate
        localStorage.setItem("userData", JSON.stringify({ name, email }));
        navigate("/registerverification");
      } else {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        } else {
          const errorText = await response.text();
          alert(`Error: ${errorText}`);
        }
      }
    } catch (error) {
      alert(`An error occurred: ${error.message}`);
    } finally {
      setIsLoading(false); // End loading state
    }
  };
  
  
  

  return (
    <div className="login">
      <div className="login-left">
        <div className="login-top">
          <img src={logo} alt="logo" className="login-logo" />
          <h3 className="register-learning">Register to start learning</h3>

          <div className="steps">
            <h4 className="steps-head">Steps: </h4>
            <div className="step-one">
              <h6 className="steps-head-one">1</h6>
            </div>
            <hr width="55%" size="1" color="#00AAEF" />
            <div className="step-two">
              <h6 className="steps-head-two">2</h6>
            </div>
          </div>

          <div className="login-mid-name">
            <label className="login-label">
              Full Name<span className="star">*</span>
            </label>
            <div className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                id="floatingName"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <label className="login-label">
              Email ID<span className="star">*</span>
            </label>
            <div className="input-group mb-2">
              <input
                type="email"
                className="form-control"
                id="floatingEmail"
                placeholder="abc@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="register-btn"
              onClick={handleClick}
              disabled={isLoading}
            >
              {isLoading ? "Sending OTP..." : "Verify"}
            </button>
          </div>

          <p className="login-with-hachion">
            Do you have an account with Hachion?{" "}
            <Link to="/login" className="link-to">
              Click here to Login
            </Link>
          </p>
        </div>
      </div>
      <LoginSide />
    </div>
  );
};

export default RegisterHere;