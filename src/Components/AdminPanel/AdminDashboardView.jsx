import React, { useState } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import TrendingCourseTable from './TrendingCourseTable';
import Trainer from './Trainer';
import Certificate from './Certificate';
import Enroll from './Enroll';
import Registration from './Registration';
import ScheduleRequest from './ScheduleRequest';
import Blogs from './Blogs';
import Support from './Support';
import Course from './Course';
import Reports from './Reports';
import Other from './Other';
import CourseCategory from './CourseCategory';
import CorporateCourses from './CorporateCourses';
import Payments from './Payments';
import Tracking from './Tracking';
import AdminSummerEvents from './AdminSummerEvents';
import Jobs from './Jobs';
import StudentInterests from './StudentInterests';
import AdminUploadImage from './AdminUploadImage';
import AdminDiscount from './AdminDiscount';
import GeneralFaq from './GeneralFaq';
import Employees from './Employees';
const componentMap = {
  'Dashboard': <AdminDashboard />,
  'Course Category': <CourseCategory />,
  'Course': <Course />,
  'Corporate Training': <CorporateCourses />,
  'Trending Courses': <TrendingCourseTable />,
  'Kids Courses': <AdminSummerEvents />,
  'Trainer': <Trainer />,
  'Jobs': <Jobs />,
  'Certificates': <Certificate />,
  'Enrollments': <Enroll />,
  'Payments': <Payments />,
  'Registration': <Registration />,
  'Tracking': <Tracking />,
  'Student Interests': <StudentInterests />,
  'Reports': <Reports />,
  'Schedule Request': <ScheduleRequest />,
  'Blog': <Blogs />,
  'General FAQ': <GeneralFaq />,
  'Upload Images': <AdminUploadImage />,
  'Other': <Other />,
  'Discount Courses': <AdminDiscount />,
  'Employees': <Employees />,
  'Support': <Support />,
};
const AdminDashboardView = () => {
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return localStorage.getItem('selectedCategory') || 'Dashboard';
  });

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    localStorage.setItem('selectedCategory', category);
  };

  return (
    <React.Fragment>
      <AdminNavbar />
      <div className="admin-layout">
        <AdminSidebar onSelectCategory={handleSelectCategory} />
        <div className='admin-right'>
          {componentMap[selectedCategory] || <AdminDashboard />}
        </div>
      </div>
    </React.Fragment>
  );
};

export default AdminDashboardView;