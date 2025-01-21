import React from 'react'
import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'
import { IoIosArrowForward } from 'react-icons/io'

const AddSupport = () => {
  return (
   <>
   <AdminNavbar />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      
        <AdminSidebar />
        <div style={{ flexGrow: 1, padding: '20px' }}>
        
      
  <div className='course-category'>
<p>Support Details <IoIosArrowForward/> Add Support </p>
<div className='category'>
<div className='category-header'>
<p>Add Support</p>
</div>
<div class="row">

  <div class="col">
    <label className='form-label'>Name</label>
    <input type="text" class="form-control" placeholder="Enter Name" aria-label="First name"/>
  </div>
  <div class="col">
    <label className='form-label'>Mobile</label>
    <input type="number" class="form-control" placeholder="Enter Mobile" aria-label="First name"/>
  </div>
  </div>
  <div className='course-row'>
  <div class="col">
    <label className='form-label'>Email</label>
    <input type="email" class="form-control" placeholder="Enter Title" aria-label="First name"/>
  </div>
  <div class="col">
    <label className='form-label'>Password</label>
    <input type="password" class="form-control" placeholder="Enter Title" aria-label="First name"/>
  </div>
</div>

  <div class="mb-3">
  <label for="exampleFormControlTextarea1" class="form-label">Description</label>
  <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
</div>

  <div style={{display:'flex',flexDirection:'row'}}> 
  <button className='submit-btn'>Submit</button>
  <button className='reset-btn'>Reset</button>
</div>
</div></div>
</div></div>
   </>
  )
}

export default AddSupport