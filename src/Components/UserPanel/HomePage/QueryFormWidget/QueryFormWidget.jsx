import React, { useState, useRef, useEffect } from 'react';
import { FaPhone, FaChevronUp, FaChevronDown, FaTimes, FaCheckCircle, FaLock, FaQuestionCircle } from 'react-icons/fa';
import { Form, Button, Spinner } from 'react-bootstrap';
import Flag from 'react-world-flags';
import { AiFillCaretDown } from 'react-icons/ai';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './QueryFormWidget.module.css';
import { useTopBarApi } from '../../../../Api/hooks/HomePageApi/useTopBarApi';
import { countries, getDefaultCountry } from '../../../../countryUtils';

const QueryFormWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    query: '',
    phone: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [emailValid, setEmailValid] = useState(null); // null = not checked, true = valid, false = invalid

  // 🔹 UPDATED: Separate dropdown state for desktop & mobile
  const [isCountryMenuOpenDesktop, setIsCountryMenuOpenDesktop] = useState(false);
  const [isCountryMenuOpenMobile, setIsCountryMenuOpenMobile] = useState(false);

  const mobileInputRef = useRef(null);

  // 🔹 UPDATED: Separate refs
  const countryDropdownRefDesktop = useRef(null);
  const countryDropdownRefMobile = useRef(null);

  const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());
  const [hasUserClosed, setHasUserClosed] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  const {
    countryCode,
    whatsappNumber,
    whatsappLink,
    isLoading: countryLoading,
    error: countryError
  } = useTopBarApi();

  // Check if user has previously closed the widget
  useEffect(() => {
    const userClosedWidget = localStorage.getItem('queryWidgetClosed');
    const hasVisitedBefore = sessionStorage.getItem('queryWidgetVisited');

    if (userClosedWidget === 'true') {
      setHasUserClosed(true);
    }

    // Check if this is a first visit/refresh in this session
    if (!hasVisitedBefore) {
      setIsFirstVisit(true);
      sessionStorage.setItem('queryWidgetVisited', 'true');
    }
  }, []);

  // Show component after 10 seconds
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 10000);

    return () => clearTimeout(showTimer);
  }, []);

  // Auto-open only on first visit/refresh if user hasn't permanently closed it
  useEffect(() => {
    if (isVisible && isFirstVisit && !hasUserClosed) {
      setIsOpen(true);
    }
  }, [isVisible, isFirstVisit, hasUserClosed]);

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
      return;
    }

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

  // 🔹 UPDATED: Outside click handling for both dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        countryDropdownRefDesktop.current &&
        !countryDropdownRefDesktop.current.contains(event.target)
      ) {
        setIsCountryMenuOpenDesktop(false);
      }

      if (
        countryDropdownRefMobile.current &&
        !countryDropdownRefMobile.current.contains(event.target)
      ) {
        setIsCountryMenuOpenMobile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleCountrySelect = (country) => {
    console.log('Country selected:', country.name, country.code);
    setSelectedCountry(country);
    setIsCountryMenuOpenDesktop(false);
    setIsCountryMenuOpenMobile(false);
    setTimeout(() => {
      if (mobileInputRef.current) {
        mobileInputRef.current.focus();
      }
    }, 100);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate email in real-time
    if (name === 'email') {
      if (value.trim() === '') {
        setEmailValid(null); // No input, no icon
      } else {
        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidFormat = emailRegex.test(value);

        if (!isValidFormat) {
          setEmailValid(false); // Invalid format
        } else {
          // Check for typos in 'gmail.com' as a complete phrase
          const lowerEmail = value.toLowerCase();

          // Extract the domain part (everything after @)
          const domainPart = lowerEmail.split('@')[1];

          // Check if it looks like gmail.com but is misspelled
          const gmailComTypos = [
            'gamil.com', 'gmial.com', 'gmai.com', 'gmaill.com', 'gmil.com',
            'gnail.com', 'gmal.com', 'gmeil.com', 'gmaul.com', 'gimail.com',
            'gmail.con', 'gmail.cmo', 'gmail.ocm', 'gmail.cm', 'gmail.comm',
            'gmail.ccom', 'gmail.co', 'gmail.om', 'gmail.vom', 'gmail.xom',
            'gamil.con', 'gmial.cmo', 'gmai.cm', 'gmaill.comm', 'gmil.ccom',
            'gnail.co', 'gmal.om', 'gmeil.vom', 'gmaul.xom', 'gimail.con'
          ];

          // Check if domain matches any typo
          const hasGmailComTypo = gmailComTypos.includes(domainPart);

          if (hasGmailComTypo) {
            setEmailValid(false); // Has typo in gmail.com
          } else {
            setEmailValid(true); // Valid email
          }
        }
      }
    }

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
    } else {
      // Check for typos in 'gmail.com' as a complete phrase
      const lowerEmail = formData.email.toLowerCase();

      // Extract the domain part (everything after @)
      const domainPart = lowerEmail.split('@')[1];

      // Check if it looks like gmail.com but is misspelled
      const gmailComTypos = [
        'gamil.com', 'gmial.com', 'gmai.com', 'gmaill.com', 'gmil.com',
        'gnail.com', 'gmal.com', 'gmeil.com', 'gmaul.com', 'gimail.com',
        'gmail.con', 'gmail.cmo', 'gmail.ocm', 'gmail.cm', 'gmail.comm',
        'gmail.ccom', 'gmail.co', 'gmail.om', 'gmail.vom', 'gmail.xom',
        'gamil.con', 'gmial.cmo', 'gmai.cm', 'gmaill.comm', 'gmil.ccom',
        'gnail.co', 'gmal.om', 'gmeil.vom', 'gmaul.xom', 'gimail.con'
      ];

      // Check if domain matches any typo
      if (gmailComTypos.includes(domainPart)) {
        newErrors.email = 'Did you mean "gmail.com"? Please check your email address.';
      }
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
      setEmailValid(null); // Reset email validation state

      localStorage.removeItem('queryWidgetClosed');
      setHasUserClosed(false);

      setTimeout(() => {
        setIsOpen(false);
      }, 3000);

    } catch (error) {
      console.error('Submission error:', error);

      setIsSuccess(true);
      setFormData((prev) => ({
        ...prev,
        query: ''
      }));

      setErrors({});
      setEmailValid(null); // Reset email validation state

      localStorage.removeItem('queryWidgetClosed');
      setHasUserClosed(false);

      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setHasUserClosed(true);
    localStorage.setItem('queryWidgetClosed', 'true');
  };

  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* Desktop Widget - Bottom Right */}
      {isVisible && (
        <div className={`${styles.widgetContainer} ${isOpen ? styles.open : ''}`}>
          <div
            className={`${styles.widgetHeader} d-flex align-items-center justify-content-between`}
            role="button"
            onClick={handleToggle}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggle();
              }
            }}
          >
            <h5 className={`m-0 d-flex align-items-center ${styles.widgetTitle}`}>
              Have a Question? We're Here to Help
              <span className={styles.buttonIcon}>
                <FaQuestionCircle size={16} className={styles.blinkIcon} />
              </span>
            </h5>
            <span className={styles.chevronIcon}>
              {isOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </span>
          </div>

          {/* Widget Content */}
          <div className={styles.widgetContent}>
            <div className={styles.formContentWrapper}>
              <div className={styles.widgetBody}>
                {!isSuccess ? (
                  <>
                    {/* Contact Info - More Compact */}
                    <div className={`d-flex align-items-center ${styles.contactInfo}`}>
                      <div className={`d-flex align-items-center justify-content-center ${styles.contactIcon}`}>
                        <FaPhone size={12} />
                      </div>
                      <div className={styles.contactDetails}>
                        <a
                          href={whatsappLink}
                          className={`d-block ${styles.phoneLink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {whatsappNumber}
                          <span className={styles.contactActions}> [Call Now] [WhatsApp]</span>
                        </a>
                        <span className={`d-block ${styles.availability}`}>
                          Get expert guidance within 24 hours
                        </span>
                      </div>
                    </div>

                    {/* Form */}
                    <Form onSubmit={handleSubmit} className={styles.queryForm}>
                      {/* Query Textarea - Smaller */}
                      <Form.Group className={styles.formGroup}>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="Tell us about your course interest, batch timing, or any doubts you have*"
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

                      {/* Phone Field */}
                      <Form.Group className={styles.formGroup}>
                        <Form.Label className={styles.formLabel}>
                          Phone Number<span className="required-star">*</span>
                          {countryLoading && (
                            <Spinner animation="border" size="sm" className="ms-1" />
                          )}
                        </Form.Label>
                        <div className={styles.phoneFieldContainer}>
                          <div className={styles.countryDropdownWrapper} ref={countryDropdownRefDesktop}>
                            <button
                              type="button"
                              onClick={() => setIsCountryMenuOpenDesktop(!isCountryMenuOpenDesktop)}
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
                              <AiFillCaretDown className={styles.caretIcon} />
                            </button>

                            {isCountryMenuOpenDesktop && (
                              <div className={styles.countryMenu}>
                                {countries.map((country) => (
                                  <div
                                    key={`${country.name}-${country.code}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCountrySelect(country);
                                    }}
                                    className={`${styles.countryMenuItem} ${country.flag === countryCode ? styles.detectedCountry : ''
                                      }`}
                                  >
                                    <Flag
                                      code={country.flag}
                                      className={styles.countryFlagIcon}
                                      height="12"
                                      width="18"
                                    />
                                    <span>
                                      {country.name} ({country.code})
                                      {country.flag === countryCode && (
                                        <span className={styles.detectedBadge}>Detected</span>
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
                            placeholder="Mobile number"
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
                      <Form.Group className={styles.formGroup}>
                        <Form.Label className={styles.formLabel}>
                          Email<span className="required-star">*</span>
                        </Form.Label>
                        <div className={styles.emailFieldContainer}>
                          <Form.Control
                            type="email"
                            placeholder="Your email address"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={`${styles.emailInput} ${errors.email ? 'is-invalid' : ''}`}
                            disabled={isSubmitting}
                          />
                          {emailValid !== null && (
                            <span className={`${styles.emailLockIcon} ${emailValid ? styles.validEmail : styles.invalidEmail}`}>
                              <FaLock />
                            </span>
                          )}
                        </div>
                        {errors.email && (
                          <div className="invalid-feedback d-block">{errors.email}</div>
                        )}
                      </Form.Group>
                      <div className={styles.privacyNote}>
                        We'll only use this to contact you about your query
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        className={`w-100 ${styles.submitButton}`}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-1" />
                            Submitting...
                          </>
                        ) : (
                          'Get Support'
                        )}
                      </Button>
                      <div className={styles.ratingBadge}>
                        ⭐ 4.8/5 by 120K+ learners
                      </div>
                    </Form>
                  </>
                ) : (
                  /* Success Message - More Compact */
                  <div className={styles.successContainer}>
                    <div className={styles.successIcon}>
                      <FaCheckCircle size={40} />
                    </div>
                    <h4 className={styles.successTitle}>Thank You!</h4>
                    <p className={styles.successMessage}>
                      Your query has been submitted. Our team will contact you soon.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Modal - Full Screen */}
      {isVisible && isOpen && (
        <div className={styles.mobileModal}>
          <div className={styles.mobileModalContent}>
            <div className={`${styles.widgetHeader} d-flex align-items-center justify-content-between`}>
              <h5 className={`m-0 d-flex align-items-center ${styles.widgetTitle}`}>
                Have a Question? We're Here to Help

                <span className={styles.buttonIcon}>
                  <FaQuestionCircle size={16} className={styles.blinkIcon} />
                </span>
              </h5>
              <button
                className={styles.mobileCloseButton}
                onClick={handleClose}
                aria-label="Close"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className={styles.widgetBody}>
              {!isSuccess ? (
                <>
                  {/* Contact Info */}
                  <div className={`d-flex align-items-center ${styles.contactInfo}`}>
                    <div className={`d-flex align-items-center justify-content-center ${styles.contactIcon}`}>
                      <FaPhone size={12} />
                    </div>
                    <div className={styles.contactDetails}>
                      <a
                        href={whatsappLink}
                        className={`d-block ${styles.phoneLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {whatsappNumber}
                        <span className={styles.contactActions}> [Call Now] [WhatsApp]</span>
                      </a>
                      <span className={`d-block ${styles.availability}`}>
                        Get expert guidance within 24 hours
                      </span>
                    </div>
                  </div>

                  {/* Form */}
                  <Form onSubmit={handleSubmit} className={styles.queryForm}>
                    <Form.Group className={styles.formGroup}>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Tell us about your course interest, batch timing, or any doubts you have*"
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

                    {/* Phone Field */}
                    <Form.Group className={styles.formGroup}>
                      <Form.Label className={styles.formLabel}>
                        Phone Number<span className="required-star">*</span>
                        {countryLoading && (
                          <Spinner animation="border" size="sm" className="ms-1" />
                        )}
                      </Form.Label>
                      <div className={styles.phoneFieldContainer}>
                        <div className={styles.countryDropdownWrapper} ref={countryDropdownRefMobile}>
                          <button
                            type="button"
                            onClick={() => setIsCountryMenuOpenMobile(!isCountryMenuOpenMobile)}
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
                            <AiFillCaretDown className={styles.caretIcon} />
                          </button>

                          {isCountryMenuOpenMobile && (
                            <div className={styles.countryMenu}>
                              {countries.map((country) => (
                                <div
                                  key={`${country.name}-${country.code}`}
                                  onClick={() => handleCountrySelect(country)}
                                  className={`${styles.countryMenuItem} ${country.flag === countryCode ? styles.detectedCountry : ''
                                    }`}
                                >
                                  <Flag
                                    code={country.flag}
                                    className={styles.countryFlagIcon}
                                    height="12"
                                    width="18"
                                  />
                                  <span>
                                    {country.name} ({country.code})
                                    {country.flag === countryCode && (
                                      <span className={styles.detectedBadge}>Detected</span>
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
                          placeholder="Mobile number"
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
                    <Form.Group className={styles.formGroup}>
                      <Form.Label className={styles.formLabel}>
                        Email<span className="required-star">*</span>
                      </Form.Label>
                      <div className={styles.emailFieldContainer}>
                        <Form.Control
                          type="email"
                          placeholder="Your email address"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className={`${styles.emailInput} ${errors.email ? 'is-invalid' : ''}`}
                          disabled={isSubmitting}
                        />
                        {emailValid !== null && (
                          <span className={`${styles.emailLockIcon} ${emailValid ? styles.validEmail : styles.invalidEmail}`}>
                            <FaLock />
                          </span>
                        )}
                      </div>
                      {errors.email && (
                        <div className="invalid-feedback d-block">{errors.email}</div>
                      )}
                    </Form.Group>

                    <div className={styles.privacyNote}>
                      We'll only use this to contact you about your query
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      className={`w-100 ${styles.submitButton}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-1" />
                          Submitting...
                        </>
                      ) : (
                        'Get Support'
                      )}
                    </Button>

                    <div className={styles.ratingBadge}>
                      ⭐ 4.8/5 by 120K+ learners
                    </div>
                  </Form>
                </>
              ) : (
                <div className={styles.successContainer}>
                  <div className={styles.successIcon}>
                    <FaCheckCircle size={40} />
                  </div>
                  <h4 className={styles.successTitle}>Thank You!</h4>
                  <p className={styles.successMessage}>
                    Your query has been submitted. Our team will contact you soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Footer */}
      {isVisible && (
        <div className={styles.mobileFooter}>
          <a
            href={whatsappLink}
            className={`${styles.footerButton} ${styles.callButton}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaPhone className={styles.footerIcon} />
            <span>Get Expert Guidance</span>
          </a>
          <button
            className={`${styles.footerButton} ${styles.queryButton}`}
            onClick={handleToggle}
          >
            <img
              width="16"
              height="16"
              src="https://d1jnx9ba8s6j9r.cloudfront.net/img/blinker_d.webp"
              alt="Query"
              className={styles.footerIconImg}
            />
            <span>Ask Question</span>
          </button>
        </div>
      )}
    </>
  );
};

export default QueryFormWidget;