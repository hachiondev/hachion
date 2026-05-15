import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TbShare3 } from "react-icons/tb";
import { MdBookmarkBorder, MdBookmark } from "react-icons/md";
import fallbackImg from "../../../../Assets/18.webp";
import "../../Home.css";

const UserEnrolledCards = ({
  heading,
  month,
  image,
  trainer_name,
  level,
  progress = 0,
  status = "Enrolled",
  isLiveClass = false,
  courseData = {},
  activeTab,
  forceCompleted = false,
  courseCategory
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

  const formattedName = heading
  ? heading.toLowerCase().replace(/\s+/g, "-")
  : "";

const formattedCategory = courseCategory
  ? courseCategory.toLowerCase().replace(/\s+/g, "-")
  : "";

const handleNavigation = () => {

  if (!formattedName || !formattedCategory) {
    console.error("Missing category/course", {
      heading,
      courseCategory
    });
    return;
  }

  navigate(
    `/courses/${formattedCategory}/${formattedName}`,
    {
      state: { courseData, activeTab },
    }
  );
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

  const getButtonLabel = () => {
    if (status === "Completed" || forceCompleted) {
      return "View Details";
    }
    if (isLiveClass) {
      return status === "In Progress" ? "View Details" : "View Details";
    }
    return status === "In Progress" ? "View Details" : "View Details";
  };

  const displayProgress = forceCompleted ? 100 : progress;

  return (
    <div
      className="sidebar-card"
      style={{ cursor: "pointer" }}
      onClick={handleNavigation}
      data-tab={activeTab.toLowerCase().replace(/\s+/g, "-")}
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

        {/* ✅ Progress + Status */}
       {/* ✅ Status + Mode */}
<div className="progress-container">
  <div className="card-row">
    <p className="progress-text">{status}</p>
    <p className="progress-text">
      {courseData?.mode || "Self Paced"}
    </p>
  </div>
</div>


        <button
          className={`card-view-btn ${status === "Completed" ? "completed-btn" : ""}`}
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
