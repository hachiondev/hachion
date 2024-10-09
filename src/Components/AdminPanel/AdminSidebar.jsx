import React, { useState } from 'react';
import { FaTachometerAlt, FaBook } from 'react-icons/fa';
import { TbCategoryPlus } from 'react-icons/tb';
import { MdLiveTv } from 'react-icons/md';
import { FaMoneyBillTrendUp } from 'react-icons/fa6';
import { TbDiscount } from 'react-icons/tb';
import { LiaChalkboardTeacherSolid } from 'react-icons/lia';
import { TbCertificate } from 'react-icons/tb';
import { FaRegPenToSquare } from 'react-icons/fa6';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import { BiSolidBookContent } from 'react-icons/bi';
import { MdOutlineVideoCameraFront } from 'react-icons/md';
import { BiSupport } from 'react-icons/bi';
import { FaHandshakeAngle } from 'react-icons/fa6';
import { LuFocus } from 'react-icons/lu';
import { HiOutlineDotsCircleHorizontal } from 'react-icons/hi';

import './Admin.css';

const AdminSidebar = ({ onSelectCategory }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const menuItems = [
    { title: 'Dashboard', icon: <FaTachometerAlt /> },
    { title: 'Course Category', icon: <TbCategoryPlus /> },
    { title: 'Course', icon: <FaBook /> },
    { title: 'Live Demo & Live Class', icon: <MdLiveTv /> },
    { title: 'Trending Courses', icon: <FaMoneyBillTrendUp /> },
    { title: 'Discount Courses', icon: <TbDiscount /> },
    { title: 'Trainer', icon: <LiaChalkboardTeacherSolid /> },
    { title: 'Certificate', icon: <TbCertificate /> },
    { title: 'All Enroll', icon: <FaRegPenToSquare /> },
    { title: 'Payment Status', icon: <RiMoneyDollarCircleFill /> },
    { title: 'Registration', icon: <BiSolidBookContent /> },
    { title: 'Schedule Request', icon: <BiSolidBookContent /> },
    { title: 'Blog', icon: <MdOutlineVideoCameraFront /> },
    { title: 'Support', icon: <BiSupport /> },
    { title: 'Internship', icon: <FaHandshakeAngle /> },
    { title: 'Live Class Tracking', icon: <LuFocus /> },
    { title: 'Other', icon: <HiOutlineDotsCircleHorizontal /> },
  ];

  const handleMenuItemClick = (index, title) => {
    setActiveIndex(index);
    onSelectCategory(title); // Call the function to notify the parent component
  };

  return (
    <div className="sidebar-admin">
      <h3 className='sidebar-heading-admin'>Admin</h3>
      <ul className="menu-list-admin">
        {menuItems.map((item, index) => (
          <li key={index} className="menu-item-container">
            <button
              onClick={() => handleMenuItemClick(index, item.title)}
              className={`menu-item-admin ${activeIndex === index ? 'active' : ''}`}
            >
              <span className="menu-icon">{item.icon}</span>
              <span>{item.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
