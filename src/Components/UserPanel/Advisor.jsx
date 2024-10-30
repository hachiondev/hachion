import React, { useState, useRef } from 'react';
import './Corporate.css';
import { AiFillCaretDown } from 'react-icons/ai';
import { Menu, MenuItem, Button } from '@mui/material';
import Flag from 'react-world-flags';
import success from '../../Assets/success.gif';
import { RiCloseCircleLine } from 'react-icons/ri';
import { useFormik } from 'formik';
import { LoginSchema } from '../Schemas';

const initialValues = {
  name: "",
  company_name:"",
  email: "",
  number:"",
  course_name:"",
  comment:""
};


const Advisor = () => {
  const [showModal, setShowModal] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const mobileInputRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState({ code: '+91', flag: 'IN' });
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


  const handleModal = (e) => {
    e.preventDefault(); // Prevent default form submission
    setShowModal(true); // Open the modal
  };

  return (
    <>
      <div className='advisor'>
        <div className='advisor-form'>
          <div className='advisor-head'>
            <p>Talk to our Advisor</p>
          </div>
          <form className="enquiry-form" onSubmit={handleModal}>
            <div className='row'>
            <div className="col-md-5">
              <label htmlFor="inputName4" className="form-label">
                Full Name<span className="required">*</span>
              </label>
              <input type="text" className="form-control" id="advisor1" placeholder='Enter your full name' 
             required/>
            </div>
            <div className="col-md-5">
              <label htmlFor="inputCompany4" className="form-label">
                Company Name<span className="required">*</span>
              </label>
              <input type="text" className="form-control" id="advisor1" placeholder='Enter your company name'
               name='company_name'
               value={values.company_name}
               onChange={handleChange}
               onBlur={handleBlur} />
            </div>
            </div>
            <div className='row'>
            <div className="col-md-5">
              <label htmlFor="inputEmail4" className="form-label">
                Email ID<span className="required">*</span>
              </label>
              <input type="email" className="form-control" id="advisor1" placeholder='abc@gmail.com'
               name='email'
               value={values.email}
               onChange={handleChange}
               onBlur={handleBlur} />
            </div>
            <div className="col-md-5">
            <label className='form-label'>Mobile Number</label>
          <div class="input-group custom-width">
          <div className='input-group'>
            <Button
              variant="outlined"
              onClick={openMenu}
              className="country-code-dropdown"
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
            <input type='tel'
            className="mobile-number"
            ref={mobileInputRef}
              id='advisor2'
              aria-label="Text input with segmented dropdown button" 
              placeholder='Enter your mobile number' 
            name='name'
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}/>
            </div>
            </div>
            </div>
            </div>
            <div className='row'>
            <div className="col-md-5">
              <label htmlFor="inputState" className="form-label">
                No. of People<span className="required">*</span>
              </label>
              <select id="advisor1" className="form-select" required>
                <option selected disabled>Select number</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            <div className="col-md-5">
              <label htmlFor="inputCourse4" className="form-label">
                Training Course<span className="required">*</span>
              </label>
              <input type="text" className="form-control" id="advisor1" placeholder='Enter preferred course'
               name='course_name'
               value={values.course_name}
               onChange={handleChange}
               onBlur={handleBlur}/>
            </div>
            </div>
            <div className="col-10">
              <label htmlFor="Textarea" className="form-label">Comments</label>
              <textarea className="form-control" id="advisor3" placeholder="Enter comments here"
               name='comment'
               value={values.comment}
               onChange={handleChange}
               onBlur={handleBlur}/>
            </div>
            <div className="col-12 text-center">
              <button type="submit" className='submit-btn'>Submit</button>
            </div>
          </form>

          {showModal && (
            <div className='modal' style={{ display: 'block' }} onClick={() => setShowModal(false)}>
              <div className='modal-dialog' onClick={(e) => e.stopPropagation()}>
                <div className='modal-content' id='#querymodal'>
                  <button
                    className='close-btn'
                    aria-label='Close'
                    onClick={() => setShowModal(false)}
                  >
                    <RiCloseCircleLine />
                  </button>
                  <div className='modal-body'>
                    <img src={success} alt='Success' className='success-gif' />
                    <p className='modal-para'>
                      Thank you! Our Team will contact you soon
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Advisor;