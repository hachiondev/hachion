import React, { useEffect, useState, useRef } from "react";
import Topbar from "./Topbar";
import NavbarTop from "./NavbarTop";
import contactUsBanner from "../../Assets/contactbanner.webp";
import { MdKeyboardArrowRight } from "react-icons/md";
import Usa from "../../Assets/usa.webp";
import "./Blogs.css";
import india from "../../Assets/india.webp";
import dubai from "../../Assets/dubai.webp";
import ContactForm from "../../Assets/contact1.webp";
import Footer from "./Footer";
import StickyBar from "./StickyBar";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { LoginSchema } from "../Schemas";
import axios from "axios";
import { TbSlashes } from "react-icons/tb";

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
  
    useEffect(() => {
    // Detect user country and set phone number accordingly
    const detectUserCountry = async () => {
      try {
        const res = await fetch("https://ipwho.is/");
        if (!res.ok) throw new Error("Failed to fetch location data");

        const data = await res.json();
        if (data.country_code === "IN") {
          setContactNumber("+91 94903 23388");
        } else {
          setContactNumber("+1 (732) 485-2499");
        }
      } catch (error) {
        setContactNumber("+1 (732) 485-2499");
      }
    };
    detectUserCountry();
  }, []);
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
      name: values.name,
      email: values.email,
      mobile: mobileNumber,
      comment: values.comment,
      date: currentDate,
      country: selectedCountry.name,
    };
  
    try {
      const response = await axios.post("https://api.test.hachion.co/haveanyquery/add", requestData, {
        headers: { "Content-Type": "application/json" }
      });
  
       if (response.status === 200) {
    setShowModal(true);
    setMobileNumber("");
    formik.resetForm();
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
  
    const officeLocations = [
      {
        name: "Texas, USA",
        country: Usa
      },
      {
        name: "Hyderabad, India",
        country: india
      },
      {
        name: "Dubai, UAE",
        country: dubai
      }
    ];
  return (
    <>
      <Topbar />
      <NavbarTop />

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
             <p className="contact-mail-data">Leave us a note here, or give us a call at {contactNumber}.</p>
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
                  Email Id<span className="star">*</span>
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
                        // id="contact1"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        aria-label="Text input with segmented dropdown button"
                        placeholder="Enter your mobile number"
                         
                        />
                      </div>
                      </div>
              {/* <div class="mb-3"> */}
                <label for="exampleFormControlTextarea1" class="form-label">
                  Tell us about your idea<span className="star">*</span>
                </label>
                <div className="register-field">
                <div className="form-field">
                <textarea
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
              {/* </div> */}
              <div class="mb-3">
              {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
                <button
                  type="button"
                  class="submit-button"
                  onClick={handleFormSubmit}
                >
                  Send
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
      <img src={loc.country} alt={`${loc.name} country`} className="contact-address" loading="lazy"/>
      <div className="office-location">
        <h3 className="trending-title">{loc.name}</h3>
        {/* <p>{loc.address}</p> */}
      </div>
    </div>
  </div>
))}
  </div>
    </div>

    <div className="instructor-banner container">
          <div className="home-content">
            <h3 className="contact-title">For Others</h3>
            {["University/college associations", "Media queries", "Fest sponsorships", "For everything else"].map(
              (title, i) => (
                <div key={i}>
                  <h4 className="contact-title">
                    <span>{title}</span>
                  </h4>
                  <p className="contact-mail-data">
                    Email us : 
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
              )
            )}
          </div>
    
          <div className="home-content">
            <h3 className="contact-title">Address</h3>
            <div className="contact-block">
            <h3 className="contact-title-text">Head Office:<span> Texas, USA</span></h3>
            <p className="contact-title-text"><span>Hachion 601 Voyage Trce Leander Texas 78641</span></p>
            </div>
            <div className="contact-block">
            <h3 className="contact-title-text">India Office:<span> Hyderabad, India</span></h3>
            <p className="contact-title-text"><span>Hachion GP Rao Enclaves, 301, 3rd floor Road No 3</span></p>
            <p className="contact-title-text"><span>KPHB colony, Hyderabad 500072.</span></p>
            </div>
            <div className="contact-block">
            <h3 className="contact-title-text">Dubai Office:<span> Dubai, UAE</span></h3>
            <p className="contact-title-text"><span>Sports City Dubai UAE</span></p>
            </div>
        </div>
        </div>
      </div>
      <Footer />
      <StickyBar />
    </>
  );
};

export default ContactUs;