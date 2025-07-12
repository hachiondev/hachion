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
  comment: "",
  date: "",
};


const HaveAnyQuery = ({ closeModal }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const mobileInputRef = useRef(null);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  //const currentDate = new Date().toISOString().split("T")[0];
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
  
  //  if (!userEmail) {
  //     console.warn("🔒 No logged-in user found. Redirecting to /login...");
  //      window.confirm("Please login before unsubscribe from hachion");
  //     navigate("/login");
  //     return;
  //   }
  
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
      comment: values.comment,
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
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    closeMenu();
    mobileInputRef.current?.focus();
  };

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const { values, errors, handleBlur, touched, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: LoginSchema,
      onSubmit: (values) => {
        console.log(values);
      },
    });

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="request-batch">
          <div className="request-header">Have any Query ?</div>
          <AiOutlineCloseCircle onClick={closeModal} className="button-close" />

          <form className="query-form" onSubmit={handleSubmit}>
            <div className="form-group col-10">
              <label htmlFor="inputName" className="form-label">
                Full Name*
              </label>
              <input
                type="text"
                className="form-control-query"
                id="query1"
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
                Email ID
              </label>
              <input
                type="email"
                className="form-control-query"
                id="query1"
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

            <label className="form-label">Mobile Number</label>
            <div class="input-group mb-3 custom-width">
              <div className="input-wrapper" style={{ position: 'relative' }}>
                  {/* Country code dropdown button (inside input field) */}
                 
                  <input
                  type="tel"
                  className="form-control-query"
                  ref={mobileInputRef}
                  aria-label="Text input with segmented dropdown button"
                  id="query1"
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
            <div className="mb-4">
              <label
                htmlFor="exampleFormControlTextarea1"
                className="form-label"
              >
                Comments
              </label>
              <textarea
                className="form-control-query"
                id="query3"
                rows="4"
                name="comment"
                value={values.comment}
                onChange={handleChange}
                onBlur={handleBlur}
              ></textarea>
              {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
            </div>
            {errors.comment && touched.comment ? (
              <p className="form-error">{errors.comment}</p>
            ) : null}
            
            <button
              className="btn btn-primary btn-submit"
              type="submit"
              onClick={handleContact}
            >
              Contact Us
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
      </div>
    </div>
  );
};

export default HaveAnyQuery;