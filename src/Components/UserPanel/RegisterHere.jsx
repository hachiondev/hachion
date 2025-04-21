import React, { useState,useRef } from "react";
import "./Login.css";
import logo from "../../Assets/logo.png";
import LoginSide from "./LoginSide";
import { Link, useNavigate } from "react-router-dom";
import { Menu, MenuItem, Button } from '@mui/material';
import Flag from 'react-world-flags';
import {AiFillCaretDown } from 'react-icons/ai'

const RegisterHere = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile,setMobile]=useState("");
  const [isLoading, setIsLoading] = useState(false); // For loading state
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const mobileInputRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState({
    code: '+91',
    flag: 'IN',
    name: 'India',
  });

  const countries = [
    { name: 'India', code: '+91', flag: 'IN' },
    { name: 'United States', code: '+1', flag: 'US' },
    { name: 'United Kingdom', code: '+44', flag: 'GB' },
    { name: 'Thailand', code: '+66', flag: 'TH' },
    { name: 'Canada', code: '+1', flag: 'CA' },
    { name: 'Australia', code: '+61', flag: 'AU' },
    { name: 'Germany', code: '+49', flag: 'DE' },
    { name: 'France', code: '+33', flag: 'FR' },
    { name: 'United Arab Emirates', code: '+971', flag: 'AE' },
    { name: 'Qatar', code: '+974', flag: 'QA' },
    { name: 'Japan', code: '+81', flag: 'JP' },
    { name: 'China', code: '+86', flag: 'CN' },
    { name: 'Russia', code: '+7', flag: 'RU' },
    { name: 'South Korea', code: '+82', flag: 'KR' },
    { name: 'Brazil', code: '+55', flag: 'BR' },
    { name: 'Mexico', code: '+52', flag: 'MX' },
    { name: 'South Africa', code: '+27', flag: 'ZA' },
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


  // Basic email validation regex
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleClick = async () => {
    if (!name || !email || !mobile) {
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
      mobile
      
    };

    try {
      const response = await fetch("/HachionUserDashboad/api/v1/user/send-otp?email=" + email, {
        method: "POST", // Assuming POST request for OTP
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      localStorage.setItem("registeruserData", JSON.stringify({
        name,
        email,
       mobile 
      }));
      const contentType = response.headers.get("Content-Type");
  
      if (response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const responseData = await response.json();
        
          if (responseData && responseData.otp) {
            alert('OTP sent to your email');
            
            console.log("Stored in LocalStorage:", localStorage.getItem("registeruserData"));
           
          } else {
            alert("Failed to send OTP. Please try again.");
          }
        } else {
          const responseText = await response.text();
          alert(`Error: ${responseText}`);
        }
      } else {
        const responseText = await response.text();
        alert(`Error: ${responseText}`);
      }
    } catch (error) {
      alert(`An error occurred: ${error.message}`);
    } finally {
      navigate("/registerverification");
      setIsLoading(false); // End loading state
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
            <label className="login-label">
                  Mobile Number<span className="star">*</span>
                </label>
                <div className="input-group mb-3 custom-width">
                  <div className="input-group">
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
                      value={mobile}
                      onChange={(e)=>setMobile(e.target.value)}
                    
                      placeholder="Enter your mobile number"
                    />
                  </div>
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
