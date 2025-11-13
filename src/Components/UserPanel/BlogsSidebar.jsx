import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { LuListFilter } from "react-icons/lu";
import "./Course.css";

const BlogsSidebar = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expanded, setExpanded] = useState({ category: true });
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 480);
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Detect screen width change for responsive behavior
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://api.test.hachion.co/course-categories/all"
        );
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Toggle expand/collapse of category section
  const toggleSection = (section) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // ✅ Handle checkbox select/deselect
  const handleCheckboxChange = (category) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updated);
    onFilterChange(updated); // Send selected categories to parent (Blogs.jsx)
  };

  // ✅ Sidebar main content
  const sidebarContent = (
    <div className="Blogsidebar">
      {/* --- Categories --- */}
      <div className="sidebar-section">
        <div className="sidebar-heading" onClick={() => toggleSection("category")}>
          <span>Categories</span>
          {expanded.category ? (
            <IoIosArrowUp className="sidebar-arrow" />
          ) : (
            <IoIosArrowDown className="sidebar-arrow" />
          )}
        </div>

        {expanded.category && (
          <div className="sidebar-options">
            {categories.map((cat) => (
              <label key={cat.id || cat.name} className="sidebar-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.name)}
                  onChange={() => handleCheckboxChange(cat.name)}
                />
                {cat.name}
              </label>
            ))}
          </div>
        )}
      </div>
      <hr className="faq-seperater" />
    </div>
  );

  return (
    <>
      {isMobileView ? (
        <>
          {/* --- Mobile Filter Button --- */}
          <button className="home-start-button" onClick={() => setIsOpen(true)}>
            <LuListFilter style={{ marginBottom: "3px" }} /> Filter
          </button>

          {/* --- Overlay when drawer is open --- */}
          {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}

          {/* --- Drawer --- */}
          <div className={`sidebar-drawer ${isOpen ? "open" : ""}`}>
            <div className="category-drawer-header">
              <button className="filter-close-btn" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>
            {sidebarContent}
          </div>
        </>
      ) : (
        sidebarContent
      )}
    </>
  );
};

export default BlogsSidebar;
