import React, { useState, useEffect, useRef } from 'react';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import Sidebar from './Sidebar';
import SidebarRight from './SidebarRight';
import Pagination from './Pagination';
import Footer from './Footer';
import StickyBar from './StickyBar';
import './Course.css';
import { Helmet } from 'react-helmet-async';
import TrendingCourseNames from './TrendingCourseNames';
import InstructorProfile from './InstructorProfile';

const Course = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [filters, setFilters] = useState({ categories: [], levels: [], price: [] });

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

  const handleFilterChange = (updatedFilters) => {
  const normalized = {
    categories: Array.isArray(updatedFilters?.categories) ? updatedFilters.categories : [],
    levels: Array.isArray(updatedFilters?.levels) ? updatedFilters.levels : [],
    price: Array.isArray(updatedFilters?.price) ? updatedFilters.price : [],
  };
  setFilters(normalized);
  setCurrentPage(1);
};


  const updateTotalCards = (total) => {
    setTotalCards(total);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const updateCardsPerPage = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setCardsPerPage(4);
      } else if (width <= 1024) {
        setCardsPerPage(6);
      } else if (width <= 1366) {
        setCardsPerPage(9);
      } else {
        setCardsPerPage(9);
      }
    };

    updateCardsPerPage();
    window.addEventListener('resize', updateCardsPerPage);
    return () => window.removeEventListener('resize', updateCardsPerPage);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, window.scrollY);
  };

  return (
    <>
      <Helmet>
        <title>Best Online IT Certification Courses & Programs | Hachion</title>
        <meta
          name="description"
          content="Transform your career with Hachion's online IT courses! Enroll now, earn a certificate, get job assistance & try our FREE demo! Join today!"
        />
      </Helmet>

      <div className="course-top">
        <Topbar />
        <NavbarTop />

        <div className="course-content container">
          <Sidebar
            onSelectCategory={handleCategorySelect}
            onFilterChange={handleFilterChange}
          />

          <div className="sidebar-right-container">
            <SidebarRight
              category={selectedCategory}
              filters={filters}
              currentPage={currentPage}
              cardsPerPage={cardsPerPage}
              onTotalCardsChange={updateTotalCards}
            />

            <div className="pagination-container">
              <Pagination
                currentPage={currentPage}
                totalCards={totalCards}
                cardsPerPage={cardsPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
        <TrendingCourseNames />
        <InstructorProfile />
        <Footer />
        <StickyBar />
      </div>
    </>
  );
};

export default Course;
