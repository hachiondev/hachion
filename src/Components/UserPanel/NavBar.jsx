import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../Assets/logo.png"; 
import { IoMdSearch, IoMdClose } from "react-icons/io";
import { IoCloseCircleSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { IoMdMenu } from "react-icons/io";
import "./Style.css";
import DropdownCardRight from "./DropdownCardRight";

const NavBar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState(""); // search input
  const [results, setResults] = useState([]); // search results (desktop)

  // Fake search function (replace with API call)
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 1) {
      setResults([
        "React Basics",
        "React Advanced",
        "Node.js Training",
        "Python for Data Science",
      ].filter((item) => item.toLowerCase().includes(value.toLowerCase())));
    } else {
      setResults([]);
    }
  };

  const handleToggle = () => {
    setShowSearch(!showSearch);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm px-3 px-md-5" style={{ height: "80px" }}>
      <div className="container-fluid px-4">
        
        {/* Logo */}
        <div className="d-flex justify-content-start flex-fill">
      <a className="navbar-brand d-flex align-items-center" href="/">
        <img src={logo} alt="logo" className="logo" />
      </a>
    </div>

        {/* ===== MOBILE ONLY ITEMS ===== */}
        <div className="d-flex align-items-center d-lg-none">
          <div className="d-lg-none d-flex align-items-center">
      {!showSearch ? (
        // 🔍 Search Icon (when collapsed)
        <button className="btn" type="button" onClick={handleToggle}>
          <IoMdSearch size={24} className="text-info" />
        </button>
      ) : (
        // 🔎 Expanded Search Bar
        <div className="d-flex flex-grow-1 mx-2 align-items-center" style={{ width: "100%" }}>
          <form className="d-flex flex-grow-1" role="search">
            <div
              className="input-group rounded-pill custom-search"
              style={{ overflow: "hidden", height: "40px", width: "100%" }}
            >
              <input
                type="search"
                className="form-control border-0"
                placeholder="What would you like to learn?"
                aria-label="Search"
              />
              <button
                className="btn btn-info d-flex align-items-center justify-content-center search-btn"
                type="submit"
              >
                <IoMdSearch size={20} className="text-white" />
              </button>
            </div>
          </form>

          {/* ❌ Close Icon */}
          <button className="btn ms-2" type="button" onClick={handleToggle}>
            <IoCloseCircleSharp size={24} className="text-danger" />
          </button>
        </div>
      )}
    </div>

          {/* Drawer Toggle (Hamburger - mobile) */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileDrawer"
            aria-controls="mobileDrawer"
          >
            <span className="navbar-toggler-icon border-none"></span>
          </button>
        </div>

        {/* ===== MOBILE DRAWER ===== */}
        <div
          className="offcanvas offcanvas-start d-lg-none"
          tabIndex="-1"
          id="mobileDrawer"
          aria-labelledby="mobileDrawerLabel"
        >
          <div className="offcanvas-header">
            <a className="navbar-brand d-flex align-items-center" href="/">
          <img src={logo} alt="logo" className="logo" />
        </a>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>

          <div className="offcanvas-body">
            {/* Accordion Menu for Categories */}
            <div className="accordion" id="drawerMenu">
              
              {/* Categories */}
              {/* <div className="accordion-item">
                <h2 className="accordion-header" id="headingCategories">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseCategories"
                    aria-expanded="false"
                    aria-controls="collapseCategories"
                  >
                    Categories
                  </button>
                </h2>
                <div
                  id="collapseCategories"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingCategories"
                  data-bs-parent="#drawerMenu"
                >
                  <div className="accordion-body">
                    <ul className="list-unstyled mb-0">
                      <li><a className="d-block py-1 text-decoration-none" href="#">Action</a></li>
                      <li><a className="d-block py-1 text-decoration-none" href="#">Another action</a></li>
                      <li><a className="d-block py-1 text-decoration-none" href="#">Something else here</a></li>
                    </ul>
                  </div>
                </div>
              </div> */}

              {/* Corporate Training - only in drawer */}
              <div className="accordion-item">
                <Link
                  to="/corporate"
                  className="btn btn-md text-nowrap p-3"
                >
                  Corporate Training
                </Link>
              </div>
            </div>

            {/* Auth buttons */}
            <div className="mt-3 d-flex flex-column gap-2">
             <button className="btn btn-outline-info rounded-pill px-3 text-nowrap">
             <Link to="/login" className="btn btn-sm text-nowrap login-btn-link">
                     Log in
             </Link>
             </button>
              <button className="btn btn-info rounded-pill px-3 text-white text-nowrap">
              <Link to="/register" className="btn btn-sm text-white text-nowrap">
                     Sign up
             </Link></button>
            </div>
          </div>
        </div>

        {/* ===== DESKTOP NAVBAR ===== */}
        <div className="collapse navbar-collapse d-none d-lg-flex" id="navbarScroll">
          {/* Categories dropdown */}
          {/* <ul className="navbar-nav me-3 my-2 my-lg-0 navbar-nav-scroll">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categories
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Action</a></li>
                <li><a className="dropdown-item" href="#">Another action</a></li>
                <li><a className="dropdown-item" href="#">Something else here</a></li>
              </ul>
            </li>
          </ul> */}

          {/* Search bar (desktop only) */}
{/* Search bar (desktop only) */}
<div className="search-container position-relative flex-grow-1 mx-3" style={{ maxWidth: "600px" }}>
  <form className="d-flex flex-grow-1" role="search">
    <div
      className="input-group rounded-pill custom-search w-100"
      style={{ overflow: "hidden", height: "48px" }}
    >
      <input
        type="search"
        className="form-control border-0"
        placeholder="What would you like to learn?"
        aria-label="Search"
        value={query}
        onChange={handleSearch}
      />
      <button
        className="btn btn-info d-flex align-items-center justify-content-center search-btn"
        type="submit"
      >
        <IoMdSearch size={20} className="text-white" />
      </button>
    </div>
  </form>

  {/* 🔽 Desktop Search Results */}
  {results.length > 0 && (
    <div
      className="search-results position-absolute bg-white shadow rounded mt-1"
      style={{ width: "90%", zIndex: 1050 }}
    >
      {results.map((item, idx) => (
        <Link
          key={idx}
          to={`/search?q=${encodeURIComponent(item)}`}
          className="d-block p-2 text-dark text-decoration-none border-bottom"
          onClick={() => setResults([])}
        >
          {item}
        </Link>
      ))}
    </div>
  )}
</div>

          {/* Buttons */}
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-outline-info rounded-pill px-3 text-nowrap">
             <Link to="/login" className="btn btn-sm text-nowrap login-btn-link">
                     Log in
             </Link>
             </button>
            <button className="btn btn-info rounded-pill px-3 text-white text-nowrap">
              <Link to="/register" className="btn btn-sm text-white text-nowrap">
                     Sign up
             </Link></button>
          </div>
        </div>
      </div>
            {showSearch && (
        <div className="mobile-search-overlay position-fixed top-0 start-0 w-100 h-100 bg-white p-3 d-lg-none" style={{ zIndex: 2000 }}>
          <div className="d-flex align-items-center mb-3">
            <form className="flex-grow-1 d-flex flex-row me-2">
              <div
                className="input-group rounded-pill custom-search"
                style={{ overflow: "hidden", height: "48px" }}
              >
                <input
                  type="search"
                  className="form-control border-0"
                  placeholder="What would you like to learn?"
                  aria-label="Search"
                  value={query}
                  onChange={handleSearch}
                />
                <button
                  className="btn btn-info d-flex align-items-center justify-content-center search-btn"
                  type="submit"
                >
                  <IoMdSearch size={20} className="text-white" />
                </button>
              </div>
            
            <button className="btn" onClick={() => setShowSearch(false)}>
              <IoCloseCircleSharp size={28} className="text-danger" />
            </button>
            </form>
          </div>

          {/* Mobile Search Results */}
          {results.length > 0 && (
            <div className="search-results mt-2">
              {results.map((item, idx) => (
                <Link
                  key={idx}
                  to={`/search?q=${encodeURIComponent(item)}`}
                  className="d-block p-2 border-bottom text-dark text-decoration-none"
                  onClick={() => {
                    setShowSearch(false);
                    setResults([]); 
                  }}
                >
                  {item}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
