"use client";

import "./Corporate.css";
import placeholderImage from "@/assets/workshopplaceholder.webp";

const WorkshopEntriesCard = ({ banner_image, title, date, time, timeZone, onClick }) => {
  const handleImageError = (e) => {
    e.target.src = placeholderImage.src;
  };
  return (
    <div className="workshop-card" onClick={onClick}>
      <img src={banner_image} alt="card-image" className="workshop-card-image" onError={handleImageError} />
      <div className="main-content-block">
        <p className="workshop-title">{title}</p>
        <div className="bottom-main-content">
          <p className="work-date">{date}</p>
          <p className="work-date">{time} {timeZone}</p>
        </div>
      </div>
    </div>
  );
};

export default WorkshopEntriesCard;
