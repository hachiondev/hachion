import React, { useEffect, useRef, useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import Flag from 'react-world-flags';
import { AiFillCaretDown } from 'react-icons/ai';
import axios from 'axios';
import { countries, getDefaultCountry } from '../../countryUtils';
const PostJob = () => {
  const [error, setError] = useState('');
  const [messageType, setMessageType] = useState('');
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    company: "",
    companyUrl: "",
    companyLogo: "",
    workDays: "",
    jobTitle: "",
    vacancies: "",
    exp: "",
    salary: "",
    location: "",
    noticePeriod: "",
    empType: "",
    jobType: "",
    description: "",
    qualification: "",
  });
  

  const mobileInputRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);


const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());


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
    "Africa/Johannesburg": "SAST"
  };

const handleChange = (e) => {
  const { name, type, value, files } = e.target;

  setFormData((prevData) => ({
    ...prevData,
    [name]: type === 'file' ? files[0] : value,
  }));
};

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    closeMenu();
    mobileInputRef.current?.focus();
  };

  const openMenu = (event) => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);
useEffect(() => {
  if (countries.length === 0) return;

  fetch("https://api.country.is")
    .then((res) => res.json())
    .then((data) => {
      data.country_code = (data.country || "").toUpperCase();

      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
      const userCountryCode = data?.country_code || "US";

      window.userTimeZoneFromIP = timeZone;
      setFormData((prev) => ({ ...prev, timeZone }));

      const matchedCountry = countries.find(
        (c) => c.flag.toUpperCase() === userCountryCode.toUpperCase()
      );

      setSelectedCountry(matchedCountry || { name: "United States", code: "+1", flag: "US" });
    })
    .catch(() => {
      window.userTimeZoneFromIP = "America/New_York";
      setFormData((prev) => ({ ...prev, timeZone: "America/New_York" }));
      setSelectedCountry({ name: "United States", code: "+1", flag: "US" });
    });
}, [countries]);



const handleSubmit = async (e) => {
  e.preventDefault();
    const {
    firstName, lastName, email, mobileNumber, company, companyUrl, companyLogo,
    workDays, jobTitle, vacancies, exp, noticePeriod, salary,
    location, empType, jobType, description, qualification
  } = formData;

  
  if (
    !firstName || !lastName || !email || !mobileNumber || !company || !companyUrl || !companyLogo ||
    !workDays || !jobTitle || !vacancies || !exp || !noticePeriod || !salary ||
    !location || !empType || !jobType || !description || !qualification
  ) {
    
    setError('Please fill all the details to Post Job.');
    setMessageType('error');
    return;
  }

  const timeZone = formData.timeZone;
  const timeZoneShort = timeZoneAbbreviationMap[timeZone] || timeZone;
  const payload = {
    firstName,
    lastName,
    email,
    mobileNumber: `${selectedCountry.code} ${mobileNumber}`,
    company,
    companyUrl,
    companyLogo: "", 
    workDays,
    jobTitle,
    vacancies,
    experience: exp,
    salary,
    location,
    noticePeriod,
    employmentType: empType,
    jobType,
    description,
    qualification,
  };

  

  const finalFormData = new FormData();
  finalFormData.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));
  finalFormData.append("companyLogo", companyLogo);

  for (let pair of finalFormData.entries()) {
    console.log(`${pair[0]}:`, pair[1]);
  }
  try {
    const response = await axios.post("https://api.hachion.co/hire-from-us", finalFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    
    setError('Job posted successful!');
    setMessageType('success');

    
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      company: "",
      companyUrl: "",
      companyLogo: "",
      workDays: "",
      jobTitle: "",
      vacancies: "",
      exp: "",
      salary: "",
      location: "",
      noticePeriod: "",
      empType: "",
      jobType: "",
      description: "",
      qualification: "",
    });

    
  } catch (error) {
   

    if (error.response && error.response.data && error.response.data.message) {
      const backendMessage = error.response.data.message;
      

      if (backendMessage.includes("Email already exists")) {
        setError("This email is already registered.");
      } else if (backendMessage.includes("Mobile number already exists")) {
        setError("This mobile number is already registered.");
      } else {
        setError(backendMessage);
      }
    } else {
      setError("Posting Job failed. Please try again.");
    }

    setMessageType("error");
  }
};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    
    <div className='studentform'>
        <h2 className='hire-sub-title'>Post Job</h2>
        <div className='d-flex justify-content-center'>
        <form onSubmit={handleSubmit}>
                <div className='hire-row'>
                <div className="col-md-5 d-flex flex-column">
                  <label className="form-label">First Name<span className='star'>*</span></label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="form-control-registration"
                    id="registration"
                    placeholder="Enter your first name"
                  />
                </div>

                <div className="col-md-5 d-flex flex-column">
                  <label className="form-label">Last Name<span className='star'>*</span></label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="form-control-registration"
                    id="registration"
                    placeholder="Enter your last name"
                  />
                </div>
                </div>

                <div className='hire-row'>
                <div className="col-md-5 d-flex flex-column">
                  <label className="form-label">Email ID<span className='star'>*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control-registration"
                    id="registration"
                    placeholder="abc@gmail.com"
                  />
                </div>

                <div className="col-md-5 d-flex flex-column">
                  <label className="form-label">Mobile Number <span className="star">*</span></label>
                  <div className="input-wrapper" style={{ position: 'relative' }}>
                    {/* <button type="button" onClick={openMenu} className='mobile-button'>
                      <Flag code={selectedCountry.flag} className="country-flag me-1" />
                      <span style={{ marginRight: '5px' }}>{selectedCountry.code}</span>
                      <AiFillCaretDown />
                    </button> */}
                     <button
                      variant="text"
                      onClick={openMenu}
                      className='mobile-button'
                    >
                      <Flag code={selectedCountry.flag} className="country-flag me-1" />
                      <span style={{ marginRight: '5px', fontWeight: 'bold' }}>
                        {selectedCountry.flag} ({selectedCountry.code})
                      </span>
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
                      className="form-control-registration"
                      id="registration"
                      name="mobileNumber"
                      ref={mobileInputRef}
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="Enter your mobile number"
                      style={{ paddingLeft: '130px' }}
                    />
                  </div>
                  </div>
                  </div>
                  <div className='hire-row'>
                  <div className="col-md-5 d-flex flex-column">
                  <label className="form-label">Company Name<span className='star'>*</span></label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="form-control-registration"
                    id="registration"
                    placeholder="Enter company name"
                  />
                </div>
                 <div className="col-md-5 d-flex flex-column">
                  <label className="form-label">Company URL<span className='star'>*</span></label>
                  <input
                    type="text"
                    name="companyUrl"
                    value={formData.companyUrl}
                    onChange={handleChange}
                    className="form-control-registration"
                    id="registration"
                    placeholder="Enter company url"
                  />
                </div>
                </div>
                <div className='hire-row'>
                  <div className="col-md-5 d-flex flex-column">
                  <label className="form-label">Company Logo<span className='star'>*</span></label>
                  <input
                    type="file"
                    name="companyLogo"
                    onChange={handleChange}
                    className="form-control-registration"
                    id="registration"
                    placeholder="Upload company logo"
                    accept="image/*"
                    style={{ backgroundColor: 'white' }}
                  />
                </div>
                 <div className="col-md-5 d-flex flex-column">
                  <label className="form-label">Working Days<span className='star'>*</span></label>
                  <select
                    type="text"
                    name="workDays"
                    value={formData.workDays}
                    onChange={handleChange}
                    className="form-control-registration"
                    id="registration"
                  >
                    <option value="">Select working days </option>
                     <option value="Mon-Fri">Mon - Fri</option>
                     <option value="Mon-Sat">Mon - Sat</option>
                     <option value="Mon-Sun">Mon - Sun</option>
                </select>
                </div>
                </div>
                <div className='hire-row'>
                  <div className="col-md-5 d-flex flex-column">
                  <label className="form-label">Job Title<span className='star'>*</span></label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className="form-control-registration"
                    id="registration"
                    placeholder="Enter job title"
                  />
                </div>
                 <div className="col-md-5 d-flex flex-column">
                  <label className="form-label">Vacancies<span className='star'>*</span></label>
                  <input
                    type="text"
                    name="vacancies"
                    value={formData.vacancies}
                    onChange={handleChange}
                    className="form-control-registration"
                    id="registration"
                    placeholder="Enter no. of vacancies"
                  />
                </div>
                </div>
                <div className='hire-row'>
                  <div className="col-md-5 d-flex flex-column">
                  <label className="form-label">Experiance<span className='star'>*</span></label>
                  <select
                    type="text"
                    name="exp"
                    value={formData.exp}
                    onChange={handleChange}
                    className="form-control-registration"
                    id="registration"
                  >
                    <option value="">Select Experiance </option>
                    <option value="0-1 Years">0-1 Years</option>
                    <option value="2-4 Years">2-4 Years</option>
                    <option value="5+ Years">5+ Years</option>
                </select>
                </div>
                 <div className="col-md-5 d-flex flex-column">
                  <label className="form-label">Salary Range<span className='star'>*</span></label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className="form-control-registration"
                    id="registration"
                    placeholder="Enter salary range"
                  />
                </div>
                </div>
                <div className='hire-row'>
                 <div className="col-md-5 d-flex flex-column">
                  <label className="form-label">Location<span className='star'>*</span></label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="form-control-registration"
                    id="registration"
                    placeholder="Enter location"
                  />
                </div>
                  <div className="col-md-5 d-flex flex-column">
                  <label className="form-label">Notice Period<span className='star'>*</span></label>
                  <input
                    type="text"
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={handleChange}
                    className="form-control-registration"
                    id="registration"
                    placeholder="Enter no. of days/months"
                  />
                </div>
                </div>
                <div className='hire-row'>
                 <div className="col-md-5 d-flex flex-column">
                  <label className="form-label">Type of Employment<span className='star'>*</span></label>
                  <select
                    type="text"
                    name="empType"
                    value={formData.empType}
                    onChange={handleChange}
                    className="form-control-registration"
                    id="registration"
                  >
                    <option value="">Select type of employment </option>
                     <option value="Full-Time">Full-Time</option>
                     <option value="Part-Time">Part-Time</option>
                     <option value="Contract">Contract</option>
                </select>
                </div>
                <div className="col-md-5 d-flex flex-column">
                  <label className="form-label">Job Type<span className='star'>*</span></label>
                  <select
                    type="text"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="form-control-registration"
                    id="registration"
                  >
                    <option value="">Select job type </option>
                     <option value="Onsite">Onsite</option>
                     <option value="Hybrid">Hybrid</option>
                     <option value="Remote">Remote</option>
                </select>
                </div>
                </div>
                <div className="center-wrapper">
                <div className="col-md-11 d-flex flex-column">
                  <label htmlFor="Textarea" className="form-label">Description<span className='star'>*</span></label>
                  <textarea
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-control-hire"
                    id="hire"
                    placeholder="Enter job description"
                  />
                </div>
                </div>
                <div className="center-wrapper">
                <div className="col-md-11 d-flex flex-column">
                  <label htmlFor="Textarea" className="form-label">Requirements / Qualifications<span className='star'>*</span></label>
                  <textarea
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className="form-control-hire"
                    id="hire"
                    placeholder="Enter job Requirements / Qualifications"
                  />
                </div>
                </div>

                {error && (
                  <div
                    style={{
                      color: messageType === 'success' ? 'green' : 'red',
                      marginBottom: '10px',
                      fontWeight: '700'
                    }}
                  >
                    {error}
                  </div>
                )}
                <div className="col-12 text-center">
                <button type="submit" className="summer-register-button">
                  Post Job
                </button>
                </div>
        </form>
      </div>
      </div>
  );
};

export default PostJob;