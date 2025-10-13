import React from "react";
import "./Corporate.css";
import { BsPersonCircle } from "react-icons/bs";
import Blogimageplaceholder from "../../Assets/Default_blogimage.jpg";

const RecentEntriesCard = ({ 
  imageSrc, 
  category, 
  content, 
  description, 
  author, 
  avatarSrc, 
  date, 
  onClick 
}) => {
  const handleImageError = (e) => {
    e.target.src = Blogimageplaceholder;
  };

  return (
    <div className="recent-blog-card" onClick={onClick}>
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

        {/* Description */}
        {/* <p className="blog-card-description">{description}</p> */}
<p className="blog-card-description">
  {(() => {
    if (!description) return "";
    const el = document.createElement("div");
    el.innerHTML = description;                 
    return (el.textContent || el.innerText || "").trim();
  })()}
</p>

        {/* Author Section */}
        <div className="author-info">
          {avatarSrc ? (
            <div className="avatar-wrapper">
              <img
                src={avatarSrc}
                alt="author-avatar"
                className="author-avatar"
                onError={handleImageError}
              />
              <div className="avatar-fallback">
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
    </div>
  );
};

export default RecentEntriesCard;
