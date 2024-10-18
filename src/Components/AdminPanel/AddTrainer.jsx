import React from 'react'
import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'
import { IoIosArrowForward } from 'react-icons/io'

const AddTrainer = () => {
  return (
   <>
   <AdminNavbar />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      
        <AdminSidebar />
        <div style={{ flexGrow: 1, padding: '20px' }}>
        
      
  <div className='course-category'>
<p>View Trainer <IoIosArrowForward/> Add Trainer </p>
<div className='category'>
<div className='category-header'>
<p>Add Trainer</p>
</div>
<div class="row">
  <div class="col">
    <label className='form-label'>Trainer</label>
    <input type="text" class="form-select" placeholder="Trainer name" aria-label="First name"/>
  </div>
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
  <div class="mb-6">
  <label for="exampleFormControlTextarea1" class="form-label">Trainer Profile Summary</label>
  <textarea class="form-control" id="exampleFormControlTextarea1" rows="6"></textarea>
</div>
<div class="row g-3 align-items-center">
  <div class="col-auto">
    <label for="inputPassword6" class="col-form-label">Demo Link 1</label>
  </div>
  <div class="col-auto">
    <input type="text" id="inputtext6" class="form-control" aria-describedby="passwordHelpInline"/>
  </div>
  </div>
  <div class="row g-3 align-items-center">
  <div class="col-auto">
    <label for="inputPassword6" class="col-form-label">Demo Link 2</label>
  </div>
  <div class="col-auto">
    <input type="text" id="inputtext6" class="form-control" aria-describedby="passwordHelpInline"/>
  </div>
  </div>
  <div class="row g-3 align-items-center">
  <div class="col-auto">
    <label for="inputPassword6" class="col-form-label">Demo Link 3</label>
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

export default AddTrainer