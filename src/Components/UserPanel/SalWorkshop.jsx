import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import { useParams } from 'react-router-dom';
import './Course.css';
import Footer from './Footer';
import StickyBar from './StickyBar';
import Banner2 from '../../Assets/bann3.png';
import Exp from '../../Assets/exp.png';
import Assig from '../../Assets/assig.png';
import Handexp from '../../Assets/handexp.png';
import cv from '../../Assets/cv.png';
import inter from '../../Assets/inter.png';
import support from '../../Assets/247.png';
import salreg from '../../Assets/salreg.png';
import WorkshopHighlights from './WorkshopHighlights';
import WorkshopLearners from './WorkshopLearners';
import WorkshopFAQ from './WorkshopFAQ';
import './Blogs.css';
import { Menu, MenuItem, Button } from '@mui/material';
import Flag from 'react-world-flags';
import {AiFillCaretDown } from 'react-icons/ai';
import axios from "axios";
import {MdKeyboardArrowRight} from 'react-icons/md';

const SalWorkshop = () => {
  const { courseName } = useParams();
  const [error, setError] = useState('');
  const [messageType, setMessageType] = useState('');
  const footerRef = useRef(null);
  const workshopRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const currentDate = new Date().toISOString().split('T')[0];
  const [workshops, setWorkshops] = useState([]);
  const [workshop, setWorkshop] = useState(null);
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
  const [selectedCountry, setSelectedCountry] = useState({
    code: '+1',
    flag: 'US',
    name: 'United States',
  });

  const countries = [
    { name: 'India', code: '+91', flag: 'IN' },
    { name: 'United States', code: '+1', flag: 'US' },
    { name: 'United Kingdom', code: '+44', flag: 'GB' },
    { name: 'Thailand', code: '+66', flag: 'TH' },
    { name: 'Canada', code: '+1', flag: 'CA' },
    { name: 'Australia', code: '+61', flag: 'AU' },
    { name: 'Germany', code: '+49', flag: 'DE' },
    { name: 'France', code: '+33', flag: 'FR' },
    { name: 'United Arab Emirates', code: '+971', flag: 'AE' },
    { name: 'Qatar', code: '+974', flag: 'QA' },
    { name: 'Japan', code: '+81', flag: 'JP' },
    { name: 'China', code: '+86', flag: 'CN' },
    { name: 'Russia', code: '+7', flag: 'RU' },
    { name: 'South Korea', code: '+82', flag: 'KR' },
    { name: 'Brazil', code: '+55', flag: 'BR' },
    { name: 'Mexico', code: '+52', flag: 'MX' },
    { name: 'South Africa', code: '+27', flag: 'ZA' },
    { name: 'Netherlands', code: '+31', flag: 'NL' }
  ];
  const resolvedTimeZone = window.userTimeZoneFromIP;
  const timeZoneAbbreviationMap = {
    "Europe/Amsterdam": "CEST",  // Netherlands in daylight saving
    "Europe/Berlin": "CEST",     // Germany in daylight saving
    "America/Los_Angeles": "PDT", // United States (Pacific)
    "America/New_York": "EDT",    // United States (Eastern)
    "Asia/Kolkata": "IST",        // India
    "Asia/Bangkok": "ICT",        // Thailand
    "America/Toronto": "EDT",     // Canada
    "Australia/Sydney": "AEST",   // Australia
    "Europe/Paris": "CEST",       // France
    "Asia/Dubai": "GST",          // United Arab Emirates
    "Asia/Qatar": "AST",          // Qatar
    "Asia/Tokyo": "JST",          // Japan
    "Asia/Shanghai": "CST",       // China
    "Europe/Moscow": "MSK",       // Russia
    "Asia/Seoul": "KST",          // South Korea
    "America/Sao_Paulo": "BRT",   // Brazil
    "America/Mexico_City": "CDT", // Mexico
    "Africa/Johannesburg": "SAST" // South Africa
  };

  useEffect(() => {
    // Checking if courseName exists
    if (!courseName) {
      return;
    }
  
    const originalName = courseName.replace(/-/g, " ");
    // Now use originalName safely for setting state or further processing
  }, [courseName]);
  
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    closeMenu();
    mobileInputRef.current?.focus();
  };
  
  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Fetch workshop list
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await axios.get('https://api.hachion.co/workshopschedule');
        setWorkshops(response.data);
    
        // ✅ Auto-select default category & course and display data
        const defaultWorkshop = response.data[0];
    
        const { localDate, localTime, timeZone } = convertISTtoLocalTime(
          defaultWorkshop?.datetime || defaultWorkshop?.date,
          defaultWorkshop?.time
        );
    
        setWorkshop({
          ...defaultWorkshop,
          localDate,
          localTime,
          timeZone,
        });
    
      } catch (error) {
        // handle error silently or set fallback state
      }
    };
    
  
    fetchWorkshops();
  }, []);
  
  const closeMenu = () => {
    setAnchorEl(null);
  };
  

// Helper to convert IST time to local user time
const convertISTtoLocalTime = (date, time, timeZone = "Asia/Kolkata") => {
  if (!date || !time) {
    return {
      localDate: "Invalid date",
      localTime: "Invalid time",
      timeZone: "IST",
    };
  }

  try {
    const userTimeZone = window.userTimeZoneFromIP || Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (userTimeZone === "Asia/Kolkata" || userTimeZone === "Asia/Calcutta") {
      return {
        localDate: new Date(`${date}`).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        localTime: time,
        timeZone: "IST",
      };
    }

    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":");
    if (modifier === "PM" && hours !== "12") hours = String(+hours + 12);
    if (modifier === "AM" && hours === "12") hours = "00";

    const istISODateTime = `${date}T${hours.padStart(2, "0")}:${minutes}:00`;
    const istDate = new Date(`${istISODateTime}+05:30`);

    const localDateTime = new Date(
      istDate.toLocaleString("en-US", { timeZone: userTimeZone })
    );

    const localDate = localDateTime.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const localTime = localDateTime.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    let timeZoneAbbreviation = "";
    try {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: userTimeZone,
        timeZoneName: 'short',
      });
      const parts = formatter.formatToParts(localDateTime);
      const tz = parts.find((p) => p.type === "timeZoneName");
      timeZoneAbbreviation = tz ? tz.value : "";
    } catch {
      timeZoneAbbreviation = "";
    }

    return {
      localDate,
      localTime,
      timeZone: timeZoneAbbreviationMap[userTimeZone] || timeZoneAbbreviation || "IST",
    };
  } catch {
    return {
      localDate: "Error",
      localTime: "Error",
      timeZone: "IST",
    };
  }
};

  useEffect(() => {
    fetch("https://ipwho.is/")
      .then((res) => res.json())
      .then((data) => {
        if (data?.timezone?.id) {
          window.userTimeZoneFromIP = data.timezone.id;
        } else {
          window.userTimeZoneFromIP = "America/New_York"; // fallback timezone
        }
        const userCountryCode = data?.country_code || "US";
  
        const matchedCountry = countries.find(
          (c) => c.flag.toUpperCase() === userCountryCode.toUpperCase()
        );
  
        setSelectedCountry(
          matchedCountry || {
            name: "United States",
            code: "+1",
            flag: "US",
          }
        );
      })
      .catch(() => {
        window.userTimeZoneFromIP = "America/New_York";
        setSelectedCountry({
          name: "United States",
          code: "+1",
          flag: "US",
        });
      });
  }, []);
  const handleScrollToWorkshop = () => {
    if (workshopRef.current) {
      workshopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.mobileNumber || !formData.fullName || !formData.emailId) {
      setError('Please fill all the details to register.');
      setMessageType('error');
      return;
    }
    setError('');
    setMessageType('');
    const currentDate = new Date().toISOString().split("T")[0];
    const timeZoneShort = timeZoneAbbreviationMap[resolvedTimeZone] || resolvedTimeZone || "IST";
    const updatedFormData = {
      fullName: formData.fullName,
      courseCategory: formData.courseCategory || "",
      time: formData.time || "",
      message: "register",
      emailId: formData.emailId,
      mobileNumber: formData.mobileNumber,
      timeZone: timeZoneShort  || "IST",
      courseName: [formData.courseName || ""],
      date: currentDate,
      country: selectedCountry.name
    };
    try {
      const response = await axios.post("https://api.hachion.co/workshops", updatedFormData);
      setError("Registration for workshop done successfully");
      setMessageType('success');
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Something went wrong. Please try again.");
      setMessageType('error');
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsSticky(false);
          }
        });
      },
      { rootMargin: '0px', threshold: 0.1 }
    );
    if (footerRef.current) {
      observer.observe(footerRef.current);
    }
    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);
  return (
    <>
    <Helmet>
  <title>{workshop?.meta_title || "Hachion Workshop"}</title>
  <meta name="description" content={workshop?.meta_description || "Workshop description"} />
  <meta name="keywords" content={workshop?.meta_keyword || "workshop"} />
  <meta property="og:title" content={workshop?.meta_title || "Best Online IT Workshop Courses"} />
  <meta property="og:description" content={workshop?.meta_description || "Transform your career with Hachion's Online IT Courses."} />
   </Helmet>
      <Topbar />
      <NavbarTop />
      {/* <div className='work-details'>
      <div className='course-row'>
      <div class="col-md-3">
          <label for="inputState" class="form-label">Workshop Category Name</label>
          <select
    id="inputState"
    className="form-select"
    name="category_name"
    value={workshopData.category_name}
    onChange={(e) => setWorkshopData({ ...workshopData, category_name: e.target.value })}
  >
    <option value="" disabled>Select Category</option>
    {categories.map((cat, idx) => (
      <option key={idx} value={cat}>{cat}</option>
    ))}
  </select>
      </div>
      <div className="col-md-3">
      <label htmlFor="course" className="form-label">Workshop Course Name</label>      <select
    id="course"
    className="form-select"
    name="course_name"
    value={workshopData.course_name}
    onChange={(e) => setWorkshopData({ ...workshopData, course_name: e.target.value })}
    disabled={!workshopData.category_name}
  >
    <option value="" disabled>Select Course</option>
    {courses.map((course, idx) => (
      <option key={idx} value={course}>{course}</option>
    ))}
  </select>
    </div>
      <div>
        <button className="workshop-button" onClick={handleSearch}>
        Submit
      </button>
      </div>
      </div>
      </div> */}
      <div className='blogs-header'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">Home</a> <MdKeyboardArrowRight/> </li>
                    <li className="breadcrumb-item">
                    <a href="/workshop">Workshop</a> <MdKeyboardArrowRight/> </li>
                  <li className="breadcrumb-item active" aria-current="page">
                  {workshop?.title || workshop?.course_name || "Workshop Details"}
                  </li>
                </ol>
              </nav>
              </div>
      {workshop && (
      <div className='course-top'>
        <div className='about-banner'>
            <img
            src={workshop?.banner_image && workshop.banner_image.trim() !== ""
                  ? `https://api.hachion.co/${workshop.banner_image}` 
                  : Banner2}
            alt="Workshop Banner"
      
            className="d-block w-100"
            onClick={handleScrollToWorkshop}
          />
        </div>
        <div className='workshop-content'>
          <h2 className='workshop-heading'>About training program</h2>
          <div className='workshop-top'>
            <div className='workshop-left-content'>
              <h3 className='workshop-text'>Key Takeaways</h3>
              <div className="qa-sub-content" dangerouslySetInnerHTML={{ __html: workshop?.content.trim() || "" }} />
            </div>
            <div className='workshop-left-content'>
              <h3 className='workshop-text'>Workshop Details</h3>
              <div className='workshop-text-details'>
              <p>
  Date: {
    (() => {
      if (!workshop?.localDate) return 'Loading...';
      const date = new Date(workshop.localDate);
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'long' });
      const suffix = (day > 3 && day < 21)
        ? 'th'
        : (['st', 'nd', 'rd'][day % 10 - 1] || 'th');
      return `${day}${suffix} ${month}`;
    })()
  }
</p>
  <p>
    Time: {workshop?.localTime} {workshop?.timeZone}
  </p>
        <p>(4 Days a Week: Monday - Thursday)</p>
        <p>Time Duration: 1 Hour Daily</p>
      </div>
      <div className="qa-sub-content" dangerouslySetInnerHTML={{ __html: workshop?.details.trim() || "" }} />
            </div>
          </div>
        </div>

      <div className='workshop-banner'onClick={handleScrollToWorkshop}>
                    <p className='workshop-banner-content'>Register Now Before Seats Run Out !</p>
                    <button className='join' onClick={handleScrollToWorkshop}>Join Now</button>
                  </div>
        <WorkshopHighlights />
        <WorkshopLearners page="course"/>
        <div className='workshopfaq'>
        <WorkshopFAQ />
        </div>
        <div className='workshopform' ref={workshopRef}>
        <div className='workshop-content'>
        <form onSubmit={handleSubmit}>
          <h2 className='workshop-reg'>Join the Workshop Now!</h2>
          <div className='workshop-top-form'>
          <img className='workshop-reg-img' src={salreg} alt='' />
          <div>
          <div className='join-form'>
            <div className="form-group col-10" style={{marginBottom: '20px'}}>
          <label htmlFor="inputName" className="form-label">
          Full Name<span className='star'>*</span>
          </label>
          <input
            id="query1"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="form-control-query"
            placeholder="Enter your name"
          />
        </div>
        <div className="form-group col-10" style={{marginBottom: '20px'}}>
          <label htmlFor="inputEmail" className="form-label">
            Email ID<span className='star'>*</span>
          </label>
          <input
            id="query1"
            type="email"
            name="emailId"
          value={formData.emailId}
          onChange={handleChange}
            className="form-control-query"
            placeholder="abc@gmail.com"
          />
        </div>
<div className="form-group col-10" style={{ marginBottom: '20px' }}>
  <label htmlFor="mobileNumber" className="form-label">
    Mobile Number <span className="star">*</span>
  </label>

  <div className="input-wrapper" style={{ position: 'relative' }}>
    {/* Country code dropdown button (inside input field) */}
    <button
      variant="text"
      onClick={openMenu}
      className='mobile-button'
    >
      <Flag code={selectedCountry.flag} className="country-flag me-1" />
      <span style={{ marginRight: '5px' }}>{selectedCountry.code}</span>
      <AiFillCaretDown />
    </button>
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
      {countries.map((country) => (
        <MenuItem key={country.code} onClick={() => handleCountrySelect(country)}>
          <Flag code={country.flag} className="country-flag me-2" />
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
            style={{
          paddingLeft: '100px',
        }}
          />
        </div>
      </div>
          <div className='form-group col-10' style={{ position: 'relative' }}>
            </div>
            </div>
            {error && (
  <div
    style={{
      color: messageType === 'success' ? 'green' : 'red',
      marginBottom: '10px', fontWeight:'700'
    }}
  >
    {error}
  </div>
)}
            <button
              type="submit"
              className="register-button"
            >
              Register
            </button>
            </div>
        </div>
        </form> 
        </div>
        </div>
      <div ref={footerRef}>
        <Footer />
      </div>
      <StickyBar />
      </div>)}
      
    </>
  );
};

export default SalWorkshop;