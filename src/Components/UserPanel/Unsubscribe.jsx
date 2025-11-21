import React, { useEffect, useState, useRef } from "react";
import "./unsubscribe.css";
import { useNavigate } from "react-router-dom";
import { RiCloseCircleLine } from "react-icons/ri";
import { useFormik } from "formik";
import { LoginSchema } from "../Schemas";
import success from "../../Assets/success.gif";
import axios from "axios";
import { GoHeartFill } from "react-icons/go";
import { countries, getDefaultCountry } from '../../countryUtils';

const initialValues = {
  name: "",
  email: "",
  number: "",
  duration: "",
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
const [isChecked, setIsChecked] = useState(false);
const [error, setError] = useState("");
const [selectedReasons, setSelectedReasons] = useState([]);
const mobileInputRef = useRef(null);
  
const matchedCountry = countries.find(c => mobileNumber.startsWith(c.code)) || selectedCountry;

const { values, handleBlur, handleChange } = useFormik({
  initialValues,
  validationSchema: LoginSchema,
  onSubmit: () => {}
});

const defaultCountry = getDefaultCountry("US");

// useEffect(() => {
//   const detectAndSetCountry = async () => {
//     try {
//       const res = await fetch("https://ipwhowho.is/");
//       if (!res.ok) throw new Error("Location fetch failed");
//       const data = await res.json();

//       const matched = countries.find(c => c.flag === data?.country_code);
//       if (matched) setSelectedCountry(matched);

//     } catch (err) {
      
//     }
//   };


//   detectAndSetCountry();

//   const userData = JSON.parse(localStorage.getItem("loginuserData")) || {};
//   const userEmail = userData.email || "";

//   if (!userEmail) {
//     window.confirm("Please login before unsubscribe from hachion");
//     navigate("/login");
//     return;
//   }

//   values.email = userEmail;

//   const fetchUserProfile = async () => {
//     try {
//       const res = await fetch(`https://api.test.hachion.co/api/v1/user/myprofile?email=${userEmail}`);
//       const data = await res.json();
//       if (res.ok) {
//         values.name = data.name || "";
//         values.country = data.country || "";
//         setMobileNumber(data.mobile || "");
//       }
//     } catch (err) {
      
//     }
//   };

//   fetchUserProfile();
// }, []);

useEffect(() => {
  const detectAndSetCountry = async () => {
    try {
      const res = await fetch("https://api.country.is");
      if (!res.ok) throw new Error("Location fetch failed");
      const data = await res.json();

      data.country_code = (data.country || "").toUpperCase();
      const matched = countries.find((c) => c.flag === data?.country_code);
      if (matched) setSelectedCountry(matched);

    } catch (err) {}
  };

  detectAndSetCountry();

  const userData = JSON.parse(localStorage.getItem("loginuserData")) || {};
  const userEmail = userData.email || "";

  if (!userEmail) {
    window.confirm("Please login before unsubscribe from hachion");
    navigate("/login");
    return;
  }

  values.email = userEmail;

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`https://api.test.hachion.co/api/v1/user/myprofile?email=${userEmail}`);
      const data = await res.json();
      if (res.ok) {
        values.name = data.name || "";
        values.country = data.country || "";
        setMobileNumber(data.mobile || "");
      }
    } catch (err) {}
  };

  fetchUserProfile();
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

  if (!isChecked) {
    setError("Please select at least one option to unsubscribe.");
    return;
  } else {
    setError("");
  }

  const form = e.target.closest("form");
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  const requestBody = {
    userName: values.name,
    email: values.email,
    mobile: mobileNumber,
    reason: selectedReasons.join(", "),
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
      setShowModal(true);
      values.name = "";
      values.email = "";
      values.comment = "";
      setMobileNumber("");
      setIsChecked(false);
      form.classList.remove("was-validated");

      setTimeout(() => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("loginuserData");
        navigate("/");
      }, 3000);
    } else {
      const errorData = await res.json();
      
      setError("Something went wrong. Please try again.");
    }
  } catch (err) {
    
    setError("Unable to connect to the server.");
  }
};

const handlePrivacy = () => {
  navigate("/privacy");
};

const isFormValid = (
  values.name.trim() !== "" &&
  values.email.trim() !== "" &&
  mobileNumber.trim() !== "" &&
  selectedReasons.length > 0 &&
  values.duration.trim() !== "" &&
  values.comment.trim() !== ""
);

  return (
    <>
      <div className="unsubscribe-container">
        <div className="unsub-us-bottom-div">
          <div>
      <div className="unsubscribe-info">
            <h2 className="unsubscribe-heading">We're sorry to see you go</h2>
            <p className="unsubscribe-message">
              Please let us know the reason for your decision.
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
                  Full Name<span className="required">*</span>
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
                  required
                  readOnly
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
                  readOnly
                />
                <div class="invalid-feedback">PLease Enter Your Email ID.</div>
              </div>
              </div>
              </div>
              <div>
              <label className="login-label">Mobile Number<span className="required">*</span></label>
                <div className="register-field">
                <div className="form-field" style={{ position: "relative" }}>
                  <input
                    type="tel"
                    ref={mobileInputRef}
                    className="form-control"
                    id="contactEmail"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    aria-label="Text input with segmented dropdown button"
                    placeholder="Enter your mobile number"
                    style={{
                      paddingLeft: '12px', 
                      textAlign: 'left'
                    }}
                    readOnly
                  />
                </div>
                </div>
                </div>
                <div>
              <label htmlFor="inputEmail" className="login-label">
                Reason<span className="required">*</span> :
              </label>
              {error && <p className="error-message">{error}</p>}
              <div className="input-group-checkbox">
                <div class="form-check pe-4">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="chknotification"
                    onChange={handleCheckboxChange}
                  />
                  <label className="login-label" for="chknotification">
                    Notifications
                  </label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="chkmails"
                    onChange={handleCheckboxChange}
                  />
                  <label class="form-check-label" for="chkmails">
                    Mails and Messages
                  </label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="chkpromotional"
                    onChange={handleCheckboxChange}
                  />
                  <label class="form-check-label" for="chkpromotional">
                    Promotional mails &amp; Messages
                  </label>
                </div>
              </div>
              </div>
              <div >
                <label className="login-label"   >
                  Choose Duration<span className="required">*</span>
                </label>
                <div className="register-field">
              <div className="form-field">
                <select
                  className="form-select"
                  name="duration"
                  value={values.duration}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  style={{border: 'none'}}
                >
                  <option value="">Select Duration</option>
                  <option value="1 Month">1 Month</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="1 Year">1 Year</option>
                  <option value="Permanently">Permanently</option>
                </select>
                <div className="invalid-feedback">Please select a duration.</div>
                </div>
                </div>
                </div>
               <div>
                <label className="login-label" for="exampleFormControlTextarea1"  >
                  Comments<span className="required">*</span>
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
                  disabled={!isFormValid}
                  style={{
                    opacity: isFormValid ? 1 : 0.5,
                    cursor: isFormValid ? 'pointer' : 'not-allowed'
                  }}
                >
                  Submit
                </button>
                {/* Error message display */}
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
