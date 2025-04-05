import React, { useState } from "react";
import { FaTachometerAlt, FaBook } from "react-icons/fa";
import { TbCategoryPlus } from "react-icons/tb";
import { MdLiveTv } from "react-icons/md";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { TbDiscount } from "react-icons/tb";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { TbCertificate } from "react-icons/tb";
import { FaRegPenToSquare } from "react-icons/fa6";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { BiSolidBookContent } from "react-icons/bi";
import { MdOutlineVideoCameraFront } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { FaHandshakeAngle } from "react-icons/fa6";
import { LuFocus } from "react-icons/lu";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import { BiArrowToLeft, BiArrowToRight } from "react-icons/bi";
import { IoNewspaperOutline } from "react-icons/io5";
import { MdCorporateFare } from "react-icons/md";
import "./Admin.css";

const AdminSidebar = ({ onSelectCategory }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const menuItems = [
    { title: "Dashboard", icon: <FaTachometerAlt /> },
    { title: "Course Category", icon: <TbCategoryPlus /> },
    { title: "Course", icon: <FaBook /> },
    { title: "Corporate Training", icon: <MdCorporateFare /> },
    { title: "Live Demo & Live Class", icon: <MdLiveTv /> },
    { title: "Trending Courses", icon: <FaMoneyBillTrendUp /> },
    { title: "Discount Courses", icon: <TbDiscount /> },
    { title: "Trainer", icon: <LiaChalkboardTeacherSolid /> },
    { title: "Certificate", icon: <TbCertificate /> },
    { title: "All Enroll", icon: <FaRegPenToSquare /> },
    { title: "Payment Status", icon: <RiMoneyDollarCircleFill /> },
    { title: "Registration", icon: <BiSolidBookContent /> },
    { title: "Reports", icon: <IoNewspaperOutline /> },
    { title: "Schedule Request", icon: <BiSolidBookContent /> },
    { title: "Blog", icon: <MdOutlineVideoCameraFront /> },
    { title: "Support", icon: <BiSupport /> },
    { title: "Internship", icon: <FaHandshakeAngle /> },
    { title: "Live Class Tracking", icon: <LuFocus /> },
    { title: "Other", icon: <HiOutlineDotsCircleHorizontal /> },
  ];

  const handleMenuItemClick = (index, title) => {
    setActiveIndex(index);
    onSelectCategory(title);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={`sidebar-admin ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <div className="heading-admin">
        <div className="sidebar-heading-admin">
          {!isSidebarCollapsed && <h3>Admin</h3>}
        </div>
        <div className="sidebar-toggle">
          <button onClick={toggleSidebar} className="toggle-btn">
            {isSidebarCollapsed ? <BiArrowToRight /> : <BiArrowToLeft />}
          </button>
        </div>
      </div>
      <ul className="menu-list-admin">
        {menuItems.map((item, index) => (
          <li key={index} className="menu-item-container-admin">
            <button
              onClick={() => handleMenuItemClick(index, item.title)}
              className={`menu-item-admin ${
                activeIndex === index ? "active" : ""
              }`}
            >
              <span className="menu-icon">{item.icon}</span>
              {!isSidebarCollapsed && (
                <span className="menu-title">{item.title}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
