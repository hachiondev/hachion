import React from 'react'
import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'
import { IoIosArrowForward } from 'react-icons/io'

const AddBanner = () => {
  return (
   <>
   <AdminNavbar />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      
        <AdminSidebar />
        <div style={{ flexGrow: 1, padding: '20px' }}>
        
      
  <div className='course-category'>
<p>Banner/Amount Conversion Details <IoIosArrowForward/> Add Banner/Amount Conversion </p>
<div className='category'>
<div className='category-header'>
<p>Add Banner/Amount Conversion</p>
</div>
<div className='course-row'>
<div className='course-details'>

<div class="col">
  <label for="formFile" class="form-label">Blog Image</label>
  <input class="form-control" type="file" id="formFile"/>
</div>
<button className='submit-btn'>Upload</button>
</div>
<div className='course-details'>
<div class="col-md-10">
    <label for="inputState" class="form-label">Country</label>
    <select id="inputState" class="form-select">
      <option selected>Select Country</option>
      <option>...</option>
    </select>
  </div>
  <div class="col">
    <label for="inputEmail4" class="form-label">Amount Conversion</label>
    <input type="text" class="form-control" id="inputEmail4"/>
  </div>
  <button className='submit-btn'>Add Amount</button>
</div>
</div></div>
</div>
</div>
</div>
   </>
  )
}

export default AddBanner