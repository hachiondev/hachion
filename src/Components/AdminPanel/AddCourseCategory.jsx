// AddCourseCategory.js
import React,{useState} from 'react';
import './Admin.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import CategoryTable from './CategoryTable';
import TrendingCourseTable from './TrendingCourseTable';
import Trainer from './Trainer';
import Certificate from './Certificate';
import Enroll from './Enroll';
import Registration from './Registration';
import ScheduleRequest from './ScheduleRequest';
import Blogs from './Blogs';
import Support from './Support';
import Course from './Course';
import Other from './Other';

const AddCourseCategory = () => { 
  const [selectedCategory, setSelectedCategory] = useState('Dashboard');
  const [showAddCategory, setShowAddCategory] = useState(false);
   const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowAddCategory(false); // Reset Add Category view when changing categories
  };

  const handleAddCategoryClick = () => {
    setShowAddCategory(true);
  };

  // Render the correct component based on `selectedCategory` and `showAddCategory`
  const renderContent = () => {
    if (showAddCategory) {
      return <AddCourseCategory onSelectCategory={handleCategorySelect} />;
    }

    switch (selectedCategory) {
      case 'Dashboard':
        return <AdminDashboard />;
      case 'Course Category':
        return <CategoryTable onAddCategoryClick={handleAddCategoryClick} />;
      case 'Trending Courses':
        return <TrendingCourseTable />;
      case 'Trainer':
        return <Trainer />;
      case 'Certificate':
        return <Certificate />;
      case 'All Enroll':
        return <Enroll />;
      case 'Registration':
        return <Registration />;
      case 'Schedule Request':
        return <ScheduleRequest />;
      case 'Blog':
        return <Blogs />;
      case 'Support':
        return <Support />;
      case 'Course':
        return <Course />;
      case 'Other':
        return <Other />;
      default:
        return <AdminDashboard />;
    }
  };
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AdminNavbar />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <AdminSidebar onSelectCategory={handleCategorySelect} /> {/* Sidebar with onSelectCategory */}
          <div style={{ flexGrow: 1, padding: '20px' }}>
            <div className="course-category">
              <p>View Course Category list &gt; Add Category</p>
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
          </div>
        </div>
      </LocalizationProvider>
    </>
  );
};

export default AddCourseCategory;
