import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import styles from './BlogInquiryForm.module.css';

// react-icons imports
import { FaRocket, FaStar, FaUsers, FaFlag, FaLock, FaExclamationTriangle } from 'react-icons/fa';
import { MdCheckCircle } from 'react-icons/md';
import { AiOutlineLoading3Quarters, AiFillCaretDown } from 'react-icons/ai';
import Flag from 'react-world-flags';

import { countries, getDefaultCountry } from '../../countryUtils';
import { useTopBarApi } from '../../Api/hooks/HomePageApi/useTopBarApi';
import { useUserProfile } from '../../Api/hooks/CourseApi/useUserProfile';

// ── Shared form content (used in both desktop & mobile) ──
const FormContent = ({
  blogTitle, formData, loading, error, success,
  handleChange, handleSubmit, phoneError,
  selectedCountry, isCountryMenuOpen, setIsCountryMenuOpen,
  handleCountrySelect, countryDropdownRef, mobileInputRef, countryCode
}) => {
  const checklistItems = ['Resume Preparation', 'Mock Interviews', 'Placement Assistance'];

  return (
    <>
      {/* Hero Banner */}
      <div className={styles.heroBanner}>
        {/* <FaRocket className={styles.heroIcon} />*/}🚀
        <div className={styles.heroText}>
          <h2 className={styles.heroTitle}>{`Start Your ${blogTitle} Career`}</h2>
          <p className={styles.heroSubtitle}>Live Online Training &nbsp;|&nbsp; Real Projects</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <FaStar className={styles.statIconStar} />
          <span className={styles.statValue}>4.8</span>
          <span className={styles.statLabel}>Rating</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <FaUsers className={styles.statIconUsers} />
          <span className={styles.statValue}>5000+</span>
          <span className={styles.statLabel}>Students</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <FaFlag className={styles.statIconFlag} />
          <span className={styles.statValue}>USA</span>
          <span className={styles.statLabel}>Focused</span>
        </div>
      </div>

      {/* Checklist */}
      <ul className={styles.checklist}>
        {checklistItems.map(item => (
          <li key={item} className={styles.checkItem}>
            <MdCheckCircle className={styles.checkIcon} />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <input
            type="text"
            className={`form-control ${styles.formControl}`}
            name="name"
            placeholder="Your Name *"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <input
            type="email"
            className={`form-control ${styles.formControl}`}
            name="email"
            placeholder="Email *"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        {/* Phone with Country Code */}
        <div className={styles.formGroup}>
          <div className={`${styles.phoneInputWrapper} ${phoneError ? styles.phoneInputWrapperError : ''}`}>
            <div className={styles.countryDropdownWrapper} ref={countryDropdownRef}>
              <div className={styles.countryCodeSelector}>
                <button
                  type="button"
                  onClick={() => setIsCountryMenuOpen(prev => !prev)}
                  className={styles.countrySelectButton}
                  disabled={loading}
                >
                  <span className={styles.countryCodeDisplay}>
                    {selectedCountry.code}
                  </span>
                  <AiFillCaretDown className={styles.selectArrow} />
                </button>

                {/* Country Dropdown Menu */}
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

            <input
              type="tel"
              ref={mobileInputRef}
              className={`form-control ${styles.formControl} ${styles.phoneInput}`}
              name="phone"
              placeholder="Phone *"
              value={formData.phone}
              onKeyDown={(e) => {
                if (
                  !/[0-9]/.test(e.key) &&
                  !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'].includes(e.key) &&
                  !e.ctrlKey && !e.metaKey
                ) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, '');
                handleChange({ target: { name: 'phone', value: digitsOnly } });
              }}
              disabled={loading}
              required
            />
          </div>
          {phoneError && (
            <span className={styles.phoneErrorMessage}>
              <FaExclamationTriangle className={styles.phoneErrorIcon} />
              {phoneError}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <textarea
            className={`form-control ${styles.formControl} ${styles.textarea}`}
            name="query"
            placeholder="Your Query"
            value={formData.query}
            onChange={handleChange}
            disabled={loading}
            rows="2"
          />
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <FaExclamationTriangle className={styles.alertIcon} />
            {error}
          </div>
        )}
        {success && (
          <div className={styles.successAlert}>
            <MdCheckCircle className={styles.alertIcon} />
            Thanks! We'll contact you soon.
          </div>
        )}

        <button type="submit" className={styles.submitBtn} disabled={loading || !!phoneError}>
          {loading ? (
            <><AiOutlineLoading3Quarters className={styles.spinnerIcon} /> Sending...</>
          ) : (
            <>
            {/* <FaRocket className={styles.btnIcon} /> */}
             🚀 Book Free Demo
             </>
          )}
        </button>

        <p className={styles.privacyNote}>
          <FaLock className={styles.privacyIcon} />
          100% Privacy Guaranteed
        </p>
      </form>
    </>
  );
};

// ── Main component ──
const BlogInquiryForm = ({ blogTitle }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', query: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isSticky, setIsSticky] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());
  const formRef = useRef(null);
  const placeholderRef = useRef(null);
  const ticking = useRef(false);
  const isStickyRef = useRef(false);
  const isAtBottomRef = useRef(false);
  const errorTimerRef = useRef(null);
  const countryDropdownRef = useRef(null);
  const mobileInputRef = useRef(null);

  // Use the same top bar API as EnrollmentForm for country auto-detection
  const {
    countryCode,
    isLoading: countryLoading,
  } = useTopBarApi();
const { data: userProfile } = useUserProfile();
  // Auto-detect country — same pattern as EnrollmentForm
  useEffect(() => {
    if (countryCode && !countryLoading) {
      const matchedCountry = countries.find((c) => c.flag === countryCode);
      if (matchedCountry) {
        setSelectedCountry(matchedCountry);
      }
    }
  }, [countryCode, countryLoading]);
useEffect(() => {
  if (userProfile) {
    let rawMobile = userProfile.mobile || "";

    // Extract country code (example: +91)
    const countryMatch = rawMobile.match(/^\+\d+/);
    let detectedCode = countryMatch ? countryMatch[0] : "";

    // Remove country code → get only number
    let phoneNumber = rawMobile.replace(/^\+\d+\s*/, '').replace(/\D/g, '');

    // Match country from your countries list
    const matchedCountry = countries.find(c => c.code === detectedCode);

    if (matchedCountry) {
      setSelectedCountry(matchedCountry);
    }

    setFormData(prev => ({
      ...prev,
      name: prev.name || userProfile.name || "",
      email: prev.email || userProfile.email || "",
      phone: prev.phone || phoneNumber
    }));
  }
}, [userProfile]);
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

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        if (formRef.current && placeholderRef.current) {
          const placeholderRect = placeholderRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const blogBottom = document.querySelector('.blog-bottom');
          const blogBottomRect = blogBottom?.getBoundingClientRect();
          const reachedBottom = blogBottomRect && blogBottomRect.top <= windowHeight - 50;
          const shouldBeSticky = placeholderRect.top <= 90 && window.scrollY > 200 && !reachedBottom;
          const atBottom = reachedBottom && placeholderRect.top <= 90;

          if (shouldBeSticky !== isStickyRef.current) {
            isStickyRef.current = shouldBeSticky;
            setIsSticky(shouldBeSticky);
          }
          if (atBottom !== isAtBottomRef.current) {
            isAtBottomRef.current = atBottom;
            setIsAtBottom(atBottom);
          }
        }
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSuccess(false);
    setError('');

    // Live phone digit validation
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '');
      if (digits.length === 0) {
        setPhoneError('');
      } else if (digits.length < 10) {
        setPhoneError(`Phone number must be 10 digits (${digits.length}/10)`);
      } else if (digits.length > 10) {
        setPhoneError(`Phone number cannot exceed 10 digits (${digits.length}/10)`);
      } else {
        setPhoneError('');
      }
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Please enter a valid email address';
    if (!formData.phone.trim()) return 'Phone number is required';
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) return 'Phone number must be 10 digits';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => setError(''), 3000);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const fullPhone = `${selectedCountry.code} ${formData.phone}`;
      const response = await axios.post('https://api.test.hachion.co/blog/inquiry', {
  ...formData,
  phone: fullPhone,
  blogTitle,
  timestamp: new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  }),
  source: "blog",
  pageUrl: window.location.href,

  timeZone: selectedCountry.timezone ,
  country: selectedCountry.name 
});
      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setFormData(prev => ({
  name: userProfile?.name || "",
  email: userProfile?.email || "",
  phone: userProfile?.mobile
    ? userProfile.mobile.replace(/^\+\d+\s*/, '').replace(/\D/g, '')
    : "",
  query: ""
}));
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to submit. Please try again.';
      setError(errMsg);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => setError(''), 3000);
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFormClasses = () => {
    let classes = styles.formWrapper;
    if (isSticky) classes += ` ${styles.sticky}`;
    if (isAtBottom) classes += ` ${styles.atBottom}`;
    return classes;
  };

  const sharedProps = {
    blogTitle, formData, loading, error, success,
    handleChange, handleSubmit, phoneError,
    selectedCountry, isCountryMenuOpen, setIsCountryMenuOpen,
    handleCountrySelect, countryDropdownRef, mobileInputRef, countryCode
  };

  return (
    <>
      {/* ── DESKTOP: sticky sidebar form (hidden on mobile) ── */}
      <div ref={placeholderRef} className={styles.formPlaceholder}>
        <div ref={formRef} className={getFormClasses()}>
          <FormContent {...sharedProps} />
        </div>
      </div>

      {/* ── MOBILE: static inline form (hidden on desktop) ── */}
      <div className={styles.mobileFormWrapper}>
        <FormContent {...sharedProps} />
      </div>
    </>
  );
};

export default BlogInquiryForm;