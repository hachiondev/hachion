import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { FaUserAlt } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { PiLineVerticalThin } from "react-icons/pi";
import { IoIosMail } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import profile1 from "../../Assets/profile2.png";
import whatsapp from "../../Assets/logos_whatsapp-icon.png";
import "./Home.css";

const Topbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [whatsappNumber, setWhatsappNumber] = useState("+1 (732) 485-2499");
  const [whatsappLink, setWhatsappLink] = useState("https://wa.me/17324852499");

  useEffect(() => {
    const detectUserCountry = async () => {
      try {
        const res = await fetch("https://ipwho.is/");
        if (!res.ok) throw new Error("Failed to fetch location data");

        const data = await res.json();

        if (data.country_code === "IN") {
          setWhatsappNumber("+91-949-032-3388");
          setWhatsappLink("https://wa.me/919490323388");
        } else {
          setWhatsappNumber("+1 (732) 485-2499");
          setWhatsappLink("https://wa.me/17324852499");
        }
      } catch (error) {
        console.error("❌ Location fetch error:", error);
        // fallback to US number
        setWhatsappNumber("+1 (732) 485-2499");
        setWhatsappLink("https://wa.me/17324852499");
      }
    };

    detectUserCountry();

    const storedUserData = localStorage.getItem("loginuserData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loginuserData");
    setIsLoggedIn(false);
    setUserData(null);
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <p className="query-title">Have any query?</p>
        <div className="whatsapp-container">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-link"
          >
            <img src={whatsapp} alt="whatsapp-icon" className="whatsapp-icon" />
            <p className="whatsapp-number">{whatsappNumber}</p>
          </a>
        </div>
        <PiLineVerticalThin className="line-vertical" />
        <IoIosMail className="training-mail-icon" />
        <p className="training-email">
          <a
            href="https://mail.google.com/mail/?view=cm&to=trainings@hachion.co"
            target="_blank"
            rel="noopener noreferrer"
          >
            trainings@hachion.co
          </a>
        </p>
      </div>

      {isLoggedIn ? (
        <div className="topbar-right">
          <div className="user-info">
            <div className="btn-group">
              <Avatar src={userData?.picture || profile1} alt="user_name" />
              <div className="dropdown">
                <Link
                  className="btn-logout dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {userData?.name || "Hachion User"}
                </Link>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/userdashboard">
                      <FaUserAlt className="dropdown-icon" /> Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      <IoMdSettings className="dropdown-icon" /> Settings
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={handleLogout}
                    >
                      <IoLogOut className="dropdown-icon" /> Logout
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="topbar-right">
          <div className="login-div">
            <Link to="/login" className="login-link-home">
              <button className="login-div-content">Login</button>
            </Link>
            <PiLineVerticalThin style={{ color: "white", fontSize: "2rem" }} />
            <Link to="/register" className="login-link-home">
              <button className="login-div-content">Register</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topbar;
