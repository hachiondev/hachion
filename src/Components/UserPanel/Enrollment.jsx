import React from 'react';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import './Blogs.css';
import EnrollmentTable from './EnrollmentTable';
import TextField from '@mui/material/TextField';
import TotalOrder from './TotalOrder';
import StickyBar from './StickyBar';
import Footer from './Footer'

const Enrollment = () => {
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
        <div class="mb-3">
        <form class="row g-3">
  <div class="col-md-6">
    <label for="inputEmail4" class="form-label">Full Name*</label>
    <input type="text" class="form-control" id="inputEmail4" placeholder='Enter your full name'/>
  </div>
  <div class="col-md-6">
    <label for="inputPassword4" class="form-label">Email Id*</label>
    <input type="email" class="form-control" id="inputPassword4" placeholder='abc@gmail.com'/>
  </div>
  <div className="col-md-6">
            <label htmlFor="inputNumber4" className="form-label">
              Mobile Number<span className="required">*</span>
            </label>
            <div className="form-group col-10 mobile-number-container">
              <select className="form-select">
                <option>+1</option>
                <option>+91</option>
                <option>+44</option>
              </select>
              <input type="number" className="form-control" id="inputNumber" placeholder="Enter your number"/>
            </div>
          </div>
          <div class="col-md-6">
    <label for="inputCity" class="form-label">Country</label>
    <input type="text" class="form-control" id="inputCity" placeholder='India'/>
  </div>
  </form>
  </div>
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