// src/Components/Navbar/components/UserMenu.jsx
import React from "react";
import { Link } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { GoPerson } from "react-icons/go";
import { PiNotePencilBold, PiCertificateBold } from "react-icons/pi";
import { BsBookmarkHeart, BsCart2 } from "react-icons/bs";
import { MdOutlineRateReview, MdLogout } from "react-icons/md";
import { CgPathOutline } from "react-icons/cg";

export default function UserMenu({ userData, isOpen, onClose, onLogout }) {
  if (!isOpen) return null;

  const menu = [
    { to: "/userdashboard/dashboard", icon: RxDashboard, label: "Dashboard" },
    { to: "/userdashboard/profile", icon: GoPerson, label: "Profile" },
    { to: "/userdashboard/enrolls", icon: PiNotePencilBold, label: "Enrolls" },
    { to: "/userdashboard/wishlist", icon: BsBookmarkHeart, label: "Wishlist" },
    { to: "/userdashboard/order_history", icon: BsCart2, label: "Orders" },
    { to: "/userdashboard/certificate", icon: PiCertificateBold, label: "Certificates" },
    { to: "/userdashboard/review", icon: MdOutlineRateReview, label: "Review" },
    { to: "/userdashboard/pathfinder", icon: CgPathOutline, label: "Pathfinder" },
  ];

  return (
    <ul className="dropdown-menu dropdown-menu-end show">
      {menu.map(({ to, icon: Icon, label }) => (
        <li key={to}>
          <Link className="dropdown-item" to={to} onClick={onClose}><Icon /> {label}</Link>
        </li>
      ))}
      <li>
        <button className="dropdown-item" onClick={onLogout}><MdLogout /> Logout</button>
      </li>
    </ul>
  );
}
