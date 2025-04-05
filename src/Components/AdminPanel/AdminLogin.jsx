import React, { useState } from "react";
import "./Admin.css";
import logo from "../../Assets/logo.png";
import LoginSide from "../UserPanel/LoginSide";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const AdminLogin = () => {
  const navigate = useNavigate();

  // State for form inputs and error message
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password"); // For toggling password visibility
  const [errorMessage, setErrorMessage] = useState("");

  const apiUrl = process.env.REACT_APP_API_URL; // Get API URL from environment variables

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://api.hachion.co/api/v1/user/adminlogin",
        { email, password }
      );

      if (response.status === 200 && response.data.status) {
        // Store login state
        localStorage.setItem("isAdminLoggedIn", "true");
        localStorage.setItem("adminEmail", email); // Store admin email

        console.log("Login successful, navigating to dashboard...");
        navigate("/admindashboardview"); // Redirect to dashboard
      } else {
        setErrorMessage(
          response.data.message || "Login failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage(error.response?.data?.message || "Invalid credentials");
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  return (
    <div className="login">
      <div className="login-left">
        <div className="login-top">
          <img src={logo} alt="logo" className="login-logo" />
          <h3 className="welcome-back">Welcome back!</h3>
          <h4 className="login-continue">Login to Admin Dashboard</h4>

          <div className="login-mid">
            <form onSubmit={handleFormSubmit}>
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
                  required
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
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  className="input-group-text"
                  onClick={togglePasswordVisibility}
                >
                  {passwordType === "password" ? (
                    <AiFillEyeInvisible />
                  ) : (
                    <AiFillEye />
                  )}
                </button>
              </div>
              {errorMessage && <p className="error-message">{errorMessage}</p>}{" "}
              {/* Error message display */}
              <Link to="/adminforgot" style={{ textDecoration: "none" }}>
                <p className="forgot-password">Forgot Password?</p>
              </Link>
              <div className="d-grid gap-2">
                <button className="admin-login" type="submit">
                  Login
                </button>
              </div>
            </form>
          </div>

          <p className="go-to-register">
            Don't have an account?{" "}
            <Link to="/adminregister" className="link-to-register">
              {" "}
              Register{" "}
            </Link>
          </p>
        </div>
      </div>
      <LoginSide />
    </div>
  );
};

export default AdminLogin;
