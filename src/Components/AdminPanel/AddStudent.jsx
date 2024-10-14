import React from 'react'
import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'
import { IoIosArrowForward } from 'react-icons/io'
import './Admin.css';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import FormLabel from '@mui/material/FormLabel';


const AddStudent = () => {
  return (
  <>
  <AdminNavbar />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      
        <AdminSidebar />
        <div style={{ flexGrow: 1, padding: '20px' }}>
        
      
  <div className='course-category'>
<p>Register List <IoIosArrowForward/> Add Student </p>
<div className='category'>
<div className='category-header'>
<p>Add Student</p>
</div>
<form class="row g-3">
  <div class="col-md-3">
    <label for="inputEmail4" class="form-label">Student Name</label>
    <input type="text" class="form-control" id="inputEmail4"/>
  </div>
  <div class="col-md-3">
    <label for="inputPassword4" class="form-label">Email</label>
    <input type="email" class="form-control" id="inputPassword4" placeholder='abc@gmail.com'/>
  </div>
  <div class="col-md-3">
    <label for="inputPassword4" class="form-label">Mobile</label>
    <input type="number" class="form-control" id="inputPassword4" placeholder='enter mobile number'/>
  </div>
  <div class="col-md-3">
    <label for="inputEmail4" class="form-label">Country</label>
    <input type="text" class="form-control" id="inputEmail4"/>
  </div>
  <div class="col-md-3">
    <label for="inputPassword4" class="form-label">Location</label>
    <input type="email" class="form-control" id="inputPassword4" />
  </div>
  <div class="col-md-3">
    <label for="inputPassword4" class="form-label">Visa status</label>
    <input type="text" class="form-select" id="inputPassword4" placeholder='select Visa status'/>
  </div>
  <div className='row'>
  <div class="col-md-3">
    <label for="inputEmail4" class="form-label">Time Zone</label>
    <input type="text" class="form-control" id="inputTime4"/>
  </div>
  <div class="col-md-3">
    <label for="inputPassword4" class="form-label">Entered by</label>
    <input type="email" class="form-control" id="inputTime4" />
  </div>
  <div class="col-md-3">
    <label for="inputState" class="form-label">Source of Enquiry</label>
    <select id="inputState" class="form-select">
      <option selected>Select</option>
      <option>Linkedin</option>
      <option>Instagram</option>
      <option>Facebook</option>
      <option>Twitter</option>
    </select>
  </div>
  <div class="col-md-3">
    <label for="inputState" class="form-label">Course Name</label>
    <select id="inputState" class="form-select">
      <option selected>Select course</option>
      <option>Qa Automation</option>
      <option>Load Runner</option>
      <option>QA Manual Testing</option>
      <option>Mobile App Testing</option>
    </select>
  </div>
  </div>
  <div className='row'>
  <div class="mb-3">
  <label for="exampleFormControlTextarea1" class="form-label">Remarks</label>
  <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
</div>
<div class="mb-3">
  <label for="exampleFormControlTextarea1" class="form-label">Comments</label>
  <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
</div>
</div>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value="female" control={<Radio />} label="Send details via only email" />
        <FormControlLabel value="male" control={<Radio />} label="Send details via only whatsapp" />
        <FormControlLabel value="male" control={<Radio />} label="Send details via email and whtsapp" />
      
      </RadioGroup>
  </form>
</div>
   
</div>
</div>
</div>
  </>
  )
}

export default AddStudent
