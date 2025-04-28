import React, { useState, useEffect, useRef } from 'react';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import Sidebar from './Sidebar';
import SidebarRight, { getTotalCards } from './SidebarRight';
import Pagination from './Pagination'; 
import Footer from './Footer';
import StickyBar from './StickyBar';
import './Course.css';
import { Helmet } from 'react-helmet-async';


const Course = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const bannerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(9);
  const [totalCards, setTotalCards] = useState(0);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    if (bannerRef.current) {
      window.scrollTo(0, 400); 
    }
  };

  const updateTotalCards = (total) => {
    setTotalCards(total);
  };

  useEffect(() => {
    window.scrollTo(0, 0);  
    
    // Set cards per page based on window size
    const updateCardsPerPage = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setCardsPerPage(4); // Mobile view
      }
      else if (width <= 1024) {
        setCardsPerPage(6); // Smaller tablet view
      }
      else if (width <= 1366) {
        setCardsPerPage(8); // Larger tablet view
      } else {
        setCardsPerPage(9); // Desktop view
      }
    };

    // Update cards per page initially
    updateCardsPerPage();

    // Add event listener for window resize
    window.addEventListener('resize', updateCardsPerPage);
    
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', updateCardsPerPage);
    };
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, window.scrollY);
  };
  
  return (
    <>
      <Helmet>
      <title>Explore Our Wide Range of Courses - Hachion</title>
      <meta name="description" content="Explore top-notch courses on various subjects. Find the best programs for your skill growth at Hachion." />
      <meta name="keywords" content="IT certification programs, Best IT courses with placements, IT Career Growth courses, IT Training with Job Support" />
      <meta property="og:title" content="Best Online IT Certification Courses & Programs - Hachion" />
      <meta property="og:description" content="Transform your career with Hachion's Online IT Courses. Enroll now, earn a certificate
      ,get job assistance & try our free demo! Join Today!" />
      <meta property="og:image" content="https://hachion.co/images/course-banner.jpg" />
      <meta property="og:url" content="https://hachion.co/CourseDetails" />
      <meta name="robots" content="index, follow" />
    </Helmet>
      <div className='course-top'>
        <Topbar />
        <NavbarTop />
     
        <div>
          <h3 className='course-banner-content'>Courses</h3>
        </div>
        <div className='course-content'>
          
          <Sidebar onSelectCategory={handleCategorySelect} />
          <div className='sidebar-right-container'>
          <meta name="description" content={`Discover ${selectedCategory} courses designed to enhance your skills and career.`} />
         
            <SidebarRight
              category={selectedCategory}
              currentPage={currentPage}
              cardsPerPage={cardsPerPage}
              onTotalCardsChange={updateTotalCards}
            />
            {/* Pagination component */}
            <div className='pagination-container'>
            <Pagination
              currentPage={currentPage}
              totalCards={totalCards} // Total number of cards in the selected category
              cardsPerPage={cardsPerPage}
              onPageChange={handlePageChange} // Custom handler for page change
            />
            </div>
          </div>
        </div>
        <Footer />
        <StickyBar />
      </div>
    </>
  );
};

export default Course;