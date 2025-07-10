import React, { useEffect, useRef, useState } from 'react';
import "./Course.css";
import { AiOutlineCloseCircle, AiFillCaretDown } from "react-icons/ai";
import { Menu, MenuItem, Button } from "@mui/material";
import Flag from "react-world-flags";
import success from "../../Assets/success.gif";
import { RiCloseCircleLine } from "react-icons/ri";
import { useFormik } from "formik";
import { LoginSchema } from "../Schemas";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const initialValues = {
  name: "",
  email: "",
  number: "",
  resume: "",
  date: "",
};


const ApplyForm = ({ closeModal }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const mobileInputRef = useRef(null);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  const [selectedCountry, setSelectedCountry] = useState({
    code: "+1",
    flag: "US",
    name: "United States",
  });
  const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  
  const countries = [
    { name: "India", code: "+91", flag: "IN" },
    { name: "United States", code: "+1", flag: "US" },
    { name: "United Kingdom", code: "+44", flag: "GB" },
    { name: "Thailand", code: "+66", flag: "TH" },
    { name: "Canada", code: "+1", flag: "CA" },
    { name: "Australia", code: "+61", flag: "AU" },
    { name: "Germany", code: "+49", flag: "DE" },
    { name: "France", code: "+33", flag: "FR" },
    { name: "United Arab Emirates", code: "+971", flag: "AE" },
    { name: "Qatar", code: "+974", flag: "QA" },
    { name: "Japan", code: "+81", flag: "JP" },
    { name: "China", code: "+86", flag: "CN" },
    { name: "Russia", code: "+7", flag: "RU" },
    { name: "South Korea", code: "+82", flag: "KR" },
    { name: "Brazil", code: "+55", flag: "BR" },
    { name: "Mexico", code: "+52", flag: "MX" },
    { name: "South Africa", code: "+27", flag: "ZA" },
    { name: 'Netherlands', code: '+31', flag: 'NL' }
  ];

  const defaultCountry = countries.find((c) => c.flag === "US");
  
  
    useEffect(() => {
      fetch("https://ipwho.is/")
        .then((res) => res.json())
        .then((data) => {
          const userCountryCode = data?.country_code;
          const matchedCountry = countries.find(
            (c) => c.flag === userCountryCode
          );
          if (matchedCountry) {
            setSelectedCountry(matchedCountry);
          }
        })
        .catch(() => {});
    }, []);
  
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handlePrivacy = () => {
    navigate("/privacy");
  };
  const handleTerms = () => {
    navigate("/terms");
  };
  const matchedCountry = countries.find((c) =>
  mobileNumber.startsWith(c.code)
);

useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("loginuserData")) || {};
    const userEmail = userData.email || "";
  
   if (!userEmail) {
      console.warn("🔒 No logged-in user found. Redirecting to /login...");
       window.confirm("Please login before unsubscribe from hachion");
      navigate("/login");
      return;
    }
  
    values.email = userEmail;
   
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `https://api.hachion.co/api/v1/user/myprofile?email=${userEmail}`
        );
  
        if (!response.ok) {
          throw new Error("❌ Failed to fetch profile data");
        }
        const data = await response.json();
        if (data.name) {
          values.name = data.name;
        } else {
          console.warn("⚠️ Name not found in response.");
        }
       
        if (data.mobile) {
          setMobileNumber(data.mobile);
        } else {
          console.warn("⚠️ Mobile number not found.");
        }
        if (data.country) {
          values.country = data.country;
        }
      } catch (error) {
        console.error("❌ Error fetching profile:", error);
      }
    };
  
    fetchUserProfile();
  }, []);
  const handleContact = async (e) => {
    e.preventDefault();
    if (!isChecked) {
      setError("Please select the checkbox to acknowledge the Privacy Notice and Terms & conditions.");
      return;
    }
    setError("");
    const currentDate = new Date().toISOString().split("T")[0];

    const requestData = {
      name: values.name,
      email: values.email,
      mobile: mobileNumber,
      resume: values.resume,
      date: currentDate,
      country: matchedCountry ? matchedCountry.name : "United States"
    };

    try {
      const response = await axios.post(
        "https://api.hachion.co/haveanyquery/add",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setShowModal(true);
        setSuccessMessage("✅ Your query has been submitted successfully. Our team will get back to you shortly.");
  setErrorMessage("");
      }
    } catch (error) {
      setErrorMessage("❌ Failed to submit your query. Please try again later.");
    setSuccessMessage("");
      console.error("Error submitting query:", error);
    }
  };

  const { values, errors, handleBlur, touched, handleChange, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: initialValues,
      validationSchema: LoginSchema,
      onSubmit: (values) => {
        console.log(values);
      },
    });

  return (
    //   <div className="modal-content">
        <div className='student-reg-form'>
          <form onSubmit={handleSubmit}>
            <div className="form-group col-10">
              <label htmlFor="inputName" className="form-label">
                Full Name<span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-control-student"
                id="studentreg"
                placeholder="Enter your full name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {errors.name && touched.name ? (
              <p className="form-error">{errors.name}</p>
            ) : null}

            <div className="form-group col-10">
              <label htmlFor="inputEmail" className="form-label">
                Email ID<span className="required">*</span>
              </label>
              <input
                type="email"
                className="form-control-student"
                id="studentreg"
                placeholder="abc@gmail.com"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {errors.email && touched.email ? (
              <p className="form-error">{errors.email}</p>
            ) : null}

            <label className="form-label">Mobile Number<span className="required">*</span></label>
            <div class="input-group mb-3 custom-width">
              <div className="input-wrapper" style={{ position: 'relative' }}>
                  {/* Country code dropdown button (inside input field) */}
                 
                  <input
                  type="tel"
                  className="form-control-student"
                  ref={mobileInputRef}
                  aria-label="Text input with segmented dropdown button"
                  id="studentreg"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter your mobile number"
                      //     style={{
                      //   paddingLeft: '100px',
                      // }}
                        />
                      </div>
                    </div>
            {errors.number && touched.number ? (
              <p className="form-error">{errors.number}</p>
            ) : null}
            <div className="form-group col-10">
              <label
                htmlFor="resume"
                className="form-label"
              >
                Upload Resume<span className="required">*</span>
              </label>
              <input
                type="file"
                className="form-control-student"
                id="studentreg"
                name="resume"
                accept=".pdf, .txt, .doc, .docx, .rtf"
                onChange={(event) => {
                setFieldValue("resume", event.currentTarget.files[0]);
                }}
                onBlur={handleBlur}
                />
              <p style={{ color: "#6A6A6A", fontSize: "medium" }}>(.pdf, .txt, .doc, .docx, .rtf)</p>
              </div>
              {successMessage && (
            <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>
            )}
            {errorMessage && (
            <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>
            )}

            {errors.resume && touched.resume ? (
            <p className="form-error">{errors.resume}</p>
            ) : null}
            
            <button
              className="student-register-button"
              type="submit"
              onClick={handleContact}
            >
              Apply Now
            </button>
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
                    By clicking on Apply Now, you acknowledge read our{" "}
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
          </form>
          {showModal && (
            <div
              className="modal"
              style={{ display: "block" }}
              onClick={() => {
                setShowModal(false);
                closeModal(false);
              }}
            >
              <div
                className="modal-dialog"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content" id="#querymodal">
                  <button
                    className="close-btn"
                    aria-label="Close"
                    onClick={() => {
                      setShowModal(false);
                      closeModal(false);
                    }}
                  >
                    <RiCloseCircleLine />
                  </button>
                  <div className="modal-body">
                    <img src={success} alt="Success" className="success-gif" />
                    <p className="modal-para">
                      Thank you! Our Team will contact you soon
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
    //   </div>
  );
};

export default ApplyForm;