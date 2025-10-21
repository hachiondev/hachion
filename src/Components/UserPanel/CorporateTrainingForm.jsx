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
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());
  const mobileInputRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Auto-detect country
  useEffect(() => {
    fetch("https://ipwho.is/")
      .then((res) => res.json())
      .then((data) => {
        const matchedCountry = countries.find((c) => c.flag === data?.country_code);
        if (matchedCountry) setSelectedCountry(matchedCountry);
      })
      .catch(() => {});
  }, []);

  // Fetch courses
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

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email.";
    if (!mobile.trim()) newErrors.mobile = "Mobile number is required.";
    if (!company.trim()) newErrors.company = "Company name is required.";
    if (!experience.trim()) newErrors.experience = "Please select number of people.";
    if (!courseName.trim()) newErrors.courseName = "Please select a course.";
    if (!comment.trim()) newErrors.comment = "Comment is required.";
    else if (comment.trim().length < 10) newErrors.comment = "Comment must be at least 10 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const requestData = {
      fullName: name,
      emailId: email,
      mobileNumber: mobile,
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
        // Reset form
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
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter your mobile number"
                    style={{ paddingLeft: "120px", border: "none" }}
                  />
                </div>
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
