"use client";

import React, { useEffect, useState } from 'react';
import '../../Home.css';
import { FaCircle } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TbShare3 } from "react-icons/tb";
import fallbackImg from "@/assets/18.webp";

const TrainingCard = ({ mode, heading, month, date, time, duration, discountPercentage, image, trainer_name, level, scheduleCount, courseCategory }) => {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(false);
  // Starts false (not window.innerWidth <= 768 like the CRA original) so
  // server and the client's first hydration pass render identically;
  // the real value is set from an effect right after mount instead.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);
    const handleResize = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  const navigateToCourse = () => {

  if (!heading || !courseCategory) {
    console.error("Missing category/course", {
      heading,
      courseCategory
    });
    return;
  }

  const formattedName = heading
    .toLowerCase()
    .replace(/\s+/g, '-');

  const formattedCategory = courseCategory
    .toLowerCase()
    .replace(/\s+/g, '-');

  // Note: the CRA original also passed router state ({ scrollTo:
  // "upcoming-batch" }) for the destination course-details page to
  // auto-scroll on load. Next.js's router has no equivalent client-side
  // navigation-state channel, and that destination page isn't part of
  // this migration yet — revisit when it is.
  router.push(`/courses/${formattedCategory}/${formattedName}`);
};

// Same URL navigateToCourse() computes, exposed so the "View Details"
// button can render as a real crawlable <a href> via Link instead of only
// being reachable through onClick + navigate().
const courseDetailsUrl = heading && courseCategory
  ? `/courses/${courseCategory.toLowerCase().replace(/\s+/g, '-')}/${heading.toLowerCase().replace(/\s+/g, '-')}`
  : null;
  const handleShare = async (e) => {
    e.stopPropagation();

    // ✅ define formattedName from heading
    const formattedName = heading.toLowerCase().replace(/\s+/g, '-');
    // const courseUrl = `${window.location.origin}/courses/${formattedName}`;
    const formattedCategory = courseCategory
  ?.toLowerCase()
  ?.replace(/\s+/g, '-');

const courseUrl =
  `${window.location.origin}/courses/${formattedCategory}/${formattedName}`;
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
      </div>
      <div className="card-header-div">
        <img src={image} alt="Course-img" className="card-image" loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImg.src;
          }} />
        <div className="upcoming-card-header">
          <FaCircle className="card-header-icon" />
          {mode}
        </div>
      </div>


      <div className="card-course-details">
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
          {courseDetailsUrl ? (
            <Link
              href={courseDetailsUrl}
              onClick={(e) => e.stopPropagation()}
              style={{ textDecoration: "none" }}
            >
              <button className="card-view-btn">
                {scheduleCount > 1 ? `View ${scheduleCount - 1} More Schedules` : 'View Details'}
              </button>
            </Link>
          ) : (
            <button
              className="card-view-btn"
              onClick={(e) => {
                e.stopPropagation();
                navigateToCourse();
              }}
            >
              {scheduleCount > 1 ? `View ${scheduleCount - 1} More Schedules` : 'View Details'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingCard;
