import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TbShare3 } from "react-icons/tb";
import { MdBookmarkBorder, MdBookmark } from "react-icons/md";
import fallbackImg from "../../Assets/18.webp";
import './Home.css';
import axios from 'axios';

const CourseCard = ({ heading, month, discountPercentage, staticButtonLink, onClick, image, trainer_name, level, amount, totalAmount, timeLeftLabel = "", course_id, userEmail }) => {
  const navigate = useNavigate(); 
  const [isMobile, setIsMobile] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768); 
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

useEffect(() => {
  let stop = false;

  const user = JSON.parse(localStorage.getItem('loginuserData')) || null;
  const email = user?.email || userEmail || localStorage.getItem('userEmail') || '';

  if (!email || !course_id) return;

  (async () => {
    try {
      const { data } = await axios.get('https://api.hachion.co/api/wishlist/exists', {
        params: { email, courseId: course_id }
      });
      if (!stop && data && typeof data.bookmarked === 'boolean') {
        setBookmarked(data.bookmarked);
      }
    } catch (e) {
      
    }
  })();

  return () => { stop = true; };
}, [userEmail, course_id]);

  const formattedName = heading
  ? heading.toLowerCase().replace(/\s+/g, '-')
  : '';
  const handleNavigation = () => {
    navigate(`/coursedetails/${formattedName}`);
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const courseUrl = `${window.location.origin}/coursedetails/${formattedName}`;
    const shareMessage = `Check this course details to gain more knowledge on this: ${heading}`;

    try {
      if (navigator.canShare && navigator.canShare({ files: [] })) {
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
        await navigator.share({
          title: heading,
          text: shareMessage,
          url: courseUrl,
        });
      } else {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage + " " + courseUrl)}`;
        window.open(whatsappUrl, "_blank");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  
  const handleBookmark = async (e) => {
    e.stopPropagation();

    const user = JSON.parse(localStorage.getItem('loginuserData')) || null;
    const email = user?.email;
    if (!email ) {
      alert('Please login before bookmarking.');
      return;
    }
    if (!course_id) {
      console.error('Missing course_id prop on TeensCard');
      return;
    }

    try {
      const { data } = await axios.post('https://api.hachion.co/api/wishlist/toggle', {
        email,
        courseId: course_id
      });
      if (data && typeof data.bookmarked === 'boolean') {
        setBookmarked(data.bookmarked); 
      }
    } catch (err) {
      console.error('Wishlist toggle failed', err);
    }
  };

  return (
    <div
          className="card"
          style={{ cursor: isMobile ? 'pointer' : 'default' }}
          onClick={
    isMobile
      ? staticButtonLink
        ? () => navigate(staticButtonLink)
        : handleNavigation 
      : undefined
  }
        >
          <div className="card-action-icons">
            <button className="card-icons" onClick={handleShare} aria-label="Share this course"><TbShare3 /></button>
            <button className="card-icons" onClick={handleBookmark}
              aria-label={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}>
              {bookmarked ? <MdBookmark className="bookmark-active" /> : <MdBookmarkBorder />}
            </button>
          </div>
    
          <div className="card-header-div">
            <img src={image} alt="Course-img" className="card-image" loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallbackImg;
              }}/>
          </div>

      <div className="card-course-details">
        <div className="card-row">
          <div className="card-text-space">
            <div className="dropdown-course-month">{month} Days</div>
            <div className="dropdown-course-month">{level}</div>
          </div>
          {trainer_name && trainer_name.trim() !== "" && (
            <div className="trainer-name">
              By {trainer_name.length > 8 ? trainer_name.slice(0, 8) + "…" : trainer_name}
            </div>
          )}
        </div>

        <div className="card-row">
          <h3 className="course-name">{heading}</h3>
          <div className="discount-lable">{discountPercentage}% off</div>
        </div>

        <div className="card-row">
          <div className="course-amount">{amount} <span>{totalAmount}</span></div>
          {timeLeftLabel ? (<div className="discount-duration">{timeLeftLabel}</div>) : null}
        </div>

        <button className="card-view-btn" onClick={(e) => {
    e.stopPropagation(); 
    if (staticButtonLink) return navigate(staticButtonLink);
    if (onClick) return onClick(e);
  }}>View Details</button>
      </div>
    </div>
  );
};

export default CourseCard;
