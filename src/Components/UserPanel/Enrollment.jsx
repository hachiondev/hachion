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
  <label className='form-label'>Mobile Number</label>
<div class="input-group mb-3 custom-width">
  <button type="button" class="btn btn-outline-secondary">+91</button>
  <button type="button" class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
    <span class="visually-hidden">select</span>
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">+91</a></li>
    <li><a class="dropdown-item" href="#">+66</a></li>
    <li><a class="dropdown-item" href="#">+11</a></li>
    <li><a class="dropdown-item" href="#">+20</a></li>
  </ul>
  <input type="number" className="mobile-number" aria-label="Text input with segmented dropdown button" placeholder='Enter your mobile number'/>
</div>
          </div>
          <div class="col-md-6">
    <label for="inputCity" class="form-label">Country</label>
    <input type="text" class="form-control" id="inputCity" placeholder='India'/>
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