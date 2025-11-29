import React, { useState } from "react";
import { cn } from "../../utils";
import styles from "./EnrollPay.module.css";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

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

// Radio button component
const RadioButton = ({ label, value, selected, onChange }) => (
  <label className={styles.epradioLabel}>
    <input
      type="radio"
      name="payment-method"
      value={value}
      checked={selected}
      onChange={onChange}
      className={styles.epradioInput}
    />
    <span className={styles.epradioCustom}></span>
    {label}
  </label>
);

export default function EnrollPay({
  courseName = "Web Developer: HTML, CSS and JavaScript",
  onClose = () => {},
  onPayNow = () => {},
  totalAmount = "₹4,999",
  batches = ["Batch 1", "Batch 2", "Batch 3"],
  modes = ["Self-paced", "Live Classes", "Hybrid"],
}) {
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedMode, setSelectedMode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coupon: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayNow = () => {
    onPayNow({
      courseName,
      selectedBatch,
      selectedMode,
      paymentMethod,
      ...formData,
      totalAmount,
    });
  };

  return (
    <div className={styles.epOverlay}>
      <div className={styles.epModal}>
        {/* Header */}
        <div className={styles.epHeader}>
          <div className={styles.epHeaderContent}>
            <h2 className={styles.epTitle}>Enroll & Pay</h2>
            <p className={styles.epSubtitle}>
              Confirm your course details and proceed with secure payment.
            </p>
          </div>
          <button
            className={styles.epCloseBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className={styles.epContent}>
          {/* Course Details Section */}
          <div className={styles.epSection}>
            <label className={styles.epLabel}>Course Name</label>
            <div className={styles.epCourseDisplay}>{courseName}</div>
          </div>

          {/* Batch & Mode Selection */}
          <div className={styles.epRow}>
            <div className={styles.epCol}>
              <label htmlFor="batch" className={styles.epLabel}>
                Select Batch
              </label>
              <select
                id="batch"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className={styles.epSelect}
              >
                <option value="">Choose Batch</option>
                {batches.map((batch, idx) => (
                  <option key={idx} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.epCol}>
              <label htmlFor="mode" className={styles.epLabel}>
                Learning Mode
              </label>
              <select
                id="mode"
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className={styles.epSelect}
              >
                <option value="">Select Mode</option>
                {modes.map((mode, idx) => (
                  <option key={idx} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Billing Details Section */}
          <div className={styles.epSectionTitle}>Billing Details</div>

          <div className={styles.epRow}>
            <div className={styles.epCol}>
              <label htmlFor="fullName" className={styles.epLabel}>
                Full Name
              </label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.epCol}>
              <label htmlFor="email" className={styles.epLabel}>
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className={styles.epRow}>
            <div className={styles.epCol}>
              <label htmlFor="phone" className={styles.epLabel}>
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                placeholder="+91 XXXXX XXXXX"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.epCol}>
              <label htmlFor="coupon" className={styles.epLabel}>
                Coupon Code (Optional)
              </label>
              <Input
                id="coupon"
                name="coupon"
                placeholder="Enter coupon if any"
                value={formData.coupon}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Payment Method Section */}
          <div className={styles.epSectionTitle}>Payment Method</div>

          <div className={styles.epPaymentMethods}>
            <RadioButton
              label="Credit/Debit Card"
              value="card"
              selected={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <RadioButton
              label="UPI"
              value="upi"
              selected={paymentMethod === "upi"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <RadioButton
              label="Wallet"
              value="wallet"
              selected={paymentMethod === "wallet"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <RadioButton
              label="Net Banking"
              value="netbanking"
              selected={paymentMethod === "netbanking"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>

          {/* Terms & Conditions */}
          <div className={styles.epTerms}>
            <input
              type="checkbox"
              id="terms"
              className={styles.epCheckbox}
              defaultChecked
            />
            <label htmlFor="terms" className={styles.epTermsLabel}>
              I agree to the{" "}
              <a href="#" className={styles.epLink}>
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="#" className={styles.epLink}>
                Refund Policy
              </a>
            </label>
          </div>

          {/* Total & CTA */}
          <div className={styles.epFooter}>
            <div className={styles.epTotalSection}>
              <span className={styles.epTotalLabel}>Total Payable:</span>
              <span className={styles.epTotalAmount}>{totalAmount}</span>
            </div>
            <button
              className={styles.epPayBtn}
              onClick={handlePayNow}
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
