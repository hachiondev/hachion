import React, { useEffect, useRef, useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import Flag from 'react-world-flags';
import { AiFillCaretDown } from 'react-icons/ai';
import RegistrationImage from '../../Assets/registerImg.webp';
import { MdKeyboardArrowRight } from "react-icons/md";
import registerbanner from '../../Assets/register.webp';
import aboutHachion from '../../Assets/aboutlead.webp';
import Benefits from './LeadBenefits';
import { useNavigate } from "react-router-dom";
import { countries, getDefaultCountry } from '../../countryUtils';

const LeadForm = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [messageType, setMessageType] = useState('');
      const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [mobileError, setMobileError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    country: "",
    courseInterest: "",
    batchTiming: "",
    marketerId: ""
  });
  console.log("form data" + formData.getFulName);

  const mobileInputRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isRefValid, setIsRefValid] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleCountrySelect = (country) => {
  setSelectedCountry(country);
  setFormData((prev) => ({ ...prev, country: country.name })); 
  closeMenu();
  mobileInputRef.current?.focus();
};

  const openMenu = (event) => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);
useEffect(() => {
  fetch("https://api.country.is")
    .then((res) => res.json())
    .then((data) => {
      data.country_code = (data.country || "").toUpperCase();

      const timeZone =
        Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
      const userCountryCode = data?.country_code || "US";

      window.userTimeZoneFromIP = timeZone;
      setFormData((prev) => ({ ...prev, timeZone }));

      const matchedCountry = countries.find(
        (c) => c.flag.toUpperCase() === userCountryCode.toUpperCase()
      );

      setSelectedCountry(
        matchedCountry || { name: "United States", code: "+1", flag: "US" }
      );
    })
    .catch(() => {
      window.userTimeZoneFromIP = "America/New_York";
      setFormData((prev) => ({ ...prev, timeZone: "America/New_York" }));
      setSelectedCountry({ name: "United States", code: "+1", flag: "US" });
    });
}, []);


const handleMobileBlur = () => {
  const mobile = formData.mobileNumber;

  if (!mobile || mobile.length !== 10) {
    setMobileError("❌ Mobile number must be exactly 10 digits.");
  } else {
    setMobileError("");
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  setSuccessMessage("");
  setErrorMessage("");

  if (!isChecked) {
    setErrorMessage("Please select the checkbox to acknowledge the Privacy Notice and Terms & conditions.");
    return;
  }

  const { fullName, email, mobileNumber, country, courseInterest, batchTiming, marketerId } = formData;

  if (!fullName || !email || !mobileNumber || !courseInterest) {
    setErrorMessage("Please fill all the details to register.");
    return;
  }

  try {
    const response = await fetch("https://api.test.hachion.co/leadform", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fullName,
        email,
        mobileNumber,
        country,
        courseInterest,
        batchTiming,
        marketerId
      })
    });

    if (!response.ok) {
      throw new Error("Failed to submit the form.");
    }

    const data = await response.json();
    setSuccessMessage("Registration successful!");
    setFormData({
      fullName: "",
      email: "",
      mobileNumber: "",
      country: "",
      courseInterest: "",
      batchTiming: "",
      marketerId: "",
    });
    setIsChecked(false);
  } catch (error) {
    setErrorMessage("Something went wrong. Please try again later.");
  }
};

useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const marketerId = urlParams.get('ref');
  const allowedRefs = ['a', 'b', 'c', 'd', 'e'];
  if (marketerId) {
    if (allowedRefs.includes(marketerId)) {
      setFormData((prev) => ({ ...prev, marketerId }));
    } else {
      navigate("/", { replace: true });
    }
  }
}, []);
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handlePrivacy = () => {
    navigate("/privacy");
  };
  const handleTerms = () => {
    navigate("/terms");
  };
  
  return (
    <>
      <div className='blogs-header'>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a> <MdKeyboardArrowRight />{" "}
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Student Registration Form
            </li>
          </ol>
        </nav>
        </div>
        <div >
          <img className='banner-img' src={registerbanner} alt='Lead Form Banner' />
          <div className="contact-us-all">
          <h2 className='summer-title'>About Hachion</h2>
              <div className='summer-part'>
              <p className='about-lead-text'>
            Hachion is a leading eLearning platform dedicated to transforming tech education by delivering industry-relevant, expert-designed courses. We specialize in cutting-edge programs like Full Stack Development, Data Science, DevOps, Cloud Computing, Cyber Security and more, ensuring learners acquire the most sought-after skills in today's job market. With a focus on mentor-led training, hands-on projects, and real-world case studies, we bridge the gap between academic knowledge and workplace demands. Our mission is to empower professionals and graduates with practical expertise, career guidance, and lifelong learning opportunities, helping them thrive in the fast-evolving tech landscape. At Hachion, we don't just teach—we prepare you for success.
            </p>
            <img className='aboutlead-img' src={aboutHachion} alt='About Hachion' />
            </div>
            <Benefits />
            </div>
          <div className='studentform'>
        <h2 className='summer-title'>Student Registration Form</h2>
        <form onSubmit={handleSubmit}>
          <div className='summer-part'>
            <img className='student-img' src={RegistrationImage} alt='Registration Imag' />
            <div>
              <div className='student-reg-form'>
                <div className="form-group col-10" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Full Name<span className='star'>*</span></label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-control-student"
                    id="studentreg"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group col-10" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Email ID<span className='star'>*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control-student"
                    id="studentreg"
                    placeholder="abc@gmail.com"
                  />
                </div>

                <div className="form-group col-10" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Mobile Number <span className="star">*</span></label>
                  <div className="input-wrapper" style={{ position: 'relative' }}>
                    <button type="button" onClick={openMenu} className='mobile-button'>
                      <Flag code={selectedCountry.flag} className="country-flag me-1" />
                      <span style={{ marginRight: '5px' }}>{selectedCountry.code}</span>
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
                      className="form-control-student"
                      id="studentreg"
                      name="mobileNumber"
                      ref={mobileInputRef}
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      onBlur={handleMobileBlur}
                      placeholder="Enter your mobile number"
                      style={{ paddingLeft: '100px' }}
                    />
                     {mobileError && (
            <small style={{ color: 'red', marginTop: '4px', display: 'block' }}>{mobileError}</small>
          )}
                  </div>
                  </div>
                 <div className="form-group col-10" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Courses Interested<span className='star'>*</span></label>
                  <input
                    type="text"
                    name="courseInterest"
                    value={formData.courseInterest}
                    onChange={handleChange}
                    className="form-control-student"
                    id="studentreg"
                    placeholder="Enter Courses Interested"
                  />
                </div>
                  <input
                    type="hidden"
                    name="marketerId"
                    value={formData.marketerId}
                    onChange={handleChange}
                    className="form-control-student"
                    id="studentreg"
                  />

                {error && (
                  <div
                    style={{
                      color: messageType === 'success' ? 'green' : 'red',
                      marginBottom: '10px',
                      fontWeight: '700'
                    }}
                  >
                    {error}
                  </div>
                )}
                 {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
                <button type="submit" className="student-register-button">
                  Register
                </button>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckChecked"
                    onChange={handleCheckboxChange}
                  />
                  <label class="form-check-label" for="flexCheckChecked">
                    By clicking on Submit, you acknowledge read our{" "}
                    <span
                      onClick={handlePrivacy}
                      style={{ textDecoration: "underline", cursor: "pointer", color: "#00AAEF" }}
                    >
                      Privacy Notice
                    </span> and 
                    <span
                      onClick={handleTerms}
                      style={{ textDecoration: "underline", cursor: "pointer", color: "#00AAEF", paddingLeft: 5 }}
                    >
                      Terms & Conditions
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      </div>
    </>
  );
};

export default LeadForm;