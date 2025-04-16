import React, { useState } from "react";
import "./Admin.css";
import logo from "../../Assets/logo.png";
import LoginSide from "../UserPanel/LoginSide";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState("password");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/user/adminregister",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await response.json(); // ✅ Now, safely parse JSON
      alert("Registration successful");
      navigate("/adminlogin");
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  return (
    <div className="login">
      <div className="login-left">
        <div className="login-top">
          <img src={logo} alt="logo" className="login-logo" />
          <h3 className="register-head">Register to Admin Dashboard</h3>

          <div className="login-mid">
            <form onSubmit={handleFormSubmit}>
              <label className="login-label">
                Name<span className="star">*</span>
              </label>
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your Name"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <label className="login-label">
                Email ID<span className="star">*</span>
              </label>
              <div className="input-group mb-2">
                <input
                  type="email"
                  className="form-control"
                  placeholder="abc@gmail.com"
                  name="email"
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
              <div className="d-grid gap-2">
                <button className="admin-login" type="submit">
                  Register
                </button>
              </div>
            </form>
          </div>

          <p className="login-link" style={{ paddingTop: "10px" }}>
            Do you have an account with Hachion?
            <Link to="/adminlogin" className="link-to">
              Click here to Login
            </Link>
          </p>
        </div>
      </div>
      <LoginSide />
    </div>
  );
};

export default AdminRegister;
