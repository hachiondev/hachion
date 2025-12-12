import React, { useEffect, useRef, useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { Menu, MenuItem } from "@mui/material";
import Flag from "react-world-flags";
import { AiFillCaretDown } from "react-icons/ai";
import { countries, getDefaultCountry } from "../../../../../countryUtils";
import LoginBanner from "../../../../../Assets/loginbackground.webp";
import google from "../../../../../Assets/google-new.webp";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useTopBarApi } from "../../../../../Api/hooks/HomePageApi/useTopBarApi";
import { useUserMe } from "../../../../../Api/hooks/HomePageApi/RegisterApi/useUserMe";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const mobileInputRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());
  const { countryCode, isLoading: countryLoading } = useTopBarApi();
  const { data: user } = useUserMe(getCookie);

  function getCookie(name) {
    const m = document.cookie.match(
      new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
    );
    return m ? decodeURIComponent(m[1]) : null;
  }
  
  useEffect(() => {
    if (countryCode && !countryLoading) {
      const matchedCountry = countries.find((c) => c.flag === countryCode);
      if (matchedCountry) {
        setSelectedCountry(matchedCountry);
        console.log(`Country auto-detected: ${matchedCountry.name} (${countryCode})`);
      }
    }
  }, [countryCode, countryLoading]);


  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setAnchorEl(null);
    mobileInputRef.current?.focus();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(mobile)) {
      newErrors.mobile = "Enter a valid mobile number (10 digits).";
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
      firstName,
      lastName,
      email,
      mobile: fullMobileNumber,
      country: selectedCountry.name,
    };


    localStorage.setItem("registerStep1", JSON.stringify(userData));
    navigate("/registerhere");

    setIsLoading(false);
  };

  const SHARED_DOMAIN = "hachion.co";

  function setSharedCookie(name, value, maxAgeSeconds = 300) {

    document.cookie =
      `${name}=${encodeURIComponent(value)}; Domain=${SHARED_DOMAIN}; ` +
      `Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax; Secure`;
  }

  function clearCookieAllScopes(name) {

    document.cookie = `${name}=; Path=/; Max-Age=0`;

    document.cookie = `${name}=; Domain=${SHARED_DOMAIN}; Path=/; Max-Age=0; SameSite=Lax; Secure`;
  }
  const loginWithGoogle = () => {

    localStorage.removeItem("loginuserData");
    localStorage.removeItem("authToken");
    clearCookieAllScopes("flow");
    clearCookieAllScopes("auth_error");
    clearCookieAllScopes("avatar");
    setSharedCookie("flow", "signup", 300);
    console.log("doc.cookie now:", document.cookie);

    setTimeout(() => {
      window.location.href = "https://api.hachion.co/oauth2/authorization/google";
    }, 50);
  };

useEffect(() => {
  if (!user) return;

  const toStore = {
    name: user.name || "",
    email: user.email || "",
    picture: user.picture || ""
  };

  localStorage.setItem("loginuserData", JSON.stringify(toStore));

  if (user.token) {
    localStorage.setItem("authToken", user.token);
  }

  window.dispatchEvent(new Event("storage"));
}, [user]);

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
                Create Account
              </li>
            </ol>
          </nav>
        </div>

        <img src={LoginBanner} alt="Login Banner" className="register-banner" />

        <div className='register-login container'>
          <div className="register-login-left">
            <div className="register-login-top">
              <div className="register-login-mid">
                {/* First Name */}
                <h4 className="register-login-continue">Create Account</h4>
                <label className="register-login-label">
                  First Name<span className="star">*</span>
                </label>
                <div className="register-field">
                  <div className="register-password-field">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="error-field-message">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <label className="register-login-label">Last Name</label>
                <div className="register-password-field">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                {/* Email */}
                <label className="register-login-label">
                  Email ID<span className="star">*</span>
                </label>
                <div className="register-field">
                  <div className="register-password-field">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="abc@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {errors.email && (
                    <p className="error-field-message">{errors.email}</p>
                  )}
                </div>

                {/* Mobile */}
                <label className="register-login-label">
                  Phone Number<span className="star">*</span>
                </label>
                <div className="register-field">
                  <div className="register-password-field">
                    <button
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      className="register-mobile-button"
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

                <div className="d-grid gap-2">
                  <button
                    type="button"
                    className="register-btn"
                    onClick={handleClick}
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating..." : "Create Account"}
                  </button>
                </div>

                <hr style={{ width: "90%", margin: "20px" }} />

                <div className="d-grid gap-2">
                  <button className="other-btn" type="button" onClick={loginWithGoogle}>
                    <img
                      src={google}
                      alt="login-with-google"
                      className="icon-btn-img"
                    />
                    or Sign Up with Google
                  </button>
                </div>
              </div>
            </div>

            <p className="go-to-register">
              Already have an account?{" "}
              <Link to="/login" className="link-to-register">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* <Footer />
      <StickyBar /> */}
      </div>
    </>
  );
};

export default Register;
