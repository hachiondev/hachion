import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosArrowForward, IoIosArrowDown } from 'react-icons/io';
import './Course.css';

const DropdownSidebar = ({ onSelectCategory }) => {
  const [activeIndex, setActiveIndex] = useState(null); // Track active main menu item
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState(null); // Track open submenu
  const [menuItems, setMenuItems] = useState([]); // Dynamic menu items

  const API_URL = 'https://api.hachion.co/course-categories/all';

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            'Authorization': 'Bearer 98A4V2IB5X6V7B671Y18QPWMU9Q5TG4S',
            'Content-Type': 'application/json',
           
          },
        });

        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleMenuItemClick = (index, name) => {
    setActiveIndex(index);
    onSelectCategory(name);
    setOpenSubmenuIndex(null);
  };

  const handleSubmenuToggle = (index) => {
    setOpenSubmenuIndex(openSubmenuIndex === index ? null : index);
  };

  return (
    <div>
        <div className={`dropdown-sidebar ${activeIndex !== null ? 'show-cards' : ''}`}>
          <ul className="menu">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => handleMenuItemClick(index, item.name)}
                  onMouseEnter={() => handleMenuItemClick(index, item.name)}
                  className={`menu-item ${activeIndex === index ? 'active' : ''}`}
                  style={{padding: '4px 8px', fontWeight: '500'}}
                >
                  {item.name}
                  {item.submenu && item.submenu.length > 0 && (
                    <span onClick={() => handleSubmenuToggle(index)}>
                      {openSubmenuIndex === index ? <IoIosArrowDown /> : <IoIosArrowForward />}
                    </span>
                  )}
                </button>

                {openSubmenuIndex === index && item.submenu && item.submenu.length > 0 && (
                  <ul className="submenu">
                    {item.submenu.map((subitem, subIndex) => (
                      <li key={subIndex} className="submenu-item">
                        <button onClick={() => onSelectCategory(subitem.name)}>{subitem}</button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
    </div>
  );
};

export default DropdownSidebar;