import { LocalizationProvider } from '@mui/x-date-pickers'
import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { IoIosArrowForward } from 'react-icons/io';

const AddTrendingCourse = () => {
    const [course, setCourse] = React.useState('');

    const handleChange = (event) => {
      setCourse(event.target.value);
    };
  
  return (
   <>
   <LocalizationProvider>
    <AdminNavbar />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      
        <AdminSidebar />
        <div style={{ flexGrow: 1, padding: '20px' }}>
        
      
  <div className='course-category'>
<p>View Trending Courses <IoIosArrowForward/> Add Trending Courses </p>
<div className='category'>
<div className='category-header'>
<p>Add Trending Courses</p>
</div>

  <FormControl sx={{ m: 1, minWidth: 120 }}>
    <label>Course Name</label>
        <Select
          value={course}
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value="">
            <em>Select Course</em>
          </MenuItem>
          <MenuItem value={10}>Qa Automation</MenuItem>
          <MenuItem value={20}>Load Runner</MenuItem>
          <MenuItem value={30}>Qa Manual Testing</MenuItem>
          <MenuItem value={30}>Mobile AppTesting Testing</MenuItem>
        </Select>
        <label>status:</label>
        <FormControlLabel control={<Switch defaultChecked />} label="Disable" />
        <div style={{display:'flex',flexDirection:'row'}}> 
  <button className='submit-btn'>Submit</button>
  <button className='reset-btn'>Reset</button>
  </div>
      </FormControl>
  </div>
  </div>
</div>
</div>


 
  </LocalizationProvider>
   
   </>
  )
}

export default AddTrendingCourse
