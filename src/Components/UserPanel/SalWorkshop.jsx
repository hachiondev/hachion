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
  import WorkshopLearners from './WorkshopLearners';
  import WorkshopFAQ from './WorkshopFAQ';
  import './Blogs.css';
  import { Menu, MenuItem, Button } from '@mui/material';
  import Flag from 'react-world-flags';
  import {AiFillCaretDown } from 'react-icons/ai';
  import axios from "axios";

  const SalWorkshop = () => {
    const { courseName } = useParams();
    const [error, setError] = useState('');
    const [messageType, setMessageType] = useState('');
    const footerRef = useRef(null);
    const workshopRef = useRef(null);
    const [isSticky, setIsSticky] = useState(false);
    const currentDate = new Date().toISOString().split('T')[0];
    const [workshopData, setWorkshopData] = useState({
      category_name: '',
      course_name: '',
    });
    const [workshops, setWorkshops] = useState([]);
    const [categories, setCategories] = useState([]);
    const [courses, setCourses] = useState([]);
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
      courseName: "Salesforce",
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
    
          const uniqueCategories = [...new Set(response.data.map(item => item.category_name))];
          setCategories(uniqueCategories);
        } catch (error) {
          // Error silently caught, no console output
        }
      };
    
      fetchWorkshops();
    }, []);
    

    useEffect(() => {
      if (workshopData.category_name) {
        const filteredCourses = workshops
          .filter(item => item.category_name === workshopData.category_name)
          .map(item => item.course_name);
    
        const uniqueCourses = [...new Set(filteredCourses)];
        setCourses(uniqueCourses);
      } else {
        setCourses([]);
      }
    }, [workshopData.category_name, workshops]);
    
    const handleSearch = async () => {
      try {
        const filteredWorkshop = workshops.find(
          item =>
            item.category_name === workshopData.category_name &&
            item.course_name === workshopData.course_name
        );
    
        setWorkshop(filteredWorkshop || null);
      } catch (error) {
        // Error silently caught, no console output
      }
    };
    
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

    
    // ✅ New code: Fetch user's timezone from IP
    useEffect(() => {
      fetch("https://ipwho.is/")
        .then((res) => res.json())
        .then((data) => {
          // Set timezone globally
          if (data?.timezone?.id) {
            window.userTimeZoneFromIP = data.timezone.id;
          } else {
            window.userTimeZoneFromIP = "America/New_York"; // fallback timezone
          }
    
          // Get user country code
          const userCountryCode = data?.country_code || "US";
    
          // Match with predefined country list
          const matchedCountry = countries.find(
            (c) => c.flag.toUpperCase() === userCountryCode.toUpperCase()
          );
    
          // Set country (fallback to USA)
          setSelectedCountry(
            matchedCountry || {
              name: "United States",
              code: "+1",
              flag: "US",
            }
          );
        })
        .catch(() => {
          // If IP lookup fails (e.g., permission denied or network error)
          window.userTimeZoneFromIP = "America/New_York";
    
          // Set default USA flag + code
          setSelectedCountry({
            name: "United States",
            code: "+1",
            flag: "US",
          });
        });
    }, []);

  // Use new code with time conversion when fetching workshop data
  useEffect(() => {
    fetch("https://api.hachion.co/workshopschedule")
      .then((res) => res.json())
      .then((data) => {
        const selectedWorkshop = Array.isArray(data) ? data[0] : data;

        const { localDate, localTime, timeZone } = convertISTtoLocalTime(
          selectedWorkshop.datetime || selectedWorkshop.date,
          selectedWorkshop.time
        );

        setWorkshop({
          ...selectedWorkshop,
          localDate,
          localTime,
          timeZone,
        });
      })
      .catch(() => {});
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
        courseCategory: formData.courseCategory || "Salesforce",
        time: formData.time || "",
        message: "register",
        emailId: formData.emailId,
        mobileNumber: formData.mobileNumber,
        timeZone: timeZoneShort  || "IST",
        courseName: [formData.courseName || "Salesforce"],
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
          <title>Best Salesforce Training & Workshop in USA | Expert Guidance</title>
          <meta name="description" content="Unlock your potential with our expert-led Salesforce training & workshop in USA. Enhance skills, boost career & transform businesses." />
          <meta name="keywords" content="Salesforce Training, Salesforce Workshop, USA Salesforce Training, Expert Guidance, Career Development" />
        </Helmet>
        <Topbar />
        <NavbarTop />
        <div className='work-details'>
        <div className='course-row'>
        <div class="col-md-3">
            <label for="inputState" class="form-label">Category Name</label>
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
        <label htmlFor="course" className="form-label">Course Name</label>

        <select
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
        </div>
        {workshop && (
        <div className='course-top'>
          <div className='about-banner'>
            {/* <img src={Banner2} alt="Banner2" onClick={handleScrollToWorkshop}/> */}
            <img
              src={workshop?.banner_image && workshop.banner_image.trim() !== ""
                    ? `https://api.hachion.co/${workshop.banner_image}` 
                    : Banner2}
              alt="Workshop Banner"
              // style={{ height: "420px"}}
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
          {/* <p>Date: 15th March</p>
          <p>Time: 10AM EST</p> */}
          <p>(4 Days a Week: Monday - Thursday)</p>
          <p>Time Duration: 1 Hour Daily</p>
        </div>

        {/* <p>{workshop?.details}</p> */}

        <div className="qa-sub-content" dangerouslySetInnerHTML={{ __html: workshop?.details.trim() || "" }} />

            
              </div>
            </div>
          </div>

        <div className='workshop-banner'onClick={handleScrollToWorkshop}>
                      <p className='workshop-banner-content'>Register Now Before Seats Run Out !</p>
                      <button className='join' onClick={handleScrollToWorkshop}>Join Now</button>
                    </div>

              <div className='workshop-content'>
            <h2 className='workshop-heading'>Program Highlights</h2>
            <div className='workshop-top-img'>
              <div className='workshop-div-content'>
                  <img className='workshop-img' src={Exp} alt='' />
                  <h6>Expert Guidance</h6>
                </div>
                <div className='workshop-div-content'>
                  <img className='workshop-img' src={Assig} alt='' />
                  <h6>Assignment Practices</h6>
                </div>
                <div className='workshop-div-content'>
                  <img className='workshop-img' src={Handexp} alt='' />
                  <h6>Hands on Projects</h6>
                </div>
              </div>

              <div className='workshop-top-img'>
              <div className='workshop-div-content'>
                  <img className='workshop-img' src={cv} alt='' />
                  <h6>Resume Building</h6>
                </div>
                <div className='workshop-div-content'>
                  <img className='workshop-img' src={inter} alt='' />
                  <h6>Interview Preparation</h6>
                </div>
                <div className='workshop-div-content'>
                  <img className='workshop-img' src={support} alt='' />
                  <h6>24/7 Support</h6>
                </div>
              </div>
          </div>

          <WorkshopLearners />

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

          <div className="form-group col-10" style={{marginBottom: '20px'}}>
            <label className="form-label">Mobile Number</label>
                    <div className="input-group mb-3 custom-width">
                      <div className="input-group">
                        <Button
                          variant="outlined"
                          onClick={openMenu}
                          className="country-code-dropdown"
                          endIcon={<AiFillCaretDown />}
                          style={{backgroundColor: '#FFF'}}
                        >
                          <Flag code={selectedCountry.flag} className="country-flag" />
                          {selectedCountry.code}
                        </Button>
            
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
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
                          aria-label="Text input with segmented dropdown button"
                          id="workshop"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          placeholder="Enter your mobile number"
                        />
                      </div>
                    </div>
                    </div>

            <div className='form-group col-10' style={{ position: 'relative' }}>
              {/* <label for="inputState" className='form-label'>
                Time Zone<span className="star">*</span>
              </label> */}
              {/* <div className="input-group mb-2"> */}
                {/* <select id='query1' class="form-select mode" name="timeZone"
            value={formData.timeZone}
            onChange={handleChange}>
              <option selected>Select Time Zone</option>
              <option>EST</option>
              <option>CST</option>
              <option>MST</option>
              <option>PST</option>
              <option>IST</option>
            </select> */}
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
        
        {/* Footer section to stop the sticky behavior */}
        <div ref={footerRef}>
          <Footer />
          
        </div>
        
        <StickyBar />
        </div>)}
        
      </>
    );
  };

  export default SalWorkshop;