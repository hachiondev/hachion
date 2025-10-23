import React, { useEffect, useState, useRef } from "react";
import "./Blogs.css";
import CorporateContactForm from "../../Assets/corporate3.webp";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { LoginSchema } from "../Schemas";
import axios from "axios";

const initialValues = {
  name: "",
  email: "",
  number: "",
  comment: "",
  date:"",
  country:""
};

const ContactUs = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const mobileInputRef = useRef(null);
  const [company, setCompany] = useState("");
  const [selectedCountry, setSelectedCountry] = useState({
    code: "+1",
    flag: "US",
    name: "United States",
  });
  const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
    window.scrollTo(0, 0); 
    
  }, []);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("loginuserData")) || {};
    const userEmail = userData.email || "";
  
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
        if (data.name) {
          values.name = data.name;
        } else {
          
        }
       
        if (data.mobile) {
          setMobileNumber(data.mobile);
        } else {
        }
        if (data.country) {
          values.country = data.country;
        }
      } catch (error) {
        
      }
    };
  
    fetchUserProfile();
  }, []);


const handleFormSubmit = async (e) => {
  e.preventDefault();
  if (!isChecked) {
    setError("Please select the checkbox to acknowledge the Privacy Notice and Terms & conditions.");
    return;
  }
  setError("");

  const currentDate = new Date().toISOString().split("T")[0];

  const requestData = {
    fullName: values.name || "",
    emailId: values.email || "",
    mobileNumber: mobileNumber || "",
    companyName: company || "",
    trainingCourse: "",
    noOfPeople: 0,
    comments: values.comment || "",
    country: selectedCountry?.name || "",
    
  };

  try {
    const response = await axios.post("https://api.test.hachion.co/advisors", requestData, {
      headers: { "Content-Type": "application/json" }
    });

    if (response.status === 200) {
      setShowModal(true);
      setMobileNumber("");
      formik.resetForm();
      setCompany("");
       
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
  } = formik;
  
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
              {/* <div class="mb-3"> */}
                <label for="exampleFormControlInput1" class="form-label">
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
              {/* <div class="mb-3"> */}
                <label for="exampleFormControlInput1" class="form-label">
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
              <label className="form-label">Phone Number<span className="star">*</span></label>
              {/* <div className="input-wrapper" style={{ position: 'relative' }}> */}
                 <div className="register-field">
                <div className="form-field">
                        <input
                        type="tel"
                        className="form-control"
                        ref={mobileInputRef}
                        
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        aria-label="Text input with segmented dropdown button"
                        placeholder="Enter your mobile number"
                         
                        />
                      </div>
                      </div>
              <div>
              <label className="login-label">
                Company Name<span className="star">*</span>
              </label>
              <div className="register-field">
                <div className="password-field">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your Company Name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                {errors.company && <p className="error-field-message">{errors.company}</p>}
              </div>
            </div>
  
              <div class="mb-3">
              {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
                <button
                  type="button"
                  class="submit-button"
                  onClick={handleFormSubmit}
                >
                  Submit
                </button>
                
                {/* Error message display */}
                {error && <p className="error-message">{error}</p>}
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckChecked"
                    onChange={handleCheckboxChange}
                  />
                  <label class="form-check-label" for="flexCheckChecked">
                    By clicking on Submit, you acknowledge read our{" "}
                    <span
                      onClick={handlePrivacy}
                      style={{ textDecoration: "underline", cursor: "pointer", color: "#00AAEF" }}
                    >
                      Privacy Notice
                    </span> and 
                    <span
                      onClick={handleTerms}
                      style={{ textDecoration: "underline", cursor: "pointer", color: "#00AAEF", paddingLeft: 5 }}
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

export default ContactUs;