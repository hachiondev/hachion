import React, { useState, useEffect, useRef } from 'react';
import logo from '../../Assets/logo.png';
import { IoSearch } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";
import profile1 from '../../Assets/profile2.png';
import Avatar from '@mui/material/Avatar';
import { FaUserAlt } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from 'react-icons/io5';
import './Home.css';
import axios from 'axios';
import Fuse from 'fuse.js';
import { useLocation } from 'react-router-dom';
import {
  Button,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { IoIosArrowForward, IoIosArrowDown } from 'react-icons/io';

import DropdownSidebar from './DropdownSidebar';
import DropdownCardRight, { getTotalCards } from './DropdownCardRight';
import './Course.css';

const NavbarTop = () => {
  const [activeLink, setActiveLink] = useState(null);
  const [searchVisible, setSearchVisible] = useState(true);
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state
  const navigate = useNavigate();
  const drawerRef = useRef(null); // Reference to the drawer for click detection
   const [userData, setUserData] = useState(null);
   const [searchQuery, setSearchQuery] = useState('');
   const [courses, setCourses] = useState([]);
   const [searchResults, setSearchResults] = useState([]);
   const [blogs, setBlogs] = useState([]);
   const [selectedItem, setSelectedItem] = useState(null);
   const location = useLocation();
   const [categories, setCategories] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState('All');
    const bannerRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage, setCardsPerPage] = useState(4);
    const [totalCards, setTotalCards] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef();

    const handleMouseEnter = () => setIsDropdownOpen(true);
  const handleMouseLeave = () => {
    if (window.innerWidth > 768) return; // only close on hover in desktop
    setIsDropdownOpen(false);
  };

  const handleClickToggle = () => {
    setIsDropdownOpen(prev => !prev);
  };

  // Close on outside click
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
          setCardsPerPage(6); // Larger tablet view
        } else {
          setCardsPerPage(6); // Desktop view
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
 
   // Helper function to format course name for the URL
   const formatCourseName = (courseName) => {
     return courseName
       .toLowerCase()
       .replace(/\s+/g, '-') // Replace spaces with hyphens
       // Remove any non-alphanumeric characters
   };
 
   useEffect(() => {
    const fetchCoursesAndBlogs = async () => {
      try {
        const [coursesRes, blogsRes] = await Promise.all([
          axios.get('https://api.hachion.co/courses/all'),
          axios.get('https://api.hachion.co/blog'),
        ]);
        setCourses(coursesRes.data);
        setBlogs(blogsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert("Unable to fetch search results. Please try again.");
      }
    };
  
    fetchCoursesAndBlogs();
  }, []);

  
  const highlightMatch = (text, query) => {
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? <strong key={index}>{part}</strong> : part
    );
  };
  
  
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setSelectedItem(null);
  
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
  
    const courseFuse = new Fuse(courses, {
      keys: ['courseName', 'courseCategory'],
      threshold: 0.4,
      ignoreLocation: true,
    });
  
    const blogFuse = new Fuse(blogs, {
      keys: ['title', 'category_name'],
      threshold: 0.4,
      ignoreLocation: true,
    });
  
    const courseResults = courseFuse.search(query).map(res => ({ ...res.item, type: 'course' }));
    const blogResults = blogFuse.search(query).map(res => ({ ...res.item, type: 'blog' }));
    const combinedResults = [...courseResults, ...blogResults];

    // ✅ Sort alphabetically (case-insensitive)
    combinedResults.sort((a, b) => {
      const nameA = (a.courseName || a.title || '').toLowerCase();
      const nameB = (b.courseName || b.title || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });
  
    setSearchResults(combinedResults);
  };
  
  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search term.");
      return;
    }
  
    if (selectedItem && (selectedItem.courseName || selectedItem.title).toLowerCase() === searchQuery.toLowerCase()) {
      handleCourseClick(selectedItem);
      return;
    }
  
    const fuseCourse = new Fuse(courses, {
      keys: ['courseName', 'courseCategory'],
      threshold: 0.4,
      ignoreLocation: true
    });
  
    const fuseBlog = new Fuse(blogs, {
      keys: ['title', 'category_name'],
      threshold: 0.4,
      ignoreLocation: true
    });
  
    const courseResult = fuseCourse.search(searchQuery);
    const blogResult = fuseBlog.search(searchQuery);
  
    if (courseResult.length > 0) {
      handleCourseClick({ ...courseResult[0].item, type: 'course' });
    } else if (blogResult.length > 0) {
      handleCourseClick({ ...blogResult[0].item, type: 'blog' });
    } else {
      alert("No matching content found. Please refine your search.");
    }
  };
  
  
  
   // Navigate to the course details page when a course card is clicked
   const handleCourseClick = (item) => {
    if (item.type === 'course') {
      const formattedCourseName = formatCourseName(item.courseName);
      navigate(`/coursedetails/${formattedCourseName}`);
    } else if (item.type === 'blog') {
      const formattedCategory = item.category_name.toLowerCase().replace(/\s+/g, '-');
      navigate(`/blogs/${formattedCategory}/content`);
    }
  };
  
 
  
   useEffect(() => {
    
    const storedUserData = localStorage.getItem('loginuserData');
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);
      setIsLoggedIn(true);
      
    } else {
      
    }
  }, []);

  const handleLogout = () => {
    
    localStorage.removeItem('loginuserData'); 
    setIsLoggedIn(false);
    setUserData(null);
    
  };

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const handleNavClick = (link) => {
    setActiveLink(link);
  };

  const handleClick = () => {
    navigate('/');
  };

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      setSearchVisible(!isMobile);
      setMobileSearchOpen(false);
      
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setDrawerOpen(false);
        
      }
    };

    if (isDrawerOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isDrawerOpen]);
  useEffect(() => {
  const fetchAllCategoryCourses = async () => {
    try {
      const categoryRes = await axios.get("https://api.hachion.co/course-categories/all");
      setCategories(categoryRes.data);

      const allCourses = [];

      for (const category of categoryRes.data) {
        const courseRes = await axios.get(
          `https://api.hachion.co/courses/coursenames-by-category?categoryName=${encodeURIComponent(category.name)}`
        );
        const categoryCourses = courseRes.data.map(course => ({
          ...course,
          categoryId: category._id, // attach categoryId to filter later
        }));
        allCourses.push(...categoryCourses);
      }

      setCourses(allCourses);
    } catch (error) {
      console.error("Error fetching category-wise courses:", error);
    }
  };

  fetchAllCategoryCourses();
}, []);

  const getCoursesByCategory = (categoryId) =>
    courses.filter((course) => course.categoryId === categoryId);

 const toggleSubmenu = (e, categoryId) => {
    e.stopPropagation();
    setOpenCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
      
        {!isMobileSearchOpen && (
          <img
            src={logo}
            alt="logo"
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
          />
        )}
<div className="dropdown" ref={dropdownRef}>
      <button
        className="btn btn-outline custom-category-btn dropdown-toggle d-none d-md-block"
        onClick={handleClickToggle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Categories
      </button>
  {isDropdownOpen && (
        <ul
          className="dropdown-menu custom-dropdown-menu show"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <li>
            <div className="course-content">
              <div className="scrollable-category-list">
                <h2 className="dropdown-sidebar-heading">Categories</h2>
                <DropdownSidebar onSelectCategory={handleCategorySelect} />
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
                  <a className="btn btn-link" href="/coursedetails">
                    <strong>Explore All Courses</strong>
                  </a>
                </li>
              </div>
            </div>
          </li>
        </ul>
      )}
    </div>
        <div className="right-icons">
          {searchVisible ? (
            <div className="search-div-home" role="search">
              <input
                className="search-input-home"
                type="search"
                placeholder="Enter Courses, Category or Keywords"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}
                aria-label="Search"
              />
              <button className="btn-search-home"  onClick={handleSearchSubmit}
                disabled={!searchQuery.trim()} aria-label="Search" title="Search">
                <IoSearch style={{ fontSize: '1.8rem' }} aria-hidden="true"/>
              </button>
            </div>
          ) : isMobileSearchOpen ? (
            <div className="search-div-mobile">
              <input
                className="search-input-mobile"
                type="search"
                placeholder="Enter Courses, Category or Keywords"
                aria-label="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}
              />
              <button
                className="btn-search-icon-mobile"
                onClick={() => setMobileSearchOpen(true)}
                aria-label="Open mobile search"
                title="Search"
              >
                <IoSearch className="search-icon" aria-hidden="true" />
              </button>
              <button
                className="btn-cancel-mobile"
                onClick={() => setMobileSearchOpen(false)}
                aria-label="Cancel Search"
                title="Cancel Search"
              >
                <MdCancel />
              </button>
            </div>
          
          ) : (
            <button
              className="btn-search-icon-mobile"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="Open mobile search"
              title="Search"
            >
              <IoSearch className="search-icon" aria-hidden="true"/>
            </button>
          )}

          {!isMobileSearchOpen && !isDrawerOpen && (
            <button
            className="drawer-toggle-btn"
            onClick={toggleDrawer}
            aria-label="Toggle navigation menu"
            title="Menu"
          >
            <GiHamburgerMenu className="toggle-icon" aria-hidden="true" />
          </button>
          )}
        </div>
        {searchQuery.length >= 2 && !selectedItem && (
  <div className="search-results">
    {searchResults.length === 0 ? (
      <div className="no-results">No Results Found</div>
    ) : (
      searchResults.map((item) => (
        <div
          key={item.id}
          className="result-card"
          onClick={() => {
            setSearchQuery(item.courseName || item.title); 
            setSearchResults([]);                          
            setSelectedItem(item);                         
          }}
        >
          <div className="result-content">
            <div>
              <p className="result-title">
                {highlightMatch(item.courseName || item.title, searchQuery)}
              </p>
            </div>
            <img
              className="result-image"
              src={
                item.type === 'course'
                  ? `https://api.hachion.co/${item.courseImage}`
                  : `https://api.hachion.co/blogs/${item.blog_image}`
              }
              alt={item.type}
            />
          </div>
        </div>
      ))
    )}
  </div>
)}

        {/* Drawer content, only visible when isDrawerOpen is true */}
        {isDrawerOpen && (
          <div className="mobile-drawer" ref={drawerRef}>
            <button
              className="drawer-cancel-icon"
              onClick={() => setDrawerOpen(false)}
            >
              <MdCancel />
            </button>
            <img
              src={logo}
              alt="logo"
              onClick={handleClick}
              className="drawer-logo"
            />
            {isLoggedIn ? (
              <>
                <div className="profile">
                  <div className="dropdown">
                    <div className="user-name">
                    <Avatar src={userData?.picture || profile1} alt="user_name" />
                    <Link
                                      className="user-name"
                                      role="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      {userData?.name || 'Hachion User'}
                                    </Link>
                    </div>
                    <div className="drawer-sub-item" onClick={() => navigate('/userdashboard')}>
                      <FaUserAlt style={{ color: '#00AEEF' }} /> Dashboard
                    </div>
                    <div className="drawer-sub-item" onClick={() => navigate('/userdashboard')}>
                      <IoMdSettings style={{ color: '#00AEEF' }} /> Settings
                    </div>

                    <div className="drawer-item" onClick={() => navigate('/corporate')}>
                      Corporate Training
                    </div>
                    <div className="drawer-item" onClick={() => navigate('/coursedetails')}>
                      Categories
                    </div>
                    {/* <div className="drawer-item" onClick={() => navigate('/hire-from-us')}>Hire from Us</div> */}

                    <button className="drawer-button" onClick={() => handleLogout()}>
                      <IoLogOut /> Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="drawer-item" onClick={() => navigate('/corporate')}>
                  Corporate Training
                </div>
                <div className="drawer-item" onClick={() => navigate('/coursedetails')}>
                  Categories
                </div>
                {/* <div className="drawer-item" onClick={() => navigate('/hire-from-us')}>Hire from Us</div> */}

                <button className="drawer-button" onClick={() => navigate('/login')}>
                  Login
                </button>
                {/* <button className="drawer-button" onClick={() => navigate('/register')}>
                  Register
                </button> */}
              </>
            )}
          </div>
        )}

        {/* <div className="navbar-nav"> */}
          <button
            className={`nav-item ${location.pathname === '/corporate' ? 'active' : ''}`}
          >
            <Link to="/corporate" className="nav-item-link">
              Corporate Training
            </Link>
          </button>

          {/* <button
            className={`nav-item ${location.pathname === '/coursedetails' ? 'active' : ''}`}
          >
            <Link to="/coursedetails" className="nav-item-link">
              Categories 
            </Link>
          </button> */}

          {/* <button
            className={`nav-item ${location.pathname === '/hire-from-us' ? 'active' : ''}`}
          >
            <Link to="/hire-from-us" className="nav-item-link">
              Hire from Us
            </Link>
          </button> */}
        {/* </div> */}
      </div>
    </nav>
  );
};

export default NavbarTop;