import React, { useEffect, useState, useRef } from "react";
import './Course.css';
import { AiOutlineCloseCircle, AiFillCaretDown } from 'react-icons/ai';
import { Menu, MenuItem, Button } from '@mui/material';
import Flag from 'react-world-flags';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import calendar from '../../Assets/calendar.png'; 
import { useParams } from "react-router-dom";

const RequestBatch = ({ closeModal }) => {
  const { courseName } = useParams();
  const [startDate, setStartDate] = useState(null);
  const [time, setTime] = useState('');
  const timeInputRef = useRef(null);
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const mobileInputRef = useRef(null);
  const[mode,setMode]=useState('');
  const datePickerRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState({ code: '+91', flag: 'IN', name: 'India' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

  const formattedCourseName = courseName
    ?.replace(/-/g, ' ').split(' ') .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');  

     const userData = JSON.parse(localStorage.getItem('loginuserData')) || {};

const userName = userData.name || '';
const userEmail = userData.email || '';
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

  const defaultCountry = countries.find((c) => c.flag === "US");
    useEffect(() => {
  fetch("https://api.country.is")
    .then((res) => res.json())
    .then((data) => {
      data.country_code = (data.country || "").toUpperCase();
      const userCountryCode = data?.country_code;
      const matchedCountry = countries.find((c) => c.flag === userCountryCode);
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

  useEffect(() => {
  if (!userEmail) return;

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`https://api.test.hachion.co/api/v1/user/myprofile?email=${userEmail}`);
      const data = await response.json();

      if (data && data.mobile) {
        setMobile(data.mobile); 
      } else {
        console.warn("❌ Mobile number not found in profile response.");
      }
    } catch (err) {
      console.error("Error fetching profile data:", err);
    }
  };

  fetchUserProfile();
}, [userEmail]);


  const handleSubmit = async () => {
    setLoading(true);
    setError('');
  
setSuccessMessage('');
  setErrorMessage('');

    const payload = {
      schedule_date: startDate,
      time_zone: time,
      email: userEmail,
      mobile,
      mode,
      country: selectedCountry.name,
      courseName: formattedCourseName,
      userName: userName,

    };
  
    try {
      const response = await fetch('https://api.test.hachion.co/requestbatch/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
       if (!response.ok) {
      throw new Error('Failed to add the request.');
    }

    setSuccessMessage('✅ Request submitted successfully!');
    setTimeout(() => {
      closeModal();
    }, 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage('❌ Error submitting request. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="request-batch">
      <div className="request-header">Let us know your preferred start date</div>
      <form className="request-form">
        <AiOutlineCloseCircle onClick={closeModal} className="request-close" />

         <div className='form-group col-10' style={{ position: 'relative' }}>
            <label for="inputState" className='form-label'>
              Mode of Trainings
            </label>
            <select id='query1' class="form-select mode" value={mode}
            onChange={(e) => setMode(e.target.value)}>
            <option selected>Select Mode</option>
            <option>Live Class</option>
            <option>Live Demo</option>
            <option>Crash Course</option>
            {/* <option>Mentor Training</option> */}
            <option>Self-Paced</option>
            <option>Corporate Training</option>
          </select>
          </div>
        <div className="form-group col-10">
          <label htmlFor="inputDate" className="form-label">
            Preferred batch start date
          </label>
          <div className="date-picker-wrapper">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="DD/MM/YYYY"
              className="form-control-query date-picker"
              id="query1"
              ref={datePickerRef}
            />
            <img
              src={calendar}
              alt="calendar"
              className="icon-right black-calendar"
              onClick={() => datePickerRef.current.setFocus()}
            />
          </div>
        </div>

        <div className="form-group col-10" style={{ position: 'relative' }}>
          <label htmlFor="inputTime" className="form-label">
            Preferred batch Time
          </label>
          <input
            type="time"
            ref={timeInputRef}
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="form-control-query time-picker"
            placeholder="HH:MM"
            id="query1"
          />
        </div>
               {/* {error && <div className="error-message">{error}</div>} */}
{successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
        <button
          className="btn btn-primary btn-submit"
          type="button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default RequestBatch;