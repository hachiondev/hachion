"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TbShare3 } from "react-icons/tb";
import { MdBookmarkBorder, MdBookmark } from "react-icons/md";
import fallbackImg from "@/assets/18.webp";
import "./Home.css";
import axios from "axios";
import { buildCourseDetailsPath } from "./CoursePage/courseRouteUtils";

// Ported from the CRA app's src/Components/UserPanel/SidebarCard.jsx —
// the wishlist course-card. useNavigate -> useRouter.
const SidebarCard = ({
  heading,
  month,
  discountPercentage,
  image,
  trainer_name,
  level,
  amount,
  totalAmount,
  timeLeftLabel,
  isWishlisted = false,
  onToggleWishlist,
  userEmail,
  course_id,
  courseCategory,
  priority = false,
}) => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [bookmarked, setBookmarked] = useState(!!isWishlisted);

  useEffect(() => {
    // Syncs from the isWishlisted prop (parent-controlled, an external
    // source) — bookmarked is also independently mutated by the wishlist
    // fetch below and the user's own toggle click, so it can't be a pure
    // render-time derivation of this prop alone.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBookmarked(!!isWishlisted);
  }, [isWishlisted]);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth <= 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (typeof onToggleWishlist === "function") return;
    let stop = false;
    const user = JSON.parse(localStorage.getItem("loginuserData")) || null;
    const email = user?.email || userEmail || localStorage.getItem("userEmail") || "";
    if (!email || !course_id) return;
    (async () => {
      try {
        const { data } = await axios.get(`https://api.hachion.co/api/wishlist/exists`, {
          params: { email, courseId: course_id },
        });
        if (!stop && data && typeof data.bookmarked === "boolean") {
          setBookmarked(data.bookmarked);
        }
      } catch {
        // best-effort existence check
      }
    })();
    return () => {
      stop = true;
    };
  }, [onToggleWishlist, userEmail, course_id]);

  const courseDetailsUrl = buildCourseDetailsPath(courseCategory, heading);

  const handleNavigation = () => {
    const nextPath = buildCourseDetailsPath(courseCategory, heading);
    if (nextPath === "/courses") {
      console.error("Missing category/course", { heading, courseCategory });
      return;
    }
    router.push(nextPath);
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const courseUrl = `${window.location.origin}${courseDetailsUrl}`;
    const shareMessage = `Check this course details to gain more knowledge on this: ${heading}`;
    try {
      if (navigator.canShare && navigator.canShare({ files: [] })) {
        const response = await fetch(image);
        const blob = await response.blob();
        const file = new File([blob], "course-image.jpg", { type: blob.type });
        await navigator.share({ title: heading, text: shareMessage, url: courseUrl, files: [file] });
      } else if (navigator.share) {
        await navigator.share({ title: heading, text: shareMessage, url: courseUrl });
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
    if (typeof onToggleWishlist === "function") {
      onToggleWishlist();
      return;
    }
    const user = JSON.parse(localStorage.getItem("loginuserData")) || null;
    const email = user?.email || userEmail || localStorage.getItem("userEmail") || "";
    if (!email) {
      alert("Please login before bookmarking.");
      return;
    }
    if (!course_id) return;
    try {
      const { data } = await axios.post(`https://api.hachion.co/api/wishlist/toggle`, { email, courseId: course_id });
      if (data && typeof data.bookmarked === "boolean") {
        setBookmarked(data.bookmarked);
      }
    } catch (err) {
      console.error("Wishlist toggle failed", err);
    }
  };

  return (
    <div
      className="sidebar-card"
      style={{ cursor: isMobile ? "pointer" : "default" }}
      onClick={isMobile ? handleNavigation : undefined}
    >
      <div className="card-action-icons">
        <button className="card-icons" onClick={handleShare} aria-label="Share this course">
          <TbShare3 />
        </button>
        <button
          className="card-icons"
          onClick={handleBookmark}
          aria-label={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
          title={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
        >
          {bookmarked ? <MdBookmark className="bookmark-active" /> : <MdBookmarkBorder />}
        </button>
      </div>

      <div className="card-header-div">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={heading ? `${heading} course thumbnail` : "Course thumbnail"}
          className="card-image"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImg.src;
          }}
        />
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
          <div className="course-amount">
            {" "}
            {amount} <span>{totalAmount}</span>
          </div>
          <div className="discount-duration">{timeLeftLabel}</div>
        </div>

        {courseDetailsUrl ? (
          <Link href={courseDetailsUrl} onClick={(e) => e.stopPropagation()} style={{ textDecoration: "none" }}>
            <button className="card-view-btn">View Details</button>
          </Link>
        ) : (
          <button
            className="card-view-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigation();
            }}
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default SidebarCard;
