"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Usa from "@/assets/usa.webp";
import "./Blogs.css";
import india from "@/assets/india.webp";
import dubai from "@/assets/dubai.webp";
import ContactForm from "@/assets/contact1.webp";
import axios from "axios";
import { TbSlashes } from "react-icons/tb";
import { Menu, MenuItem } from "@mui/material";
import Flag from "@/components/common/CountryFlag";
import { AiFillCaretDown } from "react-icons/ai";
import { countries } from "@/countryUtils";

const initialValues = {
  name: "",
  email: "",
  comment: "",
};

// Plain useState, matching Login/Register/Sitemap's pattern — the CRA
// original wired up formik+yup here but never actually called
// formik.handleSubmit or read formik.errors; the real (and only)
// validation was this hand-rolled areMandatoryFieldsFilled() check, so
// formik/yup were decorative. Standardizing removes an unused dependency
// and the anti-pattern of mutating formik's values object directly.
const ContactUs = () => {
  const [values, setValues] = useState(initialValues);
  const [showModal, setShowModal] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const mobileInputRef = useRef(null);
  const submittingRef = useRef(false);
  const [selectedCountry, setSelectedCountry] = useState({
    code: "+1",
    flag: "US",
    name: "United States",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const [contactNumber, setContactNumber] = useState("+1 (732) 485-2499");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetch("https://api.country.is")
      .then((r) => r.json())
      .then((data) => {
        data.country_code = (data.country || "").toUpperCase();
        const match = countries.find((c) => c.flag === data?.country_code);
        if (match) setSelectedCountry(match);
        if (data?.country_code === "IN") {
          setContactNumber("+91 94903 23388");
        } else {
          setContactNumber("+1 (732) 485-2499");
        }
      })
      .catch(() => {});
  }, []);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };
  const onlyDigits = (v) => String(v || "").replace(/\D/g, "").slice(0, 15);
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setAnchorEl(null);
    mobileInputRef.current?.focus();
  };
  const handleMobileChange = (e) => {
    const digits = onlyDigits(e.target.value);
    setMobileNumber(digits);

    if (digits.length > 10) {
      setMobileError("Mobile number must be 10 digits");
    } else {
      setMobileError("");
    }
  };
  const handleMobileBlur = () => {
    setMobileNumber((m) => onlyDigits(m));

    if (mobileNumber.length > 0 && mobileNumber.length !== 10) {
      setMobileError("Mobile number must be 10 digits");
    } else {
      setMobileError("");
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("loginuserData")) || {};
    const userEmail = (userData.email || "").trim();
    setValues((prev) => ({ ...prev, email: userEmail }));
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`https://api.hachion.co/api/v1/user/myprofile?email=${userEmail}`);
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();
        setValues((prev) => ({
          ...prev,
          name: data?.name || prev.name,
        }));
        if (data?.mobile) {
          const clean = String(data.mobile).includes(" ")
            ? String(data.mobile).split(" ")[1].trim()
            : String(data.mobile).trim();
          setMobileNumber(onlyDigits(clean));
        }
      } catch {
        // profile prefill is best-effort only
      }
    };
    if (userEmail) {
      setIsLoggedIn(true);
      fetchUserProfile();
    }
     
  }, []);

  const areMandatoryFieldsFilled = () => {
    return (
      values.name.trim() !== "" &&
      values.email.trim() !== "" &&
      mobileNumber.trim() !== "" &&
      values.comment.trim() !== ""
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // A useState-only guard isn't enough: two clicks fired back-to-back
    // (double-click, or two React event handlers dispatched before the
    // first setIsSubmitting(true) has committed a re-render) both close
    // over the same stale isSubmitting=false and both pass the check.
    // submittingRef is mutated synchronously, so the second invocation
    // always sees the first one's guard.
    if (submittingRef.current) return;
    if (!areMandatoryFieldsFilled()) {
      setError("Please provide all mandatory fields.");
      return;
    }
    if (!isChecked) {
      setError("Please select the checkbox to acknowledge the Privacy Notice and Terms & conditions.");
      return;
    }
    setError("");
    submittingRef.current = true;
    setIsSubmitting(true);
    const currentDate = new Date().toISOString().split("T")[0];
    const requestData = {
      name: values.name,
      email: values.email,
      mobile: mobileNumber,
      comment: values.comment,
      date: currentDate,
      country: selectedCountry.name,
    };
    try {
      const response = await axios.post(`https://api.hachion.co/haveanyquery/add`, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        setShowModal(true);
        if (isLoggedIn) {
          setValues((prev) => ({ ...prev, comment: "" }));
        } else {
          setValues(initialValues);
          setMobileNumber("");
        }
        setIsChecked(false);
        setSuccessMessage("✅ Query submitted successfully.");
        setErrorMessage("");
      } else {
        setErrorMessage("❌ Failed to submit query.");
        setSuccessMessage("");
      }
    } catch {
      // Form values are deliberately left untouched here so the user
      // doesn't have to retype everything after a failed submit.
      setErrorMessage("❌ Something went wrong while submitting the form.");
      setSuccessMessage("");
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const officeLocations = [
    { name: "Texas, USA", country: Usa },
    { name: "Hyderabad, India", country: india },
    { name: "Dubai, UAE", country: dubai },
  ];

  return (
    <>
      <div className="contact-banner container">
        <h1 className="instructor-profile-title">Contact Us</h1>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="instructor-breadcrumb-item">
              <Link href="/">Home</Link> <TbSlashes color="#00aeef" />
            </li>
            <li className="instructor-breadcrumb-item active" aria-current="page">
              Contact Us
            </li>
          </ol>
        </nav>
      </div>

      <div className="home-banner container">
        <div className="home-content">
          <h3 className="contact-title">Let’s talk.</h3>
          <p className="contact-mail-data">
            Leave us a note here, or give us a call at {contactNumber}.
          </p>
          <form className="contact-form">
            <label htmlFor="contactName" className="form-label">
              Full Name<span className="star">*</span>
            </label>
            <div className="register-field">
              <div className="form-field">
                <input
                  id="contactName"
                  type="text"
                  className="form-control"
                  placeholder="Enter your full name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <label htmlFor="contactEmail" className="form-label">
              Email Id<span className="star">*</span>
            </label>
            <div className="register-field">
              <div className="form-field">
                <input
                  id="contactEmail"
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
                  onBlur={handleMobileBlur}
                  aria-label="Mobile number, with country code dropdown"
                  placeholder="Enter your mobile number"
                  style={{ paddingLeft: "120px" }}
                  maxLength={15}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </div>

              {mobileError && (
                <p style={{ color: "red", fontSize: "12px", marginTop: "5px", marginBottom: "0" }}>
                  {mobileError}
                </p>
              )}
            </div>

            <label htmlFor="contactComment" className="form-label">
              Tell us about your idea<span className="star">*</span>
            </label>
            <div className="register-field">
              <div className="form-field">
                <textarea
                  id="contactComment"
                  className="form-control"
                  placeholder="Type your Idea...."
                  rows={5}
                  name="comment"
                  value={values.comment}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckChecked"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor="flexCheckChecked">
                By clicking on Send, you acknowledge read our{" "}
                <Link href="/privacy" style={{ textDecoration: "underline", color: "#00AAEF" }}>
                  Privacy Notice
                </Link>{" "}
                and
                <Link href="/terms" style={{ textDecoration: "underline", color: "#00AAEF", paddingLeft: 5 }}>
                  Terms & Conditions
                </Link>
              </label>
            </div>

            <div className="mb-3">
              {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
              {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
              <button
                type="button"
                className="submit-button"
                onClick={handleFormSubmit}
                disabled={!areMandatoryFieldsFilled() || !isChecked || isSubmitting}
                style={{
                  backgroundColor: !areMandatoryFieldsFilled() || !isChecked || isSubmitting ? "#cccccc" : "#00AAEF",
                  color: !areMandatoryFieldsFilled() || !isChecked || isSubmitting ? "#666666" : "#ffffff",
                  cursor: !areMandatoryFieldsFilled() || !isChecked || isSubmitting ? "not-allowed" : "pointer",
                  opacity: !areMandatoryFieldsFilled() || !isChecked || isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting ? "Submitting..." : "Send"}
              </button>

              {error && <p className="error-message">{error}</p>}
            </div>
          </form>
        </div>

        <Image className="contact-form-image" src={ContactForm} alt="Contact Form" priority />
      </div>

      <div className="contact-us-all">
        <div className="container">
          <h2 className="trending-title">Our offices</h2>
          <div className="contact-us">
            {officeLocations.map((loc, i) => (
              <div className="contact-us-div" key={i}>
                <div className="contact-us-box">
                  <Image src={loc.country} alt={`${loc.name} country`} className="contact-address" loading="lazy" />
                  <div className="office-location">
                    <h3 className="trending-title">{loc.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="instructor-banner container">
          <div className="home-content">
            <h3 className="contact-title">For Others</h3>
            {["University/college associations", "Media queries", "Fest sponsorships", "For everything else"].map((title, i) => (
              <div key={i}>
                <h4 className="contact-title">
                  <span>{title}</span>
                </h4>
                <p className="contact-mail-data">
                  Email us :{" "}
                  <span>
                    <a
                      href="https://mail.google.com/mail/?view=cm&to=trainings@hachion.co"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      trainings@hachion.co
                    </a>
                  </span>
                </p>
              </div>
            ))}
          </div>

          <div className="home-content">
            <h3 className="contact-title">Address</h3>
            <div className="contact-block">
              <h3 className="contact-title-text">
                Head Office:<span> Texas, USA</span>
              </h3>
              <p className="contact-title-text">
                <span>Hachion 601 Voyage Trce Leander Texas 78641</span>
              </p>
            </div>
            <div className="contact-block">
              <h3 className="contact-title-text">
                India Office:<span> Hyderabad, India</span>
              </h3>
              <p className="contact-title-text">
                <span>Hachion GP Rao Enclaves, 301, 3rd floor Road No 3</span>
              </p>
              <p className="contact-title-text">
                <span>KPHB colony, Hyderabad 500072.</span>
              </p>
            </div>
            <div className="contact-block">
              <h3 className="contact-title-text">
                Dubai Office:<span> Dubai, UAE</span>
              </h3>
              <p className="contact-title-text">
                <span>Sports City Dubai UAE</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ContactUs;
