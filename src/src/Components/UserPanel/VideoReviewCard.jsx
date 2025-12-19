import React from "react";
import "./Course.css";
import "./Corporate.css";
import Avatar from "@mui/material/Avatar";
import { AiOutlinePlaySquare } from "react-icons/ai";

const VideoReviewCard = ({ name, profileImage, demo_link_1, onPlayVideo }) => {
  // Use the provided video link or fallback to static links
  const staticVideoLinks = [
    "https://www.youtube.com/watch?v=jFq396RUcqI",
  ];

  const videoLinks = demo_link_1 ? [demo_link_1] : staticVideoLinks;

  return (
    <div className="video-learner-card">
      <div className="video-learner-image">
        <Avatar
          alt={name}
          src={profileImage || ""}
          variant="square"
          className="video-profile-image"
        />

        {videoLinks.map((videoLink, i) => {
          const validUrl = videoLink.startsWith("http")
            ? videoLink
            : `https://${videoLink}`;
          return (
            <button
              key={i}
              className="review-video-play-btn"
              onClick={(e) => {
                e.stopPropagation();
                onPlayVideo(validUrl);
              }}
            >
              <AiOutlinePlaySquare className="review-video-icon-btn" />
            </button>
          );
        })}
      </div>
      <p className="video-learner-name">{name}</p>
    </div>
  );
};

export default VideoReviewCard;
