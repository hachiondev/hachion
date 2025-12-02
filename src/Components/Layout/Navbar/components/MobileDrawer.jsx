// src/Components/Navbar/components/MobileDrawer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { GoPerson } from "react-icons/go";
import { PiNotePencilBold, PiCertificateBold } from "react-icons/pi";
import { BsBookmarkHeart, BsCart2 } from "react-icons/bs";
import { MdOutlineRateReview, MdLogout } from "react-icons/md";
import { CgPathOutline } from "react-icons/cg";
import logo from "../../../../Assets/logo.webp";

export default function MobileDrawer({ isOpen, onClose, isLoggedIn, userData, navigate, handleLogout }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className={`sidebar-drawer ${isOpen ? "open" : ""}`}>
        <div className="category-drawer-header">
          <a href="/"><img src={logo} alt="logo" className="logo" /></a>
          <button className="filter-close-btn" aria-label="Close menu" onClick={onClose}>✕</button>
        </div>

        <div className="drawer-body">
          {isLoggedIn ? (
            <>
              <div className="d-flex align-items-center mb-3">
                {userData?.picture ? <img src={userData.picture} alt="avatar" style={{ width:40, height:40, borderRadius:999 }} /> : <div style={{ width:40, height:40, borderRadius:999, background:"#fff", border:"2px solid #00AEEF", display:"grid", placeItems:"center" }}><FaUserAlt /></div>}
                <span className="ms-2">{userData?.name || "User"}</span>
              </div>

              <div className="drawer-item" onClick={() => navigate("/userdashboard/dashboard")}><RxDashboard /> Dashboard</div>
              <div className="drawer-item" onClick={() => navigate("/userdashboard/profile")}><GoPerson /> Profile</div>
              <div className="drawer-item" onClick={() => navigate("/userdashboard/enrolls")}><PiNotePencilBold /> Enrolls</div>
              <div className="drawer-item" onClick={() => navigate("/userdashboard/wishlist")}><BsBookmarkHeart /> Wishlist</div>
              <div className="drawer-item" onClick={() => navigate("/userdashboard/order_history")}><BsCart2 /> Orders</div>
              <div className="drawer-item" onClick={() => navigate("/userdashboard/certificate")}><PiCertificateBold /> Certificates</div>
              <div className="drawer-item" onClick={() => navigate("/userdashboard/review")}><MdOutlineRateReview /> Review</div>
              <div className="drawer-item" onClick={() => navigate("/userdashboard/pathfinder")}><CgPathOutline /> Pathfinder</div>

              <div className="drawer-item" onClick={() => navigate("/coursedetails")}>Explore Courses</div>
              <div className="drawer-item" onClick={() => navigate("/corporate")}>Corporate Training</div>

              <button className="btn btn-info rounded-pill w-100 text-white mt-3" onClick={handleLogout}><MdLogout /> Logout</button>
            </>
          ) : (
            <>
              <div className="drawer-item" onClick={() => navigate("/coursedetails")}>Explore Courses</div>
              <div className="drawer-item" onClick={() => navigate("/corporate")}>Corporate Training</div>
              <Link to="/login" className="btn btn-outline-info rounded-pill w-100 mt-3 fw-bold">Log In</Link>
              <Link to="/register" className="btn btn-info rounded-pill w-100 mt-2 text-white fw-bold">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
