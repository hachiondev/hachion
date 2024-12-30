import React, { useState, useRef } from 'react';
import './Login.css';
import './Course.css';
import logo from '../../Assets/logo.png';
import LoginSide from './LoginSide';
import {useFormik} from 'formik';
import {LoginSchema} from '../Schemas';
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import { Menu, MenuItem, Button } from '@mui/material';
import Flag from 'react-world-flags';
import {AiFillCaretDown } from 'react-icons/ai';

const initialValues={
  name:"",
  email:""
}

const RegisterHere = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const mobileInputRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState({
    code: '+91',
    flag: 'IN',
    name: 'India',
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

  const {values,errors,handleBlur,touched,handleChange,handleSubmit}= useFormik({
    initialValues:initialValues,
    validationSchema:LoginSchema,
    onSubmit:(values)=>{
   console.log(values);
    }
   })

    const navigate=useNavigate();

const handleClick=()=>{
    navigate('/registerverification')
}

  return (
  <>
<div className='login'>
<div className='login-left'>
  <div className='login-top'>
  <img src={logo} alt='logo' className='login-logo'/>
  <h3 className='register-learning'>Register to start learning</h3>
 
<div className='steps'>
    <h4 className='steps-head'>Steps: </h4>
    <div className='step-one'>
      <h6 className='steps-head-one'>1</h6>
</div>
<hr width='55%' size='1' color='#00AAEF'/>
<div className='step-two'>
  <h6 className='steps-head-two'>2</h6>
</div>
</div>
<form onSubmit={handleSubmit}>
<div className='login-mid-name'>
<label className='login-label'>Full Name<span className='star'>*</span></label>
<div className="input-group mb-2">
  <input type="string" className="form-control" id="floatingName" placeholder="Enter your name"
   name='name' value={values.name} onChange={handleChange} onBlur={handleBlur}/>
</div>
{errors.name && touched.name ? (<p className='form-error'>{errors.name}</p>):null}

<label className='login-label'>Email ID<span className='star'>*</span></label>
<div className="input-group mb-2">
  <input type="email" className="form-control" id="floatingEmail" placeholder="abc@gmail.com"
   name='email' value={values.email} onChange={handleChange} onBlur={handleBlur}/>
  </div>
  {errors.email && touched.email ? (<p className='form-error'>{errors.email}</p>):null}
  
  <label className="login-label">
                  Mobile Number<span className="star">*</span>
                </label>
                <div className="input-group mb-3 custom-width">
                  <div className="input-group">
                    <Button
                      variant="outlined"
                      onClick={openMenu}
                      className="country-dropdown"
                      endIcon={<AiFillCaretDown />}
                    >
                      <Flag code={selectedCountry.flag} className="country-flag" />
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
                          <Flag code={country.flag} className="country-flag" />
                          {country.name} ({country.code})
                        </MenuItem>
                      ))}
                    </Menu>

                    <input
                      type="tel"
                      className="mobilenumber"
                      ref={mobileInputRef}
                      name="mobile"
                      aria-label="Text input with segmented dropdown button"
                      id="register"
                      value={values.mobile}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your mobile number"
                    />
                  </div>
                </div>
                {errors.mobile && touched.mobile ? (<p className='form-error'>{errors.mobile}</p>) : null}

<button className='register-btn' onClick={handleClick}>Verify</button>

</div>
</form>
<p className='login-with-hachion'>Do you have an account with Hachion? <Link to='/login' className='link-to'>Click here to Login</Link></p>
</div>
</div>
<LoginSide/>
</div>
  </>
  )
}
export default RegisterHere;