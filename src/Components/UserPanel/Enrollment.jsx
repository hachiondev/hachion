import React, { useState, useRef } from 'react';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import './Blogs.css';
import EnrollmentTable from './EnrollmentTable';
import TextField from '@mui/material/TextField';
import TotalOrder from './TotalOrder';
import StickyBar from './StickyBar';
import Footer from './Footer'
import { AiFillCaretDown } from 'react-icons/ai';
import { Menu, MenuItem, Button } from '@mui/material';
import Flag from 'react-world-flags';

const Enrollment = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const mobileInputRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState({ code: '+91', flag: 'IN' });

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
  ];

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

  return (
    <>
    <Topbar/>
    <NavbarTop/>
    <div className='enrollment'>
        <p>Enrollment Details</p>
    </div>
    <div className='enrollment-details'>
    <div className='personal-details'>
        <div className='personal-details-header'>
            <p>1. Personal Details</p>
        </div>
      
        <form>
          <div className="row">
  <div class="col-md-6">
    <label for="inputEmail4" class="form-label">Full Name*</label>
    <input type="text" class="form-control" id="inputEmail4" placeholder='Enter your full name'/>
  </div>
  <div class="col-md-6">
    <label for="inputPassword4" class="form-label">Email Id*</label>
    <input type="email" class="form-control" id="inputPassword4" placeholder='abc@gmail.com'/>
  </div>
  </div>
  <div className="row">
  <div className="col-md-6">
  <label className='form-label'>Mobile Number</label>
<div class="input-group mb-3 custom-width">
  <div className='input-group'>
            <Button
              variant="outlined"
              onClick={openMenu}
              className="country-code"
              endIcon={<AiFillCaretDown />}
            >
              <Flag code={selectedCountry.flag} className='country-flag' />
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
                  <Flag code={country.flag} className='country-flag' />
                  {country.name} ({country.code})
                </MenuItem>
              ))}
            </Menu>
          <input 
          type='tel'
          class="form-control"
          ref={mobileInputRef}
          id="inputMobile4"
          aria-label="Text input with segmented dropdown button"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          placeholder='Enter your mobile number'/>
        </div>
      </div>
      </div>
          <div class="col-md-6">
    <label for="inputCity" class="form-label">Country</label>
    <input type="text" class="form-control" id="inputCity" placeholder='India'/>
  </div>
  </div>

  </form>
  
        </div>
        <div className='personal-details'>
        <div className='personal-details-header'>
            <p>1. Course Details</p>
            </div>
            <EnrollmentTable/>
            <div className='coupon-div'>
            <p>Have a coupon code ?</p>
            <TextField
         placeholder='Enter coupon code'
          id="filled-start-adornment"
          sx={{ m: 1, width: '25ch' }}
          slotProps={{
          
          }}
          variant="filled"
        />
        <button className='apply-btn'>Apply</button>
        </div>
            </div>
            <div className='personal-details'>
            <div className='personal-details-header'>
                <p>3. Order summary</p>
                </div>
               <TotalOrder/>
                </div>
    </div>
    <Footer/>
    <StickyBar/>
    </>
  )
}

export default Enrollment