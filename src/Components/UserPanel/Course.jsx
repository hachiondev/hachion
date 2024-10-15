import React, { useState, useEffect, useRef } from 'react';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import Sidebar from './Sidebar';
import './Course.css';
import Footer from './Footer';
import SidebarRight from './SidebarRight';
import Pagination from './Pagination';
import StickyBar from './StickyBar';

const Course = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const bannerRef = useRef(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (bannerRef.current) {
      const bannerHeight = bannerRef.current.clientHeight;
      window.scrollTo(0, 400); // Scroll to just below the banner
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);  
  }, []);

  return (
    <>
      <div className='course-top'>
        <Topbar />
        <NavbarTop />
        <div className='course-banner' ref={bannerRef}>
          <h3 className='course-banner-content'>Courses</h3>
        </div>
        <div className='sidebar-top'>
          <Sidebar onSelectCategory={handleCategorySelect} />
          <div className='sidebar-right'>
            <SidebarRight category={selectedCategory} />
            {selectedCategory === 'All' ? <Pagination /> : null}
          </div>
        </div>
        <Footer />
        <StickyBar />
      </div>
    </>
  );
};

export default Course;