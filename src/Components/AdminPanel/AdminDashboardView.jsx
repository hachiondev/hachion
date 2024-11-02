import React, { useState } from 'react';
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
import AddCourseCategory from './AddCourseCategory';
import Other from './Other';

const AdminDashboardView = () => {
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
      <AdminNavbar />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <AdminSidebar onSelectCategory={handleCategorySelect} />
        <div className='admin-right'>
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default AdminDashboardView;
