// src/Components/Navbar/components/ExploreDropdown.jsx
import React, { lazy, Suspense } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

const DropdownSidebar = lazy(() => import("../../../UserPanel/DropdownSidebar"));
const DropdownCourseList = lazy(() => import("../../../UserPanel/DropdownCourseList"));

export default function ExploreDropdown({ isOpen, setIsOpen, selectedCategory, setSelectedCategory }) {
  return (
    <>
      <button
        className="nav-link"
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => setIsOpen(s => !s)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        style={{ color: "#000000", fontWeight: 500, background: "none", border: "none" }}
      >
        Explore Courses{" "}
        <span className="ms-1 arrow-icon" aria-hidden="true">
          {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
        </span>
      </button>

      {isOpen && (
        <ul className="dropdown-menu custom-dropdown-menu show" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
          <li>
            <div className="course-content">
              <div className="scrollable-category-list">
                <Suspense fallback={<div>Loading...</div>}>
                  <DropdownSidebar onSelectCategory={setSelectedCategory} selectedCategory={selectedCategory} />
                </Suspense>
              </div>

              <div className="sidebar-right-container">
                <Suspense fallback={<div>Loading courses...</div>}>
                  <DropdownCourseList category={selectedCategory} />
                </Suspense>
                <li>
                  <button className="dropdown-all-btn" onClick={() => window.location.assign("/coursedetails")}>Explore All Courses</button>
                </li>
              </div>
            </div>
          </li>
        </ul>
      )}
    </>
  );
}
