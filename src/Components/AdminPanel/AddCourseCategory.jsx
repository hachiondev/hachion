import React from 'react';
import './Admin.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IoIosArrowForward } from "react-icons/io";
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
const AddCourseCategory = ({ onSelectCategory }) => {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AdminNavbar />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {/* Pass onSelectCategory to AdminSidebar */}
          <AdminSidebar onSelectCategory={onSelectCategory} />
          <div style={{ flexGrow: 1, padding: '20px' }}>
            <div className="course-category">
              <p>View Course Category list <IoIosArrowForward /> Add Category </p>
              <div className="category">
                <div className="category-header">
                  <p>Add Category</p>
                </div>
                <div className="date-schedule" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="mb-3">
                    <label htmlFor="exampleFormControlInput1" className="form-label">Category Name</label>
                    <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Enter Category name" />
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
          </div>
        </div>
      </LocalizationProvider>
    </>
  );
};

export default AddCourseCategory;