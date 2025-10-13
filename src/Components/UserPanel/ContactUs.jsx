import React, { useEffect, useState, useRef } from "react";
import Topbar from "./Topbar";
import NavbarTop from "./NavbarTop";
import contactUsBanner from "../../Assets/contactbanner.webp";
import { MdKeyboardArrowRight } from "react-icons/md";
import UsaFlag from "../../Assets/usa.webp";
import "./Blogs.css";
import indiaFlag from "../../Assets/india.webp";
import dubaiFlag from "../../Assets/dubai.webp";
import whatsappIcon from "../../Assets/logos_whatsapp-icon.png";
import mailIcon from "../../Assets/uiw_mail.png";
import facebookIcon from "../../Assets/facebook_symbol.svg.png";
import twitter from "../../Assets/twitter.png";
import linkedin from "../../Assets/linkedin.png";
import instagram from "../../Assets/instagram.png";
import quora from "../../Assets/Component 141.png";
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
    const [whatsappNumber, setWhatsappNumber] = useState('+1 (732) 485-2499');
    const [whatsappLink, setWhatsappLink] = useState('https://wa.me/17324852499');
  
    useEffect(() => {
      const detectUserCountry = async () => {
        try {
          const res = await fetch('https://ipwho.is/');
          if (!res.ok) throw new Error('Failed to fetch location data');
  
          const data = await res.json();
        
  
          if (data.country_code === 'IN') {
            setWhatsappNumber('+91-949-032-3388');
            setWhatsappLink('https://wa.me/919490323388');
          } else {
            setWhatsappNumber('+1 (732) 485-2499');
            setWhatsappLink('https://wa.me/17324852499');
          }
        } catch (error) {
          
          setWhatsappNumber('+1 (732) 485-2499');
          setWhatsappLink('https://wa.me/17324852499');
        }
      };
  
      detectUserCountry();
       }, []);
  useEffect(() => {
    window.scrollTo(0, 0); 
    
  }, []);


  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

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
        name: "New Jersey, USA",
        address: "Hachion 601 Voyage Trce Leander Texas 78641",
        flag: UsaFlag
      },
      {
        name: "Hyderabad, India",
        address: "Hachion GP Rao Enclaves, 301, 3rd floor Road No 3 KPHB colony, Hyderabad 500072.",
        flag: indiaFlag
      },
      {
        name: "Dubai, UAE",
        address: "Sports City Dubai UAE",
        flag: dubaiFlag
      }
    ];
  return (
    <>
      <Topbar />
      <NavbarTop />

        <div className="contact-banner">
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
        <div className="contact-us-all">
        <h1 className="about-us-heading">Office Location</h1>

        <div className="contact-us">
        {officeLocations.map((loc, i) => (
  <div className="contact-us-div" key={i}>
    <div className="contact-us-box">
      <img src={loc.flag} alt={`${loc.name} flag`} className="flag" loading="lazy"/>
      <div className="office-location">
        <p>{loc.name}</p>
        <p>{loc.address}</p>
      </div>
    </div>
  </div>
))}
        </div>
        <div className="contact-us-bottom-box">
          <div className="contact-us-left">
            <h3>Enquiries</h3>
            <div className="contact-block">
              <img src={whatsappIcon} alt="whatsapp-icon" loading="lazy"/>
              <p className="contact-info">
                <a
                  href="https://wa.me/17324852499"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                 {whatsappNumber}
                </a>
              </p>
            </div>
            <div className="contact-block">
              <img src={mailIcon} alt="mail-icon" loading="lazy"/>
              <p className="contact-info">
                <a
                  href="https://mail.google.com/mail/?view=cm&to=trainings@hachion.co"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  trainings@hachion.co
                </a>
              </p>
            </div>
            <div className="contact-us-icon">
              <a
                href="https://www.facebook.com/hachion.co"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={facebookIcon} alt="facebook-icon" loading="lazy"/>
              </a>
              <a
                href="https://x.com/hachion_co"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={twitter} alt="twitter-icon" loading="lazy"/>
              </a>
              <a
                href="https://www.linkedin.com/company/hachion"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={linkedin} alt="linkedin-icon" loading="lazy"/>
              </a>
              <a
                href="https://www.instagram.com/hachion_trainings"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={instagram} alt="instagram-icon" loading="lazy"/>
              </a>
              <a
                href="https://www.quora.com/profile/Hachion-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={quora} alt="quora-icon" loading="lazy"/>
              </a>
            </div>
          </div>
          <div className="contact-us-right">
            <div className="contact-us-right-header">
              <p>Get in touch with us</p>
            </div>
            <form className="contact-form">
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control-contact"
                  id="contact1"
                  placeholder="Enter your full name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">
                  Email Id
                </label>
                <input
                  type="email"
                  className="form-control-contact"
                  id="contact1"
                  placeholder="Enter your email id"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <label className="form-label">Mobile Number</label>
              <div className="input-wrapper" style={{ position: 'relative' }}>
                 
                        <input
                        type="tel"
                        className="form-control-contact"
                        ref={mobileInputRef}
                        id="contact1"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        aria-label="Text input with segmented dropdown button"
                        placeholder="Enter your mobile number"
                         
                        />
                      </div>
              <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label">
                  Comments
                </label>
                <textarea
                  class="form-control-contact"
                  id="contact3"
                  rows="3"
                  name="comment"
                  value={values.comment}
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></textarea>
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
      <Footer />
      <StickyBar />
    </>
  );
};

export default ContactUs;