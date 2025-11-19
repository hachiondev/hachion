import React, { useState, useEffect, useRef } from 'react';
import logo from '../../Assets/logo.webp';
import { IoSearch, IoCloseCircleSharp } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Fuse from 'fuse.js';
import './Home.css';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import { FaUserAlt } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { GoPerson } from "react-icons/go";
import { MdLogout } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";
import DropdownSidebar from './DropdownSidebar';
import DropdownCourseList, { getTotalCards } from './DropdownCourseList';
import './Course.css';
import { BsCart2 } from "react-icons/bs";
import { CgPathOutline , CgMenuGridR } from "react-icons/cg";
import { BsBookmarkHeart } from "react-icons/bs";
import { PiNotePencilBold, PiCertificateBold, PiBriefcase } from "react-icons/pi";
import { MdOutlineRateReview } from "react-icons/md";

const API_BASE = "https://api.test.hachion.co";

const resolveImageUrl = (img) => {
  if (!img) return "";
  if (/^https?:\/\//i.test(img)) return img;
  return `${API_BASE}${img.startsWith("/") ? "" : "/"}${img}`;
};

async function ensureAvatarFromApi(email, setUserData) {
  if (!email) return;
  try {
    const { data } = await axios.get(`${API_BASE}/api/v1/user/myprofile`, {
      params: { email },
    });
    const img = data?.profileImageUrl
      ? resolveImageUrl(data.profileImageUrl)
      : data?.profileImage
      ? resolveImageUrl(`/api/v1/user/profile/${data.profileImage}`)
      : "";

    if (img) {
      setUserData((prev) => {
        const next = {
          ...(prev || {}),
          picture: img,
          name: prev?.name || data?.name || data?.userName || "",
        };
        try {
          const raw = localStorage.getItem("loginuserData");
          const stored = raw ? JSON.parse(raw) : {};
          localStorage.setItem("loginuserData", JSON.stringify({ ...stored, ...next }));
        } catch {}
        return next;
      });
    }
  } catch {}
}

const ProfileAvatar = styled(Avatar)({
    width: 40,
    height: 40,
    border: "2px solid #00AEEF",
    backgroundColor: "#ffffff",
  });

const NavbarTop = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("https://api.test.hachion.co/courses/names-and-categories");
        setCourses(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCourses();
  }, []);

  const handleCategorySelect = (category) => setSelectedCategory(category);

  const getCookie = (name) => {
    const escaped = name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1");
    const match = document.cookie.match(new RegExp("(?:^|; )" + escaped + "=([^;]*)"));
    return match ? decodeURIComponent(match[1]) : null;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("loginuserData");
    const avatar = localStorage.getItem("avatar") || getCookie("avatar");
    if (storedUser) {
      let parsed = JSON.parse(storedUser);
      if (parsed && avatar && !parsed.picture) {
        parsed.picture = avatar;
        localStorage.setItem("loginuserData", JSON.stringify(parsed));
      }
      if (parsed) {
        setUserData(parsed);
        setIsLoggedIn(true);
        if (!parsed.picture && parsed.email) ensureAvatarFromApi(parsed.email, setUserData);
      }
    }
  }, []);

    useEffect(() => {
    // Try to hydrate from localStorage + avatar cookie first
    const stored = localStorage.getItem("loginuserData");
    const avatarCookie = getCookie("avatar");

    if (stored) {
      try {
        const u = JSON.parse(stored);
        // If we have cookie avatar but no picture saved, merge it
        if (!u.picture && avatarCookie) {
          u.picture = avatarCookie;
          localStorage.setItem("loginuserData", JSON.stringify(u));
        }
        setUserData(u);
        setIsLoggedIn(true);
        return; // already hydrated, no need to call /api/me
      } catch (e) {
        console.warn("[NavbarTop] JSON parse error for loginuserData in second effect:", e);
      }
    }

    // If no valid stored user, ask backend who is logged in (for Google OAuth, etc.)
    fetch(`${API_BASE}/api/me`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => {
        if (!u) return;
        const toStore = {
          name: u.name || "",
          email: u.email || "",
          picture: u.picture || avatarCookie || "",
        };
        localStorage.setItem("loginuserData", JSON.stringify(toStore));
        // If you use this flag during OAuth flow, we can clean it up:
        localStorage.removeItem("pendingOAuth");
        setUserData(toStore);
        setIsLoggedIn(true);
      })
      .catch((err) => console.error("[NavbarTop] /api/me failed:", err));
  }, []);


  const deleteCookieEverywhere = (name) => {
    document.cookie = `${name}=; Max-Age=0; Path=/`;
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=hachion.co; Secure`;
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.hachion.co; Secure`;
  };

  const handleLogout = async () => {
    try {
      await fetch("https://api.test.hachion.co/api/logout", { method: "POST", credentials: "include" });
    } catch {}
    finally {
      localStorage.clear();
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
    const courseFuse = new Fuse(courses, { keys: ["courseName"], threshold: 0.4 });
    const blogFuse = new Fuse(blogs, { keys: ["title"], threshold: 0.4 });
    const courseResults = courseFuse.search(query).map((r) => ({ ...r.item, type: "course" }));
    const blogResults = blogFuse.search(query).map((r) => ({ ...r.item, type: "blog" }));
    setSearchResults([...courseResults, ...blogResults]);
  };

  const handleCourseClick = (item) => {
    if (item.type === "course") {
      const slug = item.courseName.toLowerCase().replace(/\s+/g, "-");
      navigate(`/coursedetails/${slug}`);
    } else {
      const slug = item.title.toLowerCase().replace(/\s+/g, "-");
      navigate(`/blogs/${item.category_name}/${slug}-${item.id}`);
    }
    setSearchResults([]);
    setMobileSearchOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
  }, [drawerOpen]);

  const handleMouseEnter = () => {
  clearTimeout(window.dropdownTimeout);
  setIsDropdownOpen(true);
};

const handleMouseLeave = () => {
  window.dropdownTimeout = setTimeout(() => {
    setIsDropdownOpen(false);
  }, 200);
};

  const handleClickToggle = () => {
    setIsDropdownOpen(prev => !prev);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm" style={{ height: "80px" }}>
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img src={logo} alt="logo" className="logo" />
          </a>

          {/* Desktop Content */}
          <div className="collapse navbar-collapse d-none d-lg-flex" id="navbarScroll">
            <div className="navbar-nav my-lg-0 navbar-nav-scroll" ref={dropdownRef}>
              <div className="nav-item dropdown">
                <button
              className="nav-link"
              type="button"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              onClick={handleClickToggle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ color: "#000000", fontWeight: "500", background: "none", border: "none" }}
            >
              Explore Courses{" "}
              <span className="ms-1 arrow-icon" aria-hidden="true">
                {isDropdownOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
              </span>
            </button>
                {isDropdownOpen && (
                  <ul className="dropdown-menu custom-dropdown-menu show"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}>
                    <li>
                      <div className="course-content">
                        <div className="scrollable-category-list">
                          <DropdownSidebar
                            onSelectCategory={handleCategorySelect}
                            selectedCategory={selectedCategory}
                          />
                        </div>
                        <div className="sidebar-right-container">
                          <DropdownCourseList category={selectedCategory} />
                          <li>
                            <button
                              className="dropdown-all-btn"
                              onClick={() => navigate("/coursedetails")}
                            >
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

            {/* Desktop Search */}
            <div
              className="search-container position-relative flex-grow-1 mx-3"
              style={{ maxWidth: "500px" }}
            >
              <form className="d-flex flex-grow-1" role="search">
                <div
                  className="input-group rounded-pill custom-search w-100"
                  style={{ overflow: "hidden", height: "48px", maxWidth: "400px" }}
                >
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
                    aria-label="Search"
                    onClick={(e) => e.preventDefault()}
                  >
                    <IoSearch size={20} className="text-white" />
                  </button>
                </div>
              </form>
              {searchResults.length > 0 && (
                <div className="search-results position-absolute bg-white shadow rounded w-100 mt-1">
                  {searchResults.map((item) => (
                    <div
                      key={item._id || item.id}
                      className="p-2 border-bottom text-dark d-flex align-items-center"
                      onClick={() => handleCourseClick(item)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={resolveImageUrl(item.courseImage)}
                        alt=""
                        style={{ width: 40, height: 40, marginRight: 8 }}
                      />
                      {item.courseName || item.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Right Section */}
          <div className="d-flex align-items-center d-lg-none ms-auto">
            <button className="btn" onClick={() => setMobileSearchOpen(true)}>
              <IoSearch size={26} color="#00AEEF" />
            </button>
            {isLoggedIn && (
              <button className="btn ms-2" 
              aria-label="View cart"
              onClick={() => navigate("/userdashboard/order_history")}>
                <BsCart2 size={24} color="#000" />
              </button>
            )}
            <button className="btn ms-2"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}>
              <GiHamburgerMenu size={28} />
            </button>
          </div>

          {/* Desktop Right */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-info rounded-pill px-3 fw-bold text-nowrap"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="btn btn-info rounded-pill px-3 text-white fw-bold text-nowrap"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <div className="d-flex align-items-center gap-3">
                <button
                  className="btn"
                  aria-label="View cart"
                  onClick={() => navigate("/userdashboard/order_history")}
                >
                  <BsCart2 size={28} />
                </button>
                <div className="dropdown">
                  <button
                    className="btn d-flex align-items-center"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ background: "transparent", border: "none" }}
                  >
                    {userData?.picture ? (
                      <ProfileAvatar src={userData.picture} alt="user avatar" />
                    ) : (
                      <ProfileAvatar>
                        <FaUserAlt size={20} color="#b3b3b3" />
                      </ProfileAvatar>
                    )}
                    <span className="ms-2">{userData?.name || "User"}</span>
                    {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                  </button>
                  {isOpen && (
                    <ul className="dropdown-menu dropdown-menu-end show">
                      <li>
                        <Link className="dropdown-item" to="/userdashboard/dashboard">
                          <RxDashboard /> Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/userdashboard/profile">
                          <GoPerson /> Profile
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/userdashboard/enrolls">
                          <PiNotePencilBold /> Enrolls
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/userdashboard/wishlist">
                          <BsBookmarkHeart /> Wishlist
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/userdashboard/order_history">
                          <BsCart2 /> Orders
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/userdashboard/certificate">
                          <PiCertificateBold /> Certificates
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/userdashboard/review">
                          <MdOutlineRateReview /> Review
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/userdashboard/pathfinder">
                          <CgPathOutline /> Pathfinder
                        </Link>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={handleLogout}>
                          <MdLogout /> Logout
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Overlay and Drawer */}
      {drawerOpen && <div className="overlay" onClick={() => setDrawerOpen(false)} />}
      <div className={`sidebar-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="category-drawer-header">
          <a href="/">
            <img src={logo} alt="logo" className="logo" />
          </a>
          <button className="filter-close-btn" 
          aria-label="Close menu"
          onClick={() => setDrawerOpen(false)}>
            ✕
          </button>
        </div>
        <div className="drawer-body">
          {isLoggedIn ? (
            <>
              <div className="d-flex align-items-center mb-3">
                {userData?.picture ? (
                  <ProfileAvatar src={userData.picture} alt="user avatar" />
                ) : (
                  <ProfileAvatar>
                    <FaUserAlt size={20} color="#b3b3b3" />
                  </ProfileAvatar>
                )}
                <span className="ms-2">{userData?.name || "User"}</span>
              </div>

              <div className="drawer-item" onClick={() => navigate("/userdashboard/dashboard")}>
                <RxDashboard /> Dashboard
              </div>
              <div className="drawer-item" onClick={() => navigate("/userdashboard/profile")}>
                <GoPerson /> Profile
              </div>
              <div className="drawer-item" onClick={() => navigate("/userdashboard/enrolls")}>
                <PiNotePencilBold /> Enrolls
              </div>
              <div className="drawer-item" onClick={() => navigate("/userdashboard/wishlist")}>
                <BsBookmarkHeart /> Wishlist
              </div>
              <div className="drawer-item" onClick={() => navigate("/userdashboard/order_history")}>
                <BsCart2 /> Orders
              </div>
              <div className="drawer-item" onClick={() => navigate("/userdashboard/certificate")}>
                <PiCertificateBold /> Certificates
              </div>
              <div className="drawer-item" onClick={() => navigate("/userdashboard/review")}>
                <MdOutlineRateReview /> Review
              </div>
              <div className="drawer-item" onClick={() => navigate("/userdashboard/pathfinder")}>
                <CgPathOutline /> Pathfinder
              </div>

              <div className="drawer-item" onClick={() => navigate("/coursedetails")}>
                Explore Courses
              </div>
              <div className="drawer-item" onClick={() => navigate("/corporate")}>
                Corporate Training
              </div>

              <button
                className="btn btn-info rounded-pill w-100 text-white mt-3"
                onClick={handleLogout}
              >
                <MdLogout /> Logout
              </button>
            </>
          ) : (
            <>
              <div className="drawer-item" onClick={() => navigate("/coursedetails")}>
                Explore Courses
              </div>
              <div className="drawer-item" onClick={() => navigate("/corporate")}>
                Corporate Training
              </div>
              <Link
                to="/login"
                className="btn btn-outline-info rounded-pill w-100 mt-3 fw-bold"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="btn btn-info rounded-pill w-100 mt-2 text-white fw-bold"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Search Popup */}
     {mobileSearchOpen && (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 bg-white p-3"
        style={{ zIndex: 1050 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="input-group rounded-pill custom-search w-100" style={{ overflow: "hidden", height: "48px" }}>
            <input
              type="search"
              className="form-control border-0"
              placeholder="What would you like to learn?"
              value={searchQuery}
              onChange={handleSearchChange}
              autoFocus
            />
            <button
              className="btn btn-info d-flex align-items-center justify-content-center search-btn"
              type="submit"
              aria-label="Open search"
              onClick={(e) => e.preventDefault()}
            >
              <IoSearch size={20} className="text-white" />
            </button>
          </div>
          <button
            className="filter-close-btn ms-2"
            aria-label="Close search"
            onClick={() => {
              setMobileSearchOpen(false);
              setSearchQuery("");
              setSearchResults([]);
            }}
          >
            ✕
          </button>
        </div>

        <div className="overflow-auto" style={{ maxHeight: "85vh" }}>
          {searchResults.map((item) => (
            <div
              key={item._id || item.id}
              className="p-2 border-bottom d-flex align-items-center"
              onClick={() => handleCourseClick(item)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={resolveImageUrl(item.courseImage)}
                alt=""
                style={{ width: 40, height: 40, marginRight: 10 }}
              />
              {item.courseName || item.title}
            </div>
          ))}
        </div>
      </div>
    )}
    </>
  );
};

export default NavbarTop;
