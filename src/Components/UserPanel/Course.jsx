// import React, { useState, useEffect, useRef } from 'react';
// import Topbar from './Topbar';
// import NavbarTop from './NavbarTop';
// import Sidebar from './Sidebar';
// import SidebarRight, { getTotalCards } from './SidebarRight';
// import Pagination from './Pagination'; 
// import Footer from './Footer';
// import StickyBar from './StickyBar';
// import './Course.css';
// import { Helmet } from 'react-helmet-async';


// const Course = () => {
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const bannerRef = useRef(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [cardsPerPage, setCardsPerPage] = useState(9);
//   const [totalCards, setTotalCards] = useState(0);

//   const handleCategorySelect = (category) => {
//     setSelectedCategory(category);
//     setCurrentPage(1);
//     if (bannerRef.current) {
//       window.scrollTo(0, 400); 
//     }
//   };

//   const updateTotalCards = (total) => {
//     setTotalCards(total);
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);  
    
//     // Set cards per page based on window size
//     const updateCardsPerPage = () => {
//       const width = window.innerWidth;
//       if (width <= 768) {
//         setCardsPerPage(4); // Mobile view
//       }
//       else if (width <= 1024) {
//         setCardsPerPage(6); // Smaller tablet view
//       }
//       else if (width <= 1366) {
//         setCardsPerPage(8); // Larger tablet view
//       } else {
//         setCardsPerPage(9); // Desktop view
//       }
//     };

//     // Update cards per page initially
//     updateCardsPerPage();

//     // Add event listener for window resize
//     window.addEventListener('resize', updateCardsPerPage);
    
//     // Cleanup event listener on component unmount
//     return () => {
//       window.removeEventListener('resize', updateCardsPerPage);
//     };
//   }, []);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     window.scrollTo(0, window.scrollY);
//   };
  
//   return (
//     <>
//       <Helmet>
//   <title>Best Online IT Certification Courses & Programs | Hachion</title>
//   <meta
//     name="description"
//     content="Transform your career with Hachion's online IT courses! Enroll now, earn a certificate, get job assistance & try our FREE demo! Join today!"
//   />
//   <meta
//     name="keywords"
//     content="IT certification programs, Best IT courses with placements, IT Career Growth courses, IT Training with Job Support"
//   />
//   <meta
//     property="og:title"
//     content="Best Online IT Certification Courses & Programs - Hachion"
//   />
//   <meta
//     property="og:description"
//     content="Transform your career with Hachion's Online IT Courses. Enroll now, earn a certificate, get job assistance & try our free demo! Join Today!"
//   />
//   <meta
//     property="og:image"
//     content="https://hachion.co/images/course-banner.jpg"
//   />
//   <meta
//     property="og:url"
//     content="https://www.hachion.co/coursedetails"
//   />
//   <meta name="robots" content="index, follow" />
//   <link rel="canonical" href="https://www.hachion.co/coursedetails" />

//   <script type="application/ld+json">
//     {JSON.stringify({
//       "@context": "https://schema.org",
//       "@type": "Course",
//       "name": "Hachion Online IT Courses",
//       "description": "Explore trending IT courses with placement support, expert trainers, and real-time projects. Join Hachion to upgrade your career.",
//       "provider": {
//         "@type": "Organization",
//         "name": "Hachion",
//         "url": "https://www.hachion.co",
//         "sameAs": [
//               "https://www.facebook.com/hachion.co",
//               "https://x.com/hachion_co",
//               "https://www.linkedin.com/company/hachion",
//               "https://www.instagram.com/hachion_trainings",
//               "https://www.quora.com/profile/Hachion-4",
//               "https://www.youtube.com/@hachion"
//             ]
        
//       }
//     })}
//   </script>
// </Helmet>
//       <div className='course-top'>
//         <Topbar />
//         <NavbarTop />
     
//         <div className='course-content container'>
          
//           <Sidebar onSelectCategory={handleCategorySelect} />
//           <div className='sidebar-right-container'>
//           <meta name="description" content={`Discover ${selectedCategory} courses designed to enhance your skills and career.`} />
         
//             <SidebarRight
//               category={selectedCategory}
//               currentPage={currentPage}
//               cardsPerPage={cardsPerPage}
//               onTotalCardsChange={updateTotalCards}
//             />
//             {/* Pagination component */}
//             <div className='pagination-container'>
//             <Pagination
//               currentPage={currentPage}
//               totalCards={totalCards} // Total number of cards in the selected category
//               cardsPerPage={cardsPerPage}
//               onPageChange={handlePageChange} // Custom handler for page change
//             />
//             </div>
//           </div>
//         </div>
//         <Footer />
//         <StickyBar />
//       </div>
//     </>
//   );
// };

// export default Course;

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
  const [filters, setFilters] = useState({ level: [], type: [] });
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
    setFilters(updatedFilters);
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
