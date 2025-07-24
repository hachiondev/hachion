  import React, { useEffect, useRef, useState } from 'react';
  import "./Login.css";
  import logo from "../../Assets/logo.png";
  import LoginSide from "./LoginSide";
  import { Link, useNavigate } from "react-router-dom";
  import { Menu, MenuItem, Button } from '@mui/material';
  import Flag from 'react-world-flags';
  import {AiFillCaretDown } from 'react-icons/ai'
import { countries, getDefaultCountry } from '../../countryUtils';


  const RegisterHere = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile,setMobile]=useState("");
    const [isLoading, setIsLoading] = useState(false); 
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const mobileInputRef = useRef(null);
    const [otpMessage, setOtpMessage] = useState("");
    const [formError, setFormError] = useState("");
    
const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());

useEffect(() => {
  fetch("https://ipwho.is/")
    .then((res) => res.json())
    .then((data) => {
      const userCountryCode = data?.country_code;
      const matchedCountry = countries.find((c) => c.flag === userCountryCode);
      if (matchedCountry) {
        setSelectedCountry(matchedCountry);
      }
    })
    .catch(() => {});
}, []);
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

    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

const handleClick = async () => {
    setFormError("");
    setOtpMessage("");

    if (!firstName || !lastName || !email || !mobile) {
      setFormError("Please fill in all required fields.");
      return;
    }

    if (!isValidEmail(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (!/^\d{6,15}$/.test(mobile)) {
      setFormError("Please enter a valid mobile number (6–15 digits).");
      return;
    }

    setIsLoading(true);

const sanitizedMobile = mobile.trim().replace(/^(\+)?/, '');
const fullMobileNumber = `${selectedCountry.code} ${sanitizedMobile}`; // e.g., "+91 8106447416"


    const data = { firstName, lastName, email, mobile:fullMobileNumber, country: selectedCountry.name };

    try {
      const response = await fetch(
        `https://api.hachion.co/api/v1/user/send-otp?email=${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const contentType = response.headers.get("Content-Type");
      let responseData;

      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        responseData = { message: text };
      }

      console.log("OTP responseData:", responseData);

      if (response.ok && (responseData?.otp || responseData?.message?.includes("OTP"))) {
        setFormError("");
        setOtpMessage("OTP sent to your email.");
        localStorage.setItem("registeruserData", JSON.stringify(data));
        setTimeout(() => navigate('/registerverification'), 3000);
      } else {
        const errorMsg = responseData?.message || "Failed to send OTP. Please try again.";
        setFormError(errorMsg);
      }
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || error.response?.data || error.message;
      setFormError(`An error occurred: ${backendMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

    return (
      <div className="login">
        <div className="login-left">
          <div className="login-top">
            <img src={logo} alt="logo" className="login-logo" />
            <h3 className="register-learning">Register to start learning</h3>

            <div className='steps'>
      <h4 className='steps-head'>Steps: </h4>
      <div className='step-one'>
        <h6 className='steps-head-one'>1</h6>
  </div>
  <hr width='55%' size='1' color='#00AAEF'/>
  <div className='step-two'>
    <h6 className='steps-head-two'>2</h6>
  </div>
  </div>

            <div className="login-mid-name">
              <label className="login-label">
                First Name<span className="star">*</span>
              </label>
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  id="floatingName"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <label className="login-label">
                Last Name<span className="star">*</span>
              </label>
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  id="floatingName"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
              <label className="login-label">
                    Mobile Number<span className="star">*</span>
                  </label>
                  <div className="input-wrapper" style={{ position: 'relative' }}>
                     
                      <button
  variant="text"
  onClick={openMenu}
  className='mobile-button'
>
  <Flag code={selectedCountry.flag} className="country-flag me-1" />
  <span style={{ marginRight: '5px', fontWeight: 'bold' }}>
    {selectedCountry.flag} ({selectedCountry.code})
  </span>
  <AiFillCaretDown />
</button>

                      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
                        {countries.map((country) => (
                          <MenuItem key={country.code} onClick={() => handleCountrySelect(country)}>
                            <Flag code={country.flag} className="country-flag me-2" />
                            {country.name} ({country.code})
                          </MenuItem>
                        ))}
                      </Menu>
                      <input
                        type="tel"
                        className="form-control"
                        ref={mobileInputRef}
                        name="mobile"
                        aria-label="Text input with segmented dropdown button"
                        id="floatingName"
                        value={mobile}
                        onChange={(e)=>setMobile(e.target.value)}
                        placeholder="Enter your mobile number"
                        style={{
                        paddingLeft: '120px', border: '1px solid #d3d3d3'
                      }}
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
              {formError ? (
                  <div style={{ color: "red", marginTop: "5px", marginBottom: "5px" }}>
                    {formError}
                  </div>
                ) : otpMessage ? (
                  <div style={{ color: "green", marginTop: "5px", marginBottom: "5px"}}>
                    {otpMessage}
                  </div>
                ) : null}
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