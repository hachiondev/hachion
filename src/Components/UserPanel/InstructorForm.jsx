import React, { useEffect, useState, useRef } from "react";
import "./Home.css";
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem } from "@mui/material";
import Flag from "react-world-flags";
import { AiFillCaretDown } from "react-icons/ai";
import { GrAttachment } from "react-icons/gr";
import axios from "axios";
import { countries, getDefaultCountry } from "../../countryUtils";

const InstructorForm = ({ onClose }) => {
  const navigate = useNavigate();
  const popupRef = useRef();
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [location, setLocation] = useState("");
  const [link, setLink] = useState("");
  const [skill, setSkill] = useState("");
  const [area, setArea] = useState("");
  const [courses, setCourses] = useState([]);
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("");
  const [upload, setUpload] = useState("");
  const [errors, setErrors] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const mobileInputRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());

const validateForm = () => {
  const newErrors = {};
  if (!name.trim()) newErrors.name = "Name is required.";
  
  if (!email.trim()) {
    newErrors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newErrors.email = "Please enter a valid email address.";
  }

  if (!comment.trim()) {
    newErrors.comment = "Comment is required.";
  } else if (comment.trim().length < 10) {
    newErrors.comment = "Comment must be at least 10 characters.";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  // Close popup when clicking outside
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
      fetch("https://ipwho.is/")
        .then((res) => res.json())
        .then((data) => {
          const userCountryCode = data?.country_code;
          const matchedCountry = countries.find((c) => c.flag === userCountryCode);
          if (matchedCountry) setSelectedCountry(matchedCountry);
        })
        .catch(() => {});
    }, []);

    const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setAnchorEl(null);
    mobileInputRef.current?.focus();
  };
    useEffect(() => {
      const fetchCourses = async () => {
        try {
          const res = await axios.get("https://api.test.hachion.co/courses/all");
          if (Array.isArray(res.data)) {
            setCourses(res.data.map(c => c.courseName));
          }
        } catch (err) {
          console.error("Error fetching courses:", err);
        }
      };
      fetchCourses();
    }, []);

  return (
    <div className="popup-overlay">
      <div className="expert-popup-container" ref={popupRef}>
        
        {/* Header */}
        <div className="expert-popup-header">
            <div>Enter Details</div>
          <button className="close-popup" onClick={onClose}>
            <IoCloseSharp size={16} />
          </button>
        </div>

        <div className="instructor-fields">
            <div>
              <label className="login-label">
                Name<span className="star">*</span>
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
                {errors.name && (
                  <p className="error-field-message">{errors.name}</p>
                )}
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
                {errors.email && (
                  <p className="error-field-message">{errors.email}</p>
                )}
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
                            </div>

            <div>
            <label className="login-label">
                Location<span className="star">*</span>
              </label>
              <div className="register-field">
                <div className="password-field">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                </div>
                {errors.location && (
                  <p className="error-field-message">{errors.location}</p>
                )}
              </div>
              </div>
              </div>

              <div className="instructor-fields">
                <div>
              <label className="login-label" htmlFor="course">
                Area of Expertise<span className="star">*</span>
                </label>
                <div className="register-field">
                <div className="password-field">
                    <select
                    id="course"
                    className="form-select"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    >
                    <option value="">Choose Area</option>
                    {courses.map((course, idx) => (
                        <option key={idx} value={course}>{course}</option>
                    ))}
                    </select>
                </div>
                {errors.area && (
                    <p className="error-field-message">{errors.area}</p>
                )}
                </div>
                </div>

                <div>
                <label className="login-label">
                Year of Experience<span className="star">*</span>
                </label>
                <div className="register-field">
                <div className="password-field">
                    <select
                    className="form-select"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    >
                    <option value="">Choose Year</option>
                    <option value="0-1 Year">0-1 Year</option>
                    <option value="1-2 Years">1-2 Years</option>
                    <option value="2-3 Years">2-3 Years</option>
                    <option value="4-5 Years">4-5 Years</option>
                    <option value="5+ Years">5+ Years</option>
                    <option value="10+ Years">10+ Years</option>
                    </select>
                </div>
                {errors.experience && (
                    <p className="error-field-message">{errors.experience}</p>
                )}
                </div>
                </div>
                </div>

              <div className="instructor-fields">
                <div>
                <label className="login-label">
                Linked Profile (Optional)<span className="star">*</span>
              </label>
              <div className="register-field">
                <div className="password-field">
                <input
                  type="link"
                  className="form-control"
                  placeholder="Enter your Profile Link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
                </div>
                {errors.link && (
                  <p className="error-field-message">{errors.link}</p>
                )}
              </div>
              </div>

              <div>
                <label className="login-label">
                Preferred Mode of Training<span className="star">*</span>
                </label>
                <div className="register-field">
                <div className="password-field">
                    <select
                    className="form-select"
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    >
                    <option value="">Choose Mode of Training</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Both">Both</option>
                    </select>
                </div>
                {errors.mode && (
                    <p className="error-field-message">{errors.mode}</p>
                )}
                </div>
                </div>
                </div>

              <div className="instructor-fields">
                <div>
                <label className="login-label">
                Skill/Occupation<span className="star">*</span>
              </label>
              <div className="register-field">
                <div className="password-field">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your Skill/Occupation"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                />
                </div>
                {errors.skill && (
                  <p className="error-field-message">{errors.skill}</p>
                )}
              </div>
              </div>

            <div>
            <label className="login-label">
                Upload Resume/CV<span className="star">*</span>
            </label>

             <div className="register-field">
      <div
        className="password-field custom-upload-field"
        onClick={() => document.getElementById("resumeUpload").click()}
      >
        <GrAttachment className="upload-icon" />
        <span className="upload-text">
          {upload ? upload.name : "Upload Your Resume/CV"}
        </span>
      </div>

      <input
        type="file"
        id="resumeUpload"
        style={{ display: "none" }}
        onChange={(e) => setUpload(e.target.files[0])}
      />

      {errors.upload && (
        <p className="error-field-message">{errors.upload}</p>
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
                placeholder="Additional Comments"
                instructor-fieldss={4} 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                />
            </div>
            {errors.comment && (
                <p className="error-field-message">{errors.comment}</p>
            )}
            </div>
            </div>

          <button
            className="expert-popup-btn">
           Submit
          </button>
      </div>
    </div>
  );
};

export default InstructorForm;
