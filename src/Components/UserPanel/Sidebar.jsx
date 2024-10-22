import React, { useState, useEffect } from 'react';
import { IoIosArrowForward, IoIosArrowDown } from 'react-icons/io';
import './Course.css';

const Sidebar = ({ onSelectCategory }) => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All'); // Default category
  const [activeIndex, setActiveIndex] = useState(null); // Track active main menu item
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState(null); // Track open submenu

  const menuItems = [
    { title: 'All', submenu: [] },
    { title: 'Project Management', submenu: ['PMP', 'Business Analyst'] },
    { title: 'QA Testing', submenu: ['QA Automation', 'Load Runner', 'QA Manual Testing', 'Mobile App Testing'] },
    { title: 'Data Science', submenu: ['Python', 'DataScience with Python', 'Data Science with R'] },
    { title: 'Programming', submenu: ['Java Full Stack Development', 'PHP with MySQL', 'UI/UX Design', 'Microsoft .NET', 'Angular JS Training', 'Node js', 'MongoDB Training', 'JavaScript Course', 'JQuery Training', 'React JS Training', 'SQL'] },
    { title: 'Salesforce', submenu: ['Salesforce Developer', 'Salesforce Admin', 'Salesforce Lightning', 'Salesforce Admin Developer Lightning', 'Salesforce Admin Developer'] },
    { title: 'ServiceNow', submenu: ['ServiceNow'] },
    { title: 'Cloud Computing', submenu: ['AWS Solution Architecture', 'AWS Developer', 'AWS SysOps Admin', 'Google Cloud', 'DevOps', 'Internet of Things', 'Snowflake'] },
    { title: 'Workday', submenu: ['Subitem 1', 'Subitem 2'] },
    { title: 'Mulesoft', submenu: ['Subitem 1', 'Subitem 2'] },
    { title: 'Cyber Security', submenu: ['Subitem 1', 'Subitem 2'] },
    { title: 'Machine learning', submenu: ['Subitem 1', 'Subitem 2'] },
    { title: 'BlockChain', submenu: ['Subitem 1', 'Subitem 2'] },
    { title: 'Deep Learning', submenu: ['Subitem 1', 'Subitem 2'] },
    { title: 'Data Warehousing & ETL', submenu: ['Subitem 1', 'Subitem 2'] },
    { title: 'Mobile Development', submenu: ['Subitem 1', 'Subitem 2'] },
    { title: 'Big Data', submenu: ['Big Data Hadoop', 'Spark and Scala'] },
    { title: 'RPA', submenu: ['Blue Prism', 'Automation Anywhere', 'RPA UI Path'] },
    { title: 'BPM', submenu: ['Subitem 1', 'Subitem 2'] },
    { title: 'Flutter', submenu: ['Subitem 1', 'Subitem 2'] },
    { title: 'Microsoft', submenu: ['Subitem 1', 'Subitem 2'] },
    { title: 'Scrum Master', submenu: ['Subitem 1', 'Subitem 2'] },
  ];

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

  const handleMenuItemClick = (index, title) => {
    setActiveIndex(index);
    onSelectCategory(title); // Update selected category and show cards
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
          <h3 className="mob-sidebar-heading">Categories</h3>
        <div className="mobile-dropdown">
        <h3 className="mob-sidebar-text">Please select Category from the below dropdown</h3>
          <select
            onChange={handleCategoryChange}
            className="dropdown-select"
            value={selectedCategory}
          >
            {menuItems.map((item, index) => (
              <option key={index} value={item.title}>
                {item.title}
              </option>
            ))}
          </select>
        </div>
        </div>
      ) : (
        // Sidebar for desktop view
        <div className={`sidebar ${activeIndex !== null ? 'show-cards' : ''}`}>
          <h3 className="sidebar-heading">Categories</h3>
          <ul className="menu">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => handleMenuItemClick(index, item.title)}
                  className={`menu-item ${activeIndex === index ? 'active' : ''}`}
                >
                  {item.title}
                  {item.submenu.length > 0 && (
                    <span onClick={() => handleSubmenuToggle(index)}>
                      {openSubmenuIndex === index ? <IoIosArrowDown /> : <IoIosArrowForward />}
                    </span>
                  )}
                </button>

                {/* Show submenu items when toggled */}
                {openSubmenuIndex === index && item.submenu.length > 0 && (
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