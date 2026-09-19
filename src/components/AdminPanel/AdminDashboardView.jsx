'use client';

import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import AdminNavbar from '@/components/dashboard/AdminNavbar';
import AdminSidebar from './AdminSidebar';

// Each admin tab is its own chunk, fetched only when that tab is actually
// selected — previously every tab's component (including the heavy
// react-quill editor pulled in by Blogs) was imported eagerly here
// regardless of which single tab an admin was viewing.
const AdminDashboard = lazy(() => import('./AdminDashboard'));
const TrendingCourseTable = lazy(() => import('./TrendingCourseTable'));
const Trainer = lazy(() => import('./Trainer'));
const Certificate = lazy(() => import('./Certificate'));
const Enroll = lazy(() => import('./Enroll'));
const Registration = lazy(() => import('./Registration'));
const ScheduleRequest = lazy(() => import('./ScheduleRequest'));
const Blogs = lazy(() => import('./Blogs'));
const Support = lazy(() => import('./Support'));
const Course = lazy(() => import('./Course'));
const Reports = lazy(() => import('./Reports'));
const Other = lazy(() => import('./Other'));
const CourseCategory = lazy(() => import('./CourseCategory'));
const CorporateCourses = lazy(() => import('./CorporateCourses'));
const Payments = lazy(() => import('./Payments'));
const Tracking = lazy(() => import('./Tracking'));
const AdminSummerEvents = lazy(() => import('./AdminSummerEvents'));
const Jobs = lazy(() => import('./Jobs'));
const StudentInterests = lazy(() => import('./StudentInterests'));
const AdminUploadImage = lazy(() => import('./AdminUploadImage'));
const AdminDiscount = lazy(() => import('./AdminDiscount'));
const GeneralFaq = lazy(() => import('./GeneralFaq'));
const Interview = lazy(() => import('./Interview'));
const EmployeesPage = lazy(() => import('./Employee/EmployeesPage'));
const EmailAutomation = lazy(() => import('./EmailAutomation/EmailAutomation'));

const componentMap = {
  'Dashboard': AdminDashboard,
  'Course Category': CourseCategory,
  'Course': Course,
  'Corporate Training': CorporateCourses,
  'Trending Courses': TrendingCourseTable,
  'Kids Courses': AdminSummerEvents,
  'Trainer': Trainer,
  'Jobs': Jobs,
  'Certificates': Certificate,
  'Enrollments': Enroll,
  'Payments': Payments,
  'Registration': Registration,
  'Tracking': Tracking,
  'Student Interests': StudentInterests,
  'Reports': Reports,
  'Schedule Request': ScheduleRequest,
  'Blog': Blogs,
  'General FAQ': GeneralFaq,
  'Upload Images': AdminUploadImage,
  'Other': Other,
  'Discount Courses': AdminDiscount,
  'Employees': EmployeesPage,
  'Support': Support,
  'Interview': Interview,
  'Email Automation': EmailAutomation,
};
const AdminDashboardView = () => {
  const [selectedCategory, setSelectedCategory] = useState('Dashboard');

  useEffect(() => {
    const stored = localStorage.getItem('selectedCategory');
    if (stored) setSelectedCategory(stored);
  }, []);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    localStorage.setItem('selectedCategory', category);
  };

  const SelectedComponent = useMemo(
    () => componentMap[selectedCategory] || AdminDashboard,
    [selectedCategory]
  );

  return (
    <React.Fragment>
      <AdminNavbar />
      <div className="admin-layout">
        <AdminSidebar onSelectCategory={handleSelectCategory} />
        <div className='admin-right'>
          <Suspense fallback={null}>
            <SelectedComponent />
          </Suspense>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AdminDashboardView;
