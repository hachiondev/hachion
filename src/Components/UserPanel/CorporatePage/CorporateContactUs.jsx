import React, { useEffect, useState, useRef } from "react";
import "../Blogs.css";
import CorporateContactForm from "../../../Assets/corporate3.webp";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { Menu, MenuItem } from "@mui/material";
import Flag from "react-world-flags";
import { AiFillCaretDown } from "react-icons/ai";
import { useTopBarApi } from "../../../Api/hooks/useTopBarApi";
import { LoginSchema } from "../../Schemas";
import { countries, getDefaultCountry } from "../../../countryUtils";


const initialValues = {
  name: "",
  email: "",
  number: "",
  comment: "",
  date: "",
  country: "",
};

const CorporateContactUs = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const mobileInputRef = useRef(null);
  const [company, setCompany] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  const [mobileTouched, setMobileTouched] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { countryCode, isLoading: countryLoading } = useTopBarApi();


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCheckboxChange = (e) => setIsChecked(e.target.checked);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: LoginSchema,
  });
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = formik;
  
  useEffect(() => {
    if (countryCode && !countryLoading) {
      const matchedCountry = countries.find((c) => c.flag === countryCode);
      if (matchedCountry) {
        setSelectedCountry(matchedCountry);
        console.log(`Country auto-detected: ${matchedCountry.name} (${countryCode})`);
      }
    }
  }, [countryCode, countryLoading]);

  
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("loginuserData") || "{}");
    const userEmail = (userData.email || "").trim();

    
    if (userEmail) {
  setFieldValue("email", userEmail, false);
  setIsLoggedIn(true);
} else {
  setIsLoggedIn(false);
  return; 
}

    if (!userEmail) return;

    const ctrl = new AbortController();

    (async () => {
      try {
        const res = await fetch(
          `https://api.hachion.co/api/v1/user/myprofile?email=${encodeURIComponent(
            userEmail
          )}`,
          { signal: ctrl.signal }
        );
        if (!res.ok) throw new Error("Failed to fetch profile data");
        const data = await res.json();

        if (data?.name) setFieldValue("name", String(data.name), false);

        
        if (data?.email) setFieldValue("email", String(data.email), false);

        
        if (data?.mobile) {
  
  const cleanMobile = data.mobile.includes(" ")
    ? data.mobile.split(" ")[1].trim()
    : data.mobile.trim();

  setMobileNumber(cleanMobile);
}


        if (data?.country) {
          const byName =
            countries.find(
              (c) =>
                String(c.name).toLowerCase() ===
                String(data.country).toLowerCase()
            ) || null;

          if (byName) setSelectedCountry(byName);
          setFieldValue("country", data.country, false);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Profile autofill failed:", err);
        }
      }
    })();

    return () => ctrl.abort();
  }, [setFieldValue]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setAnchorEl(null);
    mobileInputRef.current?.focus();
  };

  const onlyDigits = (v) => v.replace(/\D/g, "").slice(0, 15);

  const handleMobileChange = (e) => {
    const digits = onlyDigits(e.target.value);
    setMobileNumber(digits);
    setMobileTouched(true);
  };

  const handleMobileBlur = () => setMobileTouched(true);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

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
      setErrorMessage(
        `Please fill the mandatory fields: ${missing.join(", ")}.`
      );
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
      setError(
        "Please select the checkbox to acknowledge the Privacy Notice and Terms & conditions."
      );
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

    try {
      const response = await axios.post(
        "https://api.hachion.co/advisors",
        requestData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
if (response.status === 200) {
  setShowModal(true);

  if (isLoggedIn) {
    resetForm({
      values: {
        ...values,
        name: values.name,
        email: values.email,
        comment: "",
        date: "",
        country: selectedCountry?.name || "",
        number: "",
      },
    });
    setMobileNumber((prev) => prev);
  } else {
    resetForm();
    setMobileNumber("");
    
  }

  setCompany("");
  setIsChecked(false);
  setMobileTouched(false);
  setSuccessMessage("✅ Query submitted successfully.");
  setErrorMessage("");

      } else {
        setErrorMessage("❌ Failed to submit query.");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("❌ Something went wrong while submitting the form.");
      setSuccessMessage("");
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

  const handlePrivacy = () => navigate("/privacy");
  const handleTerms = () => navigate("/terms");

  return (
    <>
      <div className="corporate-contact-background">
        <div className="corporate-contact-form container">
          <img
            className="contact-form-image"
            src={CorporateContactForm}
            alt="Corporate Contact Form"
            fetchpriority="high"
          />
          <div className="home-content">
            <h3 className="contact-title">Contact With Us</h3>
            <form className="contact-form">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Full Name<span className="star">*</span>
              </label>
              <div className="register-field">
                <div className="form-field">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your full name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>

              <label htmlFor="exampleFormControlInput1" className="form-label">
                Work Email<span className="star">*</span>
              </label>
              <div className="register-field">
                <div className="form-field">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your Email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>

              {/* --- Phone with country code & flag --- */}
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
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Flag
                      code={selectedCountry.flag}
                      className="country-flag me-1"
                    />
                    <span style={{ marginRight: "5px", fontSize: "small" }}>
                      {selectedCountry.flag} ({selectedCountry.code})
                    </span>
                    <AiFillCaretDown />
                  </button>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                  >
                    {countries.map((country) => (
                      <MenuItem
                        key={country.code + country.flag}
                        onClick={() => handleCountrySelect(country)}
                      >
                        <Flag
                          code={country.flag}
                          className="country-flag me-2"
                        />
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
                    placeholder="Enter your mobile number"
                    style={{ paddingLeft: "120px" }}
                    maxLength={15}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </div>
                {/* {mobileTouched &&
                  (mobileNumber.length < 7 || mobileNumber.length > 15) && (
                    <p className="error-field-message">
                      Please enter a valid Phone Number (7–15 digits).
                    </p>
                  )} */}
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
                  {errors.company && (
                    <p className="error-field-message">{errors.company}</p>
                  )}
                </div>
              </div>

              <div className="mb-3">
                {successMessage && (
                  <p style={{ color: "green", fontWeight: "bold" }}>
                    {successMessage}
                  </p>
                )}
                {errorMessage && (
                  <p style={{ color: "red", fontWeight: "bold" }}>
                    {errorMessage}
                  </p>
                )}
                <button
                  type="button"
                  className="submit-button"
                  onClick={handleFormSubmit}
                >
                  Submit
                </button>

                {error && <p className="error-message">{error}</p>}

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckChecked"
                     checked={isChecked} 
                    onChange={handleCheckboxChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckChecked"
                  >
                    By clicking on Submit, you acknowledge read our{" "}
                    <span
                      onClick={handlePrivacy}
                      style={{
                        textDecoration: "underline",
                        cursor: "pointer",
                        color: "#00AAEF",
                      }}
                    >
                      Privacy Notice
                    </span>{" "}
                    and
                    <span
                      onClick={handleTerms}
                      style={{
                        textDecoration: "underline",
                        cursor: "pointer",
                        color: "#00AAEF",
                        paddingLeft: 5,
                      }}
                    >
                      Terms & Conditions
                    </span>
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CorporateContactUs;
