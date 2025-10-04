// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { IoIosArrowForward, IoIosArrowDown } from 'react-icons/io';
// import './Course.css';

// const Sidebar = ({ onSelectCategory }) => {
//   const [isMobileView, setIsMobileView] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState('All'); // Default category
//   const [activeIndex, setActiveIndex] = useState(null); // Track active main menu item
//   const [openSubmenuIndex, setOpenSubmenuIndex] = useState(null); // Track open submenu
//   const [menuItems, setMenuItems] = useState([]); // Dynamic menu items

//   const API_URL = 'https://api.test.hachion.co/course-categories/all';

//   // Fetch categories from the API
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(API_URL, {
//           headers: {
//             'Authorization': 'Bearer 98A4V2IB5X6V7B671Y18QPWMU9Q5TG4S', // Replace with your token if needed
//             'Content-Type': 'application/json',
           
//           },
//         });

//         setMenuItems(response.data); // Assuming response.data is an array of categories
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       }
//     };

//     fetchCategories();
//   }, []);


//   // Check if mobile view is active (max-width: 480px)
// useEffect(() => {
//   const mediaQuery = window.matchMedia("(max-width: 480px)");

//   const handleResize = () => {
//     setIsMobileView(mediaQuery.matches);
//   };

//   handleResize(); // Initial match check
//   mediaQuery.addEventListener("change", handleResize);

//   return () => {
//     mediaQuery.removeEventListener("change", handleResize);
//   };
// }, []);

//   const handleCategoryChange = (e) => {
//     const selected = e.target.value;
//     setSelectedCategory(selected);
//     onSelectCategory(selected); // Update category and display corresponding cards
//   };

//   const handleMenuItemClick = (index, name) => {
//     setActiveIndex(index);
//     onSelectCategory(name); // Update selected category and show cards
//     setOpenSubmenuIndex(null); // Close submenu if open
//   };

//   const handleSubmenuToggle = (index) => {
//     setOpenSubmenuIndex(openSubmenuIndex === index ? null : index);
//   };

//   return (
//     <div>
//       {isMobileView ? (
//         // Dropdown for mobile view
//         <div>
//           <h2 className="mob-sidebar-heading">Categories</h2>
//           <div className="mobile-dropdown">
//             <h3 className="mob-sidebar-text">Please select Category from the below dropdown</h3>
//             <select
//               onChange={handleCategoryChange}
//               className="dropdown-select"
//               value={selectedCategory}
//             >
//               {menuItems.map((item, index) => (
//                 <option key={index} value={item.name}>
//                   {item.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       ) : (
//         // Sidebar for desktop view
//         <div className={`sidebar ${activeIndex !== null ? 'show-cards' : ''}`}>
//           <h2 className="sidebar-heading">Categories</h2>
//           <ul className="menu">
//             {menuItems.map((item, index) => (
//               <li key={index}>
//                 <button
//                   onClick={() => handleMenuItemClick(index, item.name)}
//                   className={`menu-item ${activeIndex === index ? 'active' : ''}`}
//                 >
//                   {item.name}
//                   {item.submenu && item.submenu.length > 0 && (
//                     <span onClick={() => handleSubmenuToggle(index)}>
//                       {openSubmenuIndex === index ? <IoIosArrowDown /> : <IoIosArrowForward />}
//                     </span>
//                   )}
//                 </button>

//                 {/* Show submenu items when toggled */}
//                 {openSubmenuIndex === index && item.submenu && item.submenu.length > 0 && (
//                   <ul className="submenu">
//                     {item.submenu.map((subitem, subIndex) => (
//                       <li key={subIndex} className="submenu-item">
//                         <button onClick={() => onSelectCategory(subitem)}>{subitem}</button>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Sidebar;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { LuListFilter } from "react-icons/lu";
import "./Course.css";

const Sidebar = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState(["All Levels"]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [expanded, setExpanded] = useState({
    category: true,
    level: true,
    price: true,
  });
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 480);
  const [isOpen, setIsOpen] = useState(false);

  const LEVELS = ["All Levels", "Beginner", "Intermediate", "Expert"];
  const PRICE = ["Free", "Paid"];

  // handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 480);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // fetch categories
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

  const toggleSection = (section) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (value, type) => {
    let updated;
    if (type === "category") {
      updated = selectedCategories.includes(value)
        ? selectedCategories.filter((c) => c !== value)
        : [...selectedCategories, value];
      setSelectedCategories(updated);
    } else if (type === "level") {
      if (value === "All Levels") {
        updated = ["All Levels"];
      } else {
        updated = selectedLevels.includes(value)
          ? selectedLevels.filter((l) => l !== value)
          : [...selectedLevels.filter((l) => l !== "All Levels"), value];
      }
      setSelectedLevels(updated);
    } else if (type === "price") {
      updated = selectedPrice.includes(value)
        ? selectedPrice.filter((p) => p !== value)
        : [...selectedPrice, value];
      setSelectedPrice(updated);
    }

    onFilterChange({
      categories: type === "category" ? updated : selectedCategories,
      levels: type === "level" ? updated : selectedLevels,
      price: type === "price" ? updated : selectedPrice,
    });
  };

  const sidebarContent = (
    <div className="sidebar">
      {/* Categories */}
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
              <label key={cat.id} className="sidebar-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.name)}
                  onChange={() => handleCheckboxChange(cat.name, "category")}
                />
                {cat.name}
              </label>
            ))}
          </div>
        )}
      </div>
      <hr className="faq-seperater" />

      {/* Levels */}
      <div className="sidebar-section">
        <div className="sidebar-heading" onClick={() => toggleSection("level")}>
          <span>Levels</span>
          {expanded.level ? (
            <IoIosArrowUp className="sidebar-arrow" />
          ) : (
            <IoIosArrowDown className="sidebar-arrow" />
          )}
        </div>
        {expanded.level && (
          <div className="sidebar-options">
            {LEVELS.map((level) => (
              <label key={level} className="sidebar-checkbox">
                <input
                  type="checkbox"
                  checked={selectedLevels.includes(level)}
                  onChange={() => handleCheckboxChange(level, "level")}
                />
                {level}
              </label>
            ))}
          </div>
        )}
      </div>
      <hr className="faq-seperater" />

      {/* Price */}
      <div className="sidebar-section">
        <div className="sidebar-heading" onClick={() => toggleSection("price")}>
          <span>Price</span>
          {expanded.price ? (
            <IoIosArrowUp className="sidebar-arrow" />
          ) : (
            <IoIosArrowDown className="sidebar-arrow" />
          )}
        </div>
        {expanded.price && (
          <div className="sidebar-options">
            {PRICE.map((p) => (
              <label key={p} className="sidebar-checkbox">
                <input
                  type="checkbox"
                  checked={selectedPrice.includes(p)}
                  onChange={() => handleCheckboxChange(p, "price")}
                />
                {p}
              </label>
            ))}
          </div>
        )}
      </div>
      <hr className="faq-seperater" />
      <div className="sidebar-offer">
      <h3 className="home-blog-title">Get 50% Off Development Courses!</h3>
      <p className="home-sub-text">Hurry! Sale Ends in 2 Days</p>
      <button className="home-start-button">Start Today</button>
      </div>
    </div>
  );

  return (
    <>
      {isMobileView ? (
        <>
          <button className="home-start-button" onClick={() => setIsOpen(true)}>
            <LuListFilter style={{marginBottom: '3px'}}/> Filter
          </button>
          {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}
          <div className={`sidebar-drawer ${isOpen ? "open" : ""}`}>
            <div className="category-drawer-header">
              {/* <span>Filters</span> */}
              <button className="filter-close-btn" onClick={() => setIsOpen(false)}>✕</button>
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

export default Sidebar;

