import React, { useEffect, useState, useRef } from "react";
import Usa from "../../Assets/usa.webp";
import "./Blogs.css";
import india from "../../Assets/india.webp";
import dubai from "../../Assets/dubai.webp";
import ContactForm from "../../Assets/contact1.webp";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { LoginSchema } from "../Schemas";
import axios from "axios";
import { TbSlashes } from "react-icons/tb";
import { Menu, MenuItem } from "@mui/material";
import Flag from "react-world-flags";
import { AiFillCaretDown } from "react-icons/ai";
import { countries, getDefaultCountry } from "../../countryUtils";

const initialValues = {
  name: "",
  email: "",
  number: "",
  comment: "",
  date: "",
  country: "",
};

const ContactUs = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const mobileInputRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState({
    code: "+1",
    flag: "US",
    name: "United States",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  const [contactNumber, setContactNumber] = useState("+1 (732) 485-2499");
const [isLoggedIn, setIsLoggedIn] = useState(false);

  
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: LoginSchema,
  });


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


  useEffect(() => {
    window.scrollTo(0, 0);
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
  };

  const handleMobileBlur = () => {
    setMobileNumber((m) => onlyDigits(m));
  };

  
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("loginuserData")) || {};
    const userEmail = (userData.email || "").trim();

    values.email = userEmail;

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `https://api.test.hachion.co/api/v1/user/myprofile?email=${userEmail}`
        );

        if (!response.ok) {
          throw new Error("❌ Failed to fetch profile data");
        }
        const data = await response.json();

        if (data?.name) {
          values.name = data.name;
        }

        if (data?.mobile) {
          const clean = String(data.mobile).includes(" ")
            ? String(data.mobile).split(" ")[1].trim()
            : String(data.mobile).trim();
          setMobileNumber(onlyDigits(clean));
        }

        if (data?.country) {
          values.country = data.country;
        }
      } catch (_err) {
        
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

    
    if (!areMandatoryFieldsFilled()) {
      setError("Please provide all mandatory fields.");
      return;
    }

    if (!isChecked) {
      setError(
        "Please select the checkbox to acknowledge the Privacy Notice and Terms & conditions."
      );
      return;
    }

    setError(""); 

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
      const response = await axios.post(
        "https://api.test.hachion.co/haveanyquery/add",
        requestData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        setShowModal(true);

        if (isLoggedIn) {
          formik.resetForm({
            values: {
              ...values,
              name: values.name,
              email: values.email,
              comment: "",
              date: "",
              country: selectedCountry?.name || "",
            },
          });
          setMobileNumber((prev) => prev);
        } else {
          formik.resetForm();
          setMobileNumber("");
        }

        setIsChecked(false);
        setSuccessMessage("✅ Query submitted successfully.");
        setErrorMessage("");
      } else {
        setErrorMessage("❌ Failed to submit query.");
        setSuccessMessage("");
      }
    } catch (_error) {
      setErrorMessage("❌ Something went wrong while submitting the form.");
      setSuccessMessage("");
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


  const handlePrivacy = () => {
    navigate("/privacy");
  };
  const handleTerms = () => {
    navigate("/terms");
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    formik;

  const officeLocations = [
    {
      name: "Texas, USA",
      country: Usa,
    },
    {
      name: "Hyderabad, India",
      country: india,
    },
    {
      name: "Dubai, UAE",
      country: dubai,
    },
  ];

  return (
    <>
      <div className="contact-banner container">
        <h1 className="instructor-profile-title">Contact Us</h1>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="instructor-breadcrumb-item">
              <a href="/">Home</a> <TbSlashes color="#00aeef" />
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
                  onBlur={handleBlur}
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
                  onBlur={handleBlur}
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
                  <Flag code={selectedCountry.flag} className="country-flag me-1" />
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
                      <Flag code={country.flag} className="country-flag me-2" />
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
                  aria-label="Text input with segmented dropdown button"
                  placeholder="Enter your mobile number"
                  style={{ paddingLeft: "120px" }}
                  maxLength={15}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </div>
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
                  onBlur={handleBlur}
                />
              </div>
            </div>

            <div className="mb-3">
              {successMessage && (
                <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>
              )}
              {errorMessage && (
                <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>
              )}
             <button
  type="button"
  className="submit-button"
  onClick={handleFormSubmit}
  disabled={!areMandatoryFieldsFilled() || !isChecked}
  style={{
    backgroundColor: !areMandatoryFieldsFilled() || !isChecked ? "#cccccc" : "#00AAEF",
    color: !areMandatoryFieldsFilled() || !isChecked ? "#666666" : "#ffffff",
    cursor: !areMandatoryFieldsFilled() || !isChecked ? "not-allowed" : "pointer",
    opacity: !areMandatoryFieldsFilled() || !isChecked ? 0.7 : 1,
  }}
>
  Send
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
                <label className="form-check-label" htmlFor="flexCheckChecked">
                  By clicking on Send, you acknowledge read our{" "}
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

        <img
          className="contact-form-image"
          src={ContactForm}
          alt="Contact Form"
          fetchpriority="high"
        />
      </div>

      <div className="contact-us-all">
        <div className="container">
          <h2 className="trending-title">Our offices</h2>
          <div className="contact-us">
            {officeLocations.map((loc, i) => (
              <div className="contact-us-div" key={i}>
                <div className="contact-us-box">
                  <img
                    src={loc.country}
                    alt={`${loc.name} country`}
                    className="contact-address"
                    loading="lazy"
                  />
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
            {[
              "University/college associations",
              "Media queries",
              "Fest sponsorships",
              "For everything else",
            ].map((title, i) => (
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
