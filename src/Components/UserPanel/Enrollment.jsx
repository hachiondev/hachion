import React, { useState, useRef,useEffect } from 'react';
import axios from 'axios';
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
import { useFormik } from 'formik';
import { LoginSchema } from '../Schemas';

const initialValues = {
  name: "",
  email: "",
  number:"",
  country:""
};

const Enrollment = () => {
  const [studentData, setStudentData] = useState(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const mobileInputRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState({
        code: '+1',
        flag: 'US',
        name: 'United States',
      });
  const { values, errors, handleBlur, touched, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      console.log(values);
    }
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
  useEffect(() => {
    const fetchStudentDetails = async () => {
      const user = JSON.parse(localStorage.getItem('loginuserData'));
      const email = user?.email;

      if (!email) return;

      try {
        const response = await axios.get('https://api.hachion.co/api/v1/user/students');
        const allStudents = response.data;

        const matchedStudent = allStudents.find((student) => student.email === email);

        if (matchedStudent) {
          setStudentData(matchedStudent);
          setMobileNumber(matchedStudent.mobile || '');
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
      }
    };

    fetchStudentDetails();
  }, []);

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
      
        <form className='details'>
      <div className='input-row'>
        <div className="col-md-5">
          <label htmlFor="inputName4" className="form-label">
            Full Name<span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            // id="enroll1"
            placeholder='Enter your full name'
            value={studentData?.userName || ''}
            readOnly
            required
          />
        </div>
        <div className="col-md-5">
          <label htmlFor="inputEmail4" className="form-label">
            Email ID<span className="required">*</span>
          </label>
          <input
            type="email"
            className="form-control"
            // id="enroll1"
            placeholder='abc@gmail.com'
            value={studentData?.email || ''}
            readOnly
          />
        </div>
      </div>

      <div className='input-row'>
        <div className="col-md-5">
          <label className='form-label'>Mobile Number</label>
          <div className="input-group custom-width">
            <Button
              variant="outlined"
              onClick={openMenu}
              className="country-code-dropdown"
              endIcon={<AiFillCaretDown />}
            >
              <Flag code={selectedCountry.flag} className='country-flag' />
              {selectedCountry.code}
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
              {countries.map((country) => (
                <MenuItem key={country.code} onClick={() => handleCountrySelect(country)}>
                  <Flag code={country.flag} className='country-flag' />
                  {country.name} ({country.code})
                </MenuItem>
              ))}
            </Menu>
            <input
              type='tel'
              className="mobile-number"
              ref={mobileInputRef}
              id='enroll2'
              placeholder='Enter your mobile number'
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="col-md-5">
          <label htmlFor="inputCity" className="form-label">
            Country<span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            // id="enroll1"
            placeholder='Enter your country'
            value={studentData?.country || ''}
            readOnly
            required
          />
        </div>
      </div>
    </form>
  
        </div>
        <div className='personal-details'>
        <div className='personal-details-header'>
            <p>2. Course Details</p>
            </div>
            <div className='enroll-table'>
            <EnrollmentTable/>
            </div>
            <div className='coupon-div'>
            <p>Have a coupon code ?</p>
            <div className='coupon'>
            <TextField
         placeholder='Enter coupon code'
          id="filled-start-adornment"
          className='coupon-field'
          slotProps={{
          
          }}
          variant="filled"
        />
        <button className='apply-btn'>Apply</button>
        </div>
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