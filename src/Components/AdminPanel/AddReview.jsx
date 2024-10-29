import React from 'react'
import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'
import { IoIosArrowForward } from 'react-icons/io'

const AddReview = () => {
  return (
   <>
   <AdminNavbar />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      
        <AdminSidebar />
        <div style={{ flexGrow: 1, padding: '20px' }}>
        
      
  <div className='course-category'>
<p>Reviews <IoIosArrowForward/> Add Reviews </p>
<div className='category'>
<div className='category-header'>
<p>Add Reviews</p>
</div>
<div class="row">
  <div class="col">
    <label>Student name</label>
    <input type="text" class="form-control" placeholder="Enter name" aria-label="First name"/>
  </div>
  <div class="col">
  <label for="formFile" class="form-label">Image</label>
  <input class="form-control" type="file" id="formFile"/>
</div>
<div class="col">
    <label for="inputState" class="form-label">Source</label>
    <select id="inputState" class="form-select">
      <option selected>Select</option>
      <option>Linkedin</option>
      <option>Facebook</option>
      <option>Twitter</option>
      <option>Instagram</option>
    </select>
  </div>
  </div>
<div class="row">
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
  <div class="mb-3">
  <label for="exampleFormControlTextarea1" class="form-label">Comment</label>
  <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
</div>
  <div style={{display:'flex',flexDirection:'row'}}> 
  <button className='submit-btn'>Submit</button>
  <button className='reset-btn'>Reset</button>
  </div>
</div>
</div></div></div>
   </>
  )
}

export default AddReview