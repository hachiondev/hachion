import React from "react";
import "./Corporate.css";
import { HiEye } from "react-icons/hi";
import Blogimageplaceholder from "../../Assets/Default_blogimage.jpg";
const RecentEntriesCard = ({ imageSrc, content, views, date, onClick }) => {
  const handleImageError = (e) => {
    e.target.src = Blogimageplaceholder;
  };

  return (
    <div className="recent-blog-card" onClick={onClick}>
      <img
        src={imageSrc}
        alt="card-image"
        className="recent-blog-card-image"
        onError={handleImageError}
      />
      <div className="content-block">
        <p className="content">{content}</p>
        <div className="bottom-content">
          {/* <p className="views">
            <HiEye className="views-icon" /> {views}
          </p> */}
          <p className="date">{date}</p>
        </div>
      </div>
    </div>
  );
};

export default RecentEntriesCard;