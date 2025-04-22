
import React, { useEffect, useState, useRef } from "react";
import Topbar from "./Topbar";
import NavbarTop from "./NavbarTop";
import { AiFillCaretDown } from "react-icons/ai";
import { Menu, MenuItem, Button } from "@mui/material";
import Flag from "react-world-flags";
import contactUsBanner from "../../Assets/contactus.png";
import { MdKeyboardArrowRight } from "react-icons/md";
import UsaFlag from "../../Assets/usflag.jpg";
import "./Blogs.css";
import indiaFlag from "../../Assets/india.jpg";
import dubaiFlag from "../../Assets/canada.jpg";
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
import { RiCloseCircleLine } from "react-icons/ri";
import { useFormik } from "formik";
import { LoginSchema } from "../Schemas";
import success from "../../Assets/success.gif";
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
  const [selectedCountry, setSelectedCountry] = useState({
    code: "+1",
    flag: "US",
    name: "United States",
  });
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    window.scrollTo(0, 0); // This will scroll to the top of the page
    console.log("Page loaded and scrolled to top");
  }, []);

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
          const matchedCountry = countries.find((c) => c.flag === userCountryCode);
          if (matchedCountry) {
            setSelectedCountry(matchedCountry);
          }
        })
        .catch(() => {
         
        });
    }, []);

  const handleCountrySelect = (country) => {
    console.log("Country selected:", country.name, country.code);
    setSelectedCountry(country);
    closeMenu();
    mobileInputRef.current?.focus();
  };

  const openMenu = (event) => {
    console.log("Opening country select menu");
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    console.log("Closing country select menu");
    setAnchorEl(null);
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleContact = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split("T")[0];
    const requestData = {
      name: values.name,
      email: values.email,
      mobile: mobileNumber,
      comment: values.comment,
      date: currentDate,
      country: selectedCountry.name
    };

    try {
      console.log(requestData);
      const response = await axios.post(
        "/HachionUserDashboad/haveanyquery/add",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setShowModal(true);
        values.name = "";
        values.email = "";
        values.comment = "";
        setMobileNumber("");
      }
    } catch (error) {
      console.error("Error submitting query:", error);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!isChecked) {
      setError("Please select the checkbox to acknowledge the Privacy Notice.");
    } else {
      setError("");
      // Handle form submission here
      console.log("Form submitted");
    }
    handleContact(e);
  };

  const handlePrivacy = () => {
    navigate("/privacy");
  };

  const { values, errors, handleBlur, touched, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: LoginSchema,
      onSubmit: (values) => {
        console.log(values);
      },
    });
    const [whatsappNumber, setWhatsappNumber] = useState('+1 (732) 485-2499');
  const [whatsappLink, setWhatsappLink] = useState('https://wa.me/17324852499');

  useEffect(() => {
    const detectUserCountry = async () => {
      try {
        const res = await fetch('https://ipwho.is/');
        if (!res.ok) throw new Error('Failed to fetch location data');

        const data = await res.json();
        console.log('🌎 Detected country:', data.country_code);

        if (data.country_code === 'IN') {
          setWhatsappNumber('+91-949-032-3388');
          setWhatsappLink('https://wa.me/919490323388');
        } else {
          setWhatsappNumber('+1 (732) 485-2499');
          setWhatsappLink('https://wa.me/17324852499');
        }
      } catch (error) {
        console.error('❌ Error fetching user location:', error);
      }
    };

    detectUserCountry();
  }, []);

  return (
    <>
      <Topbar />
      <NavbarTop />
      <div className="about-banner">
        <img src={contactUsBanner} alt="contact-us-banner" />
      </div>
      <div className="contact-us-all">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a> <MdKeyboardArrowRight />{" "}
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Contact Us
            </li>
          </ol>
        </nav>
        <h1 className="about-us-heading">Office Location</h1>

        <div className="contact-us">
          <div className="contact-us-div">
            <h3>Head Quarters</h3>
            <div className="contact-us-box">
              <img src={UsaFlag} alt="usa" className="flag" />
              <div className="office-location">
                <p>New Jersey, USA</p>
                <p>
                  HACH Technologies 239 US Highway 22 green Brook Township, New
                  Jersey USA, ZIP 08812.
                </p>
              </div>
            </div>
          </div>

          <div className="contact-us-div">
            <div className="contact-us-box">
              <img src={indiaFlag} alt="usa" className="flag" />
              <div className="office-location">
                <p>Hyderabad, India</p>
                <p>
                  HACH Technologies GP Rao Enclaves, 301, 3rd floor Road No 3
                  KPHB colony, Hyderabad 500072.
                </p>
              </div>
            </div>
          </div>
          <div className="contact-us-div">
            <div className="contact-us-box">
              <img src={dubaiFlag} alt="usa" className="flag" />
              <div className="office-location">
                <p>Dubai, UAE</p>
                <p>Sports City Dubai UAE</p>
              </div>
            </div>
          </div>
        </div>
        <div className="contact-us-bottom-div">
          <div className="contact-us-left">
            <h3>Enquiries</h3>
            <div className="contact-block">
          <img src={whatsappIcon} alt="whatsapp-icon" />
          <p className="contact-info">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {whatsappNumber}
            </a>
          </p>
        </div>
            <div className="contact-block">
              <img src={mailIcon} alt="mail-icon" />
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
                <img src={facebookIcon} alt="facebook-icon" />
              </a>
              <a
                href="https://x.com/hachion_co"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={twitter} alt="twitter-icon" />
              </a>
              <a
                href="https://www.linkedin.com/company/hachion"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={linkedin} alt="linkedin-icon" />
              </a>
              <a
                href="https://www.instagram.com/hachion_trainings"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={instagram} alt="instagram-icon" />
              </a>
              <a
                href="https://www.quora.com/profile/Hachion-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={quora} alt="quora-icon" />
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
                  placeholder="Enter your emailid"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <label className="form-label">Mobile Number</label>
              <div class="input-group custom-width">
                <div className="input-group">
                  <Button
                    variant="outlined"
                    onClick={openMenu}
                    className="country-code-dropdown"
                    endIcon={<AiFillCaretDown />}
                  >
                    <Flag
                      code={selectedCountry.flag}
                      className="country-flag"
                    />
                    {selectedCountry.code}
                  </Button>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={closeMenu}
                  >
                    {countries.map((country) => (
                      <MenuItem
                        key={country.code}
                        onClick={() => handleCountrySelect(country)}
                      >
                        <Flag code={country.flag} className="country-flag" />
                        {country.name} ({country.code})
                      </MenuItem>
                    ))}
                  </Menu>
                  <input
                    type="tel"
                    className="mobile-number"
                    ref={mobileInputRef}
                    id="contact2"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    aria-label="Text input with segmented dropdown button"
                    placeholder="Enter your mobile number"
                  />
                </div>
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
                      style={{ textDecoration: "underline", cursor: "pointer" }}
                    >
                      Privacy Notice
                    </span>
                  </label>
                </div>
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
      <Footer />
      <StickyBar />
    </>
  );
};

export default ContactUs;