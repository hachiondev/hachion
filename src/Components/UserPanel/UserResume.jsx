import React from 'react';
import './Dashboard.css';
import MenuItem from '@mui/material/MenuItem';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { HiOutlineDownload } from "react-icons/hi";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const UserResume = () => {
    const [course, setCourse] = React.useState('');

    const handleChange = (event) => {
      setCourse(event.target.value);
    };
  return (<>
    <div className='courses-enrolled'>
    <nav className='dashboard-nav'>
      Download Resume</nav>
    </div>
    <div className='resume'>
        <div className='resume-div-top'>
        <p>Course Name</p>
    <div>
 
      <FormControl sx={{ m: 1, minWidth: 250 }} className="select-menu">
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
          <MenuItem value={30}>QA Manual Testing</MenuItem>
          <MenuItem value={40}>Mobile App Testing</MenuItem>
        </Select>
      </FormControl>
    </div>
    <button className='resume-download-btn'> <HiOutlineDownload style={{color:'white'}}/>Download</button>
    </div>
    <div className='formgroup-checkbox'>
    <FormGroup>
      <FormControlLabel control={<Checkbox />} label="Junior Level Position Resume" classes={{ label: 'custom-label' }}/>
      <FormControlLabel control={<Checkbox />} label="Middle Level Position Resume" classes={{ label: 'custom-label' }}/>
      <FormControlLabel control={<Checkbox />} label="Senior Level Position Resume" classes={{ label: 'custom-label' }}/>
    </FormGroup>
    </div>
    </div>
    </> 
    )
}

export default UserResume