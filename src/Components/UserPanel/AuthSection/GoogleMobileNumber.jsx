import React, { useEffect, useRef, useState } from "react";
import "./LoginSection/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { Menu, MenuItem } from "@mui/material";
import Flag from "react-world-flags";
import { AiFillCaretDown } from "react-icons/ai";
import { countries, getDefaultCountry } from "../../../countryUtils";
import LoginBanner from "../../../Assets/loginbackground.webp";
import { MdKeyboardArrowRight } from "react-icons/md";

const GoogleMobileNumber = () => {
  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const mobileInputRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());

  function getCookie(name) {
    const m = document.cookie.match(
      new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
    );
    return m ? decodeURIComponent(m[1]) : null;
  }

  useEffect(() => {
    fetch("https://api.country.is")
      .then((res) => res.json())
      .then((data) => {
        data.country_code = (data.country || "").toUpperCase();
        const userCountryCode = data?.country_code;
        const matchedCountry = countries.find((c) => c.flag === userCountryCode);
        if (matchedCountry) setSelectedCountry(matchedCountry);
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (isChecked) {
      setWhatsapp(mobile);
    }
  }, [mobile, isChecked]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setAnchorEl(null);
    mobileInputRef.current?.focus();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(mobile)) {
      newErrors.mobile = "Enter a valid mobile number (10 digits).";
    }
    if (!whatsapp.trim()) {
      newErrors.whatsapp = "Whatsapp number is required.";
    } else if (!/^\d{10}$/.test(whatsapp)) {
      newErrors.whatsapp = "Enter a valid mobile number (10 digits).";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClick = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    const sanitizedMobile = mobile.trim().replace(/^(\+)?/, "");
    const fullMobileNumber = `${selectedCountry.code} ${sanitizedMobile}`;

    const userData = {
      mobile: fullMobileNumber,
      whatsapp: whatsapp === mobile ? fullMobileNumber : `${selectedCountry.code} ${whatsapp.trim().replace(/^(\+)?/, "")}`,
      country: selectedCountry.name,
    };

    localStorage.setItem("registerStepFinal", JSON.stringify(userData));
    navigate("/");

    setIsLoading(false);
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
    if (!e.target.checked) {
      setWhatsapp("");
    } else {
      setWhatsapp(mobile);
    }
  };

  const handleWhatsappChange = (e) => {
    setWhatsapp(e.target.value);
    if (e.target.value !== mobile) {
      setIsChecked(false);
    } else {
      setIsChecked(true);
    }
  };

  return (
    <>
      <div className='home-background'>

        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Home</a> <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Enter Phone Number
              </li>
            </ol>
          </nav>
        </div>

        <img src={LoginBanner} alt="Login Banner" className="login-banner" />

        <div className='login container'>
          <div className="login-left">
            <div className="login-top">
              <h4 className="login-continue">Enter Phone Number</h4>
              <p className='forgotpassword-text'>We’ll use this number to send you course updates and verification messages.</p>
              <div className="login-mid">
                {/* Mobile */}
                <label className="login-label">
                  Phone Number<span className="star">*</span>
                </label>
                <div className="register-field">
                  <div className="password-field" style={{ position: "relative" }}>
                    <button
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      className="mobile-button"
                    >
                      <Flag
                        code={selectedCountry.flag}
                        className="country-flag me-1"
                      />
                      <span style={{ marginRight: "5px", fontSize: "small" }}>
                        {selectedCountry.flag} ({selectedCountry.code})
                      </span>
                      <AiFillCaretDown />
                    </button>

                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={() => setAnchorEl(null)}
                    >
                      {countries.map((country) => (
                        <MenuItem
                          key={country.code}
                          onClick={() => handleCountrySelect(country)}
                        >
                          <Flag code={country.flag} className="country-flag me-2" />
                          {country.name} ({country.code})
                        </MenuItem>
                      ))}
                    </Menu>

                    <input
                      type="tel"
                      className="form-control"
                      ref={mobileInputRef}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="Enter your mobile number"
                      style={{ paddingLeft: "120px", border: "none" }}
                      autoComplete="tel-national"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </div>
                  {errors.mobile && (
                    <p className="error-field-message">{errors.mobile}</p>
                  )}
                </div>

                <div className="confirm-number-label">
                  <input
                    className="confirm-number-check"
                    type="checkbox"
                    value=""
                    id="flexCheckChecked"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  <label className="confirm-number-label" htmlFor="flexCheckChecked">
                    Make sure this number is registered on WhatsApp
                  </label>
                </div>

                {/* Whatsapp */}
                <label className="login-label">
                  WhatsApp Number<span className="star">*</span>
                </label>
                <div className="register-field">
                  <div className="password-field" style={{ position: "relative" }}>
                    <button
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      className="mobile-button"
                    >
                      <Flag
                        code={selectedCountry.flag}
                        className="country-flag me-1"
                      />
                      <span style={{ marginRight: "5px", fontSize: "small" }}>
                        {selectedCountry.flag} ({selectedCountry.code})
                      </span>
                      <AiFillCaretDown />
                    </button>

                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={() => setAnchorEl(null)}
                    >
                      {countries.map((country) => (
                        <MenuItem
                          key={country.code}
                          onClick={() => handleCountrySelect(country)}
                        >
                          <Flag code={country.flag} className="country-flag me-2" />
                          {country.name} ({country.code})
                        </MenuItem>
                      ))}
                    </Menu>

                    <input
                      type="tel"
                      className="form-control"
                      ref={mobileInputRef}
                      value={whatsapp}
                      onChange={handleWhatsappChange}
                      placeholder="Enter your mobile number"
                      style={{ paddingLeft: "120px", border: "none" }}
                      autoComplete="tel-national"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      disabled={isChecked}
                    />
                  </div>
                  {errors.whatsapp && (
                    <p className="error-field-message">{errors.whatsapp}</p>
                  )}
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="button"
                    className="register-btn"
                    onClick={handleClick}
                    disabled={isLoading}
                  >
                    {isLoading ? "Confirming..." : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GoogleMobileNumber;