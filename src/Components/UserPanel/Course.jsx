// import React, { useState, useEffect, useRef } from 'react';
// import Topbar from './Topbar';
// import NavbarTop from './NavbarTop';
// import Sidebar from './Sidebar';
// import './Course.css';
// import Footer from './Footer';
// import SidebarRight from './SidebarRight';
// import Pagination from './Pagination';
// import StickyBar from './StickyBar';

// const Course = () => {
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const bannerRef = useRef(null);

//   const handleCategorySelect = (category) => {
//     setSelectedCategory(category);
//     if (bannerRef.current) {
//       const bannerHeight = bannerRef.current.clientHeight;
//       window.scrollTo(0, 400); // Scroll to just below the banner
//     }
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);  
//   }, []);

//   return (
//     <>
//       <div className='course-top'>
//         <Topbar />
//         <NavbarTop />
//         <div className='course-banner' ref={bannerRef}>
//           <h3 className='course-banner-content'>Courses</h3>
//         </div>
//         <div className='sidebar-top'>
//           <Sidebar onSelectCategory={handleCategorySelect} />
//           <div className='sidebar-right'>
//             <SidebarRight category={selectedCategory} />
//             {selectedCategory === 'All' ? <Pagination /> : null}
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
import SidebarRight, { getTotalCards } from './SidebarRight';
import Pagination from './Pagination'; 
import Footer from './Footer';
import StickyBar from './StickyBar';
import './Course.css';

const Course = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const bannerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(12);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    if (bannerRef.current) {
      window.scrollTo(0, 400); 
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);  
    
    // Set cards per page based on window size
    const updateCardsPerPage = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        setCardsPerPage(4); // Mobile view
      } else if (width <= 1024) {
        setCardsPerPage(8); // Tablet view
      }
      else if (width <= 1366) {
        setCardsPerPage(8); // Tablet view
      } else {
        setCardsPerPage(12); // Desktop view
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
      <div className='course-top'>
        <Topbar />
        <NavbarTop />
        <div className='course-banner' ref={bannerRef}>
          <h3 className='course-banner-content'>Courses</h3>
        </div>
        <div className='course-content'>
          <Sidebar onSelectCategory={handleCategorySelect} />
          <div className='sidebar-right-container'>
            {/* SidebarRight renders the course cards */}
            <SidebarRight
              category={selectedCategory}
              currentPage={currentPage}
              cardsPerPage={cardsPerPage}
            />
            {/* Pagination component */}
            <Pagination
              currentPage={currentPage}
              totalCards={getTotalCards(selectedCategory)} // Total number of cards in the selected category
              cardsPerPage={cardsPerPage}
              onPageChange={handlePageChange} // Custom handler for page change
            />
          </div>
        </div>
        <Footer />
        <StickyBar />
      </div>
    </>
  );
};

export default Course;

