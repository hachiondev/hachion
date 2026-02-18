import React from 'react';
import { FaPhone, FaTimes, FaCheckCircle, FaLock, FaChevronDown } from 'react-icons/fa';
import { Form, Button, Spinner } from 'react-bootstrap';
import Flag from 'react-world-flags';
import { AiFillCaretDown } from 'react-icons/ai';
import styles from './QueryFormWidget.module.css';
import { countries } from '../../../../countryUtils';

const MobileQueryForm = ({
  isOpen,
  isVisible,
  isSubmitting,
  isSuccess,
  formData,
  errors,
  emailValid,
  isCountryMenuOpenMobile,
  selectedCountry,
  countryCode,
  countryLoading,
  whatsappLink,
  whatsappNumber,
  mobileInputRef,
  countryDropdownRefMobile,
  handleClose,
  handleSubmit,
  handleChange,
  handlePhoneChange,
  handleCountrySelect,
  setIsCountryMenuOpenMobile
}) => {
  if (!isVisible || !isOpen) return null;

  return (
    <div className={styles.mobileModal}>
      <div className={styles.mobileModalContent}>
        <div className={`${styles.widgetHeader} d-flex align-items-center justify-content-between`}>
          <h5 className={`m-0 d-flex align-items-center ${styles.widgetTitle}`}>
            Have a Question? We're Here to Help
            <span className={styles.buttonIcon}>
              <img
                width="16"
                height="16"
                src="https://d1jnx9ba8s6j9r.cloudfront.net/img/blinker_d.webp"
                alt="Query"
                className={styles.blinkIcon}
              />
            </span>
          </h5>
          <button
            className={styles.mobileCloseButton}
            onClick={handleClose}
            aria-label="Close"
          >
            <FaChevronDown size={18} />
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
  );
};

export default MobileQueryForm;