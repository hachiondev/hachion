import React, { useState } from 'react';
import {FaTachometerAlt, FaBook} from 'react-icons/fa';
import {FaMoneyBillTrendUp, FaRegPenToSquare, FaHandshakeAngle} from 'react-icons/fa6';
import { TbCategoryPlus, TbDiscount, TbCertificate} from 'react-icons/tb';
import { LiaChalkboardTeacherSolid } from 'react-icons/lia';
import { MdLiveTv, MdOutlineVideoCameraFront, MdCorporateFare} from 'react-icons/md';
import { RiMoneyDollarCircleFill} from 'react-icons/ri';
import { BiSolidBookContent, BiSupport, BiArrowToLeft, BiArrowToRight} from 'react-icons/bi';
import { LuFocus} from 'react-icons/lu';
import { HiOutlineDotsCircleHorizontal} from 'react-icons/hi';
import { IoNewspaperOutline} from 'react-icons/io5';
import './Admin.css';
const menuItems = [
  { title: 'Dashboard', icon: <FaTachometerAlt /> },
  { title: 'Course Category', icon: <TbCategoryPlus /> },
  { title: 'Course', icon: <FaBook /> },
  { title: 'Corporate Training', icon: <MdCorporateFare /> },
  { title: 'Live Demo & Live Class', icon: <MdLiveTv /> },
  { title: 'Trending Courses', icon: <FaMoneyBillTrendUp /> },
  { title: 'Discount Courses', icon: <TbDiscount /> },
  { title: 'Trainer', icon: <LiaChalkboardTeacherSolid /> },
  { title: 'Certificate', icon: <TbCertificate /> },
  { title: 'All Enroll', icon: <FaRegPenToSquare /> },
  { title: 'Payment Status', icon: <RiMoneyDollarCircleFill /> },
  { title: 'Registration', icon: <BiSolidBookContent /> },
  { title: 'Reports', icon: <IoNewspaperOutline /> },
  { title: 'Schedule Request', icon: <BiSolidBookContent /> },
  { title: 'Blog', icon: <MdOutlineVideoCameraFront /> },
  { title: 'Support', icon: <BiSupport /> },
  { title: 'Internship', icon: <FaHandshakeAngle /> },
  { title: 'Live Class Tracking', icon: <LuFocus /> },
  { title: 'Other', icon: <HiOutlineDotsCircleHorizontal /> },
];
const AdminSidebar = ({ onSelectCategory = () => {} }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const handleMenuItemClick = (index, title) => {
    setActiveIndex(index);
    onSelectCategory(title);
  };
  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };
  return (
    <aside className={`sidebar-admin ${isSidebarCollapsed ? 'collapsed' : ''}`} aria-label="Admin Sidebar">
      <div className="heading-admin">
        <div className="sidebar-heading-admin">
          {!isSidebarCollapsed && <h3>Admin</h3>}
        </div>
        <div className="sidebar-toggle">
          <button onClick={toggleSidebar} className="toggle-btn" aria-label="Toggle Sidebar">
            {isSidebarCollapsed ? <BiArrowToRight /> : <BiArrowToLeft />}
          </button>
        </div>
      </div>
      <ul className="menu-list-admin">
        {menuItems.map((item, index) => (
          <li key={index} className="menu-item-container-admin">
            <button
              onClick={() => handleMenuItemClick(index, item.title)}
              className={`menu-item-admin ${activeIndex === index ? 'active' : ''}`}
              aria-current={activeIndex === index ? 'true' : undefined}
              aria-label={item.title}
            >
              <span className="menu-icon">{item.icon}</span>
              {!isSidebarCollapsed && <span className="menu-title">{item.title}</span>}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};
export default AdminSidebar;