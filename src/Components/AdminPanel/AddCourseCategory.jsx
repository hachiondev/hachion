import React from 'react';
import './Admin.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IoIosArrowForward } from "react-icons/io";
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import TextField from '@mui/material/TextField';

const AddCourseCategory = () => {
  return (<>
   <LocalizationProvider dateAdapter={AdapterDayjs}>
   <AdminNavbar />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      
        <AdminSidebar />
        <div style={{ flexGrow: 1, padding: '20px' }}>
        
      
  <div className='course-category'>
<p>View Course Category list <IoIosArrowForward/> Add Category </p>
<div className='category'>
<div className='category-header'>
<p>Add Category</p>
</div>
<div className='date-schedule' style={{display:'flex',flexDirection:'column'}}>
<div class="mb-3">
  <label for="exampleFormControlInput1" class="form-label">Category Name</label>
  <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Enter Category name"/>
</div>
<div class="mb-3">
   Date <br/>
   <DatePicker
/>

  </div>
 <div style={{display:'flex',flexDirection:'row'}}> 
  <button className='submit-btn'>Submit</button>
  <button className='reset-btn'>Reset</button>
  </div>
  </div>
</div>
</div>
</div>
</div>
 
  </LocalizationProvider>
  
  </>
  )
}

export default AddCourseCategory