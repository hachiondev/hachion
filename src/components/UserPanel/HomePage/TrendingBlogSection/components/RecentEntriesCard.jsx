"use client";

import React from "react";
import Link from "next/link";
import "../../../Corporate.css";
import { BsPersonCircle } from "react-icons/bs";
import Blogimageplaceholder from "@/assets/blogplaceholder.webp";

const RecentEntriesCard = ({
  imageSrc,
  category,
  content,
  author,
  avatarSrc,
  date,
  to,
  onClick
}) => {
  const handleImageError = (e) => {

    e.target.src = Blogimageplaceholder.src;
  };

  // Renders as a real <a href> for crawlability (previously a plain
  // <div onClick>, invisible to Googlebot and any non-JS crawler) while
  // the inline style guarantees the card looks identical to before —
  // no reliance on whatever global anchor styling exists elsewhere.
  return (
    <Link
      href={to}
      onClick={onClick}
      className="recent-blog-card"
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
      {/* Blog Image */}
      <img
        src={imageSrc}
        alt="card-image"
        className="recent-blog-card-image"
        onError={handleImageError}
      />

      <div className="content-block">
        {/* Category Badge */}
        {category && <span className="category-badge">{category}</span>}

        {/* Title */}
        <h3 className="content">{content}</h3>

        {/* Author Section */}
        <div className="author-info">
          {/* ✅ If avatarSrc exists, show image and hide fallback until image fails */}
          {avatarSrc ? (
            <div className="avatar-wrapper">
              <img
                src={avatarSrc}
                alt="author-avatar"
                className="author-avatar"
                onError={(e) => {

                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              {/* fallback circle (hidden by default, shown only if image fails) */}
              <div
                className="avatar-fallback"
                style={{ display: "none" }}
              >
                <BsPersonCircle size={48} color="#b3b3b3" />
              </div>
            </div>
          ) : (
            <div className="author-avatar avatar-fallback">
              <BsPersonCircle size={48} color="#b3b3b3" />
            </div>
          )}

          <div className="author-details">
            <p className="blog-author">{author}</p>
            <p className="date">{date}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecentEntriesCard;
