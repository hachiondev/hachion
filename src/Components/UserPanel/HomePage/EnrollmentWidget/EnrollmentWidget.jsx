import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './EnrollmentWidget.module.css'; // You'll need to create this CSS module

const EnrollmentWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    // Reset form or show success message
    setFormData({
      name: '',
      email: '',
      phone: '',
      course: '',
      message: ''
    });
    setIsOpen(false);
  };

  return (
    <div className={`${styles.widgetContainer} ${isOpen ? styles.open : ''}`}>
      {/* Floating Button */}
      <button 
        className={styles.floatingButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : 'Enroll Now'}
      </button>

      {/* Widget Content */}
      <div className={styles.widgetContent}>
        <div className={styles.widgetHeader}>
          <h3>Quick Enrollment</h3>
          <button 
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.enrollmentForm}>
          <div className={styles.formGroup}>
            <input
              type="text"
              name="name"
              placeholder="Full Name *"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.formInput}
            />
          </div>
          
          <div className={styles.formGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.formInput}
            />
          </div>
          
          <div className={styles.formGroup}>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number *"
              value={formData.phone}
              onChange={handleChange}
              required
              className={styles.formInput}
            />
          </div>
          
          <div className={styles.formGroup}>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
              className={styles.formSelect}
            >
              <option value="">Select a Course</option>
              <option value="Full Stack Development">Full Stack Development</option>
              <option value="Data Science">Data Science</option>
              <option value="Cloud Computing">Cloud Computing</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <textarea
              name="message"
              placeholder="Any specific requirements or questions?"
              value={formData.message}
              onChange={handleChange}
              rows="3"
              className={styles.formTextarea}
            />
          </div>
          
          <button type="submit" className={styles.submitButton}>
            Submit Inquiry
          </button>
          
          <div className={styles.widgetFooter}>
            <p>or explore our <Link to="/courses" className={styles.courseLink}>complete course catalog</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollmentWidget;