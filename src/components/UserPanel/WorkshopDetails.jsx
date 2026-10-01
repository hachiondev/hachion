"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import "./CoursePage/Course.css";
import "./Blogs.css";
import Banner2 from "@/assets/bann3.webp";
import salreg from "@/assets/salreg.webp";
import placeholderImage from "@/assets/workshopplaceholder.webp";
import WorkshopHighlights from "./WorkshopHighlights";
import WorkshopLearners from "./WorkshopLearners";
import WorkshopFAQ from "./WorkshopFAQ";
import WorkshopEntries from "./WorkshopEntries";
import { Menu, MenuItem } from "@mui/material";
import CountryFlag from "@/components/common/CountryFlag";
import { AiFillCaretDown } from "react-icons/ai";
import axios from "axios";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useWorkshops } from "@/Api/hooks/WorkshopApi/useWorkshops";
import { slugifyWorkshopTitle } from "@/lib/workshopSlug";
import { API_BASE_URL } from "@/lib/apiBase";

const EMPTY_ARRAY = [];

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

const timeZoneAbbreviationMap = {
  "Europe/Amsterdam": "CEST",
  "Europe/Berlin": "CEST",
  "America/Los_Angeles": "PDT",
  "America/New_York": "EDT",
  "Asia/Kolkata": "IST",
  "Asia/Bangkok": "ICT",
  "America/Toronto": "EDT",
  "Australia/Sydney": "AEST",
  "Europe/Paris": "CEST",
  "Asia/Dubai": "GST",
  "Asia/Qatar": "AST",
  "Asia/Tokyo": "JST",
  "Asia/Shanghai": "CST",
  "Europe/Moscow": "MSK",
  "Asia/Seoul": "KST",
  "America/Sao_Paulo": "BRT",
  "America/Mexico_City": "CDT",
  "Africa/Johannesburg": "SAST",
};

const formatDateWithOrdinal = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const getOrdinalSuffix = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };
  const shortMonth = date.toLocaleString("en-US", { month: "short" });
  return `${shortMonth} ${day}${getOrdinalSuffix(day)}`;
};

const WorkshopDetails = () => {
  const rawParams = useParams();
  const slug = decodeURIComponent(rawParams.slug || "");

  const [error, setError] = useState("");
  const [messageType, setMessageType] = useState("");
  const workshopRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: "",
    emailId: "",
    courseCategory: "",
    time: "",
    message: "",
    mobileNumber: "",
    timeZone: "",
    date: "",
    courseName: "",
  });
  const mobileInputRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState({ code: "+1", flag: "US", name: "United States" });

  const { data: workshops = EMPTY_ARRAY } = useWorkshops();
  const workshop = useMemo(() => workshops.find((w) => slugifyWorkshopTitle(w.title) === slug) || null, [workshops, slug]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
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
        window.userTimeZoneFromIP = timeZone;
        const userCountryCode = data?.country_code || "US";
        const matchedCountry = countries.find((c) => c.flag.toUpperCase() === userCountryCode.toUpperCase());
        setSelectedCountry(matchedCountry || { name: "United States", code: "+1", flag: "US" });
      })
      .catch(() => {
        window.userTimeZoneFromIP = "America/New_York";
        setSelectedCountry({ name: "United States", code: "+1", flag: "US" });
      });
  }, []);

  const handleScrollToWorkshop = () => {
    workshopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.mobileNumber || !formData.fullName || !formData.emailId) {
      setError("Please fill all the details to register.");
      setMessageType("error");
      return;
    }
    setError("");
    setMessageType("");
    const currentDate = new Date().toISOString().split("T")[0];
    const resolvedTimeZone = typeof window !== "undefined" ? window.userTimeZoneFromIP : "";
    const timeZoneShort = timeZoneAbbreviationMap[resolvedTimeZone] || resolvedTimeZone || "IST";
    const updatedFormData = {
      ...formData,
      date: currentDate,
      message: "register",
      timeZone: timeZoneShort,
      courseName: [formData.courseName || ""],
      country: selectedCountry.name,
    };
    try {
      await axios.post(`${API_BASE_URL}/workshops`, updatedFormData);
      setError("Registration for workshop done successfully");
      setMessageType("success");
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Something went wrong. Please try again.");
      setMessageType("error");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleImageError = (e) => {
    e.target.src = placeholderImage.src;
  };

  if (!workshop) {
    return <p>Loading workshop...</p>;
  }

  const formattedDate = formatDateWithOrdinal(workshop.date);

  return (
    <>
      <div className="blogs-header">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item">
              <Link href="/workshop">Workshop</Link> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {workshop?.title || workshop?.course_name || "Workshop Details"}
            </li>
          </ol>
        </nav>
      </div>
      <div className="course-top">
        <div className="about-banner">
          <img
            src={workshop?.banner_image && workshop.banner_image.trim() !== "" ? `${API_BASE_URL}/${workshop.banner_image}` : Banner2.src}
            alt="Workshop Banner"
            onError={handleImageError}
            className="d-block w-100"
            onClick={handleScrollToWorkshop}
          />
        </div>
        <h1 className="workshop-heading">Join in {workshop.title}</h1>
        <div className="workshop-content">
          <div className="workshop-top">
            <div className="workshop-left-content">
              <h3 className="workshop-text">Key Takeaways</h3>
              <div className="qa-sub-content" dangerouslySetInnerHTML={{ __html: workshop?.content?.trim() || "" }} />
            </div>
            <div className="workshop-left-content">
              <h3 className="workshop-text">Workshop Details</h3>
              <div className="workshop-text-details">
                <p>Date: {formattedDate}</p>
                <p>Time: {workshop.time} {workshop.time_zone}</p>
                <p>(4 Days a Week: Monday - Thursday)</p>
                <p>Time Duration: 1 Hour Daily</p>
              </div>
              <div className="qa-sub-content" dangerouslySetInnerHTML={{ __html: workshop?.details?.trim() || "" }} />
            </div>
          </div>
        </div>

        <div className="workshop-banner" onClick={handleScrollToWorkshop}>
          <p className="workshop-banner-content">Register Now Before Seats Run Out !</p>
          <button className="join" onClick={handleScrollToWorkshop}>Join Now</button>
        </div>
        <WorkshopHighlights />
        <WorkshopLearners page="course" />
        <div className="workshopfaq">
          <WorkshopFAQ />
        </div>
        <div className="workshopform" ref={workshopRef}>
          <div className="workshop-content">
            <form onSubmit={handleSubmit}>
              <h2 className="workshop-reg">Join the Workshop Now!</h2>
              <div className="workshop-top-form">
                <img className="workshop-reg-img" src={salreg.src} alt="" />
                <div>
                  <div className="join-form">
                    <div className="form-group col-10" style={{ marginBottom: "20px" }}>
                      <label htmlFor="inputName" className="form-label">
                        Full Name<span className="star">*</span>
                      </label>
                      <input id="query1" type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="form-control-query" placeholder="Enter your name" />
                    </div>
                    <div className="form-group col-10" style={{ marginBottom: "20px" }}>
                      <label htmlFor="inputEmail" className="form-label">
                        Email ID<span className="star">*</span>
                      </label>
                      <input id="query1" type="email" name="emailId" value={formData.emailId} onChange={handleChange} className="form-control-query" placeholder="abc@gmail.com" />
                    </div>
                    <div className="form-group col-10" style={{ marginBottom: "20px" }}>
                      <label htmlFor="mobileNumber" className="form-label">
                        Mobile Number <span className="star">*</span>
                      </label>

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
                          className="form-control-query"
                          id="query1"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          placeholder="Enter your mobile number"
                          style={{ paddingLeft: "100px" }}
                        />
                      </div>
                    </div>
                    <div className="form-group col-10" style={{ position: "relative" }}></div>
                  </div>
                  {error && (
                    <div style={{ color: messageType === "success" ? "green" : "red", marginBottom: "10px", fontWeight: "700" }}>
                      <p className={`form-message ${messageType === "error" ? "error-text" : "success-text"}`}></p>
                      {error}
                    </div>
                  )}
                  <button type="submit" className="register-button">
                    Register
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="blog-bottom">
          <h2 className="workshop-heading">Recent Workshop Entries</h2>
          <WorkshopEntries />
        </div>
      </div>
    </>
  );
};

export default WorkshopDetails;
