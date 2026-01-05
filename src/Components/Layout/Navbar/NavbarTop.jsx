// src/Components/Layout/Navbar/NavbarTop.jsx
import React, { useState, useRef, useCallback, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../../Components/UserPanel/Home.css";
import "../../../Components/UserPanel/CoursePage/Course.css";
import { useCourses } from "../../../Api/hooks/HomePageApi/NavbarApi/useCourses";
import { useBlogs } from "../../../Api/hooks/HomePageApi/NavbarApi/useBlogs";
import { useUserProfile } from "../../../Api/hooks/HomePageApi/NavbarApi/useUserProfile";
import NavbarLogo from "./components/NavbarLogo";
import SearchBox from "./components/SearchBox";
import SearchResults from "./components/SearchResults";
import ExploreDropdown from "./components/ExploreDropdown";
import UserMenu from "./components/UserMenu";
import MobileDrawer from "./components/MobileDrawer";
import { useSearch } from "../../../Api/hooks/HomePageApi/NavbarApi/useSearch";
import { BsCart2 } from "react-icons/bs";

const NavbarTop = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: courses = [] } = useCourses();
  const { data: blogs = [] } = useBlogs();
  const { userData, isLoggedIn, logout } = useUserProfile();

  const {
    query,
    results,
    onChange: onSearchChange,
    setResults,
    setQuery,
  } = useSearch(courses, blogs);

  // UI State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Refs
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const searchRef = useRef(null);

  /* 🔹 Close everything on route change */
  useEffect(() => {
    setIsUserMenuOpen(false);
    setDrawerOpen(false);
    setMobileSearchOpen(false);
    setResults([]);
    setQuery("");
  }, [location.pathname, setResults, setQuery]);

  /* 🔹 Outside Click Handler */
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close search
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setResults([]);
        setQuery("");
      }

      // Close user dropdown
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setResults, setQuery]);

  /* 🔹 Search item click */
  const handleCourseClick = useCallback(
    (item) => {
      if (!item) return;

      if (item.type === "course") {
        const slug = item.courseName.toLowerCase().replace(/\s+/g, "-");
        navigate(`/coursedetails/${slug}`);
      } else {
        const slug = item.title.toLowerCase().replace(/\s+/g, "-");
        navigate(`/blogs/${item.category_name}/${slug}-${item.id}`);
      }

      setResults([]);
      setMobileSearchOpen(false);
      setQuery("");
    },
    [navigate, setResults, setQuery]
  );

  const toggleDrawer = () => setDrawerOpen((s) => !s);
  const closeDrawer = () => setDrawerOpen(false);

  const openMobileSearch = () => setMobileSearchOpen(true);
  const closeMobileSearch = () => {
    setMobileSearchOpen(false);
    setResults([]);
    setQuery("");
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white shadow-sm" style={{ height: 80 }}>
        <div className="container">
          <NavbarLogo />

          {/* Desktop */}
          <div className="collapse navbar-collapse d-none d-lg-flex">
            <div className="navbar-nav" ref={dropdownRef}>
              <ExploreDropdown
                isOpen={isDropdownOpen}
                setIsOpen={setIsDropdownOpen}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </div>

            <div
              className="search-container position-relative flex-grow-1 mx-3"
              style={{ maxWidth: 500 }}
              ref={searchRef}
            >
              <SearchBox query={query} onChange={onSearchChange} />
              {results.length > 0 && (
                <SearchResults items={results} onSelect={handleCourseClick} />
              )}
            </div>
          </div>

          {/* Mobile Right */}
          <div className="d-flex align-items-center d-lg-none ms-auto">
            <button className="btn" onClick={openMobileSearch}>
              <IoSearch size={26} color="#00AEEF" />
            </button>

            {isLoggedIn && (
              <button className="btn ms-2" onClick={() => navigate("/userdashboard/order_history")}>
                <BsCart2 size={24} />
              </button>
            )}

            <button className="btn ms-2" onClick={toggleDrawer}>
              <GiHamburgerMenu size={28} />
            </button>
          </div>

          {/* Desktop Right */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="btn btn-outline-info rounded-pill fw-bold">
                  Log in
                </Link>
                <Link to="/register" className="btn btn-info rounded-pill text-white fw-bold">
                  Sign up
                </Link>
              </>
            ) : (
              <div className="d-flex align-items-center gap-3">
                <button className="btn" onClick={() => navigate("/userdashboard/order_history")}>
                  <BsCart2 size={24} />
                </button>

                <div className="dropdown" ref={userDropdownRef}>
                  <button
                    className="btn d-flex align-items-center"
                    onClick={() => setIsUserMenuOpen((s) => !s)}
                  >
                    <span className="ms-2">{userData?.name || "User"}</span>
                  </button>

                  <UserMenu
                    userData={userData}
                    isOpen={isUserMenuOpen}
                    onClose={() => setIsUserMenuOpen(false)}
                    onLogout={handleLogout}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <MobileDrawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        isLoggedIn={isLoggedIn}
        userData={userData}
        navigate={navigate}
        handleLogout={handleLogout}
      />
    </>
  );
};

export default React.memo(NavbarTop);
