import React, { useEffect, useState, useRef } from "react";
import Topbar from "./Topbar";
import NavbarTop from "./NavbarTop";
import "./unsubscribe.css";
import Footer from "./Footer";
import StickyBar from "./StickyBar";
import { useNavigate } from "react-router-dom";
import { RiCloseCircleLine } from "react-icons/ri";
import { useFormik } from "formik";
import { LoginSchema } from "../Schemas";
import success from "../../Assets/success.gif";
import axios from "axios";
import { GoHeartFill } from "react-icons/go";

const initialValues = {
  name: "",
  email: "",
  number: "",
  reason: "",
  comment: "",
  date: "",
  country: "",
};

const Unsubscribe = () => {
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
    window.scrollTo(0, 0); 
  }, []);
const [selectedReasons, setSelectedReasons] = useState([]);

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
    { name: "Netherlands", code: "+31", flag: "NL" },
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

  const handleCheckboxChange = (e) => {
  const label = e.target.nextSibling.textContent.trim(); // Gets the checkbox label
  const isCurrentlyChecked = e.target.checked;

  setSelectedReasons((prev) => {
    const updated = isCurrentlyChecked
      ? [...prev, label]
      : prev.filter((reason) => reason !== label);
    setIsChecked(updated.length > 0);
    return updated;
  });
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
    e.stopPropagation();
    form.classList.add("was-validated");
    return;
  }  
  const requestBody = {
    userName: values.name,
    email: values.email,
    mobile: mobileNumber,
    reason: selectedReasons.join(", "),
    comments: values.comment,
    country: matchedCountry ? matchedCountry.name : "United States"
  };
  try {
    const response = await fetch("https://api.hachion.co/unsubscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    if (response.ok) {
      const data = await response.json();
      
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
      const errorData = await response.json();
      console.error("Unsubscribe failed:", errorData);
      setError("Something went wrong. Please try again.");
    }
  } catch (err) {
    console.error("Network error:", err);
    setError("Unable to connect to the server.");
  }
};
  const handlePrivacy = () => {
    navigate("/privacy");
  };
  const { values, errors, handleBlur, touched, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: LoginSchema,
      onSubmit: (values) => { 
      },
    });
  const [whatsappNumber, setWhatsappNumber] = useState("+1 (732) 485-2499");
  const [whatsappLink, setWhatsappLink] = useState("https://wa.me/17324852499");
  useEffect(() => {
    const detectUserCountry = async () => {
      try {
        const res = await fetch("https://ipwho.is/");
        if (!res.ok) throw new Error("Failed to fetch location data");
        const data = await res.json();
                if (data.country_code === "IN") {
          setWhatsappNumber("+91-949-032-3388");
          setWhatsappLink("https://wa.me/919490323388");
        } else {
          setWhatsappNumber("+1 (732) 485-2499");
          setWhatsappLink("https://wa.me/17324852499");
        }
      } catch (error) {
        console.error("❌ Error fetching user location:", error);
      }
    };

    detectUserCountry();
  }, []);

  return (
    <>
      <Topbar />
      <NavbarTop />
      <div className="unsubscribe-container">
        <div className="unsub-us-bottom-div">
          <div>
      <div className="unsubscribe-info">
            <h2 className="unsubscribe-heading">We're sorry to see you go!</h2>
            <p className="unsubscribe-message">
              You've successfully landed on the Hachion Unsubscribe page.
              <br />
              If you no longer wish to receive communications from us, please fill out the form below.
            </p>

            <p className="unsubscribe-feedback-text">
              Your feedback is valuable. If there's something we could improve,
              let us know in the comments.
            </p>
          </div>
          <div className="unsubscribe-info">
            <h2 className="unsubscribe-heading">Need help?</h2>
            <p className="unsubscribe-message">
              If you unsubscribed by mistake or have any questions, feel free to Contact Us.
              <br />
              Thanks for being part of the Hachion community <span style={{color: '#00AEEF'}}>< GoHeartFill /></span>
            </p>
          </div>
          </div>
          <div className="unsub-us-right">
            <div className="unsub-us-right-header">
              <p>Unsubscribe</p>
            </div>
            <form
              className="needs-validation unsub-form"
              enctype="multipart/form-data"
              novalidate
            >
              <div className="form-group col-10">
                <p className="form-label">Do you want to unsubscribe?</p>
              </div>
              <div class="mb-3 has-validation">
                <label for="exampleFormControlInput1" class="form-label">
                  Full Name*
                </label>
                <input
                  type="text"
                  className="form-control-unsub"
                  id="unsub1"
                  placeholder="Enter your full name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <div class="invalid-feedback">PLease Enter Your Full Name.</div>
              </div>
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">
                  Email Id
                </label>
                <input
                  type="email"
                  className="form-control-unsub"
                  id="unsub1"
                  placeholder="Enter your emailid"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <div class="invalid-feedback">PLease Enter Your Email ID.</div>
              </div>
              <label className="form-label">Mobile Number</label>
                <div className="input-wrapper" style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    ref={mobileInputRef}
                    className="form-control-unsub"
                    id="unsub1"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    aria-label="Text input with segmented dropdown button"
                    placeholder="Enter your mobile number"
                    style={{
                      paddingLeft: '12px', 
                      textAlign: 'left'
                    }}
                  />
                </div>
              <label htmlFor="inputEmail" className="form-label" style={{marginTop: 10}}>
                Reason :
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
                  <label class="form-check-label" for="chknotification">
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
               <div class="mb-3 d-flex flex-column">
                <label for="exampleFormControlTextarea1" class="form-label">
                  Comments
                </label>
                <textarea
                  class="form-control-unsub"
                  id="unsub3"
                  rows="3"
                  name="comment"
                  value={values.comment}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div class="mb-3">
                <button
                  type="button"
                  class="u-submit-button"
                  onClick={handleFormSubmit}
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
      <Footer />
      <StickyBar />
    </>
  );
};

export default Unsubscribe;
