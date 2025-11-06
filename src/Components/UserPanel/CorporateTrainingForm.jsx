import React, { useEffect, useRef, useState } from "react";
import "./Home.css";
import { IoCloseSharp } from "react-icons/io5";
import { Menu, MenuItem } from "@mui/material";
import Flag from "react-world-flags";
import { AiFillCaretDown } from "react-icons/ai";
import axios from "axios";
import { countries, getDefaultCountry } from "../../countryUtils";


const CorporateTrainingForm = ({ onClose }) => {
  const popupRef = useRef();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [company, setCompany] = useState("");
  const [courseName, setCourseName] = useState("");
  const [experience, setExperience] = useState("");
  const [comment, setComment] = useState("");
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [mobileError, setMobileError] = useState("");
const [mobileTouched, setMobileTouched] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());
  const mobileInputRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState("");

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);
useEffect(() => {
  fetch("https://api.country.is")
    .then((res) => res.json())
    .then((data) => {
      data.country_code = (data.country || "").toUpperCase();
      const matchedCountry = countries.find((c) => c.flag === data?.country_code);
      if (matchedCountry) setSelectedCountry(matchedCountry);
    })
    .catch(() => {});
}, []);

const onlyDigits = (v) => v.replace(/\D/g, "").slice(0, 10);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("https://api.test.hachion.co/courses/all");
        if (Array.isArray(res.data)) setCourses(res.data.map((c) => c.courseName));
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

const handleMobileChange = (e) => {
  const digits = onlyDigits(e.target.value);
  setMobile(digits);

  
  setErrors((prev) => {
    if (prev.mobile && digits.length === 10) {
      const { mobile, ...rest } = prev;
      return rest;
    }
    return prev;
  });
};

const handleMobileBlur = () => {
  const digits = onlyDigits(mobile);
  setMobile(digits); 

  if (digits.length !== 10) {
    setErrors((prev) => ({ ...prev, mobile: "Please enter exactly 10 digits." }));
  } else {
    setErrors((prev) => {
      const { mobile, ...rest } = prev;
      return rest;
    });
  }
};

const validateForm = () => {
  const newErrors = {};

  if (!name.trim()) newErrors.name = "Name is required.";
  if (!email.trim()) newErrors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email.";

  const mobileDigits = onlyDigits(mobile);
  if (mobileDigits.length !== 10) newErrors.mobile = "Please enter exactly 10 digits.";

  if (!company.trim()) newErrors.company = "Company name is required.";
  if (!experience.trim()) newErrors.experience = "Please select number of people.";
  if (!courseName.trim()) newErrors.courseName = "Please select a course.";
  if (!comment.trim()) newErrors.comment = "Comment is required.";
  else if (comment.trim().length < 10) newErrors.comment = "Comment must be at least 10 characters.";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  
const formatMobileWithCode = (code, mobile) => {
  const digits = String(mobile || "").trim().replace(/\s+/g, ""); 
  const dial = String(code || "").trim(); 
  return `${dial} ${digits}`;
};

const toIntFromRange = (val) => {
  if (!val) return 0;
  const v = String(val).trim();
  if (v.endsWith("+")) return parseInt(v.slice(0, -1).trim(), 10) || 0;
  if (v.includes("-")) {
    const [a, b] = v.split("-").map(s => parseInt(s.trim(), 10) || 0);
    return Math.max(a, b);
  }
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? 0 : n;
};

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const requestData = {
      fullName: name,
      emailId: email,
      mobileNumber: formatMobileWithCode(selectedCountry?.code, mobile),
      companyName: company,
      trainingCourse: courseName,
      noOfPeople: experience,
      comments: comment,
      country: selectedCountry.name,
    };

    try {
      const response = await axios.post("https://api.test.hachion.co/advisors", requestData, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        setSuccessMessage("Thank you! Our team will contact you soon.");
        
        setName("");
        setEmail("");
        setMobile("");
        setCompany("");
        setCourseName("");
        setExperience("");
        setComment("");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setSuccessMessage("Submission failed. Please try again.");
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setAnchorEl(null);
    mobileInputRef.current?.focus();
  };
useEffect(() => {
  const userData = JSON.parse(localStorage.getItem("loginuserData") || "{}");
  const userEmail = (userData.email || "").trim();

  
  if (userEmail) setEmail(userEmail);

  if (!userEmail) return; 

  const ctrl = new AbortController();

  (async () => {
    try {
      const res = await fetch(
        `https://api.test.hachion.co/api/v1/user/myprofile?email=${encodeURIComponent(userEmail)}`,
        { signal: ctrl.signal }
      );
      if (!res.ok) throw new Error("Failed to fetch profile data");
      const data = await res.json();

      if (data?.name) setName(String(data.name));
      if (data?.email && !email) setEmail(String(data.email)); 

      if (data?.mobile) {
        
        const digits = String(data.mobile).replace(/\D/g, "");
        setMobile(digits.slice(-10));
      }

      if (data?.country) {
        
        const countryMatch =
          countries.find(
            (c) => String(c.name).toLowerCase() === String(data.country).toLowerCase()
          ) || null;

        if (countryMatch) {
          setSelectedCountry(countryMatch);
        }
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        
        console.error("Profile autofill failed:", err);
      }
    }
  })();

  return () => ctrl.abort();
  
}, []);

  return (
    <div className="popup-overlay">
      <div className="expert-popup-container" ref={popupRef}>
        <div className="expert-popup-header">
          <div>Enter Details</div>
          <button className="close-popup" onClick={onClose}>
            <IoCloseSharp size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="instructor-fields">
            <div>
              <label className="login-label">
                Full Name<span className="star">*</span>
              </label>
              <div className="register-field">
                <div className="password-field">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                {errors.name && <p className="error-field-message">{errors.name}</p>}
              </div>
            </div>

            <div>
              <label className="login-label">
                Email ID<span className="star">*</span>
              </label>
              <div className="register-field">
                <div className="password-field">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {errors.email && <p className="error-field-message">{errors.email}</p>}
              </div>
            </div>
          </div>

          <div className="instructor-fields">
            <div>
              <label className="login-label">
                Phone Number<span className="star">*</span>
              </label>
              <div className="register-field">
                <div className="password-field" style={{ position: "relative" }}>
                  <button
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    className="mobile-button"
                    type="button"
                  >
                    <Flag code={selectedCountry.flag} className="country-flag me-1" />
                    <span style={{ marginRight: "5px", fontSize: "small" }}>
                      {selectedCountry.flag} ({selectedCountry.code})
                    </span>
                    <AiFillCaretDown />
                  </button>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
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
  value={mobile}
  onChange={handleMobileChange}
  onBlur={handleMobileBlur}
  placeholder="Enter your mobile number"
  style={{ paddingLeft: "120px", border: "none" }}
  maxLength={10}
  inputMode="numeric"
  pattern="\d*"
/>                </div>
                {errors.mobile && <p className="error-field-message">{errors.mobile}</p>}
              </div>
            </div>

            <div>
              <label className="login-label">
                Company Name<span className="star">*</span>
              </label>
              <div className="register-field">
                <div className="password-field">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your Company Name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                {errors.company && <p className="error-field-message">{errors.company}</p>}
              </div>
            </div>
          </div>

          <div className="instructor-fields">
          <div>
            <label className="login-label">
              No. of People<span className="star">*</span>
            </label>
            <div className="register-field">
              <div className="password-field">
                <select
                  className="form-select"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                >
                  <option value="">Choose Number</option>
                  <option value="1-5">1-5</option>
                  <option value="6-10">6-10</option>
                  <option value="11-15">11-15</option>
                  <option value="16-20">16-20</option>
                  <option value="20+">20+</option>
                </select>
              </div>
              {errors.experience && (
                <p className="error-field-message">{errors.experience}</p>
              )}
            </div>
          </div>

          <div>
            <label className="login-label">
              Training Course<span className="star">*</span>
            </label>
            <div className="register-field">
              <div className="password-field">
                <select
                  className="form-select"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                >
                  <option value="">Choose Course</option>
                  {courses.map((course, idx) => (
                    <option key={idx} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>
              {errors.courseName && (
                <p className="error-field-message">{errors.courseName}</p>
              )}
            </div>
          </div>
        </div>

          <div>
            <label className="login-label">
              Additional Comments<span className="star">*</span>
            </label>
            <div className="register-field">
              <div className="password-field">
                <textarea
                  className="form-control"
                  placeholder="Type additional Comments...."
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              {errors.comment && <p className="error-field-message">{errors.comment}</p>}
            </div>
          </div>

          <button type="submit" className="expert-popup-btn">
            Submit
          </button>

          {/* Inline Success / Error Message */}
          {successMessage && (
            <p className="success-message" style={{ color: "green", marginTop: "10px", textAlign: "center" }}>
              {successMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CorporateTrainingForm;
