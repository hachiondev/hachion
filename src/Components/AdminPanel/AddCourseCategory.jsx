// AddCourseCategory.js
import React, { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PropTypes from 'prop-types';

const AddCourseCategory = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="course-category">
        <p>View Course Category list &gt; Add Category</p>
        {/* <button className="back-btn" onClick={onBack}>Back</button> */}
        <div className="category">
          <div className="category-header">
            <p>Add Category</p>
          </div>
          <div className="date-schedule" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="mb-3">
              <label htmlFor="categoryName" className="form-label">Category Name</label>
              <input type="text" className="form-control" id="categoryName" placeholder="Enter Category name" />
            </div>
            <div className="mb-3">
              Date <br />
              <DatePicker />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <button className="submit-btn">Submit</button>
              <button className="reset-btn">Reset</button>
            </div>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

AddCourseCategory.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default AddCourseCategory;
