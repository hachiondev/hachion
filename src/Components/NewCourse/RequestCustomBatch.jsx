import React, { useState } from "react";
import { cn } from "../../utils";
import styles from "./RequestCustomBatch.module.css";
import { Input } from "../ui/input";

// Close icon
const CloseIcon = (p) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...p}>
    <path
      fill="currentColor"
      d="M18 6L6 18M6 6l12 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Country code selector component
const CountryCodeSelect = ({ value, onChange }) => (
  <select
    value={value}
    onChange={onChange}
    className={styles.rcbCountrySelect}
  >
    <option value="+1">🇺🇸 +1</option>
    <option value="+44">🇬🇧 +44</option>
    <option value="+91">🇮🇳 +91</option>
    <option value="+61">🇦🇺 +61</option>
    <option value="+1">🇨🇦 +1</option>
  </select>
);

// Location selector component
const LocationSelect = ({ value, onChange }) => (
  <select
    value={value}
    onChange={onChange}
    className={styles.rcbLocationSelect}
  >
    <option value="">United Kingdom</option>
    <option value="US">United States</option>
    <option value="IN">India</option>
    <option value="AU">Australia</option>
    <option value="CA">Canada</option>
  </select>
);

export default function RequestCustomBatch({
  onClose = () => {},
  onSubmit = () => {},
  schedules = ["Morning (9 AM - 12 PM)", "Afternoon (2 PM - 5 PM)", "Evening (6 PM - 9 PM)"],
  modes = ["Live Classes", "Self-paced", "Hybrid"],
  groupSizes = ["5-10 members", "10-20 members", "20-30 members", "30+ members"],
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    location: "United Kingdom",
    startDate: "",
    trainingMode: "",
    schedule: "",
    groupSize: "",
    comments: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCountryCodeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      countryCode: e.target.value,
    }));
  };

  const handleLocationChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      location: e.target.value || "United Kingdom",
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className={styles.rcbOverlay}>
      <div className={styles.rcbModal}>
        {/* Header */}
        <div className={styles.rcbHeader}>
          <h2 className={styles.rcbTitle}>Request Custom Batch</h2>
          <button
            className={styles.rcbCloseBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className={styles.rcbContent}>
          {/* Name & Email Row */}
          <div className={styles.rcbRow}>
            <div className={styles.rcbCol}>
              <label htmlFor="name" className={styles.rcbLabel}>
                Name<span className={styles.rcbRequired}>*</span>
              </label>
              <Input
                id="name"
                name="name"
                placeholder="Enter Your Name"
                value={formData.name}
                onChange={handleInputChange}
                className={cn(styles.rcbInput)}
              />
            </div>
            <div className={styles.rcbCol}>
              <label htmlFor="email" className={styles.rcbLabel}>
                Email<span className={styles.rcbRequired}>*</span>
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className={cn(styles.rcbInput)}
              />
            </div>
          </div>

          {/* Phone & Location Row */}
          <div className={styles.rcbRow}>
            <div className={styles.rcbCol}>
              <label htmlFor="phone" className={styles.rcbLabel}>
                Phone Number<span className={styles.rcbRequired}>*</span>
              </label>
              <div className={styles.rcbPhoneGroup}>
                <CountryCodeSelect
                  value={formData.countryCode}
                  onChange={handleCountryCodeChange}
                />
                <Input
                  id="phone"
                  name="phone"
                  placeholder="2583 65489"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={cn(styles.rcbInput, styles.rcbPhoneInput)}
                />
              </div>
            </div>
            <div className={styles.rcbCol}>
              <label htmlFor="location" className={styles.rcbLabel}>
                Location<span className={styles.rcbRequired}>*</span>
              </label>
              <LocationSelect
                value={formData.location}
                onChange={handleLocationChange}
              />
            </div>
          </div>

          {/* Start Date & Training Mode Row */}
          <div className={styles.rcbRow}>
            <div className={styles.rcbCol}>
              <label htmlFor="startDate" className={styles.rcbLabel}>
                Preferred Start Date<span className={styles.rcbRequired}>*</span>
              </label>
              <div className={styles.rcbDateGroup}>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  placeholder="DD/MM/YY"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={cn(styles.rcbInput, styles.rcbDateInput)}
                />
                <span className={styles.rcbCalendarIcon}><img src="calendar_form.png" alt="Calendar Icon" /></span>
              </div>
            </div>
            <div className={styles.rcbCol}>
              <label htmlFor="trainingMode" className={styles.rcbLabel}>
                Preferred Mode of Training<span className={styles.rcbRequired}>*</span>
              </label>
              <select
                id="trainingMode"
                name="trainingMode"
                value={formData.trainingMode}
                onChange={handleInputChange}
                className={styles.rcbSelect}
              >
                <option value="">Choose Mode of Training</option>
                {modes.map((mode, idx) => (
                  <option key={idx} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Schedule & Group Size Row */}
          <div className={styles.rcbRow}>
            <div className={styles.rcbCol}>
              <label htmlFor="schedule" className={styles.rcbLabel}>
                Preferred Schedule<span className={styles.rcbRequired}>*</span>
              </label>
              <select
                id="schedule"
                name="schedule"
                value={formData.schedule}
                onChange={handleInputChange}
                className={styles.rcbSelect}
              >
                <option value="">Select Schedule</option>
                {schedules.map((schedule, idx) => (
                  <option key={idx} value={schedule}>
                    {schedule}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.rcbCol}>
              <label htmlFor="groupSize" className={styles.rcbLabel}>
                Preferred Group Size<span className={styles.rcbRequired}>*</span>
              </label>
              <select
                id="groupSize"
                name="groupSize"
                value={formData.groupSize}
                onChange={handleInputChange}
                className={styles.rcbSelect}
              >
                <option value="">Select Group Size</option>
                {groupSizes.map((size, idx) => (
                  <option key={idx} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comments */}
          <div className={styles.rcbFormGroup}>
            <label htmlFor="comments" className={styles.rcbLabel}>
              Additional Requirements or Comments
            </label>
            <textarea
              id="comments"
              name="comments"
              placeholder="Add Comments"
              value={formData.comments}
              onChange={handleInputChange}
              className={styles.rcbTextarea}
              rows="5"
            />
          </div>

          {/* Info Box */}
          <div className={styles.rcbInfoBox}>
            <h3 className={styles.rcbInfoTitle}>What happens next?</h3>
            <ul className={styles.rcbInfoList}>
              <li>Our team will review your request within 24 hours</li>
              <li>We'll contact you to discuss batch formation</li>
              <li>You'll receive confirmation once a batch is ready</li>
              <li>No commitment required until you confirm enrolment</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className={styles.rcbActions}>
            <button className={styles.rcbCancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button className={styles.rcbSubmitBtn} onClick={handleSubmit}>
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
