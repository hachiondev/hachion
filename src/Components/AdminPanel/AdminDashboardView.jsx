import React, { useState } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard'; // Default or dashboard component
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

import Other from './Other';
import ManageCategories from './ManageCategories';


const AdminDashboardView = () => {
  const [selectedCategory, setSelectedCategory] = useState('Dashboard');

  const [showAddCategory, setShowAddCategory] = useState(false);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowAddCategory(false);
   
  };

  const handleAddCategoryClick = () => {
    setShowAddCategory(true);
  };

  const renderContent = () => {
    if (showAddCategory) {
      return <AddCourseCategory  />; // Pass onSelectCategory
    }



    switch (selectedCategory) {
      case 'Dashboard':
        return <AdminDashboard />;
      case 'Course Category':
        return <ManageCategories onAddCategoryClick={handleAddCategoryClick} />;
   
        case 'Trending Courses':
        
        return <TrendingCourseTable/>
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
      <AdminNavbar />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <AdminSidebar onSelectCategory={handleCategorySelect} /> {/* Sidebar with onSelectCategory prop */}
        <div className='admin-right'>
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default AdminDashboardView;
