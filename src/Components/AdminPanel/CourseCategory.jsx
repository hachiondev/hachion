import React from 'react';
import './Admin.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IoSearch } from "react-icons/io5";
import { FiPlus } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const CourseCategory = ({
  pageTitle = "Course Category",
  headerTitle = "View Course Category List", 
  buttonLabel = "Add Category", 
  onAdd,
  onAddCategoryClick,
  children
}) => 
  
  {
    const navigate=useNavigate()
  const handleAdd = () => {
   
    if (onAdd) {
      onAdd();
    } else if (onAddCategoryClick) {
      onAddCategoryClick();
    } else {
     navigate('/addcourse')
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='course-category'>
        <p>{pageTitle}</p>
        <div className='category'>
          <div className='category-header'>
            <p>{headerTitle}</p>
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
                  {/* Other entries */}
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
                <FiPlus /> {buttonLabel}
              </button>
            </div>
          </div>
          {children}
        </div>
      </div>
    </LocalizationProvider>
  );
};

CourseCategory.propTypes = {
  pageTitle: PropTypes.string,
  headerTitle: PropTypes.string,
  buttonLabel: PropTypes.string,
  onAddCategoryClick: PropTypes.func,
  children: PropTypes.node,
};

export default CourseCategory;
