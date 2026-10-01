"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import "../Blogs.css";
import CorporateContactForm from "@/assets/corporate3.webp";
import axios from "axios";
import { Menu, MenuItem } from "@mui/material";
import Flag from "@/components/common/CountryFlag";
import { AiFillCaretDown } from "react-icons/ai";
import { useTopBarApi } from "@/Api/hooks/HomePageApi/useTopBarApi";
import { countries, getDefaultCountry } from "@/countryUtils";
import { API_BASE_URL } from "@/lib/apiBase";

const initialValues = {
  name: "",
  email: "",
  comment: "",
};

// Plain useState — same "formik was wired up but never actually enforced
// validation" situation as ContactUs.jsx; standardized for consistency.
const CorporateContactUs = () => {
  const [values, setValues] = useState(initialValues);
  const [mobileNumber, setMobileNumber] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const mobileInputRef = useRef(null);
  const [company, setCompany] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { countryCode, isLoading: countryLoading } = useTopBarApi();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  const handleCheckboxChange = (e) => setIsChecked(e.target.checked);

  useEffect(() => {
    if (countryCode && !countryLoading) {
      const matchedCountry = countries.find((c) => c.flag === countryCode);
      if (matchedCountry) {
        setSelectedCountry(matchedCountry);
      }
    }
  }, [countryCode, countryLoading]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("loginuserData") || "{}");
    const userEmail = (userData.email || "").trim();
    if (!userEmail) {
      setIsLoggedIn(false);
      return;
    }
    setValues((prev) => ({ ...prev, email: userEmail }));
    setIsLoggedIn(true);
    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/user/myprofile?email=${encodeURIComponent(userEmail)}`, {
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch profile data");
        const data = await res.json();
        setValues((prev) => ({
          ...prev,
          name: data?.name ? String(data.name) : prev.name,
          email: data?.email ? String(data.email) : prev.email,
        }));
        if (data?.mobile) {
          const cleanMobile = data.mobile.includes(" ") ? data.mobile.split(" ")[1].trim() : data.mobile.trim();
          setMobileNumber(cleanMobile);
        }
        if (data?.country) {
          const byName = countries.find((c) => String(c.name).toLowerCase() === String(data.country).toLowerCase()) || null;
          if (byName) setSelectedCountry(byName);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Profile autofill failed:", err);
        }
      }
    })();
    return () => ctrl.abort();
  }, []);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setAnchorEl(null);
    mobileInputRef.current?.focus();
  };
  const onlyDigits = (v) => v.replace(/\D/g, "").slice(0, 15);
  const handleMobileChange = (e) => {
    setMobileNumber(onlyDigits(e.target.value));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // guards against duplicate submissions from a double-click
    const missing = [];
    const nameVal = (values.name || "").trim();
    const emailVal = (values.email || "").trim();
    const companyVal = (company || "").trim();
    const phoneVal = (mobileNumber || "").trim();
    if (!nameVal) missing.push("Full Name");
    if (!emailVal) missing.push("Work Email");
    if (!phoneVal) missing.push("Phone Number");
    if (!companyVal) missing.push("Company Name");
    if (missing.length) {
      setErrorMessage(`Please fill the mandatory fields: ${missing.join(", ")}.`);
      setSuccessMessage("");
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
    if (!emailOk) {
      setErrorMessage("Please enter a valid Work Email.");
      setSuccessMessage("");
      return;
    }
    const digitCount = (phoneVal.match(/\d/g) || []).length;
    const phoneOk = digitCount >= 7;
    if (!phoneOk) {
      setErrorMessage("Please enter a valid Phone Number.");
      setSuccessMessage("");
      return;
    }
    if (!isChecked) {
      setError("Please select the checkbox to acknowledge the Privacy Notice and Terms & conditions.");
      return;
    }
    setError("");
    const requestData = {
      fullName: nameVal,
      emailId: emailVal,
      mobileNumber: `${selectedCountry.code} ${phoneVal}`,
      companyName: companyVal,
      trainingCourse: "",
      noOfPeople: 0,
      comments: (values.comment || "").trim(),
      country: selectedCountry?.name || "",
    };
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/advisors`, requestData, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        if (isLoggedIn) {
          setValues((prev) => ({ ...prev, comment: "" }));
        } else {
          setValues(initialValues);
          setMobileNumber("");
        }
        setCompany("");
        setIsChecked(false);
        setSuccessMessage("Your request has been submitted successfully. Our team will contact you shortly.");
        setErrorMessage("");
      } else {
        setErrorMessage("Unable to submit your request. Please try again.");
        setSuccessMessage("");
      }
    } catch (err) {
      // Surface the backend's own safe error message when available (e.g.
      // a 503 "mail relay unavailable, but your request may not have been
      // saved") instead of a generic string that hides whether the lead
      // was actually captured or not.
      const backendMsg =
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.message;
      setErrorMessage(backendMsg || "Unable to submit your request. Please try again.");
      setSuccessMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  return (
    <div className="corporate-contact-background">
      <div className="corporate-contact-form container">
        <Image className="contact-form-image" src={CorporateContactForm} alt="Corporate Contact Form" priority />
        <div className="home-content">
          <h3 className="contact-title">Contact With Us</h3>
          <form className="corporate-contact-form-fields">
            <label htmlFor="corpContactName" className="form-label">
              Full Name<span className="star">*</span>
            </label>
            <div className="register-field">
              <div className="form-field">
                <input
                  id="corpContactName"
                  type="text"
                  className="form-control"
                  placeholder="Enter your full name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <label htmlFor="corpContactEmail" className="form-label">
              Work Email<span className="star">*</span>
            </label>
            <div className="register-field">
              <div className="form-field">
                <input
                  id="corpContactEmail"
                  type="email"
                  className="form-control"
                  placeholder="Enter your Email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <label className="form-label">
              Phone Number<span className="star">*</span>
            </label>
            <div className="register-field">
              <div className="form-field" style={{ position: "relative" }}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setAnchorEl(e.currentTarget);
                  }}
                  className="mobile-button"
                  type="button"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  <Flag code={selectedCountry.flag} alt={`${selectedCountry.name} flag`} className="country-flag me-1" />
                  <span style={{ marginRight: "5px", fontSize: "small" }}>
                    {selectedCountry.flag} ({selectedCountry.code})
                  </span>
                  <AiFillCaretDown />
                </button>

                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                  {countries.map((country) => (
                    <MenuItem key={country.code + country.flag} onClick={() => handleCountrySelect(country)}>
                      <Flag code={country.flag} alt={`${country.name} flag`} className="country-flag me-2" />
                      {country.name} ({country.code})
                    </MenuItem>
                  ))}
                </Menu>

                <input
                  type="tel"
                  className="form-control"
                  ref={mobileInputRef}
                  value={mobileNumber}
                  onChange={handleMobileChange}
                  placeholder="Enter your mobile number"
                  style={{ paddingLeft: "120px" }}
                  maxLength={15}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </div>
            </div>

            <div>
              <label className="form-label">
                Company Name<span className="star">*</span>
              </label>
              <div className="register-field">
                <div className="form-field">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your Company Name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mb-3">
              {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
              {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="corpFlexCheckChecked"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="corpFlexCheckChecked">
                  By clicking on Submit, you acknowledge read our{" "}
                  <Link href="/privacy" style={{ textDecoration: "underline", color: "#00AAEF" }}>
                    Privacy Notice
                  </Link>{" "}
                  and
                  <Link href="/terms" style={{ textDecoration: "underline", color: "#00AAEF", paddingLeft: 5 }}>
                    Terms & Conditions
                  </Link>
                </label>
              </div>
              <button
                type="button"
                className="submit-button"
                onClick={handleFormSubmit}
                disabled={isSubmitting}
                style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>

              {error && <p className="error-message">{error}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CorporateContactUs;
