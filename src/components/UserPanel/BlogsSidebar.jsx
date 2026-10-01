"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { LuListFilter } from "react-icons/lu";
import "./CoursePage/Course.css";
import { API_BASE_URL } from "@/lib/apiBase";
const BlogsSidebar = ({
  onFilterChange,
  onCategoriesLoaded
}) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expanded, setExpanded] = useState({
    category: true
  });
  // Starts false (not window.innerWidth <= 480 like the CRA original) so
  // server and the client's first hydration pass render identically.
  const [isMobileView, setIsMobileView] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsMobileView(window.innerWidth <= 480);
    const handleResize = () => setIsMobileView(window.innerWidth <= 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/blog/categories`);
        if (Array.isArray(response.data)) {
          setCategories(response.data);
          onCategoriesLoaded?.(response.data);
        }
      } catch (error) {
        console.error("Error fetching blog categories:", error);
      }
    };
    fetchCategories();
    // onCategoriesLoaded intentionally omitted: this fetch should only ever
    // run once per mount, not re-run because the parent passed a new
    // function reference.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const toggleSection = section => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  const handleCheckboxChange = category => {
    const updated = selectedCategories.includes(category) ? selectedCategories.filter(c => c !== category) : [...selectedCategories, category];
    setSelectedCategories(updated);
    onFilterChange(updated);
  };
  const sidebarContent = <div className="Blogsidebar">
      {/* --- Categories --- */}
      <div className="sidebar-section">
        <div className="sidebar-heading" role="button" tabIndex={0} onClick={() => toggleSection("category")} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggleSection("category")}>
          <span>Categories</span>
          {expanded.category ? <IoIosArrowUp className="sidebar-arrow" /> : <IoIosArrowDown className="sidebar-arrow" />}
        </div>

        {expanded.category && <div className="sidebar-options">
            {categories.map(cat => <label key={cat} className="sidebar-checkbox">
                <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => handleCheckboxChange(cat)} />
                {cat}
              </label>)}
          </div>}
      </div>
      <hr className="faq-seperater" />
    </div>;
  return <>
      {isMobileView ? <>
          {/* --- Mobile Filter Button --- */}
          <button className="home-start-button" onClick={() => setIsOpen(true)}>
            <LuListFilter /> Filter
          </button>

          {/* --- Overlay when drawer is open --- */}
          {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}

          {/* --- Drawer --- */}
          <div className={`sidebar-drawer ${isOpen ? "open" : ""}`}>
            <div className="category-drawer-header">
              <button className="filter-close-btn" aria-label="Close filters" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>
            {sidebarContent}
          </div>
        </> : sidebarContent}
    </>;
};
export default BlogsSidebar;
