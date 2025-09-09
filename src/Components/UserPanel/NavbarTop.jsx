// import React, { useState, useEffect, useRef } from 'react';
// import logo from '../../Assets/logo.png';
// import { IoSearch } from "react-icons/io5";
// import { MdCancel } from "react-icons/md";
// import { Link, useNavigate } from 'react-router-dom';
// import { GiHamburgerMenu } from "react-icons/gi";
// import profile1 from '../../Assets/profile2.png';
// import Avatar from '@mui/material/Avatar';
// import { FaUserAlt } from "react-icons/fa";
// import { IoMdSettings } from "react-icons/io";
// import { IoLogOut } from 'react-icons/io5';
// import './Home.css';
// import axios from 'axios';
// import Fuse from 'fuse.js';
// import { useLocation } from 'react-router-dom';
// import { Button, Menu, MenuItem, ListItemText, ListItemIcon,} from "@mui/material";
// import { IoMdArrowDropdown } from "react-icons/io";
// import { IoMdArrowDropup } from "react-icons/io";
// import DropdownSidebar from './DropdownSidebar';
// import DropdownCardRight, { getTotalCards } from './DropdownCardRight';
// import './Course.css';
// const NavbarTop = () => {
//   const [activeLink, setActiveLink] = useState(null);
//   const [searchVisible, setSearchVisible] = useState(true);
//   const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);
//   const [isDrawerOpen, setDrawerOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false); 
//   const navigate = useNavigate();
//   const drawerRef = useRef(null); 
//   const [userData, setUserData] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [courses, setCourses] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);
//   const [blogs, setBlogs] = useState([]);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const location = useLocation();
//   const [categories, setCategories] = useState([]);
//   const [openCategory, setOpenCategory] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const bannerRef = useRef(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [cardsPerPage, setCardsPerPage] = useState(4);
//   const [totalCards, setTotalCards] = useState(0);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef();

//   const handleMouseEnter = () => setIsDropdownOpen(true);
//   const handleMouseLeave = () => {
//     if (window.innerWidth > 768) return; 
//     setIsDropdownOpen(false);
//   };
//   const handleClickToggle = () => {
//     setIsDropdownOpen(prev => !prev);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

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
//   window.scrollTo(0, 0);  
//   const updateCardsPerPage = () => {
//     const width = window.innerWidth;
//     if (width <= 768) {
//       setCardsPerPage(4); 
//     } else if (width <= 1024) {
//       setCardsPerPage(6); 
//     } else if (width <= 1366) {
//       setCardsPerPage(6); 
//     } else {
//       setCardsPerPage(6); 
//     }
//   };
//   updateCardsPerPage();
//   window.addEventListener('resize', updateCardsPerPage);
//   return () => window.removeEventListener('resize', updateCardsPerPage);
// }, []);

//   const formatCourseName = (courseName) => {
//     return courseName.toLowerCase().replace(/\s+/g, '-');
//   };
  
//   useEffect(() => {
//     const fetchCoursesCategoriesAndBlogs = async () => {
//       try {
//         const [coursesRes, categoryRes, blogsRes] = await Promise.all([
//            axios.get("https://api.hachion.co/courses/names-and-categories"),
//           axios.get("https://api.hachion.co/course-categories/all"),
//           axios.get("https://api.hachion.co/blog"),
//         ]);

//         const allOption = { _id: "all", name: "All" };
//         const updatedCategories = [allOption, ...categoryRes.data];
//         setCategories(updatedCategories);

//         setCourses(coursesRes.data);
//         setBlogs(blogsRes.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         alert("Unable to fetch data. Please try again.");
//       }
//     };

//     fetchCoursesCategoriesAndBlogs();
//   }, []);

//   const highlightMatch = (text, query) => {
//     const parts = text.split(new RegExp(`(${query})`, 'gi'));
//     return parts.map((part, index) =>
//       part.toLowerCase() === query.toLowerCase() ? <strong key={index}>{part}</strong> : part
//     );
//   };

//   const handleSearchChange = (event) => {
//     const query = event.target.value;
//     setSearchQuery(query);
//      if (!query.trim()) {
//     setSelectedItem(null);
//   }
    
//     if (query.trim().length < 2) {
//       setSearchResults([]);
//       return;
//     }

//     const courseFuse = new Fuse(courses, {
//       keys: ['courseName', 'courseCategory'],
//       threshold: 0.4,
//       ignoreLocation: true,
//     });

//     const blogFuse = new Fuse(blogs, {
//       keys: ['title', 'category_name'],
//       threshold: 0.4,
//       ignoreLocation: true,
//     });

//     const courseResults = courseFuse.search(query).map(res => ({ ...res.item, type: 'course' }));
//     const blogResults = blogFuse.search(query).map(res => ({ ...res.item, type: 'blog' }));
//     const combinedResults = [...courseResults, ...blogResults];
//     combinedResults.sort((a, b) => {
//       const nameA = (a.courseName || a.title || '').toLowerCase();
//       const nameB = (b.courseName || b.title || '').toLowerCase();
//       return nameA.localeCompare(nameB);
//     });

//     setSearchResults(combinedResults);
//   };

//   const handleSearchSubmit = () => {
//     if (!searchQuery.trim()) {
//       alert("Please enter a search term.");
//       return;
//     }

//     if (selectedItem && (selectedItem.courseName || selectedItem.title).toLowerCase() === searchQuery.toLowerCase()) {
//       handleCourseClick(selectedItem);
//       return;
//     }

//     const fuseCourse = new Fuse(courses, {
//       keys: ['courseName', 'courseCategory'],
//       threshold: 0.4,
//       ignoreLocation: true
//     });

//     const fuseBlog = new Fuse(blogs, {
//       keys: ['title', 'category_name'],
//       threshold: 0.4,
//       ignoreLocation: true
//     });

//     const courseResult = fuseCourse.search(searchQuery);
//     const blogResult = fuseBlog.search(searchQuery);

//     if (courseResult.length > 0) {
//       handleCourseClick({ ...courseResult[0].item, type: 'course' });
//     } else if (blogResult.length > 0) {
//       handleCourseClick({ ...blogResult[0].item, type: 'blog' });
//     } else {
//       alert("No matching content found. Please refine your search.");
//     }
//   };

//   const handleCourseClick = (item) => {
//     if (item.type === 'course') {
//       const formattedCourseName = formatCourseName(item.courseName);
//       navigate(`/coursedetails/${formattedCourseName}`);
    
//      } else if (item.type === 'blog') {
//     const formattedCategory = item.category_name.toLowerCase().replace(/\s+/g, '-');
//     const formattedTitle = item.title
//       .toLowerCase()
//       .replace(/\s+/g, '-')       
//       .replace(/[^a-z0-9\-]/g, ''); 
//     navigate(`/blogs/${formattedCategory}/${formattedTitle}-${item.id}`);
//   }
//   };

//   useEffect(() => {
//     const storedUserData = localStorage.getItem('loginuserData');
//     if (storedUserData) {
//       const parsedData = JSON.parse(storedUserData);
//       setUserData(parsedData);
//       setIsLoggedIn(true);
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('loginuserData'); 
//     setIsLoggedIn(false);
//     setUserData(null);
//   };

//   const toggleDrawer = () => {
//     setDrawerOpen(!isDrawerOpen);
//   };

//   const handleNavClick = (link) => {
//     setActiveLink(link);
//   };

//   const handleClick = () => {
//     navigate('/');
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       const isMobile = window.matchMedia('(max-width: 768px)').matches;
//       setSearchVisible(!isMobile);
//     };

//     window.addEventListener('resize', handleResize);
//     handleResize(); 
//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

  // useEffect(() => {
  //   const handleOutsideClick = (event) => {
  //     if (drawerRef.current && !drawerRef.current.contains(event.target)) {
  //       setDrawerOpen(false);
  //     }
  //   };

  //   if (isDrawerOpen) {
  //     document.addEventListener('mousedown', handleOutsideClick);
  //   }
  //   return () => {
  //     document.removeEventListener('mousedown', handleOutsideClick);
  //   };
  // }, [isDrawerOpen]);

//   const getCoursesByCategory = (categoryName) =>
//     categoryName === "All" ? courses : courses.filter(course => course.courseCategory === categoryName);

//   const toggleSubmenu = (e, categoryId) => {
//     e.stopPropagation();
//     setOpenCategory((prev) => (prev === categoryId ? null : categoryId));
//   };
//   return (
//     <nav className="navbar navbar-expand-lg bg-body-tertiary">
//       <div className="container-fluid">
      
//         {!isMobileSearchOpen && (
//           <img
//             src={logo}
//             alt="logo"
//             onClick={handleClick}
//             style={{ cursor: 'pointer' }}
//           />
//         )}
// <div className="dropdown" ref={dropdownRef}>
//         <button 
//         className="btn btn-outline custom-category-btn dropdown-toggle d-none d-md-block"
//         onClick={handleClickToggle}
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//       >
  //       Explore All Courses{" "}
  //   <span className="ms-1 arrow-icon">
  //     {isDropdownOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
  //   </span>
  //     </button>
  // {isDropdownOpen && (
  //       <ul
  //         className="dropdown-menu custom-dropdown-menu show"
  //         onMouseEnter={handleMouseEnter}
  //         onMouseLeave={handleMouseLeave}
  //       >
  //         <li>
  //           <div className="course-content">
  //             <div className="scrollable-category-list">
  //               <h2 className="dropdown-sidebar-heading">All Categories</h2>
  //               <DropdownSidebar onSelectCategory={handleCategorySelect} 
  //               selectedCategory={selectedCategory}/>
  //             </div>

  //             <div className="sidebar-right-container">
  //               <meta
  //                 name="description"
  //                 content={`Discover ${selectedCategory} courses designed to enhance your skills and career.`}
  //               />
  //               <div className="selected-category-heading">
  //               {selectedCategory} Courses
  //             </div>
  //               <div>
  //                 <DropdownCardRight
  //                   category={selectedCategory}
  //                   currentPage={currentPage}
  //                   cardsPerPage={cardsPerPage}
  //                   onTotalCardsChange={updateTotalCards}
  //                 />
  //               </div>
  //               <li>
  //                 <a className="btn btn-link" href="/coursedetails">
  //                   <strong>Explore All Courses</strong>
  //                 </a>
  //               </li>
  //             </div>
  //           </div>
  //         </li>
  //       </ul>
  //     )}
  //   </div>
//         <div className="right-icons">
//           {searchVisible ? (
//             <div className="search-div-home" role="search">
//               <input
//                 className="search-input-home"
//                 type="search"
//                 placeholder="Enter Courses, Category or Keywords"
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//                 onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}
//                 aria-label="Search"
//               />
//               <button className="btn-search-home"  onClick={handleSearchSubmit}
//                 disabled={!searchQuery.trim()} aria-label="Search" title="Search">
//                 <IoSearch style={{ fontSize: '1.8rem' }} aria-hidden="true"/>
//               </button>
//             </div>
//           ) : isMobileSearchOpen ? (
//             <div className="search-div-mobile">
//               <input
//                 className="search-input-mobile"
//                 type="search"
//                 placeholder="Enter Courses, Category or Keywords"
//                 aria-label="Search"
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//                 onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}
//               />
//               <button
//                 className="btn-search-icon-mobile"
//                 onClick={handleSearchSubmit} 
//                 aria-label="Open mobile search"
//                 title="Search"
//               >
//                 <IoSearch className="search-icon" aria-hidden="true" />
//               </button>
//               <button
//                 className="btn-cancel-mobile"
//                 onClick={() => setMobileSearchOpen(false)}
//                 aria-label="Cancel Search"
//                 title="Cancel Search"
//               >
//                 <MdCancel />
//               </button>
//             </div>
          
//           ) : (
//             <button
//               className="btn-search-icon-mobile"
//               onClick={() => setMobileSearchOpen(true)}
//               aria-label="Open mobile search"
//               title="Search"
//             >
//               <IoSearch className="search-icon" aria-hidden="true"/>
//             </button>
//           )}

//           {!isMobileSearchOpen && !isDrawerOpen && (
//             <button
//             className="drawer-toggle-btn"
//             onClick={toggleDrawer}
//             aria-label="Toggle navigation menu"
//             title="Menu"
//           >
//             <GiHamburgerMenu className="toggle-icon" aria-hidden="true" />
//           </button>
//           )}
//         </div>
//         {searchQuery.length >= 2 && !selectedItem && (
//   <div className="search-results">
//     {searchResults.length === 0 ? (
//       <div className="no-results">No Results Found</div>
//     ) : (
//       searchResults.map((item) => (
//         <div
//           key={item.id}
//           className="result-card"
//           onClick={() => {
//             setSearchQuery(item.courseName || item.title); 
//             setSearchResults([]);                          
//             setSelectedItem(item);  
                             
//           }}
//         >
//           <div className="result-content">
//             <div>
//               <p className="result-title">
//                 {highlightMatch(item.courseName || item.title, searchQuery)}
//               </p>
//             </div>
//             <img
//               className="result-image"
//               src={
//                 item.type === 'course'
//                   ? `https://api.hachion.co/${item.courseImage}`
//                   : `https://api.hachion.co/blogs/${item.blog_image}`
//               }
//               alt={item.type}
//             />
//           </div>
//         </div>
//       ))
//     )}
//   </div>
// )}

//         {/* Drawer content, only visible when isDrawerOpen is true */}
//         {isDrawerOpen && (
//           <div className="mobile-drawer" ref={drawerRef}>
//             <button
//               className="drawer-cancel-icon"
//               onClick={() => setDrawerOpen(false)}
//             >
//               <MdCancel />
//             </button>
//             <img
//               src={logo}
//               alt="logo"
//               onClick={handleClick}
//               className="drawer-logo"
//             />
//             {isLoggedIn ? (
//               <>
//                 <div className="profile">
//                   <div className="dropdown">
//                     <div className="user-name">
//                     <Avatar src={userData?.picture || profile1} alt="user_name" />
//                     <Link
//                                       className="user-name"
//                                       role="button"
//                                       data-bs-toggle="dropdown"
//                                       aria-expanded="false"
//                                     >
//                                       {userData?.name || 'Hachion User'}
//                                     </Link>
//                     </div>
//                     <div className="drawer-sub-item" onClick={() => navigate('/userdashboard')}>
//                       <FaUserAlt style={{ color: '#00AEEF' }} /> Dashboard
//                     </div>
//                     <div className="drawer-sub-item" onClick={() => navigate('/userdashboard')}>
//                       <IoMdSettings style={{ color: '#00AEEF' }} /> Settings
//                     </div>

//                     <div className="drawer-item" onClick={() => navigate('/corporate')}>
//                       Corporate Training
//                     </div>
//                     <div className="drawer-item" onClick={() => navigate('/coursedetails')}>
//                       Explore All Courses
//                     </div>
//                     {/* <div className="drawer-item" onClick={() => navigate('/hire-from-us')}>Hire from Us</div> */}

//                     <button className="drawer-button" onClick={() => handleLogout()}>
//                       <IoLogOut /> Logout
//                     </button>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="drawer-item" onClick={() => navigate('/corporate')}>
//                   Corporate Training
//                 </div>
//                 <div className="drawer-item" onClick={() => navigate('/coursedetails')}>
//                   Explore All Courses
//                 </div>
//                 {/* <div className="drawer-item" onClick={() => navigate('/hire-from-us')}>Hire from Us</div> */}

//                 <button className="drawer-button" onClick={() => navigate('/login')}>
//                   Login
//                 </button>
                
//               </>
//             )}
//           </div>
//         )}

//         {/* <div className="navbar-nav"> */}
//           <button
//             className={`nav-item ${location.pathname === '/corporate' ? 'active' : ''}`}
//           >
//             <Link to="/corporate" className="nav-item-link">
//               Corporate Training
//             </Link>
//           </button>

//       </div>
//     </nav>
//   );
// };

// export default NavbarTop;


import React, { useState, useEffect, useRef } from 'react';
import logo from '../../Assets/logo.png';
import { IoSearch, IoCloseCircleSharp } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Fuse from 'fuse.js';
import './Home.css';
import { MdCancel } from "react-icons/md";
import Avatar from '@mui/material/Avatar';
import profile1 from '../../Assets/profile2.png';
import { FaUserAlt } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";
import DropdownSidebar from './DropdownSidebar';
import DropdownCardRight, { getTotalCards } from './DropdownCardRight';
import './Course.css';

const NavbarTop = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const bannerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(4);
  const [totalCards, setTotalCards] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const handleMouseEnter = () => setIsDropdownOpen(true);
  const handleMouseLeave = () => {
    // if (window.innerWidth > 768) return; 
    setIsDropdownOpen(false);
  };
  const handleClickToggle = () => {
    setIsDropdownOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
  const updateCardsPerPage = () => {
    const width = window.innerWidth;
    if (width <= 768) {
      setCardsPerPage(4); 
    } else if (width <= 1024) {
      setCardsPerPage(6); 
    } else if (width <= 1366) {
      setCardsPerPage(6); 
    } else {
      setCardsPerPage(6); 
    }
  };
  updateCardsPerPage();
  window.addEventListener('resize', updateCardsPerPage);
  return () => window.removeEventListener('resize', updateCardsPerPage);
}, []);

  const formatCourseName = (courseName) => {
    return courseName.toLowerCase().replace(/\s+/g, '-');
  };
  // Fetch courses + blogs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, blogsRes] = await Promise.all([
          axios.get("https://api.hachion.co/courses/names-and-categories"),
          axios.get("https://api.hachion.co/blog"),
        ]);
        setCourses(coursesRes.data);
        setBlogs(blogsRes.data);
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };
    fetchData();
  }, []);

  // Check login state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("loginuserData");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loginuserData");
    setIsLoggedIn(false);
    setUserData(null);
    navigate("/");
  };

  // Highlighted search
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const courseFuse = new Fuse(courses, { keys: ['courseName'], threshold: 0.4 });
    const blogFuse = new Fuse(blogs, { keys: ['title'], threshold: 0.4 });

    const courseResults = courseFuse.search(query).map(r => ({ ...r.item, type: 'course' }));
    const blogResults = blogFuse.search(query).map(r => ({ ...r.item, type: 'blog' }));

    setSearchResults([...courseResults, ...blogResults]);
  };

  const handleCourseClick = (item) => {
    if (item.type === 'course') {
      const slug = item.courseName.toLowerCase().replace(/\s+/g, '-');
      navigate(`/coursedetails/${slug}`);
    } else {
      const slug = item.title.toLowerCase().replace(/\s+/g, '-');
      navigate(`/blogs/${item.category_name}/${slug}-${item.id}`);
    }
    setShowMobileSearch(false);
    setSearchResults([]);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white shadow-sm px-3 px-md-5" style={{ height: "80px" }}>
        <div className="container-fluid px-4">

          {/* ==== Logo ==== */}
          <div className="d-flex justify-content-start flex-auto">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img src={logo} alt="logo" className="logo" />
          </a>
          </div>

          {/* ==== Desktop Search ==== */}
          <div className="collapse navbar-collapse d-none d-lg-flex" id="navbarScroll">
          {/* <ul className="navbar-nav my-lg-0 navbar-nav-scroll">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{color: '#000000', fontWeight: '500'}}
              >
                Explore Courses
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Action</a></li>
                <li><a className="dropdown-item" href="#">Another action</a></li>
                <li><a className="dropdown-item" href="#">Something else here</a></li>
              </ul>
            </li>
          </ul> */}
          <div className="navbar-nav my-lg-0 navbar-nav-scroll" ref={dropdownRef}>
          <div className="nav-item dropdown">
        <a 
        className="nav-link"
        href="#"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        onClick={handleClickToggle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Explore Courses{" "}
    <span className="ms-1 arrow-icon">
      {isDropdownOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
    </span>
      </a>
  {isDropdownOpen && (
        <ul
          className="dropdown-menu custom-dropdown-menu show"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <li>
            <div className="course-content">
              <div className="scrollable-category-list">
                {/* <h2 className="dropdown-sidebar-heading">All Categories</h2> */}
                <DropdownSidebar onSelectCategory={handleCategorySelect} 
                selectedCategory={selectedCategory}/>
              </div>

              <div className="sidebar-right-container">
                <meta
                  name="description"
                  content={`Discover ${selectedCategory} courses designed to enhance your skills and career.`}
                />
                <div className="selected-category-heading">
                {selectedCategory} Courses
              </div>
                <div>
                  <DropdownCardRight
                    category={selectedCategory}
                    currentPage={currentPage}
                    cardsPerPage={cardsPerPage}
                    onTotalCardsChange={updateTotalCards}
                  />
                </div>
                <li>
                  <button className="dropdown-all-btn" onClick={() => navigate('/coursedetails')} >
                    Explore All Courses
                  </button>
                </li>
              </div>
            </div>
          </li>
        </ul>
      )}
    </div>
    </div>
        <div className="search-container position-relative flex-grow-1 mx-3" style={{ maxWidth: "600px" }}>
            <form className="d-flex flex-grow-1" role="search">
              <div className="input-group rounded-pill custom-search w-100" style={{ overflow: "hidden", height: "48px" }}>
                <input
                  type="search"
                  className="form-control border-0"
                  placeholder="What would you like to learn?"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button
                  className="btn btn-info d-flex align-items-center justify-content-center search-btn"
                  type="submit"
                  onClick={(e) => e.preventDefault()}
                >
                  <IoSearch size={20} className="text-white" />
                </button>
              </div>
            </form>

            {/* Desktop results */}
            {searchResults.length > 0 && (
              <div className="search-results position-absolute bg-white shadow rounded w-100 mt-1">
                {searchResults.map((item) => (
                  <div
                    key={item._id || item.id}
                    className="p-2 border-bottom text-dark"
                    onClick={() => handleCourseClick(item)}
                    style={{ cursor: "pointer" }}
                  >
                    {item.courseName || item.title}
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>

          {/* ==== Mobile Right Icons ==== */}
          <div className="d-flex align-items-center d-lg-none ms-auto">
            <button className="btn" type="button" onClick={() => setShowMobileSearch(true)}>
              <IoSearch size={24} className="text-info" />
            </button>
            <button
              className="btn ms-2"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#mobileDrawer"
            >
              <GiHamburgerMenu size={28} />
            </button>
          </div>

          {/* ==== Desktop Right Side ==== */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            {!isLoggedIn ? (
              <>
                <button className="btn btn-outline-info rounded-pill px-3 text-nowrap">
                  <Link to="/login" className="btn btn-sm text-nowrap login-btn-link">Log in</Link>
                </button>
                <button className="btn btn-info rounded-pill px-3 text-white text-nowrap">
                  <Link to="/register" className="btn btn-sm text-white text-nowrap">Sign up</Link>
                </button>
              </>
            ) : (
              <div className="dropdown">
                <button
                  className="btn d-flex align-items-center dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <Avatar src={userData?.picture || profile1} alt="user avatar" />
                  <span className="ms-2">{userData?.name || "User"}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/userdashboard">
                      <FaUserAlt /> Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/settings">
                      <IoMdSettings /> Settings
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item text-black" onClick={handleLogout}>
                      <IoLogOut /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ==== Mobile Drawer (Offcanvas) ==== */}
      <div className="offcanvas offcanvas-start d-lg-none w-100" tabIndex="-1" id="mobileDrawer">
        <div className="offcanvas-header">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img src={logo} alt="logo" className="logo" />
          </a>
          <button className="drawer-cancel-icon" data-bs-dismiss="offcanvas" type="button">
            <MdCancel />
          </button>
        </div>

        <div className="offcanvas-body">
          {isLoggedIn ? (
            <>
              <div className="d-flex align-items-center mb-3">
                <Avatar src={userData?.picture || profile1} alt="avatar" />
                <span className="ms-2">{userData?.name || "User"}</span>
              </div>
              <div className="drawer-item" onClick={() => navigate('/coursedetails')}>
                Explore Courses
              </div>
              <div className="drawer-item" onClick={() => navigate('/corporate')}>
                Corporate Training
              </div>
              {/* <div className="drawer-item" onClick={() => navigate('/coursedetails')}>
                Explore All Courses
              </div> */}
              <div className="drawer-item" onClick={() => navigate('/userdashboard')}>
                <FaUserAlt /> Dashboard
              </div>
              <div className="drawer-item" onClick={() => navigate('/settings')}>
                <IoMdSettings /> Settings
              </div>
              <button className="drawer-button text-white mt-3" onClick={handleLogout}>
                <IoLogOut /> Logout
              </button>
            </>
          ) : (
            <div className="d-flex flex-column gap-2">
              <Link to="/coursedetails" className="btn btn-md text-start p-3">
                Explore Courses
              </Link>
              <Link to="/corporate" className="btn btn-md text-start p-3">
                Corporate Training
              </Link>
              <button className="btn btn-outline-info rounded-pill w-100">
                <Link to="/login" className="btn btn-sm text-nowrap login-btn-link">Log in</Link>
              </button>
              <button className="btn btn-info rounded-pill w-100 text-white">
                <Link to="/register" className="btn btn-sm text-white text-nowrap">Sign up</Link>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ==== Mobile Search Overlay ==== */}
      {showMobileSearch && (
        <div className="mobile-search-overlay position-fixed top-0 start-0 w-100 h-100 bg-white p-3 d-lg-none" style={{ zIndex: 2000 }}>
          <div className="d-flex align-items-center mb-3">
            <form className="flex-grow-1 d-flex flex-row me-2" onSubmit={(e) => e.preventDefault()}>
              <div className="input-group rounded-pill custom-search" style={{ overflow: "hidden", height: "48px" }}>
                <input
                  type="search"
                  className="form-control border-0"
                  placeholder="What would you like to learn?"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button className="btn btn-info d-flex align-items-center justify-content-center search-btn" type="submit">
                  <IoSearch size={20} className="text-white" />
                </button>
              </div>
              <button className="btn" onClick={() => setShowMobileSearch(false)}>
                <IoCloseCircleSharp size={28} style={{color: '#00AEEF'}} />
              </button>
            </form>
          </div>

          {/* Mobile results */}
          {searchResults.length > 0 && (
            <div className="search-results mt-2">
              {searchResults.map((item) => (
                <div
                  key={item._id || item.id}
                  className="p-2 border-bottom text-dark"
                  onClick={() => handleCourseClick(item)}
                  style={{ cursor: "pointer" }}
                >
                  {item.courseName || item.title}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default NavbarTop;
