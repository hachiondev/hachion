"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./Blogs.css";
import "./Home.css";
import { Menu, MenuItem } from "@mui/material";
import CountryFlag from "@/components/common/CountryFlag";
import { AiFillCaretDown } from "react-icons/ai";
import RegistrationImage from "@/assets/registerImg.webp";
import { MdKeyboardArrowRight } from "react-icons/md";
import registerbanner from "@/assets/register.webp";
import aboutHachion from "@/assets/aboutlead.webp";
import Benefits from "./LeadBenefits";
import { countries, getDefaultCountry } from "@/countryUtils";
import { API_BASE_URL } from "@/lib/apiBase";

const ALLOWED_MARKETER_REFS = ["a", "b", "c", "d", "e"];

const LeadForm = () => {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    country: "",
    courseInterest: "",
    batchTiming: "",
    marketerId: "",
  });
  const mobileInputRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setFormData((prev) => ({ ...prev, country: country.name }));
    closeMenu();
    mobileInputRef.current?.focus();
  };
  const openMenu = (event) => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  useEffect(() => {
    fetch("https://api.country.is")
      .then((res) => res.json())
      .then((data) => {
        data.country_code = (data.country || "").toUpperCase();
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
        const userCountryCode = data?.country_code || "US";
        window.userTimeZoneFromIP = timeZone;
        setFormData((prev) => ({ ...prev, timeZone }));
        const matchedCountry = countries.find((c) => c.flag.toUpperCase() === userCountryCode.toUpperCase());
        setSelectedCountry(matchedCountry || { name: "United States", code: "+1", flag: "US" });
      })
      .catch(() => {
        window.userTimeZoneFromIP = "America/New_York";
        setFormData((prev) => ({ ...prev, timeZone: "America/New_York" }));
        setSelectedCountry({ name: "United States", code: "+1", flag: "US" });
      });
  }, []);

  const handleMobileBlur = () => {
    const mobile = formData.mobileNumber;
    if (!mobile || mobile.length !== 10) {
      setMobileError("❌ Mobile number must be exactly 10 digits.");
    } else {
      setMobileError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    if (!isChecked) {
      setErrorMessage("Please select the checkbox to acknowledge the Privacy Notice and Terms & conditions.");
      return;
    }
    const { fullName, email, mobileNumber, country, courseInterest, batchTiming, marketerId } = formData;
    if (!fullName || !email || !mobileNumber || !courseInterest) {
      setErrorMessage("Please fill all the details to register.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/leadform`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, mobileNumber, country, courseInterest, batchTiming, marketerId }),
      });
      if (!response.ok) {
        throw new Error("Failed to submit the form.");
      }
      setSuccessMessage("Registration successful!");
      setFormData({ fullName: "", email: "", mobileNumber: "", country: "", courseInterest: "", batchTiming: "", marketerId: "" });
      setIsChecked(false);
    } catch {
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const marketerId = urlParams.get("ref");
    if (marketerId) {
      if (ALLOWED_MARKETER_REFS.includes(marketerId)) {
        // Syncs from the URL query string (an external source).
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData((prev) => ({ ...prev, marketerId }));
      } else {
        router.replace("/");
      }
    }
  }, [router]);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  return (
    <>
      <div className="blogs-header">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link> <MdKeyboardArrowRight />{" "}
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Student Registration Form
            </li>
          </ol>
        </nav>
      </div>
      <div>
        <img className="banner-img" src={registerbanner.src} alt="Lead Form Banner" />
        <div className="contact-us-all">
          <h2 className="summer-title">About Hachion</h2>
          <div className="summer-part">
            <p className="about-lead-text">
              Hachion is a leading eLearning platform dedicated to transforming tech education by delivering
              industry-relevant, expert-designed courses. We specialize in cutting-edge programs like Full Stack
              Development, Data Science, DevOps, Cloud Computing, Cyber Security and more, ensuring learners acquire
              the most sought-after skills in today&apos;s job market. With a focus on mentor-led training, hands-on
              projects, and real-world case studies, we bridge the gap between academic knowledge and workplace
              demands. Our mission is to empower professionals and graduates with practical expertise, career
              guidance, and lifelong learning opportunities, helping them thrive in the fast-evolving tech landscape.
              At Hachion, we don&apos;t just teach—we prepare you for success.
            </p>
            <img className="aboutlead-img" src={aboutHachion.src} alt="About Hachion" />
          </div>
          <Benefits />
        </div>
        <div className="studentform">
          <h2 className="summer-title">Student Registration Form</h2>
          <form onSubmit={handleSubmit}>
            <div className="summer-part">
              <img className="student-img" src={RegistrationImage.src} alt="Registration Imag" />
              <div>
                <div className="student-reg-form">
                  <div className="form-group col-10" style={{ marginBottom: "20px" }}>
                    <label className="form-label">
                      Full Name<span className="star">*</span>
                    </label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="form-control-student" id="studentregFullName" placeholder="Enter your name" />
                  </div>

                  <div className="form-group col-10" style={{ marginBottom: "20px" }}>
                    <label className="form-label">
                      Email ID<span className="star">*</span>
                    </label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control-student" id="studentregEmail" placeholder="abc@gmail.com" />
                  </div>

                  <div className="form-group col-10" style={{ marginBottom: "20px" }}>
                    <label className="form-label">Mobile Number <span className="star">*</span></label>
                    <div className="input-wrapper" style={{ position: "relative" }}>
                      <button type="button" onClick={openMenu} className="mobile-button">
                        <CountryFlag code={selectedCountry.flag} className="country-flag me-1" />
                        <span style={{ marginRight: "5px" }}>{selectedCountry.code}</span>
                        <AiFillCaretDown />
                      </button>
                      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
                        {countries.map((country) => (
                          <MenuItem key={country.code} onClick={() => handleCountrySelect(country)}>
                            <CountryFlag code={country.flag} className="country-flag me-2" />
                            {country.name} ({country.code})
                          </MenuItem>
                        ))}
                      </Menu>
                      <input
                        type="tel"
                        className="form-control-student"
                        id="studentregMobile"
                        name="mobileNumber"
                        ref={mobileInputRef}
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        onBlur={handleMobileBlur}
                        placeholder="Enter your mobile number"
                        style={{ paddingLeft: "100px" }}
                      />
                      {mobileError && <small style={{ color: "red", marginTop: "4px", display: "block" }}>{mobileError}</small>}
                    </div>
                  </div>
                  <div className="form-group col-10" style={{ marginBottom: "20px" }}>
                    <label className="form-label">
                      Courses Interested<span className="star">*</span>
                    </label>
                    <input type="text" name="courseInterest" value={formData.courseInterest} onChange={handleChange} className="form-control-student" id="studentregCourse" placeholder="Enter Courses Interested" />
                  </div>
                  <input type="hidden" name="marketerId" value={formData.marketerId} onChange={handleChange} />

                  {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
                  {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
                  <button type="submit" className="student-register-button">
                    Register
                  </button>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" onChange={handleCheckboxChange} />
                    <label className="form-check-label" htmlFor="flexCheckChecked">
                      By clicking on Submit, you acknowledge read our{" "}
                      <Link href="/privacy" style={{ textDecoration: "underline", cursor: "pointer", color: "#00AAEF" }}>
                        Privacy Notice
                      </Link>{" "}
                      and{" "}
                      <Link href="/terms" style={{ textDecoration: "underline", cursor: "pointer", color: "#00AAEF", paddingLeft: 5 }}>
                        Terms & Conditions
                      </Link>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LeadForm;
