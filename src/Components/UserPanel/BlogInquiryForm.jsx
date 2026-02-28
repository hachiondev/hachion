import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import styles from './BlogInquiryForm.module.css';

// react-icons imports
import { FaRocket, FaStar, FaUsers, FaFlag, FaLock, FaExclamationTriangle } from 'react-icons/fa';
import { MdCheckCircle } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

// ── Shared form content (used in both desktop & mobile) ──
const FormContent = ({ blogTitle, formData, loading, error, success, handleChange, handleSubmit }) => {
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
        <div className={styles.formGroup}>
          <input
            type="tel"
            className={`form-control ${styles.formControl}`}
            name="phone"
            placeholder="Phone *"
            value={formData.phone}
            onChange={handleChange}
            disabled={loading}
            required
          />
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

        <button type="submit" className={styles.submitBtn} disabled={loading}>
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
  const formRef = useRef(null);
  const placeholderRef = useRef(null);
  const ticking = useRef(false);
  const isStickyRef = useRef(false);
  const isAtBottomRef = useRef(false);
  const errorTimerRef = useRef(null);

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
      const response = await axios.post('https://api.test.hachion.co/blog/inquiry', {
        ...formData,
        blogTitle,
        timestamp: new Date().toISOString()
      });
      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', query: '' });
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

  const sharedProps = { blogTitle, formData, loading, error, success, handleChange, handleSubmit };

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