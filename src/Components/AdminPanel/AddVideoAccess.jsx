import React from 'react'
import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'
import { IoIosArrowForward } from 'react-icons/io'

const AddVideoAccess = () => {
  return (
   <>
   <AdminNavbar />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      
        <AdminSidebar />
        <div style={{ flexGrow: 1, padding: '20px' }}>
        
      
  <div className='course-category'>
<p>Video Access <IoIosArrowForward/> Add Video Access </p>
<div className='category'>
<div className='category-header'>
<p>Add Video Access</p>
</div>
<div class="row">
<div class="col">
    <label for="inputState" class="form-label">User Email</label>
    <select id="inputState" class="form-select">
      <option selected>Select Email</option>
    </select>
  </div>
  <div class="col">
    <label for="inputState" class="form-label">Trainer</label>
    <select id="inputState" class="form-select">
      <option selected>Select Trainer</option>
    </select>
  </div>
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
  <div class="mb-3">
  <label for="formGroupExampleInput" class="form-label">Description</label>
  <input type="text" class="form-control" id="formGroupExampleInput" placeholder="Add Description"/>
  </div>
  <label>Permission: </label>
  <div class="form-check form-switch">
  <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"/>
  <label class="form-check-label" for="flexSwitchCheckDefault">Disable</label>

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

export default AddVideoAccess