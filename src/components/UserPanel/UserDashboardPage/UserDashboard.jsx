"use client";

import React, { useState, useEffect } from "react";
import "../Dashboard.css";
import { RxDashboard } from "react-icons/rx";
import { PiNotePencilBold, PiCertificateBold } from "react-icons/pi";
import { MdOutlineRateReview } from "react-icons/md";
import { GoPerson } from "react-icons/go";
import UserDashboardCard from "./components/UserDashboardCard";
import UserEnrolled from "./components/UserEnrolled";
import UserOrders from "./components/UserOrders";
import UserCertificate from "./components/UserCertificate";
import UserReviews from "./components/UserReviews";
import UserPathfinder from "./components/UserPathfinder";
import UserProfile from "./components/UserProfile";
import { BiArrowToLeft, BiArrowToRight } from "react-icons/bi";
import { useParams, useRouter } from "next/navigation";
import { CgPathOutline, CgMenuGridR } from "react-icons/cg";
import { BsBookmarkHeart, BsCart2 } from "react-icons/bs";
import UserWishlist from "./components/UserWishlist";

// Ported from the CRA app's UserDashboardPage/UserDashboard.jsx.
// "Applied Jobs" and "Settings" menu items stay dropped — they were already
// commented out (dead) in the CRA source.
const menuItems = [
  { title: "Dashboard", slug: "dashboard", icon: <RxDashboard /> },
  { title: "User Profile", slug: "profile", icon: <GoPerson /> },
  { title: "Enrolls", slug: "enrolls", icon: <PiNotePencilBold /> },
  { title: "Wishlist", slug: "wishlist", icon: <BsBookmarkHeart /> },
  { title: "Order History", slug: "order_history", icon: <BsCart2 /> },
  { title: "Certificate", slug: "certificate", icon: <PiCertificateBold /> },
  { title: "Review", slug: "review", icon: <MdOutlineRateReview /> },
  { title: "Pathfinder", slug: "pathfinder", icon: <CgPathOutline /> },
];

export default function UserDashboard() {
  const params = useParams();
  const router = useRouter();
  const section = Array.isArray(params?.section) ? params.section[0] : params?.section;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const urlSlug = (section || "").toLowerCase();
    const storedSlug = localStorage.getItem("selectedCategorySlug");

    let idx = menuItems.findIndex((m) => m.slug === urlSlug);
    if (idx === -1 && !urlSlug && storedSlug) {
      const storedIdx = menuItems.findIndex((m) => m.slug === storedSlug);
      if (storedIdx !== -1) {
        router.replace(`/userdashboard/${storedSlug}`);
        idx = storedIdx;
      }
    }
    if (idx === -1) idx = 0;

    setActiveIndex(idx);
    localStorage.setItem("selectedCategorySlug", menuItems[idx].slug);
  }, [section, router]);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 480);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuItemClick = (index) => {
    const slug = menuItems[index].slug;
    setActiveIndex(index);
    localStorage.setItem("selectedCategorySlug", slug);
    router.push(`/userdashboard/${slug}`);
    if (isMobileView) setIsSidebarOpen(false);
  };

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const renderSelectedComponent = () => {
    const current = menuItems[activeIndex]?.title || "Dashboard";
    switch (current) {
      case "Dashboard":
        return <UserDashboardCard />;
      case "User Profile":
        return <UserProfile />;
      case "Order History":
        return <UserOrders />;
      case "Certificate":
        return <UserCertificate />;
      case "Enrolls":
        return <UserEnrolled />;
      case "Wishlist":
        return <UserWishlist />;
      case "Review":
        return <UserReviews />;
      case "Pathfinder":
        return <UserPathfinder />;
      default:
        return <UserDashboardCard />;
    }
  };

  return (
    <>
      {isMobileView && (
        <button className="home-start-button" onClick={() => setIsSidebarOpen(true)}>
          <CgMenuGridR /> Menu
        </button>
      )}

      <div className="user-dashboard container">
        {isMobileView && isSidebarOpen && <div className="overlay" onClick={() => setIsSidebarOpen(false)} />}

        <div className={`sidebar-user ${isSidebarCollapsed ? "collapsed" : ""} ${isMobileView && isSidebarOpen ? "open" : ""}`}>
          {!isMobileView && (
            <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
              {isSidebarCollapsed ? <BiArrowToRight /> : <BiArrowToLeft />}
            </button>
          )}

          {isMobileView && (
            <button className="filter-close-btn" onClick={() => setIsSidebarOpen(false)}>
              ✕
            </button>
          )}

          <ul className="menu-list-user">
            {menuItems.map((item, index) => (
              <li key={item.slug} className="menu-item-container">
                <button onClick={() => handleMenuItemClick(index)} className={`menu-item-user ${activeIndex === index ? "active" : ""}`}>
                  <span className="menu-icon">{item.icon}</span>
                  {!isSidebarCollapsed && <span>{item.title}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="user-dashboard-content">{renderSelectedComponent()}</div>
      </div>
    </>
  );
}
