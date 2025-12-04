// src/Components/Navbar/NavbarTop.jsx
import React, { useState, useRef, useCallback } from "react";
import { IoSearch } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import "../../../Components/UserPanel/Home.css";
import "../../../Components/UserPanel/Course.css";
import { useCourses } from "../../../Api/hooks/NavbarApi/useCourses";
import { useBlogs } from "../../../Api/hooks/NavbarApi/useBlogs";
import { useUserProfile } from "../../../Api/hooks/NavbarApi/useUserProfile";
import NavbarLogo from "./components/NavbarLogo";
import SearchBox from "./components/SearchBox";
import SearchResults from "./components/SearchResults";
import ExploreDropdown from "./components/ExploreDropdown";
import UserMenu from "./components/UserMenu";
import MobileDrawer from "./components/MobileDrawer";
import { useSearch } from "../../../Api/hooks/NavbarApi/useSearch";

const NavbarTop = () => {
  const navigate = useNavigate();
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

  // UI state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

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

  const toggleDrawer = () => setDrawerOpen(s => !s);
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
      <nav className="navbar navbar-expand-lg bg-white shadow-sm" style={{ height: "80px" }}>
        <div className="container">
          <NavbarLogo />

          {/* Desktop Content */}
          <div className="collapse navbar-collapse d-none d-lg-flex" id="navbarScroll">
            <div className="navbar-nav my-lg-0 navbar-nav-scroll" ref={dropdownRef}>
              <div className="nav-item dropdown">
                <ExploreDropdown
                  isOpen={isDropdownOpen}
                  setIsOpen={setIsDropdownOpen}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              </div>
            </div>

            {/* Search */}
            <div className="search-container position-relative flex-grow-1 mx-3" style={{ maxWidth: 500 }}>
            <SearchBox
              query={query}
              onChange={onSearchChange}
            />
            {results.length > 0 && <SearchResults items={results} onSelect={handleCourseClick} />}
            </div>
          </div>

          {/* Mobile Right Section */}
          <div className="d-flex align-items-center d-lg-none ms-auto">
            <button className="btn" onClick={openMobileSearch} aria-label="Open search">
              <IoSearch size={26} color="#00AEEF" />
            </button>

            {isLoggedIn && (
              <button className="btn ms-2" aria-label="View cart" onClick={() => navigate("/userdashboard/order_history")}>
                {/* Cart icon */}
                <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24"><path fill="currentColor" d="M7 18a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM7.2 6l1.2 6h8.2l1.8-4H8.6"/></svg>
              </button>
            )}

            <button className="btn ms-2" aria-label="Open menu" onClick={toggleDrawer}>
              <GiHamburgerMenu size={28} />
            </button>
          </div>

          {/* Desktop Right */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="btn btn-outline-info rounded-pill px-3 fw-bold text-nowrap">Log in</Link>
                <Link to="/register" className="btn btn-info rounded-pill px-3 text-white fw-bold text-nowrap">Sign up</Link>
              </>
            ) : (
              <div className="d-flex align-items-center gap-3">
                <button className="btn" aria-label="View cart" onClick={() => navigate("/userdashboard/order_history")}>
                  {/* cart icon placeholder */}
                  <svg style={{ width: 28, height: 28 }} viewBox="0 0 24 24"><path fill="currentColor" d="M7 18a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM7.2 6l1.2 6h8.2l1.8-4H8.6"/></svg>
                </button>

                <div className="dropdown" ref={userDropdownRef}>
                  <button className="btn d-flex align-items-center" onClick={() => setIsUserMenuOpen(s => !s)} style={{ background: "transparent", border: "none" }}>
                    {userData?.picture ? (
                      <img src={userData.picture} alt="user avatar" style={{ width: 40, height: 40, borderRadius: 999 }} />
                    ) : (
                      <div style={{ width: 40, height: 40, borderRadius: 999, background: "#fff", border: "2px solid #00AEEF", display: "grid", placeItems: "center" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#b3b3b3" d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z"/></svg>
                      </div>
                    )}
                    <span className="ms-2">{userData?.name || "User"}</span>
                  </button>

                  <UserMenu userData={userData} isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)} onLogout={handleLogout} />
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        isLoggedIn={isLoggedIn}
        userData={userData}
        navigate={navigate}
        handleLogout={handleLogout}
      />

      {/* Mobile Search Popup */}
      {mobileSearchOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-white p-3" style={{ zIndex: 1050 }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="input-group rounded-pill custom-search w-100" style={{ overflow: "hidden", height: 48 }}>
              <input
                type="search"
                className="form-control border-0"
                placeholder="What would you like to learn?"
                value={query}
                onChange={onSearchChange}
                autoFocus
                aria-label="Mobile search courses and blogs"
              />
              <button className="btn btn-info d-flex align-items-center justify-content-center search-btn" type="submit" aria-label="Search" onClick={(e) => e.preventDefault()}>
                <IoSearch size={20} className="text-white" />
              </button>
            </div>

            <button className="filter-close-btn ms-2" aria-label="Close search" onClick={closeMobileSearch}>✕</button>
          </div>

          <div className="overflow-auto" style={{ maxHeight: "85vh" }}>
            {results.map(item => (
              <div key={item._id || item.id} className="p-2 border-bottom d-flex align-items-center" onClick={() => handleCourseClick(item)} style={{ cursor: "pointer" }}>
                <img src={(item.courseImage || item.image) ? (item.courseImage || item.image) : ""} alt="" style={{ width: 40, height: 40, marginRight: 10 }} />
                {item.courseName || item.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(NavbarTop);
