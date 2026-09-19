"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import Flag from '@/components/common/CountryFlag';
import { AiFillCaretDown } from 'react-icons/ai';
import regkid from '@/assets/regkid.webp';
import axios from 'axios';

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
  { name: 'Netherlands', code: '+31', flag: 'NL' },
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
  "Africa/Johannesburg": "SAST"
};

const SummerRegister = () => {
  const [error, setError] = useState('');
  const [messageType, setMessageType] = useState('');
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    country: "",
    courseInterest: "",
    batchTiming: ""
  });
  const mobileInputRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState({
    code: '+1',
    flag: 'US',
    name: 'United States'
  });

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleCountrySelect = country => {
    setSelectedCountry(country);
    closeMenu();
    mobileInputRef.current?.focus();
  };
  const openMenu = event => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);
  useEffect(() => {
    fetch("https://api.country.is").then(res => res.json()).then(data => {
      data.country_code = (data.country || "").toUpperCase();
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
      const userCountryCode = data?.country_code || "US";
      setFormData(prev => ({
        ...prev,
        timeZone
      }));
      const matchedCountry = countries.find(c => c.flag.toUpperCase() === userCountryCode.toUpperCase());
      setSelectedCountry(matchedCountry || {
        name: "United States",
        code: "+1",
        flag: "US"
      });
    }).catch(() => {
      setFormData(prev => ({
        ...prev,
        timeZone: "America/New_York"
      }));
      setSelectedCountry({
        name: "United States",
        code: "+1",
        flag: "US"
      });
    });
  }, []);
  const handleSubmit = async e => {
    e.preventDefault();
    const {
      fullName,
      email,
      mobileNumber,
      country,
      courseInterest,
      batchTiming
    } = formData;
    if (!fullName || !email || !mobileNumber || !country || !courseInterest || !batchTiming) {
      setError('Please fill all the details to register.');
      setMessageType('error');
      return;
    }
    const timeZone = formData.timeZone;
    const timeZoneShort = timeZoneAbbreviationMap[timeZone] || timeZone;
    const payload = {
      fullName,
      email: email,
      mobileNumber: `${selectedCountry.code} ${mobileNumber}`,
      country,
      courseInterested: courseInterest,
      batchTiming: batchTiming
    };
    try {
      const response = await axios.post(`https://api.hachion.co/kids-summer-training`, payload);
      setError('Registration successful!');
      setMessageType('success');
      setFormData({
        fullName: "",
        email: "",
        mobileNumber: "",
        country: "",
        courseInterest: "",
        batchTiming: ""
      });
    } catch (error) {
      console.error("Registration failed:", error);
      if (error.response && error.response.data && error.response.data.message) {
        const backendMessage = error.response.data.message;
        if (backendMessage.includes("Email already exists")) {
          window.alert("This email already exists.");
          setError("This email is already registered.");
        } else if (backendMessage.includes("Mobile number already exists")) {
          window.alert("This mobile number already exists.");
          setError("This mobile number is already registered.");
        } else {
          setError(backendMessage);
        }
      } else {
        window.alert("Registration failed. Please try again.");
        setError("Registration failed. Please try again.");
      }
      setMessageType("error");
    }
  };
  return <div>
        <h2 className='summer-title'>Register Now!</h2>
        <form onSubmit={handleSubmit}>
          <div className='summer-part'>
            <Image className='reg-img' src={regkid} alt='Register' />
            <div>
              <div className='reg-form'>
                <div className="form-group col-10" style={{
              marginBottom: '20px'
            }}>
                  <label className="form-label">Full Name<span className='star'>*</span></label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="form-control-registration" id="registrationFullName" placeholder="Enter your name" />
                </div>

                <div className="form-group col-10" style={{
              marginBottom: '20px'
            }}>
                  <label className="form-label">Email ID<span className='star'>*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control-registration" id="registrationEmail" placeholder="abc@gmail.com" />
                </div>

                <div className="form-group col-10" style={{
              marginBottom: '20px'
            }}>
                  <label className="form-label">Mobile Number <span className="star">*</span></label>
                  <div className="input-wrapper" style={{
                position: 'relative'
              }}>
                    <button type="button" onClick={openMenu} className='mobile-button'>
                      <Flag code={selectedCountry.flag} alt={`${selectedCountry.name} flag`} className="country-flag me-1" />
                      <span style={{
                    marginRight: '5px'
                  }}>{selectedCountry.code}</span>
                      <AiFillCaretDown />
                    </button>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
                      {countries.map(country => <MenuItem key={country.code} onClick={() => handleCountrySelect(country)}>
                          <Flag code={country.flag} alt={`${country.name} flag`} className="country-flag me-2" />
                          {country.name} ({country.code})
                        </MenuItem>)}
                    </Menu>
                    <input type="tel" className="form-control-registration" id="registrationMobile" name="mobileNumber" ref={mobileInputRef} value={formData.mobileNumber} onChange={handleChange} placeholder="Enter your mobile number" style={{
                  paddingLeft: '100px'
                }} />
                  </div>
                  </div>
                  <div className="form-group col-10" style={{
              marginBottom: '20px'
            }}>
                  <label className="form-label">Country<span className='star'>*</span></label>
                  <input type="text" name="country" value={formData.country} onChange={handleChange} className="form-control-registration" id="registrationCountry" placeholder="Enter your country" />
                </div>
                 <div className="form-group col-10" style={{
              marginBottom: '20px'
            }}>
                  <label className="form-label">Courses Interested<span className='star'>*</span></label>
                  <input type="text" name="courseInterest" value={formData.courseInterest} onChange={handleChange} className="form-control-registration" id="registrationCourseInterest" placeholder="Enter Courses Interested" />
                </div>
                 <div className="form-group col-10" style={{
              marginBottom: '20px'
            }}>
                  <label className="form-label">Batch Timing<span className='star'>*</span></label>
                  <select name="batchTiming" value={formData.batchTiming} onChange={handleChange} className="form-control-registration" id="registrationBatchTiming">
                    <option value="">Select Batch Timing </option>
                     <option value="Morning">Morning</option>
                     <option value="Afternoon">Afternoon</option>
                     <option value="Flexible Timing">Flexible Timing</option>
                </select>
                </div>

                {error && <div style={{
              color: messageType === 'success' ? 'green' : 'red',
              marginBottom: '10px',
              fontWeight: '700'
            }}>
                    {error}
                  </div>}

                <button type="submit" className="summer-register-button">
                  Register
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>;
};
export default SummerRegister;
