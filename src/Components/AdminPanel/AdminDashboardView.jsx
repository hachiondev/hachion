import React, { useState } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard'; // Default or dashboard component
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
import AddCourseCategory from './AddCourseCategory';
import AddTrendingCourse from './AddTrendingCourse';
import Other from './Other';

const AdminDashboardView = () => {
  const [selectedCategory, setSelectedCategory] = useState('Dashboard');
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  // Function to handle category selection from sidebar
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowAddCategory(false);
    setShowAddCourse(false);
  };

  const handleAddCategoryClick = () => {
    setShowAddCategory(true); // Show the AddCourseCategory component
  };

  const handleAddTrendingCourseClick = () => {
    setShowAddCourse(true);
  };

  const renderContent = () => {
    if (showAddCategory) {
      return <AddCourseCategory />; // If the "Add" button is clicked, show this component
    }
    if (showAddCourse) {
      return <AddTrendingCourse />;
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
          return <Other/>
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <>
      <AdminNavbar />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {/* Ensure onSelectCategory is passed */}
        <AdminSidebar onSelectCategory={handleCategorySelect} />
        <div className='admin-right'>
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default AdminDashboardView;

