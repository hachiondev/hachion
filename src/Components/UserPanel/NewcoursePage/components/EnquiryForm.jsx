import React, { useState } from 'react';
import Select from 'react-select';
import styles from './EnquiryForm.module.css';
import { FaUser, FaPhone, FaEnvelope, FaChevronDown } from 'react-icons/fa';
import { HiOutlineAcademicCap } from 'react-icons/hi';
import { useAllCourses } from '../../../../Api/hooks/SitemapPageApi/useAllCourses';
import { Margin } from '@mui/icons-material';


const EnquiryForm = () => {
  // Use your course API hook
  const { data: coursesData = [], isLoading: loadingCourses, error: coursesError } = useAllCourses();
  
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

  // Transform API data to react-select format
  const courseOptions = React.useMemo(() => {
    if (!coursesData || !Array.isArray(coursesData)) return [];
    
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

  // Custom styles for react-select to match your design
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '48px',
      border: state.isFocused ? '2px solid #00aeef' : '2px solid #e0e0e0',
      borderRadius: '8px',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(0, 174, 239, 0.1)' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#00aeef' : '#ccc',
      },
      paddingLeft: '45px',
      fontSize: '15px',
      backgroundColor: 'white',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#999',
      marginLeft: '0',
    }),
    input: (provided) => ({
      ...provided,
      marginLeft: '0',
      color: '#333',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#333',
      marginLeft: '0',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0 12px',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      paddingRight: '8px',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#666',
      padding: '8px',
      '&:hover': {
        color: '#333',
      },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: '#666',
      padding: '8px',
      marginRight: '16px',
      '&:hover': {
        color: '#333',
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '8px',
      maxHeight: '300px',
    }),
    option: (provided, state) => ({
      ...provided,
      padding: '12px 16px',
      fontSize: '15px',
      backgroundColor: state.isSelected ? '#00aeef' : state.isFocused ? '#f0f9ff' : 'white',
      color: state.isSelected ? 'white' : '#333',
      '&:active': {
        backgroundColor: '#0099d6',
      },
      borderRadius: '4px',
      marginBottom: '4px',
      cursor: 'pointer',
    }),
    noOptionsMessage: (provided) => ({
      ...provided,
      color: '#666',
      fontSize: '14px',
      padding: '16px',
    }),
    loadingMessage: (provided) => ({
      ...provided,
      color: '#666',
      fontSize: '14px',
      padding: '16px',
    }),
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleCourseChange = (selectedOption) => {
    setFormData({
      ...formData,
      course: selectedOption
    });
    
    if (errors.course) {
      setErrors({
        ...errors,
        course: ''
      });
    }
  };

  const handleFeedbackChange = (selectedOption) => {
    setFormData({
      ...formData,
      feedback: selectedOption ? selectedOption.value : ''
    });
    
    if (errors.feedback) {
      setErrors({
        ...errors,
        feedback: ''
      });
    }
  };

  const handlePhoneInput = (e) => {
    const value = e.target.value;
    if (/^[0-9\-\+\(\)\s]*$/.test(value) || value === '') {
      setFormData({
        ...formData,
        phone: value
      });
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
    } else if (!/^[0-9\-\+\(\)\s]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
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
        
        // Here you would typically send the data to your backend
        // Example: await axios.post('/api/enquiries', submissionData);
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

  // Loading indicator component for react-select
  const LoadingIndicator = () => (
    <div className={styles.loadingIndicator}>
      <div className={styles.spinnerSmall}></div>
      Loading courses...
    </div>
  );

  return (
    <div className={`${styles.enquiryForm} lscard`} style={{ "--i": 0 }}>
      <div className={styles.formHeader}>
        <h3>Enroll free online demo class</h3>
        {/* <p className={styles.formSubtitle}>Fill the form to get free demo class details</p> */}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
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

        <div className={styles.formGroup}>
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
              loadingMessage={() => <LoadingIndicator />}
              noOptionsMessage={({ inputValue }) => 
                inputValue ? `No courses found for "${inputValue}"` : "No courses available"
              }
              components={{
                DropdownIndicator: () => <FaChevronDown className={styles.selectArrow} />,
                IndicatorSeparator: null
              }}
            />
          </div>
          {errors.course && <span className={styles.errorMessage}>{errors.course}</span>}
          {coursesError && (
            <span className={styles.errorMessage}>
              Failed to load courses. Please refresh the page.
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <div className={styles.selectWithIcon}>
            <Select
              value={feedbackOptions.find(option => option.value === formData.feedback) || null}
              onChange={handleFeedbackChange}
              options={feedbackOptions}
              placeholder="How did you hear about us? *"
              styles={{
                ...customStyles,
                control: (provided, state) => ({
                  ...provided,
                  minHeight: '48px',
                  border: state.isFocused ? '2px solid #00aeef' : '2px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: state.isFocused ? '0 0 0 3px rgba(0, 174, 239, 0.1)' : 'none',
                  '&:hover': {
                    borderColor: state.isFocused ? '#00aeef' : '#ccc',
                  },
                  fontSize: '15px',
                  backgroundColor: 'white',
                }),
              }}
              className={styles.reactSelectContainer}
              classNamePrefix="react-select"
              isSearchable={false}
              isClearable={true}
              components={{
                DropdownIndicator: () => <FaChevronDown className={styles.selectArrow} />,
                IndicatorSeparator: null
              }}
            />
          </div>
          {errors.feedback && <span className={styles.errorMessage}>{errors.feedback}</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || loadingCourses}
          className={styles.submitButton}
        >
          {isSubmitting ? (
            <>
              <span className={styles.spinner}></span>
              Processing...
            </>
          ) : (
            <>
              <FaPhone className={styles.buttonIcon} />
              Get Free Demo Class
            </>
          )}
        </button>

        <div className={styles.privacyNote}>
          <small>
            By submitting this form, you agree to our Privacy Policy and Terms of Service.
          </small>
        </div>
      </form>
    </div>
  );
};

export default EnquiryForm;