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

const API_BASE = "https://api.test.hachion.co";

const InstructorForm = ({ onClose }) => {
  const navigate = useNavigate();
  const popupRef = useRef();
  const mobileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [location, setLocation] = useState("");
  const [link, setLink] = useState("");
  const [skill, setSkill] = useState("");
  const [area, setArea] = useState([]); 
  const [courses, setCourses] = useState([]);
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("");
  const [upload, setUpload] = useState(null);
  const [errors, setErrors] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());
  const [submitting, setSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
      
      if (!event.target.closest(".custom-course-dropdown")) {
        setShowCourseDropdown(false);
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
      const match = countries.find((c) => c.flag === data?.country_code);
      if (match) setSelectedCountry(match);
    })
    .catch(() => {});
}, []);

  useEffect(() => {
  const userData = JSON.parse(localStorage.getItem("loginuserData") || "{}");
  const userEmail = (userData.email || "").trim();
  setIsLoggedIn(!!userEmail);
    if (userEmail) setEmail(userEmail);

    if (!userEmail) return;

    const ctrl = new AbortController();

    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/v1/user/myprofile?email=${encodeURIComponent(
            userEmail
          )}`,
          { signal: ctrl.signal }
        );
        if (!res.ok) throw new Error("Failed to fetch profile data");
        const data = await res.json();

        if (data?.name) setName(String(data.name));
        if (data?.email) setEmail(String(data.email));

        if (data?.mobile) {
          const digits = String(data.mobile).replace(/\D/g, "");
          const national10 = digits.length > 10 ? digits.slice(-10) : digits;
          setMobile(national10.slice(0, 10));
        }

        if (data?.country) {
          const matchByName =
            countries.find(
              (c) =>
                String(c.name).toLowerCase() ===
                String(data.country).toLowerCase()
            ) || null;
          if (matchByName) setSelectedCountry(matchByName);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Profile autofill failed:", err);
        }
      }
    })();

    return () => ctrl.abort();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_BASE}/courses/all`);
        if (Array.isArray(res.data)) {
          setCourses(res.data.map((c) => c.courseName));
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setAnchorEl(null);
    mobileInputRef.current?.focus();
  };

  const handleCourseToggle = (course) => {
    if (area.includes(course)) {
      setArea(area.filter((c) => c !== course));
    } else {
      setArea([...area, course]);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required.";

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    const digits = mobile.replace(/\D/g, "");
    if (!digits) {
      newErrors.mobile = "Phone number is required.";
    } else if (digits.length !== 10) {
      newErrors.mobile = "Enter exactly 10 digits.";
    }

    if (!location.trim()) newErrors.location = "Location is required.";
    if (area.length === 0) newErrors.area = "At least one expertise is required.";
    if (!experience.trim()) newErrors.experience = "Experience is required.";
    if (!mode.trim()) newErrors.mode = "Mode of training is required.";
    if (!skill.trim()) newErrors.skill = "Skill/Occupation is required.";

    if (link && !/^https?:\/\/.+/i.test(link)) {
      newErrors.link = "Enter a valid URL (starting with http or https).";
    }

    if (!upload) {
      newErrors.upload = "Resume/CV is required.";
    }

    if (!comment.trim()) {
      newErrors.comment = "Comment is required.";
    } else if (comment.trim().length < 10) {
      newErrors.comment = "Comment must be at least 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  

  const handleSubmit = async () => {
  
  if (!validateForm()) {
    setErrorMessage("Please fill the mandatory fields.");
    setSuccessMessage("");
    return;
  }

  try {
    setSubmitting(true);

    const fullMobile = `${selectedCountry.code} ${mobile.replace(/\D/g, "")}`;

    const payload = {
      name,
      email,
      mobile: fullMobile,
      location,
      link,
      skill,
      area: area.join(", "),
      experience,
      mode,
      comment,
      status: "PENDING",
    };

    const formData = new FormData();
    formData.append("instructor", JSON.stringify(payload));
    if (upload) formData.append("resume", upload);

    const res = await axios.post(`${API_BASE}/instructor/apply`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.status === 200 || res.status === 201) {
      setSuccessMessage("✅ Application submitted successfully.");
      setErrorMessage("");

      if (isLoggedIn) {
        
        setLocation("");
        setLink("");
        setSkill("");
        setArea([]);
        setExperience("");
        setMode("");
        setUpload(null);
        setComment("");
        setErrors({});
        setAnchorEl(null);
        setShowCourseDropdown(false);
      } else {
        
        setName("");
        setEmail("");
        setMobile("");
        setLocation("");
        setLink("");
        setSkill("");
        setArea([]);
        setExperience("");
        setMode("");
        setUpload(null);
        setComment("");
        setErrors({});
        
        setAnchorEl(null);
        setShowCourseDropdown(false);
      }
    } else {
      setErrorMessage("❌ Failed to submit application.");
      setSuccessMessage("");
    }
  } catch (err) {
    console.error(err);
    setErrorMessage("❌ Something went wrong while submitting the application.");
    setSuccessMessage("");
  } finally {
    setSubmitting(false);
  }
};
useEffect(() => {
  if (!successMessage && !errorMessage) return;
  const t = setTimeout(() => {
    setSuccessMessage("");
    setErrorMessage("");
  }, 4000);
  return () => clearTimeout(t);
}, [successMessage, errorMessage]);

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

        {/* Row 1 */}
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

        {/* Row 2 */}
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
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setMobile(v);
                  }}
                  placeholder="Enter your mobile number"
                  style={{ paddingLeft: "120px", border: "none" }}
                  autoComplete="tel-national"
                  inputMode="numeric"
                  maxLength={10}
                  pattern="\d{10}"
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

        {/* Row 3 */}
    <div className="instructor-fields">
    <div>
    <div className="custom-course-dropdown" style={{ position: "relative" }}>
  <label className="login-label" htmlFor="course">
    Area of Expertise<span className="star">*</span>
  </label>

  <div className="register-field">
    <div
      className="password-field"
      style={{ position: "relative" }}
    >
      {/* Real select element for Bootstrap style + arrow */}
      <select
        className="form-select"
        value={area.length ? "selected" : ""}
        onMouseDown={(e) => {
        e.preventDefault();
        setShowCourseDropdown(!showCourseDropdown);
      }}
      onFocus={(e) => e.target.blur()}
      >
        <option value="">
          {area.length > 0
            ? `${area.length} course(s) selected`
            : "Choose Courses"}
        </option>
      </select>
      </div>

      {showCourseDropdown && (
        <div
          className="course-dropdown-list"
        >
          {courses.length === 0 ? (
            <div style={{ padding: "8px 4px", color: "#666" }}>
              No courses available
            </div>
          ) : (
            courses.map((course, idx) => (
              <label
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 4px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <input
                  type="checkbox"
                  checked={area.includes(course)}
                  onChange={() => handleCourseToggle(course)}
                  style={{ marginRight: "10px" }}
                />
                <span style={{ flex: 1 }}>{course}</span>
              </label>
            ))
          )}
        </div>
      )}
    </div>

    {/* Error message */}
    {errors.area && (
      <p className="error-field-message">{errors.area}</p>
    )}

    {/* Selected tags */}
    {area.length > 0 && (
      <div
        className="selected-area-list"
        style={{
          marginTop: "4px",
          maxWidth: "360px",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {area.map((course, idx) => (
          <span
            key={idx}
            className="selected-course-item"
            style={{
              display: "inline-block",
              border: "1px solid #000",
              background: "#fff",
              borderRadius: "30px",
              padding: "4px 8px",
              margin: "3px",
              fontSize: "12px",
              cursor: "pointer",
            }}
            onClick={() => handleCourseToggle(course)}
            title="Click to remove"
          >
            {course} ✕
          </span>
        ))}
      </div>
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
                  <option value="3-4 Years">3-4 Years</option>
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

        {/* Remaining form unchanged */}
        <div className="instructor-fields">
          <div>
            <label className="login-label">Linked Profile (Optional)</label>
            <div className="register-field">
              <div className="password-field">
                <input
                  type="url"
                  className="form-control"
                  placeholder="Enter your Profile Link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
              {errors.link && <p className="error-field-message">{errors.link}</p>}
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
              {errors.mode && <p className="error-field-message">{errors.mode}</p>}
            </div>
          </div>
        </div>

        {/* Skill + Resume */}
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
              {errors.skill && <p className="error-field-message">{errors.skill}</p>}
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
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    document.getElementById("resumeUpload").click();
                  }
                }}
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
                onChange={(e) => setUpload(e.target.files?.[0] || null)}
                accept=".pdf,.doc,.docx"
              />

              {errors.upload && (
                <p className="error-field-message">{errors.upload}</p>
              )}
            </div>
          </div>
        </div>

        {/* Comments */}
        <div>
          <label className="login-label">
            Additional Comments<span className="star">*</span>
          </label>
          <div className="register-field">
            <div className="password-field">
              <textarea
                className="form-control"
                placeholder="Additional Comments"
                rows={4}
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
          className="expert-popup-btn"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
         {successMessage && (
                <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>
              )}
              {errorMessage && (
                <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>
              )}
        </div>
      </div>
  );
};

export default InstructorForm;