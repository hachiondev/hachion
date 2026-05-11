import React, { useEffect, useState, useRef } from "react";
import "./unsubscribe.css";
import { useNavigate } from "react-router-dom";
import { RiCloseCircleLine } from "react-icons/ri";
import { useFormik } from "formik";
import { LoginSchema } from "../../Schemas";
import success from "../../../Assets/success.gif";
import axios from "axios";
import { GoHeartFill } from "react-icons/go";
import { Menu, MenuItem } from "@mui/material";
import Flag from "react-world-flags";
import { AiFillCaretDown } from "react-icons/ai";
import { countries, getDefaultCountry } from '../../../countryUtils';

const initialValues = {
  name: "",
  email: "",
  number: "",
  chooseDuration: "",
  reason: "",
  comment: "",
  date: "",
  country: "",
};

const Unsubscribe = () => {
  const navigate = useNavigate();
const [showModal, setShowModal] = useState(false);
const [mobileNumber, setMobileNumber] = useState("");
const [selectedCountry, setSelectedCountry] = useState({ code: "+1", flag: "US", name: "United States" });
const [anchorEl, setAnchorEl] = useState(null);
const [isChecked, setIsChecked] = useState(true);
const [error, setError] = useState("");
const [mobileError, setMobileError] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);
const [selectedReasons, setSelectedReasons] = useState([]);
const mobileInputRef = useRef(null);
  
const matchedCountry = countries.find(c => mobileNumber.startsWith(c.code)) || selectedCountry;

const { values, handleBlur, handleChange } = useFormik({
  initialValues,
  validationSchema: LoginSchema,
  onSubmit: () => {}
});

const defaultCountry = getDefaultCountry("US");
useEffect(() => {

  const detectAndSetCountry = async () => {

    // ✅ Don't overwrite if already selected from profile
    if (selectedCountry?.code && mobileNumber) {
      return;
    }

    try {
      const res = await fetch("https://api.country.is");

      if (!res.ok) throw new Error("Location fetch failed");

      const data = await res.json();

      data.country_code = (data.country || "").toUpperCase();

      const matched = countries.find(
        (c) => c.flag === data?.country_code
      );

      if (matched) {
        setSelectedCountry(matched);
      }

    } catch (err) {}
  };
  detectAndSetCountry();

  const userData = JSON.parse(localStorage.getItem("loginuserData")) || {};
const userEmail = userData.email || "";

// ✅ If logged in → autofill
if (userEmail) {
  values.email = userEmail;

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`https://api.test.hachion.co/api/v1/user/myprofile?email=${userEmail}`);
      const data = await res.json();
      if (res.ok) {
  values.name = data.name || "";
  values.country = data.country || "";

  if (data.mobile) {

    const mobileValue = String(data.mobile).trim();

    // Example: +91 9876543210
    const parts = mobileValue.split(" ");

    if (parts.length > 1) {

      const code = parts[0];
      const number = parts.slice(1).join("");

      // set country dropdown
      const matchedCountry = countries.find(
        (c) => c.code === code
      );

      if (matchedCountry) {
        setSelectedCountry(matchedCountry);
      }

      // set only mobile number in textbox
      setMobileNumber(number.replace(/\D/g, ""));

    } else {

      // fallback
      setMobileNumber(
        mobileValue.replace(/\D/g, "")
      );
    }
  }
}
    } catch (err) {}
  };

  fetchUserProfile();
}
}, []);

const handleCountrySelect = (country) => {
  setSelectedCountry(country);
  setAnchorEl(null);
  mobileInputRef.current?.focus();
};

const openMenu = (e) => setAnchorEl(e.currentTarget);
const closeMenu = () => setAnchorEl(null);

const handleCheckboxChange = (e) => {
  const label = e.target.nextSibling.textContent.trim();
  setSelectedReasons((prev) => {
    const updated = e.target.checked
      ? [...prev, label]
      : prev.filter((r) => r !== label);
    setIsChecked(updated.length > 0);
    return updated;
  });
};

const handleFormSubmit = async (e) => {
  e.preventDefault();
    setIsSubmitting(true);
  const requestBody = {
    userName: values.name,
    email: values.email,
    mobile: mobileNumber,
    reason: selectedReasons.join(", "),
    chooseDuration: values.chooseDuration, 
    comments: values.comment,
    country: matchedCountry.name
  };

  try {
    const res = await fetch("https://api.test.hachion.co/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (res.ok) {
     setIsSubmitting(false);
      setShowModal(true);
      values.name = "";
      values.email = "";
      values.comment = "";
      setMobileNumber("");
      setIsChecked(false);
      // form.classList.remove("was-validated");

      setTimeout(() => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("loginuserData");
        navigate("/login");
      }, 3000);
    } else {

  const errorData = await res.json();

  setIsSubmitting(false);

  // ✅ Backend meaningful error message
if (errorData?.message) {

  // ✅ Remove 400 BAD_REQUEST / 404 NOT_FOUND
  const cleanMessage = errorData.message.replace(/^\d+\s+\w+\s*/, "");

  setError(cleanMessage);

} else {
  setError("Something went wrong. Please try again.");
}
}
  } catch (err) {
    setIsSubmitting(false);
    setError("Unable to connect to the server.");
  }
};

const handlePrivacy = () => {
  navigate("/privacy");
};

const isFormValid = (
  
  values.email.trim() !== "" 
  
);
useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div className="unsubscribe-container">
        <div className="unsub-us-bottom-div">
          <div>
      <div className="unsubscribe-info">
            <h2 className="unsubscribe-heading">We're sorry to see you go</h2>
            <p className="unsubscribe-message">
              Please let us know the  for your decision.
              <br />
              If you no longer wish to receive communications from us, kindly fill out the form below.
            </p>

            <p className="unsubscribe-feedback-text">
              Your feedback matters to us. If there's anything we could do better, please share your thoughts in the comments.
            </p>
          </div>
          <div className="unsubscribe-info">
            <h2 className="unsubscribe-heading">Need help?</h2>
            <p className="unsubscribe-message">
              If you unsubscribed by mistake or need assistance, feel free to contact our support team at  
            <a
            href="https://mail.google.com/mail/?view=cm&to=trainings@hachion.co"
            target="_blank"
            rel="noopener noreferrer" style={{ color: '#00AEEF', marginLeft: '5px' }}>trainings@hachion.co</a>.
            <br />
              Thanks for being part of the Hachion community <span style={{color: '#00AEEF'}}>< GoHeartFill /></span>
            </p>
          </div>
          </div>
          <div className="unsub-us-right">
            <div className="unsub-us-right-header">
              Unsubscribe
            </div>
            <form
              className="unsub-form"
              enctype="multipart/form-data"
              novalidate
            >
              <div className="form-group">
                <p className="login-label">Do you want to unsubscribe?</p>
              </div>
              <div>
                <label className="login-label">
                  Full Name
                </label>
                <div className="register-field">
              <div className="form-field">
                <input
                  type="text"
                  className="form-control"
                  id="contactEmail"
                  placeholder="Enter your full name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  // required
                  // readOnly
                />
                <div class="invalid-feedback">PLease Enter Your Full Name.</div>
              </div>
              </div>
              </div>
              <div>
                <label className="login-label">
                  Email Id<span className="required">*</span>
                </label>
                <div className="register-field">
              <div className="form-field">
                <input
                  type="email"
                  className="form-control"
                  id="contactEmail"
                  placeholder="Enter your emailid"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  // readOnly
                />
                <div class="invalid-feedback">PLease Enter Your Email ID.</div>
              </div>
              </div>
              </div>
              <div>
              <label className="login-label">Mobile Number</label>
               
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
  ref={mobileInputRef}
  className="form-control"
  value={mobileNumber}
  onChange={(e) => {

  const value = e.target.value.replace(/\D/g, "");

  setMobileNumber(value);

  // typing validation
  if (value.length > 10) {
    setMobileError("Mobile number must be 10 digits");
  } else if (value.length === 10) {
    setMobileError("");
  } else {
    setMobileError("");
  }
}}

  onBlur={() => {
    if (mobileNumber.length > 0 && mobileNumber.length !== 10) {
      setMobileError("Mobile number must be 10 digits");
    } else {
      setMobileError("");
    }
  }}

  placeholder="Enter your mobile number"
  style={{ paddingLeft: "120px" }}
  maxLength={15}
  inputMode="numeric"
  pattern="[0-9]*"
/>

  </div>
  {mobileError && (
  <p
    style={{
      color: "red",
      fontSize: "12px",
      marginTop: "5px",
      marginBottom: "0"
    }}
  >
    {mobileError}
  </p>
)}
</div>
                </div>
                <div>
              <label htmlFor="inputEmail" className="login-label">
                Reason :
              </label>
              
              <div className="input-group-checkbox">
  <div className="form-check pe-4">
    <input
      className="form-check-input"
      type="radio"
      name="reason"
      id="r1"
      value="Too many emails"
      onChange={(e) => setSelectedReasons([e.target.value])}
    />
    <label className="login-label" htmlFor="r1">
      Too many emails
    </label>
  </div>

  <div className="form-check">
    <input
      className="form-check-input"
      type="radio"
      name="reason"
      id="r2"
      value="Not relevant to me"
      onChange={(e) => setSelectedReasons([e.target.value])}
    />
    <label className="login-label" htmlFor="r2">
      Not relevant to me
    </label>
  </div>

  <div className="form-check">
    <input
      className="form-check-input"
      type="radio"
      name="reason"
      id="r3"
      value="Already enrolled / completed course"
      onChange={(e) => setSelectedReasons([e.target.value])}
    />
    <label className="login-label" htmlFor="r3">
      Already enrolled / completed course
    </label>
  </div>

  <div className="form-check">
    <input
      className="form-check-input"
      type="radio"
      name="reason"
      id="r4"
      value="Found another platform"
      onChange={(e) => setSelectedReasons([e.target.value])}
    />
    <label className="login-label" htmlFor="r4">
      Found another platform
    </label>
  </div>

  <div className="form-check">
    <input
      className="form-check-input"
      type="radio"
      name="reason"
      id="r5"
      value="Other"
      onChange={(e) => setSelectedReasons([e.target.value])}
    />
    <label className="login-label" htmlFor="r5">
      Other
    </label>
  </div>
</div>
             
              </div>
             
               <div>
                <label className="login-label" for="exampleFormControlTextarea1"  >
                  Comments
                </label>
                <div className="register-field">
              <div className="form-field">
                <textarea
                  class="form-control"
                  id="contactComment"
                  rows="3"
                  name="comment"
                  value={values.comment}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              </div>
              </div>
              <div  >
                <button
                  type="button"
                  className="u-submit-button"
                  onClick={handleFormSubmit}
                   disabled={!isFormValid || isSubmitting}
                  style={{
                    opacity: isFormValid ? 1 : 0.5,
                    cursor: isFormValid ? 'pointer' : 'not-allowed'
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
                {/* Error message display */}
                {/* Error message display */}
{error && <p className="error-message">{error}</p>}
              </div>
            </form>
            {showModal && (
              <div
                className="modal"
                style={{ display: "block" }}
                onClick={() => setShowModal(false)}
              >
                <div
                  className="modal-dialog"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="modal-content" id="#querymodal">
                    <button
                      className="close-btn"
                      aria-label="Close"
                      onClick={() => setShowModal(false)}
                    >
                      <RiCloseCircleLine />
                    </button>
                    <div className="modal-body">
                      <img
                        src={success}
                        alt="Success"
                        className="success-gif"
                      />
                      <p className="modal-para">
                        You have successfully unsubscribed from Hachion
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Unsubscribe;
