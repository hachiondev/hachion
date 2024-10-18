import React from 'react'
import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'
import { IoIosArrowForward } from 'react-icons/io'

const AddBlog = () => {
  return (
   <>
   <AdminNavbar />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      
        <AdminSidebar />
        <div style={{ flexGrow: 1, padding: '20px' }}>
        
      
  <div className='course-category'>
<p>Blog Details <IoIosArrowForward/> Add Blog </p>
<div className='category'>
<div className='category-header'>
<p>Add Blog</p>
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
    <label className='form-label'>Blog Title</label>
    <input type="select" class="form-control" placeholder="Enter Title" aria-label="First name"/>
  </div>
  </div>
  <div className='course-row'>
  <div class="col">
    <label className='form-label'>Author</label>
    <input type="text" class="form-control" placeholder="Enter Title" aria-label="First name"/>
  </div>
  <div class="col">
  <label for="formFile" class="form-label">Blog Image</label>
  <input class="form-control" type="file" id="formFile"/>
</div>
<div class="col">
  <label for="formFile" class="form-label">Blog PDF</label>
  <input class="form-control" type="file" id="formFile"/>
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

export default AddBlog