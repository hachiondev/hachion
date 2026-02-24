import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import styles from './BlogInquiryForm.module.css';

const BlogInquiryForm = ({ blogTitle }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    query: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isSticky, setIsSticky] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const formRef = useRef(null);
  const placeholderRef = useRef(null);
  const ticking = useRef(false);

  // ✅ Use refs to track current state inside scroll handler
  // This avoids re-registering the listener on every state change
  const isStickyRef = useRef(false);
  const isAtBottomRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        if (formRef.current && placeholderRef.current) {
          const placeholderRect = placeholderRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          const blogBottom = document.querySelector('.blog-bottom');
          const blogBottomRect = blogBottom?.getBoundingClientRect();
          
          const reachedBottom = blogBottomRect && 
            blogBottomRect.top <= windowHeight - 50;
          
          const shouldBeSticky = placeholderRect.top <= 90 && 
            window.scrollY > 200 && 
            !reachedBottom;

          const atBottom = reachedBottom && placeholderRect.top <= 90;

          // ✅ Compare against refs, not stale state closure values
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
  }, []); // ✅ Empty deps — stable reference, no re-registration

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]); // ✅ handleScroll is stable due to useCallback([])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
        setFormData({
          name: '',
          email: '',
          phone: '',
          query: ''
        });
        
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit. Please try again.');
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

  return (
    <div ref={placeholderRef} className={styles.formPlaceholder}>
      <div 
        ref={formRef}
        className={getFormClasses()}
      >
        <div className={styles.formHeader}>
          <h3>Quick Inquiry</h3>
          <p>Get expert guidance</p>
        </div>

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
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}
          
          {success && (
            <div className={styles.successAlert}>
              <i className="bi bi-check-circle-fill me-2"></i>
              ✓ Thanks! We'll contact you soon.
            </div>
          )}

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Sending...
              </>
            ) : (
              <>
                <i className="bi bi-send me-2"></i>
                Submit
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogInquiryForm;