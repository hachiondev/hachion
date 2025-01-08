import React, { useState, useRef } from "react";
import "./Login.css";
import "./Course.css";
import logo from "../../Assets/logo.png";
import LoginSide from "./LoginSide";
import { useFormik } from "formik";
import { LoginSchema } from "../Schemas";
import { Link, useNavigate } from "react-router-dom";
import { Menu, MenuItem, Button } from "@mui/material";
import Flag from "react-world-flags";
import { AiFillCaretDown } from "react-icons/ai";

const RegisterHere = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const mobileInputRef = useRef(null);

  const [selectedCountry, setSelectedCountry] = useState({
    code: "+91",
    flag: "IN",
    name: "India",
  });

  const countries = [
    { name: "India", code: "+91", flag: "IN" },
    { name: "United States", code: "+1", flag: "US" },
    { name: "United Kingdom", code: "+44", flag: "GB" },
    { name: "Thailand", code: "+66", flag: "TH" },
  ];

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    closeMenu();
    mobileInputRef.current?.focus();
  };

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/user/send-otp?email=${values.email}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          if (responseData && responseData.otp) {
            localStorage.setItem(
              "registeruserData",
              JSON.stringify({ ...values, otp: responseData.otp })
            );
            alert("OTP sent to your email!");
            navigate("/registerverification");
          } else {
            alert("Failed to send OTP. Please try again.");
          }
        } else {
          alert("Failed to send OTP.");
        }
      } catch (error) {
        alert(`An error occurred: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    formik;

  return (
    <div className="login">
      <div className="login-left">
        <div className="login-top">
          <img src={logo} alt="logo" className="login-logo" />
          <h3 className="register-learning">Register to start learning</h3>

          <div className="steps">
            <h4 className="steps-head">Steps:</h4>
            <div className="step-one">
              <h6 className="steps-head-one">1</h6>
            </div>
            <hr width="55%" size="1" color="#00AAEF" />
            <div className="step-two">
              <h6 className="steps-head-two">2</h6>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <label className="login-label">
              Full Name<span className="star">*</span>
            </label>
            <div className="input-group mb-2">
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-control"
            />
            </div>
            {errors.name && touched.name && (
              <p className="form-error">{errors.name}</p>
            )}

            <label className="login-label">
              Email ID<span className="star">*</span>
            </label>
            <div className="input-group mb-2">
            <input
              type="email"
              name="email"
              placeholder="abc@gmail.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-control"
            />
            </div>
            {errors.email && touched.email && (
              <p className="form-error">{errors.email}</p>
            )}

            <label className="login-label">
              Mobile Number<span className="star">*</span>
            </label>
            <div className="input-group mb-3 custom-width">
              <Button
                variant="outlined"
                onClick={openMenu}
                className="country-dropdown"
                endIcon={<AiFillCaretDown />}
              >
                <Flag code={selectedCountry.flag} className="country-flag" />
                {selectedCountry.code}
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeMenu}
              >
                {countries.map((country) => (
                  <MenuItem
                    key={country.code}
                    onClick={() => handleCountrySelect(country)}
                  >
                    <Flag code={country.flag} className="country-flag" />
                    {country.name} ({country.code})
                  </MenuItem>
                ))}
              </Menu>

              <input
                      type="tel"
                      className="mobilenumber"
                      ref={mobileInputRef}
                      name="mobile"
                      aria-label="Text input with segmented dropdown button"
                      id="register"
                      value={values.mobile}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your mobile number"
                    />
                  </div>
            {errors.mobile && touched.mobile && (
              <p className="form-error">{errors.mobile}</p>
            )}

            <button
              type="submit"
              className="register-btn"
              disabled={isLoading}
            >
              {isLoading ? "Sending OTP..." : "Verify"}
            </button>
          </form>

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
