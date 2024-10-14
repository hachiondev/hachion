import React from 'react'
import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'
import { IoIosArrowForward } from 'react-icons/io'

const AddCertificate = () => {
  return (
<>
   <AdminNavbar />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      
        <AdminSidebar />
        <div style={{ flexGrow: 1, padding: '20px' }}>
        
      
  <div className='course-category'>
<p>Course Certificate <IoIosArrowForward/> Add course certificate </p>
<div className='category'>
<div className='category-header'>
<p>Add Course Certificate</p>
</div>
<div className='row'>
<div class="col">
    <label for="inputState" class="form-label">Category Name</label>
    <select id="inputState" class="form-select">
      <option selected>Select Category</option>
      <option>QA Testing</option>
      <option>Project Management</option>
      <option>Business Intelligence</option>
      <option>Data Science</option>
    </select>
  </div>
  <div class="col">
    <label for="inputState" class="form-label">Course Name</label>
    <select id="inputState" class="form-select">
      <option selected>Select Course</option>
      <option>QA Automation</option>
      <option>Load Runner</option>
      <option>QA Automation Testing</option>
      <option>Mobile App Testing</option>
    </select>
  </div>
  </div>
  <div className='row'>
  <div class="col">
  <label for="formGroupExampleInput" class="form-label">Certificate Title</label>
  <input type="text" class="form-control" id="formGroupExampleInput" placeholder="Enter title"/>
</div>
<div class="col">
  <label for="formFileMultiple" class="form-label">Certificate Image</label>
  <input class="form-control" type="file" id="formFileMultiple" multiple/>
</div>
</div>
<div class="mb-2">
  <label for="exampleFormControlTextarea1" class="form-label">Description</label>
  <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
</div>
<div style={{display:'flex',flexDirection:'row'}}> 
  <button className='submit-btn'>Submit</button>
  <button className='reset-btn'>Reset</button>
  </div>
</div>
</div>
</div>
</div>
</>)
}

export default AddCertificate
