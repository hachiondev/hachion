import React, { useState, useEffect, useRef } from "react";
import logo from "../../Assets/logo.png";
import { IoSearch } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import profile1 from "../../Assets/profile2.png";
import Avatar from "@mui/material/Avatar";
import { FaUserAlt } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import "./Home.css";
import axios from "axios";

const NavbarTop = () => {
  const [activeLink, setActiveLink] = useState(null);
  const [searchVisible, setSearchVisible] = useState(true);
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state
  const navigate = useNavigate();
  const drawerRef = useRef(null); // Reference to the drawer for click detection
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [blogs, setBlogs] = useState([]);

  // Helper function to format course name for the URL
  const formatCourseName = (courseName) => {
    return courseName.toLowerCase().replace(/\s+/g, "-"); // Replace spaces with hyphens
    // Remove any non-alphanumeric characters
  };

  useEffect(() => {
    const fetchCoursesAndBlogs = async () => {
      try {
        const [coursesRes, blogsRes] = await Promise.all([
          axios.get("https://api.hachion.co/courses/all"),
          axios.get("https://api.hachion.co/blog"),
        ]);

        setCourses(coursesRes.data);
        setBlogs(blogsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCoursesAndBlogs();
  }, []);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filteredCourses = courses.filter((course) =>
      course.courseName?.toLowerCase().includes(query.toLowerCase())
    );

    const filteredBlogs = blogs.filter(
      (blog) =>
        blog.title?.toLowerCase().includes(query.toLowerCase()) ||
        blog.category_name?.toLowerCase().includes(query.toLowerCase())
    );

    const combinedResults = [
      ...filteredCourses.map((course) => ({ ...course, type: "course" })),
      ...filteredBlogs.map((blog) => ({ ...blog, type: "blog" })),
    ];

    setSearchResults(combinedResults);
  };

  // Navigate to the course details page when a course card is clicked
  const handleCourseClick = (item) => {
    if (item.type === "course") {
      const formattedCourseName = formatCourseName(item.courseName);
      navigate(`/courseDetails/${formattedCourseName}`);
    } else if (item.type === "blog") {
      const formattedCategory = item.category_name
        .toLowerCase()
        .replace(/\s+/g, "-");
      navigate(`/blogs/${formattedCategory}/content`);
    }
  };

  useEffect(() => {
    console.log("Checking localStorage for user data...");
    const storedUserData = localStorage.getItem("loginuserData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);
      setIsLoggedIn(true);
      console.log("User data found:", parsedData);
    } else {
      console.log("No user data found. User is not logged in.");
    }
  }, []);

  const handleLogout = () => {
    console.log("Logging out user...");
    localStorage.removeItem("loginuserData");
    setIsLoggedIn(false);
    setUserData(null);
    console.log("User logged out successfully.");
  };

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
    console.log(`Drawer ${isDrawerOpen ? "closed" : "opened"}`);
  };

  const handleNavClick = (link) => {
    setActiveLink(link);
    console.log(`Navigating to: ${link}`);
  };

  const handleClick = () => {
    console.log("Navigating to Home");
    navigate("/");
  };

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      setSearchVisible(!isMobile);
      setMobileSearchOpen(false);
      console.log(`Window resized. Mobile view: ${isMobile}`);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setDrawerOpen(false);
        console.log("Clicked outside drawer. Closing drawer.");
      }
    };

    if (isDrawerOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDrawerOpen]);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        {!isMobileSearchOpen && (
          <img
            src={logo}
            alt="logo"
            onClick={handleClick}
            style={{ cursor: "pointer" }}
          />
        )}
        <div className="right-icons">
          {searchVisible ? (
            <div className="search-div-home" role="search">
              <input
                className="search-input-home"
                type="search"
                placeholder="Enter Courses, Category or Keywords"
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search"
              />
              <button className="btn-search-home">
                <IoSearch style={{ fontSize: "1.8rem" }} />
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
              />
              <button className="btn-search-mobile">
                <IoSearch className="search-icon" />
              </button>
              <button
                className="btn-cancel-mobile"
                onClick={() => setMobileSearchOpen(false)}
              >
                <MdCancel />
              </button>
            </div>
          ) : (
            <button
              className="btn-search-icon-mobile"
              onClick={() => setMobileSearchOpen(true)}
            >
              <IoSearch className="search-icon" />
            </button>
          )}

          {!isMobileSearchOpen && !isDrawerOpen && (
            <button className="drawer-toggle-btn" onClick={toggleDrawer}>
              <GiHamburgerMenu className="toggle-icon" />
            </button>
          )}
        </div>
        {searchResults.length > 0 && (
          <div
            className="search-results"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 10,
            }}
          >
            {searchResults.map((item) => (
              <div
                key={item.id}
                className="result-card"
                onClick={() => handleCourseClick(item)}
                style={{
                  cursor: "pointer",
                  border: "1px solid #ccc",
                  padding: "10px",
                  margin: "5px auto",
                  width: "35%",
                  borderRadius: "5px",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p style={{ fontWeight: "bold" }}>
                      {item.type === "course" ? item.courseName : item.title}
                    </p>
                    <p style={{ color: "#555" }}>
                      {item.type === "course"
                        ? item.courseCategory
                        : item.category_name}
                    </p>
                  </div>
                  <div>
                    <img
                      src={
                        item.type === "course"
                          ? `https://api.hachion.co/${item.courseImage}`
                          : `HachionUserDashboad/blogs/${item.blog_image}`
                      }
                      alt={item.type === "course" ? "course" : "blog"}
                      style={{
                        height: "40px",
                        width: "60px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
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
                      <Avatar
                        src={userData?.picture || profile1}
                        alt="user_name"
                      />
                      <Link
                        className="user-name"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {userData?.name || "Hachion User"}
                      </Link>
                    </div>
                    <div
                      className="drawer-sub-item"
                      onClick={() => navigate("/userdashboard")}
                    >
                      <FaUserAlt style={{ color: "#00AEEF" }} /> Dashboard
                    </div>
                    <div
                      className="drawer-sub-item"
                      onClick={() => navigate("/userdashboard")}
                    >
                      <IoMdSettings style={{ color: "#00AEEF" }} /> Settings
                    </div>

                    <div
                      className="drawer-item"
                      onClick={() => navigate("/corporate")}
                    >
                      Corporate Training
                    </div>
                    <div
                      className="drawer-item"
                      onClick={() => navigate("/courseDetails")}
                    >
                      Courses
                    </div>
                    <div
                      className="drawer-item"
                      onClick={() => navigate("/courseDetails")}
                    >
                      Hire from Us
                    </div>

                    <button
                      className="drawer-button"
                      onClick={() => handleLogout()}
                    >
                      <IoLogOut /> Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  className="drawer-item"
                  onClick={() => navigate("/corporate")}
                >
                  Corporate Training
                </div>
                <div
                  className="drawer-item"
                  onClick={() => navigate("/courseDetails")}
                >
                  Courses
                </div>
                <div
                  className="drawer-item"
                  onClick={() => navigate("/courseDetails")}
                >
                  Hire from Us
                </div>

                <button
                  className="drawer-button"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                  className="drawer-button"
                  onClick={() => navigate("/register")}
                >
                  Register
                </button>
              </>
            )}
          </div>
        )}

        <div className="navbar-nav">
          <button
            className={`nav-item ${activeLink === "corporate" ? "active" : ""}`}
            onClick={() => handleNavClick("corporate")}
          >
            <Link to="/corporate" className="nav-item-link">
              Corporate Training
            </Link>
          </button>
          <button
            className={`nav-item ${
              activeLink === "CourseDetails" ? "active" : ""
            }`}
            onClick={() => handleNavClick("CourseDetails")}
          >
            <Link to="/courseDetails" className="nav-item-link">
              Courses
            </Link>
          </button>
          <button
            className={`nav-item ${
              activeLink === "CourseDetails" ? "active" : ""
            }`}
            onClick={() => handleNavClick("CourseDetails")}
          >
            <Link to="/courseDetails" className="nav-item-link">
              Hire from Us
            </Link>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarTop;
