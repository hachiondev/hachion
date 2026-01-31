import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styles from './Enrollmentform.module.css';
import { FaUser, FaPhone, FaEnvelope, FaChevronDown } from 'react-icons/fa';
import { HiOutlineAcademicCap } from 'react-icons/hi';
import { useAllCourses } from '../../../../Api/hooks/SitemapPageApi/useAllCourses';

const EnrollmentForm = ({onClose}) => {
  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 23,
    minutes: 25,
    seconds: 17
  });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: null,
    feedback: '',
    countryCode: '+91',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use course API hook if provided
  const { data: coursesData = [], isLoading: loadingCourses, error: coursesError } = useAllCourses() 

  // Countdown Timer Effect
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

  // Transform API data to react-select format
  const courseOptions = React.useMemo(() => {
    if (!coursesData || !Array.isArray(coursesData)) {
      // Default courses if API is not available
      return [
        { value: 'web-dev', label: 'Web Development' },
        { value: 'data-science', label: 'Data Science' },
        { value: 'digital-marketing', label: 'Digital Marketing' },
        { value: 'ui-ux', label: 'UI/UX Design' },
        { value: 'mobile-dev', label: 'Mobile App Development' },
      ];
    }
    
    return coursesData.map(course => ({
      value: course.id || course._id || course.courseId || course.name,
      label: course.name || course.title || course.courseName,
      originalData: course
    }));
  }, [coursesData]);

  const feedbackOptions = [
    { value: 'Google / Search Engine', label: 'Google / Search Engine' },
    { value: 'Social Media (FB, Insta, Linkedin..)', label: 'Social Media (FB, Insta, Linkedin..)' },
    { value: 'Online Advertisement', label: 'Online Advertisement' },
    { value: 'Referral from a Friend', label: 'Referral from a Friend' },
    { value: 'Email Newsletter', label: 'Email Newsletter' },
    { value: 'YouTube Video', label: 'YouTube Video' },
    { value: 'Blog or Article', label: 'Blog or Article' },
    { value: 'Webinar or Online Event', label: 'Webinar or Online Event' }
  ];

  const countryCodes = [
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+1', country: 'USA', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  ];

  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '40px',
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
    zIndex: 99999, // 🚀 VERY IMPORTANT
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

  const handleFeedbackChange = (selectedOption) => {
    setFormData({ ...formData, feedback: selectedOption ? selectedOption.value : '' });
    if (errors.feedback) {
      setErrors({ ...errors, feedback: '' });
    }
  };

  const handlePhoneInput = (e) => {
    const value = e.target.value;
    if (/^[0-9\-\+\(\)\s]*$/.test(value) || value === '') {
      setFormData({ ...formData, phone: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    }
    
    if (!formData.course) newErrors.course = 'Please select a course';
    if (!formData.feedback) newErrors.feedback = 'Please select how you heard about us';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        const fullPhone = `${formData.countryCode}${formData.phone}`;
        const submissionData = {
          name: formData.name,
          email: formData.email,
          phone: fullPhone,
          course: formData.course.value,
          courseId: formData.course.originalData?.id || formData.course.originalData?._id,
          courseName: formData.course.label,
          feedback: formData.feedback,
          timestamp: new Date().toISOString()
        };
        
        console.log('Form submitted:', submissionData);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        alert('Thank you! Your enquiry has been submitted. We will contact you shortly.');
        
        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          course: null,
          feedback: '',
          countryCode: '+91',
        });
        
      } catch (error) {
        console.error('Form submission error:', error);
        alert('There was an error submitting the form. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
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
          <div className={styles.countdown}>
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
          </div>
        </div>

        {/* Form Section */}
        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>Enroll Free Online Demo Class</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Name Input */}
            <div className={styles.formGroup}>
                {/* <label className={styles.formLabel}>Full name</label> */}
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

            {/* Phone Input */}
            <div className={styles.formGroup}>
                {/* <label className={styles.formLabel}>Phone</label> */}
              <div className={styles.phoneInputWrapper}>
                <div className={styles.countryCodeSelector}>
                  <FaPhone className={styles.inputIcon} />
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                    className={styles.countrySelect}
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown className={styles.selectArrow} />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneInput}
                  onKeyDown={(e) => {
                    if (!/[0-9\-\+\(\)\s]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className={`${styles.formInput} ${styles.phoneInput} ${errors.phone ? styles.error : ''}`}
                  placeholder="Phone Number *"
                  required
                />
              </div>
              {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
            </div>

            {/* Email Input */}
            <div className={styles.formGroup}>
                {/* <label className={styles.formLabel}>Email</label> */}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || loadingCourses}
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

            {/* Privacy Note */}
            {/* <div className={styles.privacyNote}>
              <small>
                By submitting this form, you agree to our Privacy Policy and Terms of Service.
              </small>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentForm;