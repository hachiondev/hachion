import React from 'react'
import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'
import { IoIosArrowForward } from 'react-icons/io'

const AddResume = () => {
  return (
   <>
   <AdminNavbar />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      
        <AdminSidebar />
        <div style={{ flexGrow: 1, padding: '20px' }}>
        
      
  <div className='course-category'>
<p>Resume <IoIosArrowForward/> Add Resume </p>
<div className='category'>
<div className='category-header'>
<p>Add Resume</p>
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
<div class="row g-3 align-items-center">
  <div class="col-auto">
    <label for="inputPassword6" class="col-form-label">Enter junior level position path</label>
  </div>
  <div class="col-auto">
    <input type="text" id="inputtext6" class="form-control" aria-describedby="passwordHelpInline"/>
  </div>
  </div>
  <div class="row g-3 align-items-center">
  <div class="col-auto">
    <label for="inputPassword6" class="col-form-label">Enter middle level position path</label>
  </div>
  <div class="col-auto">
    <input type="text" id="inputtext6" class="form-control" aria-describedby="passwordHelpInline"/>
  </div>
  </div>
  <div class="row g-3 align-items-center">
  <div class="col-auto">
    <label for="inputPassword6" class="col-form-label">Enter senior level position path</label>
  </div>
  <div class="col-auto">
    <input type="text" id="inputtext6" class="form-control" aria-describedby="passwordHelpInline"/>
  </div>
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

export default AddResume