"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./EnquiryPage.module.css";
import CountryFlag from "@/components/common/CountryFlag";
import { Menu, MenuItem } from "@mui/material";
import { AiFillCaretDown } from "react-icons/ai";
import { countries, getDefaultCountry } from "@/countryUtils";
import { useTopBarApi } from "@/Api/hooks/HomePageApi/useTopBarApi";
import { getCoursesSummary } from "./HomePage/TrendingSection/services/coursesService";
import facebook from "@/assets/facebook.webp";
import twitter from "@/assets/twitter.webp";
import youtube from "@/assets/youtube.webp";
import linkedin from "@/assets/linkedin.webp";
import instagram from "@/assets/instagram.webp";
import { API_BASE_URL } from "@/lib/apiBase";

const EMPTY_ARRAY = [];

const EnquiryPage = () => {
  const rawParams = useParams();
  const refName = decodeURIComponent(rawParams.refName || "");

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
    whatsappConsent: true,
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isErrorCase, setIsErrorCase] = useState(false);
  const isFormValid = formData.email && formData.name && formData.phone && formData.course;
  const mobileInputRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());
  const [courses, setCourses] = useState(EMPTY_ARRAY);
  const [searchCourse, setSearchCourse] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { countryCode, whatsappNumber, whatsappLink, isLoading: countryLoading } = useTopBarApi();
  const filteredCourses = courses.filter((course) => course.courseName.toLowerCase().includes(searchCourse.toLowerCase()));
  const [validForms, setValidForms] = useState(EMPTY_ARRAY);
  const [isValidForm, setIsValidForm] = useState(true);
  const [loadingFormCheck, setLoadingFormCheck] = useState(true);

  useEffect(() => {
    const fetchValidForms = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/employees/google-form-urls`);
        const data = await res.json();
        const formNames = data.map((url) => url.split("enquiryform/")[1]);
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
    // Syncs from the browser's URL/referrer/user-agent (external sources).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((prev) => ({
      ...prev,
      source: document.referrer || "Direct",
      device: /Mobi|Android|iPhone/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
      utm: params.get("utm_source") || "Organic",
      referrerName: refName || "default",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCoursesSummary();
        const sortedCourses = data.sort((a, b) => a.courseName.localeCompare(b.courseName));
        setCourses(sortedCourses);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (countryCode && !countryLoading) {
      const matchedCountry = countries.find((c) => c.flag === countryCode);
      if (matchedCountry) {
        // Syncs from the detected-country API result (an external source).
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedCountry(matchedCountry);
        setFormData((prev) => ({ ...prev, timezone: matchedCountry.timezone || "" }));
      }
    }
  }, [countryCode, countryLoading]);

  useEffect(() => {
    if (selectedCountry && selectedCountry.timezone) {
      // Syncs from the selected country (an external, user-driven source).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => ({ ...prev, timezone: selectedCountry.timezone }));
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
          country: prev.country || data.country_name || "",
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
    setFormData((prev) => ({ ...prev, timezone: country.timezone || prev.timezone }));
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
        whatsappConsent: formData.whatsappConsent,
      };
      const res = await fetch(`${API_BASE_URL}/enquiryformcreate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.status === "success") {
        setIsErrorCase(false);
        setShowSuccessScreen(true);
        setFormData((prev) => ({
          ...prev,
          email: "",
          name: "",
          phone: "",
          course: "",
          country: "",
          source: document.referrer || "Direct",
          device: /Mobi|Android|iPhone/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
          utm: new URLSearchParams(window.location.search).get("utm_source") || "Organic",
        }));
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
    return (
      <div className={styles.pageWrapper} style={{ textAlign: "center", marginTop: "50px" }}>
        Loading...
      </div>
    );
  }
  if (!isValidForm) {
    return (
      <div className={styles.pageWrapper} style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>❌ Invalid Enquiry Link</h2>
        <p>This form is not available.</p>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {showSuccessScreen && (
        <div className={styles["success-overlay"]}>
          <div className={styles["success-card-new"]}>
            <div className={styles["success-icon-circle"]}>
              <span className={styles["success-tick"]}>{isErrorCase ? "✖" : "✔"}</span>
            </div>

            <h2 className={styles["success-title"]}>{isErrorCase ? "Already Registered" : "Success"}</h2>
            <div className={styles["success-scroll-content"]}>
              {!isErrorCase ? (
                <>
                  <p>Your form has been successfully submitted.</p>
                  <p>Our team will review your details and get back to you within 24 hours.</p>

                  <div className={styles["extra-section"]}>
                    <p>📌 In the meantime, here&apos;s what you can do:</p>

                    <p>✅ Explore our courses:</p>
                    <a href="https://www.hachion.co/courses" target="_blank" rel="noopener noreferrer">
                      https://www.hachion.co/courses
                    </a>

                    <p style={{ marginTop: "10px" }}>
                      ✅ Connect with us on WhatsApp:
                      <br />
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ color: "blue", textDecoration: "underline" }}>
                        {whatsappNumber}
                      </a>
                    </p>
                    <p style={{ marginTop: "10px" }}>✅ Follow us for updates, tips, and success stories</p>
                    <div className={styles["social-icons"]}>
                      <a href="https://www.facebook.com/hachion.official/" target="_blank" rel="noopener noreferrer">
                        <img src={facebook.src} alt="facebook-icon" loading="lazy" className={styles["social-icon"]} />
                      </a>
                      <a href="https://x.com/hachionofficial" target="_blank" rel="noopener noreferrer">
                        <img src={twitter.src} alt="twitter-icon" loading="lazy" className={styles["social-icon"]} />
                      </a>
                      <a href="https://www.linkedin.com/company/hachion" target="_blank" rel="noopener noreferrer">
                        <img src={linkedin.src} alt="linkedin-icon" loading="lazy" className={styles["social-icon"]} />
                      </a>
                      <a href="https://www.instagram.com/hachion.official/" target="_blank" rel="noopener noreferrer">
                        <img src={instagram.src} alt="instagram-icon" loading="lazy" className={styles["social-icon"]} />
                      </a>
                      <a href="https://www.youtube.com/@hachion.official" target="_blank" rel="noopener noreferrer">
                        <img src={youtube.src} alt="youtube" loading="lazy" className={styles["social-icon"]} />
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p>😊 Looks like you&apos;ve already registered for this course!</p>
                  <p>No worries — our team will reach out to you soon.</p>
                  <p>
                    Need quicker help?
                    <br />
                    Chat with us on WhatsApp.
                  </p>
                </>
              )}
            </div>
            <button className={styles["continue-btn-new"]} onClick={() => setShowSuccessScreen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
      <div className={styles["enquiry-container"]}>
        <div className={styles["top-banner"]}>
          <img src="/Hachion-logo.png" alt="Hachion Banner" />
        </div>

        <div className={styles["headline-box"]}>
          <h1>Get FREE Demo + Career Roadmap + 10% Discount</h1>
          <p>⏱️ Takes only 30 seconds</p>
          <span className={styles.privacy}>We respect your privacy. We&apos;ll never share your data.</span>
        </div>

        <div className={styles["form-card"]}>
          <form onSubmit={handleSubmit}>
            <label className={styles["field-label"]}>
              Email <span className={styles.required}>*</span>
            </label>
            <input type="email" name="email" value={formData.email} placeholder="Enter your email" required onChange={handleChange} />

            <label className={styles["field-label"]}>
              Full Name <span className={styles.required}>*</span>
            </label>
            <input type="text" name="name" value={formData.name} placeholder="Enter your full name" required onChange={handleChange} />
            <label className={styles["field-label"]}>
              Phone / Whatsapp Number <span className={styles.required}>*</span>
            </label>
            <div className={styles["phone-field-container-form"]}>
              <button type="button" onClick={(e) => setAnchorEl(e.currentTarget)} className={styles["country-select-button"]}>
                <CountryFlag code={selectedCountry.flag} className={styles["country-flag-icon"]} />
                <span className={styles["country-code-display"]}>
                  {selectedCountry.flag} ({selectedCountry.code})
                </span>
                <AiFillCaretDown />
              </button>

              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                {countries.map((country) => (
                  <MenuItem key={country.code} onClick={() => handleCountrySelect(country)}>
                    <CountryFlag code={country.flag} className={styles["country-flag-icon"]} />
                    {country.name} ({country.code})
                  </MenuItem>
                ))}
              </Menu>
              <input
                type="tel"
                className={styles["phone-number-input-field"]}
                ref={mobileInputRef}
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setFormData({ ...formData, phone: value });
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
            {phoneError && <div className={styles["phone-error-text"]}>{phoneError}</div>}
            <label className={styles["field-label"]}>
              Training Program <span className={styles.required}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search & Select Training Program..."
                value={searchCourse}
                onChange={(e) => {
                  setSearchCourse(e.target.value);
                  setFormData((prev) => ({ ...prev, course: e.target.value }));
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              />

              {showDropdown && (
                <div className={styles["show-dropdown"]}>
                  {filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      onMouseDown={() => {
                        setSearchCourse(course.courseName);
                        setFormData((prev) => ({ ...prev, course: course.courseName }));
                        setShowDropdown(false);
                      }}
                      style={{ padding: "10px", cursor: "pointer", borderBottom: "1px solid #eee" }}
                    >
                      {course.courseName}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={styles["row-two-fields"]}>
              <div className={styles["field-box"]}>
                <label className={styles["field-label"]}>State</label>
                <input type="text" name="state" value={formData.state} placeholder="State" onChange={handleChange} />
              </div>

              <div className={styles["field-box"]}>
                <label className={styles["field-label"]}>
                  Timezone <span className={styles.required}>*</span>
                </label>
                <input type="text" name="timezone" value={formData.timezone} placeholder="Timezone (IST, CST, etc.)" onChange={handleChange} />
              </div>
            </div>
            <div style={{ marginTop: "10px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
                <input
                  type="checkbox"
                  name="whatsappConsent"
                  checked={formData.whatsappConsent}
                  onChange={(e) => setFormData({ ...formData, whatsappConsent: e.target.checked })}
                  style={{ width: "16px", height: "16px", accentColor: "#000" }}
                />
                I agree to receive updates via WhatsApp
              </label>
            </div>
            <input type="hidden" name="source" value={formData.source} readOnly />
            <input type="hidden" name="device" value={formData.device} readOnly />
            <input type="hidden" name="utm" value={formData.utm} readOnly />

            <p className={styles.urgency}>⚠️ Limited seats available</p>

            <button type="submit" className={styles["submit-btn"] + (isFormValid ? "" : " " + styles["disabled-btn"])} disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? "Submitting... Please wait ⏳ then move to the success message screen" : "🚀 Book Free Demo"}
            </button>
            {successMsg && (
              <div style={{ marginTop: "10px", textAlign: "center", color: successMsg.includes("successfully") ? "green" : "red", fontWeight: "bold" }}>
                {successMsg}
              </div>
            )}
          </form>
        </div>

        <div className={styles["trust-box"]}>
          ⭐ 5000+ Students Trained | 4.8 Rating | US-Based Trainers
          <br />
          📞 Our team will contact you within 24 hrs
        </div>
      </div>
    </div>
  );
};

export default EnquiryPage;
