import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TbShare3 } from "react-icons/tb";
import { MdBookmarkBorder, MdBookmark } from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";
import fallbackImg from "../../Assets/18.webp";
import "./Home.css";

const UserEnrolledCards = ({
  heading,
  month,
  image,
  trainer_name,
  level,
  progress = 0,
  status = "Enrolled to Demo",
  isLiveClass = false,
  courseData = {}, // ✅ add this to receive full course info from parent
  activeTab, 
  forceCompleted = false, // ✅ New prop to force completion display
}) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth <= 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const formattedName = heading ? heading.toLowerCase().replace(/\s+/g, "-") : "";

  // ✅ Fixed: Pass proper course data
  const handleNavigation = () => {
    navigate(`/userenrolledassignment/${formattedName}`, {
      state: { courseData, activeTab, }, // pass the data properly
    });
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const courseUrl = `${window.location.origin}/userenrolledassignment/${formattedName}`;
    const shareMessage = `Check this course details to gain more knowledge on this: ${heading}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: heading,
          text: shareMessage,
          url: courseUrl,
        });
      } else {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
          shareMessage + " " + courseUrl
        )}`;
        window.open(whatsappUrl, "_blank");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  // ✅ Enhanced button label logic based on activeTab
  const getButtonLabel = () => {
    // If course is completed (regardless of tab), show "Completed Demo"
    if (status === "Completed" || forceCompleted) {
      return "View Certificate";
    }

    if (isLiveClass) {
      return status === "Completed Demo" ? "Download Certificate" : "Join Live Class";
    }

    // Show different labels based on active tab
    if (activeTab === "Completed Courses") {
      return "View Certificate";
    }

    switch (status) {
      case "Upcoming Demo":
        return "Start Course";
      case "Enrolled to Demo":
        return progress === 0 ? "Start Course" : "Continue Course";
      default:
        return "Start Course";
    }
  };

  // ✅ Determine progress display based on activeTab
  const displayProgress = forceCompleted ? 100 : progress;
  const isCompletedTab = activeTab === "Completed Courses" || forceCompleted;

  return (
    <div
      className="sidebar-card"
      style={{ cursor: "pointer" }}
      onClick={handleNavigation}
      data-tab={activeTab.toLowerCase().replace(/\s+/g, '-')}
    >
      <div className="card-action-icons">
        <button className="card-icons" onClick={handleShare}>
          <TbShare3 />
        </button>
        <button className="card-icons" onClick={handleBookmark}>
          {bookmarked ? <MdBookmark className="bookmark-active" /> : <MdBookmarkBorder />}
        </button>
      </div>

      <div className="card-header-div">
        <img
          src={image}
          alt="Course"
          className="card-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = fallbackImg;
          }}
        />
      </div>

      <div className="card-course-details">
        <div className="card-row">
          <div className="card-text-space">
            <div className="dropdown-course-month">{month} Days</div>
            <div className="dropdown-course-month">{level}</div>
          </div>
          {trainer_name && (
            <div className="trainer-name">
              By {trainer_name.length > 8 ? trainer_name.slice(0, 8) + "…" : trainer_name}
            </div>
          )}
        </div>

        <h3 className="user-course-name">{heading}</h3>

        {/* ✅ Progress display - Different for Enrolled vs Completed tabs */}
        {!isCompletedTab ? (
          // Enrolled Courses tab - show progress bar
          <div className="progress-container">
            <div className="card-row">
              <p className="progress-text">Completed</p>
              <p className="progress-text">{displayProgress}%</p>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${displayProgress}%` }}></div>
            </div>
          </div>
        ) : (
          // Completed Courses tab - show completion badge
          <div className="progress-container">
            <div className="card-row">
              <p className="progress-text">Completed</p>
              <p className="progress-text">{displayProgress}%</p>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${displayProgress}%` }}></div>
            </div>
          </div>
        )}

        {/* ✅ Dynamic button */}
        <button
          className={`card-view-btn ${isCompletedTab ? 'completed-btn' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            handleNavigation();
          }}
        >
          {getButtonLabel()}
        </button>
      </div>
    </div>
  );
};

export default UserEnrolledCards;