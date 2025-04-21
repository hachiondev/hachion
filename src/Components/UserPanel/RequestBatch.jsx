import React, { useEffect, useState, useRef } from "react";
import './Course.css';
import { AiOutlineCloseCircle, AiFillCaretDown } from 'react-icons/ai';
import { Menu, MenuItem, Button } from '@mui/material';
import Flag from 'react-world-flags';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import calendar from '../../Assets/calendar.png'; // Black calendar icon

const RequestBatch = ({ closeModal, courseName = 'Qa Automation' }) => {
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

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
  
    // Retrieve the userName from localStorage
    const userName = JSON.parse(localStorage.getItem('loginuserData'))?.name || '';
  
    const payload = {
      schedule_date: startDate,
      time_zone: time,
      email,
      mobile,
      mode,
      country: selectedCountry.name,
      courseName, // Automatically set from the component prop
      userName // Add userName from localStorage
    };
  
    try {
      const response = await fetch('/HachionUserDashboad/requestbatch/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add the request.');
      }
  
      alert('Request submitted successfully!');
      closeModal(); // Close the modal on successful submission
    } catch (err) {
      console.error(err);
      setError('Error submitting request. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="request-batch">
      <div className="request-header">Let us know your preferred start date</div>
      <form className="request-form">
        <AiOutlineCloseCircle onClick={closeModal} className="button-close" />

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
        <div className='form-group col-10' style={{ position: 'relative' }}>
            <label for="inputState" className='form-label'>
              Mode
            </label>
            <select id='query1' class="form-select mode" value={mode}
            onChange={(e) => setMode(e.target.value)}>
            <option selected>Select mode</option>
            <option>Live Demo</option>
            <option>Live Class</option>
          </select>
          </div>
        <div className="form-group col-10">
          <label htmlFor="inputEmail" className="form-label">
            Email ID
          </label>
          <input
            id="query1"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control-query"
            placeholder="abc@gmail.com"
          />
        </div>

        <label className="form-label">Mobile Number</label>
        <div className="input-group mb-3 custom-width">
          <div className="input-group">
            <Button
              variant="outlined"
              onClick={openMenu}
              className="country-code-dropdown"
              endIcon={<AiFillCaretDown />}
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
              id="query2"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter your mobile number"
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

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