import React, { useState, useEffect } from "react";
import "./EnquiryPage.css";

import Flag from "react-world-flags";
import { Menu, MenuItem } from "@mui/material";
import { AiFillCaretDown } from "react-icons/ai";
import { countries, getDefaultCountry } from "../../countryUtils"; 
import { useTopBarApi } from "../../Api/hooks/HomePageApi/useTopBarApi";
import { useRef } from "react";
import { getCoursesSummary } from "./HomePage/TrendingSection/services/coursesService";
import { useParams } from "react-router-dom";

import whatsapp from '../../Assets/logos_whatsapp-icon.webp';
import facebook from '../../Assets/facebook.webp';
import twitter from '../../Assets/twitter.webp';
import youtube from '../../Assets/youtube.webp';
import linkedin from '../../Assets/linkedin.webp';
import instagram from '../../Assets/instagram.webp';
import quora from '../../Assets/Component 141.webp';

const EnquiryPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    course: "",
    country: "",
    state: "",
    source: "",
    device: "",
    timezone: "",
    utm: "",
    whatsappConsent: true
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isErrorCase, setIsErrorCase] = useState(false);
  const isFormValid =
  formData.email &&
  formData.name &&
  formData.phone &&
  formData.course 

const mobileInputRef = useRef(null);
const [anchorEl, setAnchorEl] = useState(null);
const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());
const [courses, setCourses] = useState([]);
const [searchCourse, setSearchCourse] = useState("");
const [showDropdown, setShowDropdown] = useState(false);
const [loadingCourses, setLoadingCourses] = useState(true);
const { refName } = useParams();
// const { countryCode, isLoading: countryLoading } = useTopBarApi();
const { 
  countryCode, 
  whatsappNumber, 
  whatsappLink, 
  isLoading: countryLoading 
} = useTopBarApi();
const filteredCourses = courses.filter((course) =>
  course.courseName.toLowerCase().includes(searchCourse.toLowerCase())
);
const [validForms, setValidForms] = useState([]);
const [isValidForm, setIsValidForm] = useState(true);
const [loadingFormCheck, setLoadingFormCheck] = useState(true);
useEffect(() => {
  const fetchValidForms = async () => {
    try {
      const res = await fetch("https://api.test.hachion.co/employees/google-form-urls");
      const data = await res.json();      
      const formNames = data.map(url =>
        url.split("enquiryform/")[1]
      );

      setValidForms(formNames);

      
      if (refName && !formNames.includes(refName)) {
        setIsValidForm(false);
      }

    } catch (err) {
      console.error("Error fetching form URLs", err);
      setIsValidForm(false);
    } finally {
      setLoadingFormCheck(false);
    }
  };

  fetchValidForms();
}, [refName]);
useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  setFormData((prev) => ({
    ...prev,
    source: document.referrer || "Direct",
    device: /Mobi|Android|iPhone/i.test(navigator.userAgent)
      ? "Mobile"
      : "Desktop",
 
    utm: params.get("utm_source") || "Organic",
     referrerName: refName || "default",
  }));
}, []);


useEffect(() => {
  const fetchCourses = async () => {
    try {
      const data = await getCoursesSummary();

const sortedCourses = data.sort((a, b) =>
  a.courseName.localeCompare(b.courseName)
);

setCourses(sortedCourses);
    } catch (error) {
      console.error("Failed to fetch courses", error);
    } finally {
      setLoadingCourses(false);
    }
  };

  fetchCourses();
}, []);
useEffect(() => {
  if (countryCode && !countryLoading) {
    const matchedCountry = countries.find((c) => c.flag === countryCode);
    if (matchedCountry) {
      setSelectedCountry(matchedCountry);

      
      setFormData((prev) => ({
        ...prev,
        timezone: matchedCountry.timezone || ""
      }));
    }
  }
}, [countryCode, countryLoading]);
useEffect(() => {
  if (selectedCountry && selectedCountry.timezone) {
    setFormData((prev) => ({
      ...prev,
      timezone: selectedCountry.timezone
    }));
  }
}, [selectedCountry]);

useEffect(() => {
  const fetchLocation = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();

      setFormData((prev) => ({
        ...prev,
        state: prev.state || data.region || "",   
        country: prev.country || data.country_name || "" 
      }));

    } catch (error) {
      console.error("Location fetch failed", error);
    }
  };

  fetchLocation();
}, []);
const handleCountrySelect = (country) => {
  setSelectedCountry(country);
  setAnchorEl(null);

  setFormData((prev) => ({
    ...prev,
    timezone: country.timezone || prev.timezone   
  }));

  mobileInputRef.current?.focus();
};
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const capitalize = (value) => {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};
const handleSubmit = async (e) => {
  e.preventDefault();

  if (isSubmitting) return;

  setIsSubmitting(true);
  setSuccessMsg("");

  try {
    const fullPhone = `${selectedCountry.code} ${formData.phone}`;

    const payload = {
      email: formData.email,
      phone: fullPhone,
      course: formData.course,
      name: formData.name,
      state: formData.state,
       country: selectedCountry.name,
       
      seoTeam: capitalize(refName || "default"),
      whatsappConsent: formData.whatsappConsent
      
    };

    const res = await fetch("https://api.test.hachion.co/enquiryformcreate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.status === "success") {
       setIsErrorCase(false);
       setShowSuccessScreen(true);

      
setFormData({
  email: "",
  name: "",
  phone: "",
  course: "",
  country: "",
  // state: "",
  source: document.referrer || "Direct",
  device: /Mobi|Android|iPhone/i.test(navigator.userAgent)
    ? "Mobile"
    : "Desktop",
  utm: new URLSearchParams(window.location.search).get("utm_source") || "Organic",
});
setSearchCourse("");
    } else {
      
       setIsErrorCase(true);   
  setShowSuccessScreen(true);
    }

  } catch (error) {
    console.error(error);
    setSuccessMsg("❌ Server error. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};
if (loadingFormCheck) {
  return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
}

if (!isValidForm) {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>❌ Invalid Enquiry Link</h2>
      <p>This form is not available.</p>
    </div>
  );
}

  return (
    <>
   {showSuccessScreen && (
  <div className="success-overlay">

    <div className="success-card-new">

      {/* CLOSE BUTTON */}
      {/* <button
        className="close-btn"
        onClick={() => setShowSuccessScreen(false)}
      >
        ✖
      </button> */}

      {/* ICON */}
      <div className="success-icon-circle">
         {/* <span className="success-tick">✔</span> */}
         <span className="success-tick">
  {isErrorCase ? "✖" : "✔"}
</span>
        
      </div>

      {/* TITLE */}
      {/* <h2 className="success-title">Success</h2> */}
<h2 className="success-title">
  {isErrorCase ? "Already Registered" : "Success"}
</h2>
      {/* MESSAGE */}
  <div className="success-scroll-content">

  {!isErrorCase ? (
    <>
      <p>Your form has been successfully submitted.</p>
      <p>Our team will review your details and get back to you within 24 hours.</p>

      <div className="extra-section">
        <p>📌 In the meantime, here's what you can do:</p>

        <p>✅ Explore our courses:</p>
        <a href="https://www.hachion.co/courses" target="_blank">
          https://www.hachion.co/courses
        </a>

<p style={{ marginTop: "10px" }}>
  ✅ Connect with us on WhatsApp:
  <br />
  <a 
    href={whatsappLink} 
    target="_blank" 
    rel="noopener noreferrer"
    style={{ color: "blue", textDecoration: "underline" }}
  >
    {whatsappNumber}
  </a>
</p>
        <p style={{ marginTop: "10px" }}>
          ✅ Follow us for updates, tips, and success stories
        </p>
      </div>
    </>
  ) : (
    <>
      <p>😊 Looks like you’ve already registered for this course!</p>

      <p>No worries — our team will reach out to you soon.</p>

      <p>
        Need quicker help?
        <br />
        Chat with us on WhatsApp.
      </p>
    </>
  )}

</div>
      {/* BUTTON */}
      <button
        className="continue-btn-new"
        onClick={() => setShowSuccessScreen(false)}
      >
        Close
      </button>

    </div>

  </div>
)}
    <div className="enquiry-container">

      <div className="top-banner">
        <img src="/hachionlogo.webp" alt="Hachion Banner" />
      </div>

      <div className="headline-box">
        <h1>Get FREE Demo + Career Roadmap + 10% Discount</h1>
        <p>⏱️ Takes only 30 seconds</p>
        <span className="privacy">
          We respect your privacy. We’ll never share your data.
        </span>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
        
<label className="field-label">
  Email Address <span className="required">*</span>
</label>
<input
  type="email"
  name="email"
  value={formData.email}
  placeholder="Your email address *"
  required
  onChange={handleChange}
/>

<label className="field-label">
  Full Name <span className="required">*</span>
</label>
<input
  type="text"
  name="name"
  value={formData.name}
  placeholder="Full Name *"
  required
  onChange={handleChange}
/>
<label className="field-label">
  Phone / Whatsapp Number <span className="required">*</span>
</label>
<div className="phone-field-container">

  <button
    type="button"
    onClick={(e) => setAnchorEl(e.currentTarget)}
    className="country-select-button"
  >
    <Flag code={selectedCountry.flag} className="country-flag-icon" />
    <span className="country-code-display">
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
        <Flag code={country.flag} className="country-flag-icon menu-flag" />
        {country.name} ({country.code})
      </MenuItem>
    ))}
  </Menu>
<input
  type="tel"
  className="phone-number-input-field"
  ref={mobileInputRef}
  value={formData.phone}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "");

    setFormData({
      ...formData,
      phone: value,
    });

    
    if (value.length <= 10) {
      setPhoneError("");
    }
  }}
  onBlur={() => {
    
    if (formData.phone.length !== 10) {
      setPhoneError("Mobile number must be 10 digits");
    } else {
      setPhoneError("");
    }
  }}
  placeholder="Enter your mobile number"
/>
</div>
{phoneError && (
  <div className="phone-error-text">
    {phoneError}
  </div>
)}
<label className="field-label">
  Training Program <span className="required">*</span>
</label>
<div style={{ position: "relative" }}>
  <input
  type="text"
  placeholder="Search & Select Training Program..."
  value={searchCourse}
  onChange={(e) => {
    setSearchCourse(e.target.value);
    setFormData((prev) => ({
      ...prev,
      course: e.target.value
    }));
  }}
  onFocus={() => setShowDropdown(true)}   
  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
    style={{
      width: "100%",
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #ccc"
    }}
  />

  {/* Dropdown list */}
  {showDropdown && (
    <div style={{
      position: "absolute",
      width: "100%",
      background: "#fff",
      border: "1px solid #ccc",
      maxHeight: "150px",
      overflowY: "auto",
      zIndex: 1000
    }}>
      {filteredCourses.map((course) => (
        <div
          key={course.id}
         onMouseDown={() => {
  setSearchCourse(course.courseName);
  setFormData((prev) => ({
    ...prev,
    course: course.courseName
  }));
  setShowDropdown(false);
}}
          style={{
            padding: "10px",
            cursor: "pointer",
            borderBottom: "1px solid #eee"
          }}
        >
          {course.courseName}
        </div>
      ))}
    </div>
  )}
</div>
     <div className="row-two-fields">

  {/* STATE */}
  <div className="field-box">
    <label className="field-label">
      State 
    </label>
    <input
      type="text"
      name="state"
      value={formData.state}
      placeholder="State"
      onChange={handleChange}
    />
  </div>

  {/* TIMEZONE */}
  <div className="field-box">
    <label className="field-label">
      Timezone <span className="required">*</span>
    </label>
    <input
  type="text"
  name="timezone"
  value={formData.timezone}
  placeholder="Timezone (IST, CST, etc.)"
  onChange={handleChange}
/>
  </div>

</div>
<div style={{ marginTop: "10px" }}>
  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
    
    
    <input
      type="checkbox"
      name="whatsappConsent"
      checked={formData.whatsappConsent}
      onChange={(e) =>
        setFormData({
          ...formData,
          whatsappConsent: e.target.checked
        })
      }
      style={{
        width: "16px",
        height: "16px",
        accentColor: "#000"   
      }}
    />

    I agree to receive updates via WhatsApp

  </label>
</div>
          <input type="hidden" name="source" value={formData.source} />
          <input type="hidden" name="device" value={formData.device} />
          
          <input type="hidden" name="utm" value={formData.utm} />

          <p className="urgency">⚠️ Limited seats available</p>

<button
  type="submit"
  className={`submit-btn ${!isFormValid ? "disabled-btn" : ""}`}
  disabled={!isFormValid || isSubmitting}
>
  {isSubmitting ? "Submitting... Please wait ⏳ then move to the success message screen" : "🚀 Book Free Demo"}
</button>
{successMsg && (
  <div style={{
    marginTop: "10px",
    textAlign: "center",
    color: successMsg.includes("successfully") ? "green" : "red",
    fontWeight: "bold"
  }}>
    {successMsg}
  </div>
)}
        </form>
      </div>

      <div className="trust-box">
        ⭐ 5000+ Students Trained | 4.8 Rating | US-Based Trainers
        <br />
        📞 Our team will contact you within 24 hrs
      </div>

    </div>
    </>
  );
};

export default EnquiryPage;