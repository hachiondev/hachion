import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import styles from './Enrollmentform.module.css';
import { FaUser, FaPhone, FaEnvelope, FaChevronDown, FaCheck, FaTimes } from 'react-icons/fa';
import { HiOutlineAcademicCap } from 'react-icons/hi';
import { AiFillCaretDown } from 'react-icons/ai';
import Flag from 'react-world-flags';

import { useCourses } from '../../../../Api/hooks/HomePageApi/NavbarApi/useCourses';
import { useUserProfile } from "../../../../Api/hooks/CourseApi/useUserProfile";
import { useTopBarApi } from '../../../../Api/hooks/HomePageApi/useTopBarApi';
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCourseByName } from "../../../../Api/hooks/CourseApi/useCourseByName";

import { countries, getDefaultCountry } from "../../../../countryUtils";

// Import Google reCAPTCHA
import ReCAPTCHA from "react-google-recaptcha";



const EnrollmentForm = ({ onClose, onSuccess }) => {

  const { courseName: courseNameSlug } = useParams();

  const courseName = courseNameSlug
    ? decodeURIComponent(courseNameSlug)
      .replace(/---+/g, " - ")
      .replace(/\b([a-zA-Z]{2,3})-(\d{3})\b/g, "$1@@$2")
      .replace(/[-_]+/g, " ")
      .replace(/@@/g, "-")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase()
    : "";

  const { data: course } = useCourseByName(courseName);

  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 23,
    minutes: 25,
    seconds: 17
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: null,
    feedback: '',
    remark: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [phoneValidation, setPhoneValidation] = useState({
    isValid: false,
    showIcon: false
  });
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [recaptchaError, setRecaptchaError] = useState("");
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());
  const countryDropdownRef = useRef(null);
  const mobileInputRef = useRef(null);

  const { data: coursesData = [], isLoading: loadingCourses, error: coursesError } = useCourses();
  const { data: profileData, isLoading: profileLoading, error: profileError } = useUserProfile();

  // Use the useTopBarApi hook - same as in QueryFormWidget
  const { 
    countryCode, 
    whatsappNumber, 
    whatsappLink, 
    isLoading: countryLoading,
    error: countryError 
  } = useTopBarApi();

  // Auto-detect and set country based on API response - EXACTLY like in QueryFormWidget
  useEffect(() => {
    if (countryCode && !countryLoading) {
      const matchedCountry = countries.find((c) => c.flag === countryCode);
      if (matchedCountry) {
        setSelectedCountry(matchedCountry);
        // console.log(`Country auto-detected: ${matchedCountry.name} (${countryCode})`);
      }
    }
  }, [countryCode, countryLoading]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setIsCountryMenuOpen(false);
      }
    };

    if (isCountryMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
        
        // Find matching country for the detected code
        const matchedCountry = countries.find((c) => c.code === detectedCode);
        if (matchedCountry) {
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!course || !coursesData || !Array.isArray(coursesData)) return;

    const courseData = course?.data || course;

    const apiCourseName = (
      courseData.name ||
      courseData.courseName ||
      courseData.title ||
      ""
    ).toLowerCase().trim();

    if (!apiCourseName) return;

    const matchedOption = coursesData
      .map((c) => ({
        value: c.id || c._id || c.courseId || c.name,
        label: c.name || c.title || c.courseName,
        originalData: c,
      }))
      .find(
        (opt) =>
          opt.label &&
          opt.label.toLowerCase().trim() === apiCourseName
      );

    if (matchedOption) {
      setFormData((prev) => ({
        ...prev,
        course: matchedOption,
      }));
    }
  }, [course, coursesData]);

  useEffect(() => {
    const digits = formData.phone.replace(/\D/g, '');
    const showIcon = digits.length > 0;
    
    if (digits.length > 10) {
      setPhoneValidation({
        isValid: false,
        showIcon: true
      });
      setErrors((prev) => ({
        ...prev,
        phone: 'invalid',
      }));
    } else if (digits.length === 10) {
      setPhoneValidation({
        isValid: true,
        showIcon: true
      });
      setErrors((prev) => ({ ...prev, phone: '' }));
    } else if (digits.length < 10 && digits.length > 0) {
      setPhoneValidation({
        isValid: false,
        showIcon: true
      });
      setErrors((prev) => ({
        ...prev,
        phone: 'invalid',
      }));
    } else {
      setPhoneValidation({
        isValid: false,
        showIcon: false
      });
      setErrors((prev) => ({ ...prev, phone: '' }));
    }
  }, [formData.phone]);

  const courseOptions = React.useMemo(() => {
    if (!coursesData || !Array.isArray(coursesData)) {
      return [
        { value: 'web-dev', label: 'Web Development' },
        { value: 'data-science', label: 'Data Science' },
        { value: 'digital-marketing', label: 'Digital Marketing' },
        { value: 'ui-ux', label: 'UI/UX Design' },
        { value: 'mobile-dev', label: 'Mobile App Development' },
      ];
    }

    return coursesData.map(course => ({
      value: course.courseName,
      label: course.courseName,
      originalData: course
    }));

  }, [coursesData]);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '30px',
      border: state.isFocused ? '2px solid #00bcd4' : '2px solid #e0e0e0',
      borderRadius: '8px',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(0, 188, 212, 0.1)' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#00bcd4' : '#ccc',
      },
      paddingLeft: '45px',
      fontSize: '14px',
      backgroundColor: 'white',
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 99999,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#999',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#333',
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      padding: '12px 16px',
      fontSize: '14px',
      backgroundColor: state.isSelected ? '#00bcd4' : state.isFocused ? '#f0f9ff' : 'white',
      color: state.isSelected ? 'white' : '#333',
      cursor: 'pointer',
    }),
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleCourseChange = (selectedOption) => {
    setFormData({ ...formData, course: selectedOption });
    if (errors.course) {
      setErrors({ ...errors, course: '' });
    }
  };

  const handlePhoneInput = (e) => {
    const value = e.target.value;

    if (!/^[0-9\-\+\(\)\s]*$/.test(value)) return;

    const digitsOnly = value.replace(/\D/g, '');

    if (digitsOnly.length > 10) {
      setPhoneValidation({
        isValid: false,
        showIcon: true
      });
      setErrors((prev) => ({
        ...prev,
        phone: 'invalid',
      }));
      setFormData({ ...formData, phone: value });
      return;
    }

    if (digitsOnly.length === 10) {
      setPhoneValidation({
        isValid: true,
        showIcon: true
      });
      setErrors((prev) => ({ ...prev, phone: '' }));
    } else if (digitsOnly.length > 0) {
      setPhoneValidation({
        isValid: false,
        showIcon: true
      });
      setErrors((prev) => ({
        ...prev,
        phone: 'invalid',
      }));
    } else {
      setPhoneValidation({
        isValid: false,
        showIcon: false
      });
      setErrors((prev) => ({ ...prev, phone: '' }));
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

    if (!formData.name.trim()) newErrors.name = 'Name is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (phoneDigits.length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    } else if (phoneDigits.length > 10) {
      newErrors.phone = 'Phone number cannot exceed 10 digits';
    }

    if (!formData.course) newErrors.course = 'Please select a course';

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
          remark: formData.remark || '',
          country: selectedCountry.name,
          countryCode: selectedCountry.code,
          countryFlag: selectedCountry.flag,
          detectedCountry: countryCode || 'Not detected',
          recaptchaToken: recaptchaValue,
          timestamp: new Date().toISOString()
        };
        await axios.post("https://api.test.hachion.co/api/webhook/enrollment", submissionData);
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
    const digits = formData.phone.replace(/\D/g, '');
    if (digits.length > 10 || (digits.length > 0 && digits.length < 10)) {
      return styles.error;
    }
    return '';
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formCard}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>

        {/* Image Section with Overlay */}
        <div className={styles.imageSection}>
          <div className={styles.liveIndicator}>
            <span className={styles.liveDot}></span>
            Live Class Starts in...
          </div>

          <div className={styles.imageContainer}>
            <img
              src="/enrollmentformbg.jpg"
              alt="Instructor"
              className={styles.instructorImage}
            />
          </div>

          {/* Countdown Timer Overlay */}
          {/* <div className={styles.countdown}>
            <div className={styles.timeBox}>
              <div className={styles.timeValue}>{String(timeLeft.days).padStart(2, '0')}</div>
              <div className={styles.timeLabel}>Days</div>
            </div>
            <div className={styles.timeBox}>
              <div className={styles.timeValue}>{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className={styles.timeLabel}>hours</div>
            </div>
            <div className={styles.timeBox}>
              <div className={styles.timeValue}>{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className={styles.timeLabel}>minutes</div>
            </div>
            <div className={styles.timeBox}>
              <div className={styles.timeValue}>{timeLeft.seconds}</div>
              <div className={styles.timeLabel}>Sec</div>
            </div>
          </div> */}
        </div>

        {/* Form Section */}
        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>Enroll Free Online Demo Class</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Name Input */}
            <div className={styles.formGroup}>
              <div className={styles.inputWithIcon}>
                <FaUser className={styles.inputIcon} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`${styles.formInput} ${errors.name ? styles.error : ''}`}
                  placeholder="Your Name *"
                  required
                />
              </div>
              {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
            </div>

            {/* Phone Input - Custom Built-in Dropdown */}
            <div className={styles.formGroup}>
              <div className={styles.phoneInputWrapper}>
                <div className={styles.countryDropdownWrapper} ref={countryDropdownRef}>
                  <div className={styles.countryCodeSelector}>
                    <FaPhone className={styles.inputIcon} />
                    <button
                      type="button"
                      onClick={() => setIsCountryMenuOpen(!isCountryMenuOpen)}
                      className={styles.countrySelectButton}
                      disabled={isSubmitting}
                    >
                      <Flag
                        code={selectedCountry.flag}
                        className={styles.countryFlagIcon}
                        height="14"
                        width="20"
                      />
                      <span className={styles.countryCodeDisplay}>
                        {selectedCountry.code}
                      </span>
                      <AiFillCaretDown className={styles.selectArrow} />
                    </button>

                    {/* Custom Country Dropdown Menu */}
                    {isCountryMenuOpen && (
                      <div className={styles.countryMenu}>
                        {countries.map((country) => (
                          <div
                            key={`${country.name}-${country.code}`}
                            onClick={() => handleCountrySelect(country)}
                            className={`${styles.countryMenuItem} ${
                              country.flag === countryCode ? styles.detectedCountry : ''
                            }`}
                          >
                            <Flag 
                              code={country.flag} 
                              className={styles.countryFlagIcon} 
                              height="14"
                              width="20"
                            />
                            <span>
                              {country.name} ({country.code})
                              {country.flag === countryCode && (
                                <span style={{ color: '#28a745', marginLeft: '4px' }}>(Detected)</span>
                              )}
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
                      if (!/[0-9\-\+\(\)\s]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className={`${styles.formInput} ${styles.phoneInput} ${getPhoneBorderClass()}`}
                    placeholder="Phone Number *"
                    required
                  />
                  {phoneValidation.showIcon && (
                    <div className={styles.phoneValidationIcon}>
                      {phoneValidation.isValid ? (
                        <FaCheck className={styles.validIcon} />
                      ) : (
                        <FaTimes className={styles.invalidIcon} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div className={styles.formGroup}>
              <div className={styles.inputWithIcon}>
                <FaEnvelope className={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${styles.formInput} ${errors.email ? styles.error : ''}`}
                  placeholder="Email Address *"
                  required
                />
              </div>
              {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
            </div>

            {/* Course Select */}
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
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  components={{
                    DropdownIndicator: () => <FaChevronDown className={styles.selectArrowInside} />,
                    IndicatorSeparator: null
                  }}
                />
              </div>
              {errors.course && <span className={styles.errorMessage}>{errors.course}</span>}
            </div>

            {/* Google reCAPTCHA */}
            <div className={styles.formGroup}>
              <div className={styles.recaptchaContainer}>
                <ReCAPTCHA
                  sitekey="6LcrZWMsAAAAACC6TICHN2N0sybzqO0uM9ozeBf-"
                  onChange={handleRecaptchaChange}
                  onExpired={handleRecaptchaExpired}
                  theme="light"
                  size="normal"
                />
                {recaptchaError && (
                  <span className={styles.errorMessage}>{recaptchaError}</span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || loadingCourses || !!successMessage || formData.phone.replace(/\D/g, '').length > 10}
              className={styles.submitBtn}
            >
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

            {/* ✅ Success Message */}
            {successMessage && (
              <div style={{ marginTop: "10px", color: "green", fontWeight: "600", textAlign: "center" }}>
                {successMessage}
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentForm;