import React, { useState } from "react";
import "./Course.css";
import "./Corporate.css";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { BsFillPlayCircleFill } from "react-icons/bs";
import { MdOutlineStar } from "react-icons/md";

const InstructorCard = (props) => {
  const [open, setOpen] = useState(false);

  const videoLinks = props.demo_link_1
    ? props.demo_link_1
        .split("\n")
        .map((link) => link.trim())
        .filter((link) => link)
    : [];

    const renderStarRating = (rating) => {
      return [...Array(5)].map((_, i) => (
        <MdOutlineStar
          key={i}
          className={`star-icon ${i < rating ? 'filled-star' : 'empty-star'}`}
        />
      ));
    };

  return (
    <>
      <div className="trainer-card">
        <div className="trainer-top">
          <div className="learner-image">
            <Avatar
              alt={props.trainer_name}
              src={props.profileImage || ""}
              className="profile-image"
            />
          </div>
          </div>
          <div className="trainer-description-bottom">
          <div className="learner-info">
            <div className="learner-name">
              <p className="name">{props.trainer_name}</p>
            </div>
            <p className="job-profile">{props.profile}</p>
            <div className='rating'>{renderStarRating(props.rating)}</div>
          </div>
        <hr className="faq-seperater"/>
          <p className="learner-description">
            {props.summary ? props.summary.substring(0, 150) : ""}...
            <span className="read-more" onClick={() => setOpen(true)}>
              {" "}
              Read More
            </span>
          </p>

          {/* {videoLinks.length > 0 &&
            videoLinks.map((videoLink, i) => {
              const validUrl = videoLink.startsWith("http")
                ? videoLink
                : `https://${videoLink}`;
              return (
                <button
                  key={i}
                  className="demo-play-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    props.onPlayVideo(validUrl);
                  }}
                >
                  <BsFillPlayCircleFill className="demo-icon-btn" />
                  <strong>Click here to Watch Demo Video</strong>
                </button>
              );
            })} */}
        </div>
      </div>

      {/* Popup Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="top">
          About Trainer {props.trainer_name}
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            className="close-button"
          >
            <CloseIcon
              style={{
                color: "#FFFFFF",
                background: "#00AEEF",
                borderRadius: "50%",
              }}
            />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="trainer-popup-content">
            <div className="trainer-top">
              <div className="learner-image">
                <Avatar
                  alt={props.trainer_name}
                  src={props.profileImage || ""}
                  className="profile-image"
                />
              </div>
              </div>
              <div className="trainer-description-bottom">
                <div className="learner-info">
              <div className="learner-name">
                <p className="name">{props.trainer_name}</p>
              </div>
              <p className="job-profile">{props.profile}</p>
              <div className='rating'>{renderStarRating(props.rating)}</div>
            </div>
            <hr className="faq-seperater"/>
              <p className="full-review">{props.summary}</p>
              {/* {videoLinks.length > 0 &&
                videoLinks.map((videoLink, i) => {
                  const validUrl = videoLink.startsWith("http")
                    ? videoLink
                    : `https://${videoLink}`;
                  return (
                    <button
                      key={i}
                      className="demo-play-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onPlayVideo(validUrl);
                      }}
                    >
                      <BsFillPlayCircleFill className="demo-icon-btn" />
                      <strong>Click here to Watch Demo Video</strong>
                    </button>
                  );
                })} */}
          </div>
           </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InstructorCard;
