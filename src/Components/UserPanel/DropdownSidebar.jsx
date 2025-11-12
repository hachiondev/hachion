import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdArrowForwardIos } from "react-icons/md";
import "./Course.css";

const DropdownSidebar = ({ onSelectCategory }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  const API_URL = "https://api.hachion.co/course-categories/all";

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: "Bearer 98A4V2IB5X6V7B671Y18QPWMU9Q5TG4S",
            "Content-Type": "application/json",
          },
        });
        setMenuItems(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Set first category as default active
  useEffect(() => {
    if (menuItems.length > 0 && activeIndex === null) {
      setActiveIndex(0);
      onSelectCategory(menuItems[0].name);
    }
  }, [menuItems, activeIndex, onSelectCategory]);

  const handleMenuItemClick = (index, name) => {
    setActiveIndex(index);
    onSelectCategory(name);
  };

  return (
    <div className="scrollable-category-list">
      <ul className="category-menu">
        {menuItems.map((item, index) => (
          <li key={item._id || index}>
            <button
              onClick={() => handleMenuItemClick(index, item.name)}
              onMouseEnter={() => handleMenuItemClick(index, item.name)}
              className={`category-menu-item ${
                activeIndex === index ? "active" : ""
              }`}
              style={{ padding: "4px 8px", fontWeight: "400" }}
            >
              <span className="category-menu-text">{item.name}</span>
              <MdArrowForwardIos className="category-menu-arrow" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownSidebar;
