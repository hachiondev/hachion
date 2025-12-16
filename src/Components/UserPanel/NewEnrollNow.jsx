import React, { useState, useEffect } from "react";
import { cn } from "../../utils";
import styles from "./NewEnrollNow.module.css";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// Radio button component
const RadioButton = ({ label, value, selected, onChange }) => (
    <label className={styles.enradioLabel}>
        <input
            type="radio"
            name="payment-method"
            value={value}
            checked={selected}
            onChange={onChange}
            className={styles.enradioInput}
        />
        <span className={styles.enradioCustom}></span>
        {label}
    </label>
);

export default function NewEnrollNow() {
    const [selectedBatch, setSelectedBatch] = useState("");
    const [selectedMode, setSelectedMode] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        coupon: "",
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const courseName = "Web Developer: HTML, CSS and JavaScript";
    const totalAmount = "₹4,999";
    const batches = ["Batch 1 - Jan 2026", "Batch 2 - Feb 2026", "Batch 3 - Mar 2026"];
    const modes = ["Self-paced Learning", "Live Classes", "Hybrid Mode"];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePayNow = () => {
        const enrollmentData = {
            courseName,
            selectedBatch,
            selectedMode,
            paymentMethod,
            ...formData,
            totalAmount,
        };
        console.log("Enrollment Data:", enrollmentData);
        // Add your payment processing logic here
    };

    return (
        <div className="container">
            <div className={styles.enContainer}>
                <div className={styles.enWrapper}>
                    {/* Header */}
                    <div className={styles.enHeader}>
                        <div className={styles.enHeaderContent}>
                            <h1 className={styles.enTitle}>Enroll & Pay</h1>
                            <p className={styles.enSubtitle}>
                                Confirm your course details and proceed with secure payment.
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className={styles.enContent}>
                        {/* Course Details Section */}
                        <div className={styles.enSection}>
                            <label className={styles.enLabel}>Course Name</label>
                            <div className={styles.enCourseDisplay}>{courseName}</div>
                        </div>

                        {/* Batch & Mode Selection */}
                        <div className={styles.enRow}>
                            <div className={styles.enCol}>
                                <label htmlFor="batch" className={styles.enLabel}>
                                    Select Batch
                                </label>
                                <select
                                    id="batch"
                                    value={selectedBatch}
                                    onChange={(e) => setSelectedBatch(e.target.value)}
                                    className={styles.enSelect}
                                >
                                    <option value="">Choose Batch</option>
                                    {batches.map((batch, idx) => (
                                        <option key={idx} value={batch}>
                                            {batch}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.enCol}>
                                <label htmlFor="mode" className={styles.enLabel}>
                                    Learning Mode
                                </label>
                                <select
                                    id="mode"
                                    value={selectedMode}
                                    onChange={(e) => setSelectedMode(e.target.value)}
                                    className={styles.enSelect}
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
                        <div className={styles.enSectionTitle}>Billing Details</div>

                        <div className={styles.enRow}>
                            <div className={styles.enCol}>
                                <label htmlFor="fullName" className={styles.enLabel}>
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
                            <div className={styles.enCol}>
                                <label htmlFor="email" className={styles.enLabel}>
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

                        <div className={styles.enRow}>
                            <div className={styles.enCol}>
                                <label htmlFor="phone" className={styles.enLabel}>
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
                            <div className={styles.enCol}>
                                <label htmlFor="coupon" className={styles.enLabel}>
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
                        <div className={styles.enSectionTitle}>Payment Method</div>

                        <div className={styles.enPaymentMethods}>
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
                        <div className={styles.enTerms}>
                            <input
                                type="checkbox"
                                id="terms"
                                className={styles.enCheckbox}
                                defaultChecked
                            />
                            <label htmlFor="terms" className={styles.enTermsLabel}>
                                I agree to the{" "}
                                <a href="#" className={styles.enLink}>
                                    Terms & Conditions
                                </a>{" "}
                                and{" "}
                                <a href="#" className={styles.enLink}>
                                    Refund Policy
                                </a>
                            </label>
                        </div>

                        {/* Total & CTA */}
                        <div className={styles.enFooter}>
                            <div className={styles.enTotalSection}>
                                <span className={styles.enTotalLabel}>Total Payable:</span>
                                <span className={styles.enTotalAmount}>{totalAmount}</span>
                            </div>
                            <button className={styles.enPayBtn} onClick={handlePayNow}>
                                Pay Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
