import React,{useEffect,useState, useRef } from 'react'
import Topbar from './Topbar'
import NavbarTop from './NavbarTop'
import { AiFillCaretDown } from 'react-icons/ai';
import { Menu, MenuItem, Button } from '@mui/material';
import Flag from 'react-world-flags';
import contactUsBanner from '../../Assets/contactus.png';
import {MdKeyboardArrowRight} from 'react-icons/md';
import UsaFlag from '../../Assets/usflag.jpg';
import './Blogs.css';
import indiaFlag from '../../Assets/india.jpg';
import dubaiFlag from '../../Assets/canada.jpg';
import whatsappIcon from '../../Assets/logos_whatsapp-icon.png';
import mailIcon from '../../Assets/uiw_mail.png';
import facebookIcon from '../../Assets/facebook_symbol.svg.png';
import twitter from '../../Assets/twitter.png';
import linkedin from '../../Assets/linkedin.png';
import instagram from '../../Assets/instagram.png';
import quora from '../../Assets/Component 141.png';
import Footer from './Footer';
import StickyBar from './StickyBar';

const ContactUs = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const mobileInputRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState({ code: '+91', flag: 'IN' });
  useEffect(() => {
    window.scrollTo(0, 0);  // This will scroll to the top of the page
  }, []);

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
   <div className='about-banner'>
<img src={contactUsBanner} alt='contact-us-banner'/>
  </div>
  <div className='contact-us-all'>
  <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a> <MdKeyboardArrowRight/>            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Contact Us
            </li>
          </ol>
        </nav>
  <h1 className='about-us-heading'>Office Location</h1>
 
<div className='contact-us'>
    <div className='contact-us-div'>
        <h3>Head Quarters</h3>
        <div className='contact-us-box'>
            <img src={UsaFlag} alt='usa' className='flag'/>
            <div className='office-location'>
                <p>New Jersey, USA</p>
                <p>HACH Technologies 239 US Highway 22 green Brook Township,
                    New Jersey USA,
                    ZIP 08812.</p>
            </div>
        </div>
    </div>
    
    <div className='contact-us-div'>
        <div className='contact-us-box'>
            <img src={indiaFlag} alt='usa' className='flag'/>
            <div className='office-location'>
                <p>Hyderabad, India</p>
                <p>HACH Technologies GP Rao Enclaves, 301, 3rd floor
                  Road No 3 KPHB colony,
                  Hyderabad 500072.</p>
            </div>
        </div>
    </div>
    <div className='contact-us-div'>
        <div className='contact-us-box'>
            <img src={dubaiFlag} alt='usa' className='flag'/>
            <div className='office-location'>
                <p>Dubai, UAE</p>
                <p>Sports City
                Dubai UAE</p>
            </div>
        </div>
    </div>
    </div>
    <div className='contact-us-bottom-div'>
    <div className='contact-us-left'>
  <h3>Enquiries</h3>
  <div className='contact-block'>
    <img src={whatsappIcon} alt='whatsapp-icon'/>
    <p className='contact-info'> +91 9490323388</p>
  </div>
  <div className='contact-block'>
    <img src={mailIcon} alt='mail-icon'/>
    <p className='contact-info'>trainings@hachion.co</p>
  </div>
  <div className='contact-us-icon'>
    <img src={facebookIcon} alt='facebook-icon'/>
    <img src={twitter} alt='twitter-icon'/>
    <img src={linkedin} alt='linkedin-icon'/>
    <img src={instagram} alt='instagram-icon'/>
    <img src={quora} alt='quora-icon'/>
  </div>
    </div>
<div className='contact-us-right'>
<div className='contact-us-right-header'>
<p>Get in touch with us</p>

</div>
<form className='contact-form'>
<div class="mb-3">
  <label for="exampleFormControlInput1" class="form-label">Full Name</label>
  <input type="text" className="form-control" id="contact1" placeholder="Enter your full name"/>
</div>
<div class="mb-3">
  <label for="exampleFormControlInput1" class="form-label">Email Id</label>
  <input type="email" className="form-control" id="contact1" placeholder="Enter your emailid"/>
</div>
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
          <input 
          type='tel'
          className="mobile-number" 
          ref={mobileInputRef}
          id='contact2' 
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          aria-label="Text input with segmented dropdown button" 
          placeholder='Enter your mobile number'/>
        </div>
        </div>
        <div class="mb-3">
          <label for="exampleFormControlTextarea1" class="form-label">Comments</label>
          <textarea class="form-control" id="contact3" rows="3"></textarea>
        </div>
        <div class="mb-3">
        <button type="button" class="submit-button">Submit</button>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" />
          <label class="form-check-label" for="flexCheckChecked">
          By clicking on Submit, you acknowledge read our Privacy Notice
          </label>
          </div>        
        </div>
        </form>
        </div>
        </div>
       </div>
      <Footer/>
      <StickyBar/>
    </>
  )
}

export default ContactUs
