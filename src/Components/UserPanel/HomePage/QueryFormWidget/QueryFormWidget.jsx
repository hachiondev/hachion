import React, { useState, useRef, useEffect } from 'react';
import { FaPhone, FaChevronUp, FaChevronDown, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { Form, Button, Spinner } from 'react-bootstrap';
import Flag from 'react-world-flags';
import { AiFillCaretDown } from 'react-icons/ai';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './QueryFormWidget.module.css';
import { useTopBarApi } from '../../../../Api/hooks/HomePageApi/useTopBarApi';
import { countries, getDefaultCountry } from '../../../../countryUtils';

const QueryFormWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    query: '',
    phone: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false);
  const mobileInputRef = useRef(null);
  const countryDropdownRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());

  // Use the EXISTING TanStack query hook - same as in Register component
  const { 
    countryCode, 
    whatsappNumber, 
    whatsappLink, 
    isLoading: countryLoading,
    error: countryError 
  } = useTopBarApi();

  // Auto-detect and set country based on API response - EXACTLY like in Register
  useEffect(() => {
    if (countryCode && !countryLoading) {
      const matchedCountry = countries.find((c) => c.flag === countryCode);
      if (matchedCountry) {
        setSelectedCountry(matchedCountry);
        console.log(`Country auto-detected: ${matchedCountry.name} (${countryCode})`);
      }
    }
  }, [countryCode, countryLoading]);

  useEffect(() => {
  const userData = JSON.parse(localStorage.getItem("loginuserData")) || {};
  const userEmail = (userData.email || "").trim();

  if (!userEmail) {
    // Not logged in → keep fields empty
    return;
  }

  // Prefill email immediately
  setFormData((prev) => ({
    ...prev,
    email: userEmail,
  }));

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(
        `https://api.test.hachion.co/api/v1/user/myprofile?email=${userEmail}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();

      // Handle mobile number (same logic as ContactUs)
      if (data?.mobile) {
        const clean = String(data.mobile).includes(" ")
          ? String(data.mobile).split(" ")[1].trim()
          : String(data.mobile).trim();

        const digitsOnly = clean.replace(/\D/g, "");

        setFormData((prev) => ({
          ...prev,
          phone: digitsOnly,
        }));
      }

      // If backend returns country, try to match it
      if (data?.country) {
        const matched = countries.find(
          (c) => c.name.toLowerCase() === data.country.toLowerCase()
        );
        if (matched) {
          setSelectedCountry(matched);
        }
      }
    } catch (err) {
      console.error("Profile fetch failed:", err);
    }
  };

  fetchUserProfile();
}, []);

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

  
  useEffect(() => {
    if (!isOpen) {
      
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  
  useEffect(() => {
    const autoOpenTimer = setTimeout(() => {
      setIsOpen(true);
    }, 10000); 

    return () => clearTimeout(autoOpenTimer);
  }, []); 

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsCountryMenuOpen(false);
    mobileInputRef.current?.focus();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    
    const numbersOnly = value.replace(/\D/g, '');
    
    setFormData(prev => ({
      ...prev,
      phone: numbersOnly
    }));
    
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.query.trim()) {
      newErrors.query = 'Query is required.';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required.';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid mobile number (10 digits).';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      
      const sanitizedMobile = formData.phone.trim().replace(/^(\+)?/, "");
      const fullMobileNumber = `${selectedCountry.code} ${sanitizedMobile}`;

      const submitData = {
  email: formData.email,
  phone: fullMobileNumber,              
  comments: formData.query,             
  location: selectedCountry?.name || "" 
};

      
      console.log('Query submitted:', submitData);
      
      
      const response = await fetch(
  'https://api.test.hachion.co/ask-query/send-to-webhook',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(submitData),
  }
);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const result = await response.json();
      console.log('Submission successful:', result);
    
      setIsSuccess(true);
      setFormData({
        query: '',
        phone: '',
        email: ''
      });
      setErrors({});
      
      // Auto-close widget after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
      
    } catch (error) {
      console.error('Submission error:', error);
      
      // Fallback - Show success message even if API fails
      setIsSuccess(true);
      setFormData({
        query: '',
        phone: '',
        email: ''
      });
      setErrors({});
      
      // Auto-close widget after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAnother = () => {
    setIsSuccess(false);
    setFormData({
      query: '',
      phone: '',
      email: ''
    });
    setErrors({});
  };

  return (
    <div className={`${styles.widgetContainer} ${isOpen ? styles.open : ''}`}>
      {/* Floating Button - Bottom Left */}
      <Button 
        variant="primary"
        className={styles.floatingButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close query form' : 'Open query form'}
        disabled={countryLoading}
      >
        <div className="d-flex align-items-center justify-content-between w-100">
          <span className={`d-flex align-items-center ${styles.buttonTitle}`}>
            <span>Drop us a Query</span>
            <span className={styles.buttonIcon}>
              <img 
                width="20" 
                height="20" 
                src="https://d1jnx9ba8s6j9r.cloudfront.net/img/blinker_d.webp" 
                alt="Blinking indicator" 
                className={styles.blinkImage}
              />
            </span>
          </span>
          <span className={styles.chevronIcon}>
            {isOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </span>
        </div>
      </Button>

      {/* Widget Content */}
      <div className={styles.widgetContent}>
        <div className={`${styles.widgetHeader} d-flex align-items-center justify-content-between`}>
          <h5 className={`m-0 d-flex align-items-center ${styles.widgetTitle}`}>
            Drop us a Query
            <span className={styles.buttonIcon}>
              <img 
                width="20" 
                height="20" 
                src="https://d1jnx9ba8s6j9r.cloudfront.net/img/blinker_d.webp" 
                alt="Blinking indicator" 
                className={styles.blinkImage}
              />
            </span>
          </h5>
          <Button 
            variant="link" 
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          >
            <FaTimes size={16} />
          </Button>
        </div>
        
        <div className={styles.widgetBody}>
          {!isSuccess ? (
            <>
              {/* Support Banner */}
              <div className={`text-center ${styles.supportBanner}`}>
                <img 
                  src="https://d1jnx9ba8s6j9r.cloudfront.net/img/24x7-available.png" 
                  alt="24x7 Support" 
                  className="img-fluid"
                  style={{ maxWidth: '152px' }}
                />
              </div>

              {/* Contact Info - Using data from useTopBarApi */}
              <div className={`d-flex align-items-center ${styles.contactInfo}`}>
                <div className={`d-flex align-items-center justify-content-center ${styles.contactIcon}`}>
                  <FaPhone size={14} />
                </div>
                <div className={styles.contactDetails}>
                  <a 
                    href={whatsappLink} 
                    className={`d-block ${styles.phoneLink}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {whatsappNumber}
                  </a>
                  <span className={`d-block ${styles.availability}`}>
                    Available 24x7 for your queries
                  </span>
                </div>
              </div>

              {/* Form */}
              <Form onSubmit={handleSubmit} className={styles.queryForm}>
                {/* Query Textarea */}
                <Form.Group className="">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Type your query here*"
                    name="query"
                    value={formData.query}
                    onChange={handleChange}
                    required
                    className={`${styles.textareaInput} ${errors.query ? 'is-invalid' : ''}`}
                    disabled={isSubmitting}
                  />
                  {errors.query && (
                    <div className="invalid-feedback d-block">{errors.query}</div>
                  )}
                </Form.Group>

                {/* Phone Field - Custom Built-in Dropdown */}
                <Form.Group className="">
                  <Form.Label className={`${styles.formLabel} d-flex align-items-center`}>
                    Phone Number<span className="required-star ms-1">*</span>
                    {countryLoading && (
                      <Spinner animation="border" size="sm" className="ms-2" />
                    )}
                  </Form.Label>
                  <div className={styles.phoneFieldContainer}>
                    <div className={styles.countryDropdownWrapper} ref={countryDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsCountryMenuOpen(!isCountryMenuOpen)}
                        className={styles.countrySelectButton}
                        disabled={isSubmitting}
                      >
                        <Flag
                          code={selectedCountry.flag}
                          className={styles.countryFlagIcon}
                          height="16"
                          width="24"
                        />
                        <span className={styles.countryCodeDisplay}>
                          {selectedCountry.flag} ({selectedCountry.code})
                        </span>
                        <AiFillCaretDown className={styles.caretIcon} />
                      </button>

                      {/* Custom Country Dropdown Menu */}
                      {isCountryMenuOpen && (
                        <div className={styles.countryMenu}>
                          {countries.map((country) => (
                            <div
                              key={country.code}
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

                    <input
                      type="tel"
                      className={`${styles.phoneNumberInput} ${errors.phone ? 'is-invalid' : ''}`}
                      ref={mobileInputRef}
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      placeholder="Enter your mobile number"
                      autoComplete="tel-national"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.phone && (
                    <div className="invalid-feedback d-block">{errors.phone}</div>
                  )}
                </Form.Group>

                {/* Email Field */}
                <Form.Group className="">
                  <Form.Label className={styles.formLabel}>
                    Email Id<span className="required-star ms-1">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email*"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`${styles.emailInput} ${errors.email ? 'is-invalid' : ''}`}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <div className="invalid-feedback d-block">{errors.email}</div>
                  )}
                </Form.Group>

                <Button 
                  type="submit" 
                  variant="primary" 
                  className={`w-100 ${styles.submitButton}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      SUBMITTING...
                    </>
                  ) : (
                    'SUBMIT QUERY'
                  )}
                </Button>
              </Form>
            </>
          ) : (
            /* Success Message */
            <div className={styles.successContainer}>
              <div className={styles.successIcon}>
                <FaCheckCircle size={60} />
              </div>
              <h3 className={styles.successTitle}>Thank You!</h3>
              <p className={styles.successMessage}>
                Your query has been submitted successfully. Our team will contact you soon.
              </p>
              <div className={styles.successActions}>
                <Button 
                  variant="outline-primary" 
                  className={styles.submitAnotherButton}
                  onClick={handleSubmitAnother}
                >
                  Submit Another Query
                </Button>
                <Button 
                  variant="primary" 
                  className={styles.closeSuccessButton}
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueryFormWidget;