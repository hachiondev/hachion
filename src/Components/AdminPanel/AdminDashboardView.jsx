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
const componentMap = {
  'Dashboard': <AdminDashboard />,
  'Course Category': <CourseCategory />,
  'Course': <Course />,
  'Corporate Training': <CorporateCourses />,
  'Trending Courses': <TrendingCourseTable />,
  'Trainer': <Trainer />,
  'Certificates': <Certificate />,
  'Enrollments': <Enroll />,
  'Payments': <Payments />,
  'Registration': <Registration />,
  'Reports': <Reports />,
  'Schedule Request': <ScheduleRequest />,
  'Blog': <Blogs />,
  'Support': <Support />,
  'Other': <Other />,
};
const AdminDashboardView = () => {
  const [selectedCategory, setSelectedCategory] = useState('Dashboard');
  return (
    <React.Fragment>
      <AdminNavbar />
      <div className="admin-layout">
        <AdminSidebar onSelectCategory={setSelectedCategory} />
        <div className='admin-right'>
          {componentMap[selectedCategory] || <AdminDashboard />}
        </div>
      </div>
    </React.Fragment>
  );
};
export default AdminDashboardView;