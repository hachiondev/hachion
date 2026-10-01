"use client";

import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import styles from "./Enrollmentform.module.css";
import { FaUser, FaPhone, FaEnvelope, FaChevronDown, FaCheck, FaTimes } from "react-icons/fa";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { AiFillCaretDown } from "react-icons/ai";
import CountryFlag from "@/components/common/CountryFlag";
import { useCourses } from "@/Api/hooks/HomePageApi/NavbarApi/useCourses";
import { useUserProfile } from "@/Api/hooks/CourseApi/useUserProfile";
import { useTopBarApi } from "@/Api/hooks/HomePageApi/useTopBarApi";
import axios from "axios";
import { useCourseByName } from "@/Api/hooks/CourseApi/useCourseByName";
import { useCourseApiName } from "@/components/UserPanel/CoursePage/CourseApiNameContext";
import { countries, getDefaultCountry } from "@/countryUtils";
import ReCAPTCHA from "react-google-recaptcha";
import { API_BASE_URL } from "@/lib/apiBase";

// Ported from the CRA app's
// src/Components/UserPanel/NewcoursePage/components/EnrollmentForm.jsx.
// useParams -> next/navigation; react-world-flags -> the CountryFlag
// dynamic-import wrapper already used elsewhere in this Next.js app (see
// components/common/CountryFlag.jsx) instead of importing the package
// directly, matching the established bundle-size optimization.
const EnrollmentForm = ({ onClose, onSuccess }) => {
  const courseName = useCourseApiName();
  const { data: course } = useCourseByName(courseName);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    course: null,
    feedback: "",
    remark: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [phoneValidation, setPhoneValidation] = useState({ isValid: false, showIcon: false });
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [recaptchaError, setRecaptchaError] = useState("");
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());
  const countryDropdownRef = useRef(null);
  const mobileInputRef = useRef(null);
  const { data: coursesData = [], isLoading: loadingCourses } = useCourses();
  const { data: profileData } = useUserProfile();

  const { countryCode, isLoading: countryLoading } = useTopBarApi();

  useEffect(() => {
    if (countryCode && !countryLoading) {
      const matchedCountry = countries.find((c) => c.flag === countryCode);
      if (matchedCountry) {
        // Syncs from the detected-country API result (an external source).
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedCountry(matchedCountry);
      }
    }
  }, [countryCode, countryLoading]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setIsCountryMenuOpen(false);
      }
    };
    if (isCountryMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCountryMenuOpen]);
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsCountryMenuOpen(false);
    mobileInputRef.current?.focus();
  };
  useEffect(() => {
    if (!profileData) return;
    const profile = profileData?.data || profileData?.user || profileData || {};
    let phoneNumber = "";
    const fullPhone = profile.phone || profile.mobile || profile.mobileNumber;
    if (fullPhone) {
      const match = fullPhone.match(/^(\+\d+)\s*(.*)$/);
      if (match) {
        const detectedCode = match[1];
        phoneNumber = match[2];

        const matchedCountry = countries.find((c) => c.code === detectedCode);
        if (matchedCountry) {
          // Syncs from the user's profile data (an external source).
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setSelectedCountry(matchedCountry);
        }
      } else {
        phoneNumber = fullPhone;
      }
    }
    setFormData((prev) => ({
      ...prev,
      name: profile.name ?? prev.name,
      email: profile.email ?? prev.email,
      phone: phoneNumber ?? prev.phone,
    }));
  }, [profileData]);
  const courseOptions = React.useMemo(() => {
    if (!coursesData || !Array.isArray(coursesData)) {
      return [
        { value: "web-dev", label: "Web Development" },
        { value: "data-science", label: "Data Science" },
        { value: "digital-marketing", label: "Digital Marketing" },
        { value: "ui-ux", label: "UI/UX Design" },
        { value: "mobile-dev", label: "Mobile App Development" },
      ];
    }
    return coursesData.map((c) => ({
      value: c.courseName,
      label: c.courseName,
      originalData: c,
    }));
  }, [coursesData]);
  useEffect(() => {
    if (!course || !coursesData || !Array.isArray(coursesData)) return;
    const courseData = course?.data || course;
    const apiCourseName = (courseData.name || courseData.courseName || courseData.title || "").toLowerCase().trim();
    if (!apiCourseName) return;
    const matchedOption = courseOptions.find((opt) => opt.label && opt.label.toLowerCase().trim() === apiCourseName);
    if (matchedOption) {
      // Syncs from the fetched course data (an external source).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => ({ ...prev, course: matchedOption }));
    }
  }, [course, coursesData, courseOptions]);
  // Phone validation is recomputed whenever formData.phone (an external,
  // user-input source) changes. Kept as an effect (not a render-time
  // derivation) because it also merges into the shared `errors` object used
  // across every other field's own handlers.
  useEffect(() => {
    const digits = formData.phone.replace(/\D/g, "");
    const showIcon = digits.length > 0;
    if (digits.length > 10) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhoneValidation({ isValid: false, showIcon: true });
      setErrors((prev) => ({ ...prev, phone: "invalid" }));
    } else if (digits.length === 10) {
      setPhoneValidation({ isValid: true, showIcon: true });
      setErrors((prev) => ({ ...prev, phone: "" }));
    } else if (digits.length < 10 && digits.length > 0) {
      setPhoneValidation({ isValid: false, showIcon: true });
      setErrors((prev) => ({ ...prev, phone: "invalid" }));
    } else {
      setPhoneValidation({ isValid: false, showIcon });
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  }, [formData.phone]);
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "40px",
      border: state.isFocused ? "2px solid #00AEEF" : "2px solid #e0e0e0",
      borderRadius: "8px",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(0, 188, 212, 0.1)" : "none",
      "&:hover": { borderColor: state.isFocused ? "#00AEEF" : "#ccc" },
      paddingLeft: "36px",
      fontSize: "14px",
      backgroundColor: "white",
    }),
    menuPortal: (base) => ({ ...base, zIndex: 99999 }),
    placeholder: (provided) => ({ ...provided, color: "#999" }),
    singleValue: (provided) => ({ ...provided, color: "#333" }),
    menu: (provided) => ({ ...provided, borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", zIndex: 9999 }),
    option: (provided, state) => ({
      ...provided,
      padding: "12px 16px",
      fontSize: "14px",
      backgroundColor: state.isSelected ? "#00bcd4" : state.isFocused ? "#f0f9ff" : "white",
      color: state.isSelected ? "white" : "#333",
      cursor: "pointer",
    }),
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };
  const handleCourseChange = (selectedOption) => {
    setFormData({ ...formData, course: selectedOption });
    if (errors.course) {
      setErrors({ ...errors, course: "" });
    }
  };
  const handlePhoneInput = (e) => {
    const value = e.target.value;
    if (!/^[0-9\-+()\s]*$/.test(value)) return;
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length > 10) {
      setPhoneValidation({ isValid: false, showIcon: true });
      setErrors((prev) => ({ ...prev, phone: "invalid" }));
      setFormData({ ...formData, phone: value });
      return;
    }
    if (digitsOnly.length === 10) {
      setPhoneValidation({ isValid: true, showIcon: true });
      setErrors((prev) => ({ ...prev, phone: "" }));
    } else if (digitsOnly.length > 0) {
      setPhoneValidation({ isValid: false, showIcon: true });
      setErrors((prev) => ({ ...prev, phone: "invalid" }));
    } else {
      setPhoneValidation({ isValid: false, showIcon: false });
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
    setFormData({ ...formData, phone: value });
  };
  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
    setRecaptchaError("");
  };
  const handleRecaptchaExpired = () => {
    setRecaptchaValue(null);
    setRecaptchaError("reCAPTCHA has expired. Please verify again.");
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (phoneDigits.length < 10) {
      newErrors.phone = "Phone number must be at least 10 digits";
    } else if (phoneDigits.length > 10) {
      newErrors.phone = "Phone number cannot exceed 10 digits";
    }
    if (!formData.course) newErrors.course = "Please select a course";
    if (!recaptchaValue) {
      setRecaptchaError("Please verify that you're not a robot");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && recaptchaValue !== null;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const fullPhone = `${selectedCountry.code} ${formData.phone}`;
        const submissionData = {
          name: formData.name,
          email: formData.email,
          phone: fullPhone,
          course: formData.course.value,
          courseId: formData.course.originalData?.id || formData.course.originalData?._id,
          courseName: formData.course.label,
          remark: formData.remark || "",
          country: selectedCountry.name,
          countryCode: selectedCountry.code,
          countryFlag: selectedCountry.flag,
          detectedCountry: countryCode || "Not detected",
          recaptchaToken: recaptchaValue,
          timestamp: new Date().toISOString(),
        };
        await axios.post(`${API_BASE_URL}/api/webhook/enrollment`, submissionData);
        setSuccessMessage("✅ Thank you! Your enquiry has been submitted. We will contact you shortly.");
        setTimeout(() => {
          onClose();
        }, 3000);
      } catch (error) {
        alert("There was an error submitting the form. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  const getPhoneBorderClass = () => {
    const digits = formData.phone.replace(/\D/g, "");
    if (digits.length > 10 || (digits.length > 0 && digits.length < 10)) {
      return styles.error;
    }
    return "";
  };
  return (
    <div className={styles.pageContainer}>
      <div className={styles.formCard}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>

        <div className={styles.imageSection}>
          <div className={styles.imageContainer}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/enrollmentformbg.jpg" alt="Instructor" className={styles.instructorImage} />
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>Enroll Free Online Demo Class</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <div className={styles.inputWithIcon}>
                <FaUser className={styles.inputIcon} />
                <input type="text" name="name" value={formData.name} onChange={handleChange} className={`${styles.formInput} ${errors.name ? styles.error : ""}`} placeholder="Your Name *" required />
              </div>
              {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
            </div>

            <div className={styles.formGroup}>
              <div className={styles.phoneInputWrapper}>
                <div className={styles.countryDropdownWrapper} ref={countryDropdownRef}>
                  <div className={styles.countryCodeSelector}>
                    <FaPhone className={styles.inputIcon} />
                    <button type="button" onClick={() => setIsCountryMenuOpen(!isCountryMenuOpen)} className={styles.countrySelectButton} disabled={isSubmitting}>
                      <span className={styles.countryCodeDisplay}>{selectedCountry.code}</span>
                      <AiFillCaretDown className={styles.selectArrow} />
                    </button>

                    {isCountryMenuOpen && (
                      <div className={styles.countryMenu}>
                        {countries.map((country) => (
                          <div key={`${country.name}-${country.code}`} onClick={() => handleCountrySelect(country)} className={`${styles.countryMenuItem} ${country.flag === countryCode ? styles.detectedCountry : ""}`}>
                            <CountryFlag code={country.flag} className={styles.countryFlagIcon} height="14" width="20" />
                            <span>
                              {country.name} ({country.code})
                              {country.flag === countryCode && <span style={{ color: "#28a745", marginLeft: "4px" }}>(Detected)</span>}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.phoneInputContainer}>
                  <input
                    type="tel"
                    name="phone"
                    ref={mobileInputRef}
                    value={formData.phone}
                    onChange={handlePhoneInput}
                    onKeyDown={(e) => {
                      // Only veto a printable character the field doesn't accept. Modifier
                      // combos (Ctrl/Cmd+V/A/C), Enter, Home/End and other named keys - which
                      // includes the "Unidentified" key some mobile keyboards report - must
                      // pass through; handlePhoneInput already rejects bad content on change.
                      if (e.ctrlKey || e.metaKey || e.altKey || e.key.length > 1) return;
                      if (!/[0-9\-+()\s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className={`${styles.formInput} ${styles.phoneInput} ${getPhoneBorderClass()}`}
                    placeholder="Phone Number *"
                    required
                  />
                  {phoneValidation.showIcon && (
                    <div className={styles.phoneValidationIcon}>{phoneValidation.isValid ? <FaCheck className={styles.validIcon} /> : <FaTimes className={styles.invalidIcon} />}</div>
                  )}
                </div>
              </div>
              {/* "invalid" is the live per-keystroke flag (red border + icon); the readable
                  messages come from validateForm() on submit and were never rendered. */}
              {errors.phone && errors.phone !== "invalid" && <span className={styles.errorMessage}>{errors.phone}</span>}
            </div>

            <div className={styles.formGroup}>
              <div className={styles.inputWithIcon}>
                <FaEnvelope className={styles.inputIcon} />
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={`${styles.formInput} ${errors.email ? styles.error : ""}`} placeholder="Email Address *" required />
              </div>
              {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
            </div>

            <div className={styles.formGroup}>
              <div className={styles.selectWithIcon}>
                <HiOutlineAcademicCap className={styles.inputIcon} />
                <Select
                  value={formData.course}
                  onChange={handleCourseChange}
                  options={courseOptions}
                  placeholder="Select Course *"
                  styles={customStyles}
                  className={styles.reactSelectContainer}
                  classNamePrefix="react-select"
                  isSearchable={true}
                  isClearable={true}
                  isLoading={loadingCourses}
                  menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                  menuPosition="fixed"
                  components={{
                    DropdownIndicator: () => <FaChevronDown className={styles.selectArrowInside} />,
                    IndicatorSeparator: null,
                  }}
                />
              </div>
              {errors.course && <span className={styles.errorMessage}>{errors.course}</span>}
            </div>

            <div className={styles.formGroup}>
              <div className={styles.recaptchaContainer}>
                <ReCAPTCHA sitekey="6LcrZWMsAAAAACC6TICHN2N0sybzqO0uM9ozeBf-" onChange={handleRecaptchaChange} onExpired={handleRecaptchaExpired} theme="light" size="normal" />
                {recaptchaError && <span className={styles.errorMessage}>{recaptchaError}</span>}
              </div>
            </div>

            <button type="submit" disabled={isSubmitting || loadingCourses || !!successMessage || formData.phone.replace(/\D/g, "").length > 10} className={styles.submitBtn}>
              {isSubmitting ? (
                <>
                  <span className={styles.spinner}></span>
                  Processing...
                </>
              ) : (
                <>
                  <FaPhone className={styles.phoneIcon} />
                  Get A Call Back
                </>
              )}
            </button>

            {successMessage && <div style={{ marginTop: "10px", color: "green", fontWeight: "600", textAlign: "center" }}>{successMessage}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};
export default EnrollmentForm;
