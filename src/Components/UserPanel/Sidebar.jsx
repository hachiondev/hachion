import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosArrowForward, IoIosArrowDown } from 'react-icons/io';
import './Course.css';

const Sidebar = ({ onSelectCategory }) => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All'); // Default category
  const [activeIndex, setActiveIndex] = useState(null); // Track active main menu item
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState(null); // Track open submenu
  const [menuItems, setMenuItems] = useState([]); // Dynamic menu items

  const API_URL = 'https://api.test.hachion.co/course-categories/all';

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            'Authorization': 'Bearer 98A4V2IB5X6V7B671Y18QPWMU9Q5TG4S', // Replace with your token if needed
            'Content-Type': 'application/json',
           
          },
        });

        setMenuItems(response.data); // Assuming response.data is an array of categories
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);


  // Check if mobile view is active (max-width: 480px)
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 480);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setSelectedCategory(selected);
    onSelectCategory(selected); // Update category and display corresponding cards
  };

  const handleMenuItemClick = (index, name) => {
    setActiveIndex(index);
    onSelectCategory(name); // Update selected category and show cards
    setOpenSubmenuIndex(null); // Close submenu if open
  };

  const handleSubmenuToggle = (index) => {
    setOpenSubmenuIndex(openSubmenuIndex === index ? null : index);
  };

  return (
    <div>
      {isMobileView ? (
        // Dropdown for mobile view
        <div>
          <h2 className="mob-sidebar-heading">Categories</h2>
          <div className="mobile-dropdown">
            <h3 className="mob-sidebar-text">Please select Category from the below dropdown</h3>
            <select
              onChange={handleCategoryChange}
              className="dropdown-select"
              value={selectedCategory}
            >
              {menuItems.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        // Sidebar for desktop view
        <div className={`sidebar ${activeIndex !== null ? 'show-cards' : ''}`}>
          <h2 className="sidebar-heading">Categories</h2>
          <ul className="menu">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => handleMenuItemClick(index, item.name)}
                  className={`menu-item ${activeIndex === index ? 'active' : ''}`}
                >
                  {item.name}
                  {item.submenu && item.submenu.length > 0 && (
                    <span onClick={() => handleSubmenuToggle(index)}>
                      {openSubmenuIndex === index ? <IoIosArrowDown /> : <IoIosArrowForward />}
                    </span>
                  )}
                </button>

                {/* Show submenu items when toggled */}
                {openSubmenuIndex === index && item.submenu && item.submenu.length > 0 && (
                  <ul className="submenu">
                    {item.submenu.map((subitem, subIndex) => (
                      <li key={subIndex} className="submenu-item">
                        <button onClick={() => onSelectCategory(subitem)}>{subitem}</button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;