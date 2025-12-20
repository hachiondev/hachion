import React, { useEffect, useState } from 'react';
import '../../Home.css';
import { FaCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { TbShare3 } from "react-icons/tb";
import fallbackImg from "../../../../Assets/18.webp";

const TrainingCard = ({ mode, heading, month, date, time, duration, discountPercentage, image, trainer_name, level, scheduleCount }) => {
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleResize = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  const navigateToCourse = () => {
    if (heading) {
      const formattedName = heading.toLowerCase().replace(/\s+/g, '-');
      navigate(`/coursedetails/${formattedName}`, {
        state: { scrollTo: 'upcoming-batch' }  // pass scroll target
      });
    }
  };
  const handleShare = async (e) => {
    e.stopPropagation();

    // ✅ define formattedName from heading
    const formattedName = heading.toLowerCase().replace(/\s+/g, '-');
    const courseUrl = `${window.location.origin}/coursedetails/${formattedName}`;
    const shareMessage = `Check this course details to gain more knowledge on this: ${heading}`;

    try {
      if (navigator.canShare && navigator.canShare({ files: [] })) {
        // Mobile native share with image
        const response = await fetch(image);
        const blob = await response.blob();
        const file = new File([blob], "course-image.jpg", { type: blob.type });

        await navigator.share({
          title: heading,
          text: shareMessage,
          url: courseUrl,
          files: [file],
        });
      } else if (navigator.share) {
        // Basic native share (no image)
        await navigator.share({
          title: heading,
          text: shareMessage,
          url: courseUrl,
        });
      } else {
        // ✅ Fallback: open social media share instead of copying text
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage + " " + courseUrl)}`;
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(courseUrl)}`;
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(courseUrl)}`;

        // Example: open WhatsApp share
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

  return (
    <div
      className="card"
      onClick={isMobile ? navigateToCourse : undefined}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && isMobile && navigateToCourse()}
    >
      <div className="card-action-icons">
        <button className="card-icons" onClick={handleShare} aria-label="Share this course"><TbShare3 /></button>
        {/* <button className="card-icons" onClick={handleBookmark}
            aria-label={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}>
                  {bookmarked ? <MdBookmark className="bookmark-active" /> : <MdBookmarkBorder />}
                </button> */}
      </div>
      <div className="card-header-div">
        <img src={image} alt="Course-img" className="card-image" loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImg;
          }} />
        <div className="upcoming-card-header">
          <FaCircle className="card-header-icon" />
          {mode}
        </div>
        {/* {image && <img src={image} alt="card-img" className="card-icon" loading="lazy"/>} */}
      </div>


      <div className="card-course-details">
        {/* <div className="mob-card-header">
          <FaCircle className="mob-card-header-icon" />
          {mode}
        </div> */}
        {/* <h3 className="upcoming-course-name">{heading}</h3> */}
        <div className="card-row">
          <div className="card-text-space">
            <div className="dropdown-course-month">
              {month} Days
            </div>
            <div className="dropdown-course-month">
              {level}
            </div>
          </div>
          {trainer_name && trainer_name.trim() !== "" && (
            <div className="trainer-name">
              By {trainer_name.length > 8
                ? trainer_name.slice(0, 8) + "…"
                : trainer_name}
            </div>
          )}

        </div>
        <div className="card-row">
          <h3 className="course-name">{heading}</h3>
          <div className="discount-lable">
            {discountPercentage}% off
          </div>
        </div>
        <div className="date-time-container">
          <p className="card-date">{date}</p>
          <p className="upcoming-time">{time}</p>
        </div>

        <div className="more-schedules">
          <button
            className="card-view-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigateToCourse();
            }}
          >
            {scheduleCount > 1 ? `View ${scheduleCount - 1} More Schedules` : 'View Details'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingCard;