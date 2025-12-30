import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import SidebarRight from './components/SidebarRight';
import Pagination from '../Common/Pagination';
import './Course.css';
import { Helmet } from 'react-helmet-async';
import TrendingCourseNames from './components/TrendingCourseNames';
import InstructorProfile from './components/InstructorProfile';

const Course = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [selectedCategoryFromParent, setSelectedCategoryFromParent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filters, setFilters] = useState({ 
    categories: [], 
    levels: [], 
    price: [] 
  });
  const [isInitialized, setIsInitialized] = useState(false);
  
  const bannerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(9);
  const [totalCards, setTotalCards] = useState(0);

  // ✅ SINGLE SOURCE OF TRUTH: Initialize category from URL
useEffect(() => {
  const categoryFromUrl = searchParams.get("category");

  if (categoryFromUrl) {
    const decoded = decodeURIComponent(categoryFromUrl);
    console.log("✅ Course.jsx picked category:", decoded);
    setSelectedCategoryFromParent(decoded);
  } else {
    setSelectedCategoryFromParent(null);
  }
}, [searchParams]);


  const handleFilterChange = (updatedFilters) => {
    const normalized = {
      categories: Array.isArray(updatedFilters?.categories) ? updatedFilters.categories : [],
      levels: Array.isArray(updatedFilters?.levels) ? updatedFilters.levels : [],
      price: Array.isArray(updatedFilters?.price) ? updatedFilters.price : [],
    };
    
    // Update selectedCategory based on filter changes
    if (normalized.categories.length > 0) {
      setSelectedCategory(normalized.categories[0]);
    } else {
      setSelectedCategory('All');
    }
    
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        <div ref={bannerRef} className="course-content container">
          <Sidebar
            onFilterChange={handleFilterChange}
            selectedCategoryFromParent={selectedCategoryFromParent}
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
      </div>
    </>
  );
};

export default Course;