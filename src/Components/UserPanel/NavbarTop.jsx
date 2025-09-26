
import React, { useState, useEffect, useRef } from 'react';
import logo from '../../Assets/logo.png';
import { IoSearch, IoCloseCircleSharp } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Fuse from 'fuse.js';
import './Home.css';
import { styled } from '@mui/material/styles';
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
import { BsCart2 } from "react-icons/bs";

const NavbarTop = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
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
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, blogsRes] = await Promise.all([
          axios.get("https://api.test.hachion.co/courses/names-and-categories"),
          // axios.get("https://api.test.hachion.co/blog"),
        ]);
        setCourses(coursesRes.data);
        setBlogs(blogsRes.data);
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };
    fetchData();
  }, []);

    const getCookie = (name) => {
    const escaped = name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1');
    const match = document.cookie.match(new RegExp('(?:^|; )' + escaped + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  };
  
  useEffect(() => {
    const storedUser = localStorage.getItem("loginuserData");
    const avatar = localStorage.getItem('avatar') || getCookie('avatar');

    console.log("[NavbarTop] document.cookie =", document.cookie);
    console.log("[NavbarTop] localStorage.avatar =", localStorage.getItem('avatar'));
    console.log("[NavbarTop] cookie.avatar =", getCookie('avatar'));
    console.log("[NavbarTop] localStorage.loginuserData (raw) =", storedUser);

    if (storedUser) {
      let parsed;
      try {
        parsed = JSON.parse(storedUser);
      } catch (e) {
        console.warn("[NavbarTop] JSON parse error for loginuserData:", e);
      }
      console.log("[NavbarTop] parsed loginuserData BEFORE hydrate =", parsed);

      if (parsed && avatar && !parsed.picture) {
        parsed.picture = avatar;
        localStorage.setItem("loginuserData", JSON.stringify(parsed));
        console.log("[NavbarTop] hydrated parsed.picture from avatar =", avatar);
      }

      if (parsed) {
        if (parsed.picture) {
    
    setUserData(parsed);
    setIsLoggedIn(true);
  } else {
    
    localStorage.removeItem("avatar");
    setUserData(parsed);
    setIsLoggedIn(true);
  }
      }
    } 
    else {
      if (avatar) {
     
      } 
      else {
        console.log("[NavbarTop] no storedUser and no avatar found.");
      }
    }
  }, []);


  const deleteCookieEverywhere = (name) => {
  
  document.cookie = `${name}=; Max-Age=0; Path=/`;

  document.cookie = `${name}=; Max-Age=0; Path=/; Domain=hachion.co; Secure`;
  document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.hachion.co; Secure`;
};

const handleLogout = async () => {
  try {
    await fetch("https://api.test.hachion.co/api/logout", {
      method: "POST",
      credentials: "include", 
    });
  } catch (e) {
    console.warn("[logout] backend call failed (will still clear client):", e);
  } finally {
    
    localStorage.removeItem("loginuserData");
    localStorage.removeItem("authToken");
    localStorage.removeItem("avatar");

    
    deleteCookieEverywhere("avatar");
    deleteCookieEverywhere("flow");

    setIsLoggedIn(false);
    setUserData(null);
    navigate("/");
  }
};
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

  const ProfileAvatar = styled(Avatar)({
    width: 40,
    height: 40,
    border: '2px solid #00AEEF',
    backgroundColor: '#ffffff'
  });


useEffect(() => {
  const getCookie = (name) => {
    const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g,'\\$1') + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  };

  const stored = localStorage.getItem("loginuserData");
  const avatarCookie = getCookie("avatar");

  if (stored) {
    try {
      const u = JSON.parse(stored);
      if (!u.picture && avatarCookie) {
        u.picture = avatarCookie;
        localStorage.setItem("loginuserData", JSON.stringify(u));
      }
      setUserData(u);
      setIsLoggedIn(true);
      return; 
    } catch {}
  }

  
  fetch("https://api.test.hachion.co/api/me", { credentials: "include" })
    .then(r => r.ok ? r.json() : null)
    .then(u => {
      if (!u) return;
      const toStore = {
        name: u.name || "",
        email: u.email || "",
        picture: u.picture || avatarCookie || ""
      };
      localStorage.setItem("loginuserData", JSON.stringify(toStore));
      localStorage.removeItem("pendingOAuth"); 
      setUserData(toStore);
      setIsLoggedIn(true);
    })
    .catch(err => console.error("[NavbarTop] /api/me failed:", err));
}, []);

 return (
    <>
      <nav className="navbar navbar-expand-lg bg-white shadow-sm px-3 px-md-4" style={{ height: "80px" }}>
        <div className="container-fluid px-4">

          {/* ==== Logo ==== */}
          <div className="d-flex justify-content-start flex-auto">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img src={logo} alt="logo" className="logo" />
          </a>
          </div>

          {/* ==== Desktop Search ==== */}
          <div className="collapse navbar-collapse d-none d-lg-flex" id="navbarScroll">
          <div className="navbar-nav my-lg-0 navbar-nav-scroll" ref={dropdownRef}>
          <div className="nav-item dropdown">
        <a 
        className="nav-link"
        href="#"
        role="button"
        // data-bs-toggle="dropdown"
        aria-expanded="false"
        onClick={(e) => {
        e.preventDefault();
        handleClickToggle();
      }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{color: '#000000', fontWeight: '500'}}
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
                  style={{
                  outline: "none",
                  boxShadow: "none",
                }}
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
                    <img
                    className="result-image"
                    src={`https://api.test.hachion.co/${item.courseImage}`}
                    alt={item.type}
                  />
                    {item.courseName || item.title}
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>

          {/* ==== Mobile Right Icons ==== */}
          <div className="d-flex align-items-center d-lg-none ms-auto">
            <button className="btn" type="button">
            <BsCart2 size={24}/>
            </button>
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
              <div className="d-flex align-items-center gap-3">
              <BsCart2 size={28}/>
              <div className="dropdown">
                <button
                  className="btn d-flex align-items-center"
                  data-bs-toggle="dropdown"
                  aria-expanded={isOpen}
                  style={{
                  border: "none",
                  boxShadow: "none",
                  outline: "none",
                  background: "transparent",
                  paddingRight: "0",
                }}
                onClick={() => setIsOpen(!isOpen)}
                >
                  {userData?.picture ? (
                    <ProfileAvatar src={userData.picture} alt="user avatar" />
                  ) : (
                    <ProfileAvatar>
                      <FaUserAlt size={20} color="#b3b3b3" />
                    </ProfileAvatar>
                  )}
                  <span className="ms-2" style={{fontSize: 'small'}}>{userData?.name || "User"}</span>
                  {isOpen ? (
                    <MdKeyboardArrowUp className="ms-1 arrow-icon" />
                  ) : (
                    <MdKeyboardArrowDown className="ms-1 arrow-icon" />
                  )}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/userdashboard/Enrolls">
                      <FaUserAlt /> Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/userdashboard/Settings">
                      <IoMdSettings /> Settings
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <IoLogOut /> Logout
                    </button>
                  </li>
                </ul>
              </div>
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
              <div className="d-flex align-items-center mb-2">
                {userData?.picture ? (
                  <ProfileAvatar src={userData.picture} alt="user avatar" />
                ) : (
                  <ProfileAvatar>
                    <FaUserAlt size={20} color="#b3b3b3" />
                  </ProfileAvatar>
                )}
                <span className="ms-2">{userData?.name || "User"}</span>
              </div>
              <div className="drawer-item" onClick={() => navigate('/userdashboard/Enrolls')}>
                <FaUserAlt /> Dashboard
              </div>
              <div className="drawer-item" onClick={() => navigate('/userdashboard/Settings')}>
                <IoMdSettings /> Settings
              </div>
              <div className="drawer-item" onClick={() => navigate('/coursedetails')}>
                Explore Courses
              </div>
              <div className="drawer-item" onClick={() => navigate('/corporate')}>
                Corporate Training
              </div>
              <button className="btn btn-info rounded-pill w-100 text-white" onClick={handleLogout}>
                <IoLogOut /> Logout
              </button>
            </>
          ) : (
            <div className="d-flex flex-column gap-2">
              <div className="drawer-item" onClick={() => navigate('/coursedetails')}>
                Explore Courses
              </div>
              <div className="drawer-item" onClick={() => navigate('/corporate')}>
                Corporate Training
              </div>
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
                  style={{
                  outline: "none",
                  boxShadow: "none",
                }}
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
                  <img
                    className="result-image"
                    src={`https://api.test.hachion.co/${item.courseImage}`}
                    alt={item.type}
                  />
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