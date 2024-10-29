import React from 'react'
import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'
import { IoIosArrowForward } from 'react-icons/io'
import './Admin.css';

const AddCourseDetails = () => {


  return (
    <>
     <AdminNavbar />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      
        <AdminSidebar />
        <div style={{ flexGrow: 1, padding: '20px' }}>
        
      
  <div className='course-category'>
<p>Course details <IoIosArrowForward/> Add Course Details </p>
<div className='category'>
<div className='category-header'>
<p>Add Course Details</p>
</div>
<div className='course-details'>
  <div className='course-row'>
<div class="col-md-4">
    <label for="inputState" class="form-label">Category Name</label>
    <select id="inputState" class="form-select">
      <option selected>Select category</option>
      <option>Qa Testing</option>
      <option>Project Management</option>
      <option>Business Intelligence</option>
    </select>
  </div>
  <div class="col-md-4">
    <label for="inputEmail4" class="form-label">Course Name</label>
    <input type="text" class="form-control" id="inputEmail4" placeholder='Enter Course name here'/>
  </div>
  <div class="mb-3">
  <label for="formFile" class="form-label">Course Images</label>
  <input class="form-control" type="file" id="formFile"/>
</div>
  </div>
  <div className='course-row'>
  <div class="col-md-4">
    <label for="inputEmail4" class="form-label">Youtube Link</label>
    <input type="text" class="form-control" id="inputEmail4" placeholder='Enter Youtube Link'/>
  </div>
  <div class="col-md-4">
    <label for="inputEmail4" class="form-label">No. of Classes</label>
    <input type="text" class="form-control" id="inputEmail4" placeholder='Enter number of classes'/>
  </div>
  <div class="col-md-4">
    <label for="inputEmail4" class="form-label">Daily Session</label>
    <input type="text" class="form-control" id="inputEmail4" placeholder='Enter session'/>
  </div>
  </div>
  <div className='course-row'>
  <div class="col-md-4">
    <label for="inputEmail4" class="form-label">Live Training hours</label>
    <input type="text" class="form-control" id="inputEmail4" placeholder='Enter Hours'/>
  </div>
  <div class="col-md-4">
    <label for="inputEmail4" class="form-label">Lab Exercise Hours</label>
    <input type="text" class="form-control" id="inputEmail4" placeholder='Enter Hours'/>
  </div>
  <div class="col-md-4">
    <label for="inputEmail4" class="form-label">Real Time Projects</label>
    <input type="text" class="form-control" id="inputEmail4" placeholder='Enter projects'/>
  </div>
  </div>
  <div className='course-row'>
  <div class="col-md-4">
    <label for="inputEmail4" class="form-label">Star Rating</label>
    <input type="text" class="form-control" id="inputEmail4" placeholder='Enter Rating'/>
  </div>
  <div class="col-md-4">
    <label for="inputEmail4" class="form-label">Rating by No. of People</label>
    <input type="text" class="form-control" id="inputEmail4" placeholder='Enter number of people'/>
  </div>
  <div class="col-md-4">
    <label for="inputEmail4" class="form-label">Total Enrollment</label>
    <input type="text" class="form-control" id="inputEmail4" placeholder='Enter No. Of Enrollment'/>
  </div>
  </div>
</div>
<div className='course-details'>
  <h3>Key Highlights</h3>
  <div className='course-row'>
  <div class="col-md-4">
    <label for="inputEmail4" class="form-label">Key Highlights 1</label>
    <input type="text" class="form-control" id="inputEmail4" />
  </div>
  <div class="col-md-4">
    <label for="inputEmail4" class="form-label">Key Highlights 2</label>
    <input type="text" class="form-control" id="inputEmail4" />
  </div>
  <div class="col-md-4">
    <label for="inputEmail4" class="form-label">Key Highlights 3</label>
    <input type="text" class="form-control" id="inputEmail4" />
  </div>
  </div>
  <div className='course-row'>
  <div class="col-md-4">
    <label for="inputEmail4" class="form-label">Key Highlights 4</label>
    <input type="text" class="form-control" id="inputEmail4" />
  </div>
  <div class="col-md-4">
    <label for="inputEmail4" class="form-label">Key Highlights 5</label>
    <input type="text" class="form-control" id="inputEmail4" />
  </div>
  <div class="col-md-4">
    <label for="inputEmail4" class="form-label">Key Highlights 6</label>
    <input type="text" class="form-control" id="inputEmail4" />
  </div>
  </div>
</div>
<h3>Mode Of Training</h3>
<div className='course-row'>
<div className='course-details'>
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
  <label class="form-check-label" for="flexCheckDefault">
    Live Training
  </label>
</div>
<div class="col-md-4">
    <label for="inputEmail4" class="form-label">Amount(INR)</label>
    <input type="number" class="form-control" id="inputEmail4" />
  </div>
  <div class="col-md-4">
    <label for="inputEmail4" class="form-label">Discount%</label>
    <input type="number" class="form-control" id="inputEmail4" />
  </div>
  <div class="col-md-4">
    <label for="inputEmail4" class="form-label">Total(INR)</label>
    <input type="number" class="form-control" id="inputEmail4" />
  </div>
</div>
<div className='course-details'>
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
  <label class="form-check-label" for="flexCheckDefault">
    Mentoring Mode
  </label>
</div>
<div class="col-md-3">
    <label for="inputEmail4" class="form-label">Amount(INR)</label>
    <input type="number" class="form-control" id="inputEmail4" />
  </div>
  <div class="col-md-3">
    <label for="inputEmail4" class="form-label">Discount%</label>
    <input type="number" class="form-control" id="inputEmail4" />
  </div>
  <div class="col-md-3">
    <label for="inputEmail4" class="form-label">Total(INR)</label>
    <input type="number" class="form-control" id="inputEmail4" />
  </div>
</div>
<div className='course-details'>
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
  <label class="form-check-label" for="flexCheckDefault">
 Self Placed Training
  </label>
</div>
<div class="col-md-3">
    <label for="inputEmail4" class="form-label">Amount(INR)</label>
    <input type="number" class="form-control" id="inputEmail4" />
  </div>
  <div class="col-md-3">
    <label for="inputEmail4" class="form-label">Discount%</label>
    <input type="number" class="form-control" id="inputEmail4" />
  </div>
  <div class="col-md-3">
    <label for="inputEmail4" class="form-label">Total(INR)</label>
    <input type="number" class="form-control" id="inputEmail4" />
  </div>
</div>

</div>
<div className='course-details'>
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
  <label class="form-check-label" for="flexCheckDefault">
 Self Placed Training
  </label>
</div>
<div class="col-md-3">
    <label for="inputEmail4" class="form-label">Amount(INR)</label>
    <input type="number" class="form-control" id="inputEmail4" />
  </div>
  <div class="col-md-3">
    <label for="inputEmail4" class="form-label">Discount%</label>
    <input type="number" class="form-control" id="inputEmail4" />
  </div>
  <div class="col-md-3">
    <label for="inputEmail4" class="form-label">Total(INR)</label>
    <input type="number" class="form-control" id="inputEmail4" />
  </div>
</div>

</div>
<h3>Sample session</h3>
<div className='course-row'>
<div className='course-details'>
  <h4>Mentoring Training</h4>
  <div className='course-col'>
  <div class="col-sm-3">
    <label for="inputEmail4" class="form-label">Day 1</label>
    <input type="number" class="form-control" id="inputEmail4" />
  </div>
  <div class="col-sm-3">
    <label for="inputEmail4" class="form-label">Day 2</label>
    <input type="number" class="form-control" id="inputEmail4" />
  </div>
  </div>
  
  </div>
  <div className='course-details'>
  <h4>Mentoring Training</h4>
  <div className='course-col'>
  <div class="col-md-4">
    <label for="inputEmail4" class="form-label">Day 1</label>
    <input type="text" class="form-control" id="inputEmail4" />
  </div>
  <div class="col-md-4">
    <label for="inputEmail4" class="form-label">Day 2</label>
    <input type="text" class="form-control" id="inputEmail4" />
  </div>
  </div>
  
  </div>
</div>
<div className='course-row'>
<div class="col-md-4">
    <label for="inputEmail4" class="form-label">Header Title</label>
    <input type="text" class="form-control" id="inputEmail4" />
  </div>
  <div class="col-md-4">
    <label for="inputEmail4" class="form-label">Course keyword with comma</label>
    <input type="text" class="form-control" id="inputEmail4" />
  </div>
  <div class="col-md-4">
    <label for="inputEmail4" class="form-label">Course keyword description</label>
    <input type="text" class="form-control" id="inputEmail4" />
  </div>
  </div>
  <div class="mb-3">
  <label for="exampleFormControlTextarea1" class="form-label">Course Highlight(Only add 4 Lines)</label>
  <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
</div>
<div class="mb-3">
  <label for="exampleFormControlTextarea1" class="form-label">Course Description</label>
  <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
</div>

</div>
<div style={{display:'flex',flexDirection:'row'}}> 
  <button className='submit-btn'>Submit</button>
  <button className='reset-btn'>Reset</button>
  </div>
</div>
</div>
    </>
  )
}

export default AddCourseDetails