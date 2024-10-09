import React from 'react';
import './Admin.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IoSearch } from "react-icons/io5";
import { FiPlus } from 'react-icons/fi';

import { useNavigate } from 'react-router-dom';

const CourseCategory = ({
  pageTitle = "Course Category",
  headerTitle = "View Course Category List", 
  buttonLabel = "Add Category", 
  onAdd,
  children 
}) => {
  const navigate = useNavigate();


  const handleAdd = () => {
    if (onAdd) {
      onAdd();
    } else {
      navigate('/addcourse');
    }
  }
  

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className='course-category'>
          <p>{pageTitle}</p> {/* Dynamic page title */}
          <div className='category'>
            <div className='category-header'>
              <p>{headerTitle}</p> {/* Dynamic header title */}
            </div>
            <div className='date-schedule'>
              Start Date
              <DatePicker />
              End Date
              <DatePicker />
              <button className='filter'>filter</button>
            </div>
            <div className='entries'>
              <div className='entries-left'>
                <p>Show</p>
                <div className="btn-group">
                  <button type="button" className="btn-number dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    10
                  </button>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">1</a></li>
                    <li><a className="dropdown-item" href="#">2</a></li>
                    <li><a className="dropdown-item" href="#">3</a></li>
                    <li><a className="dropdown-item" href="#">4</a></li>
                    <li><a className="dropdown-item" href="#">5</a></li>
                    <li><a className="dropdown-item" href="#">6</a></li>
                    <li><a className="dropdown-item" href="#">7</a></li>
                    <li><a className="dropdown-item" href="#">8</a></li>
                    <li><a className="dropdown-item" href="#">9</a></li>
                  </ul>
                </div>
                <p>entries</p>
              </div>
              <div className='entries-right'>
                <div className="search-div" role="search" style={{ border: '1px solid #d3d3d3' }}>
                  <input className="search-input" type="search" placeholder="Enter Courses, Category or Keywords" aria-label="Search" />
                  <button className="btn-search" type="submit"><IoSearch style={{ fontSize: '2rem' }} /></button>
                </div>
                <button type="button" className="btn-category" onClick={handleAdd}>
                  <FiPlus /> {buttonLabel} {/* Dynamic button label */}
                </button>
              </div>
            </div>
            {children}
            {/* <CategoryTable /> */}
          </div>
        </div>
      </LocalizationProvider>
    </>
  );
};

export default CourseCategory;
