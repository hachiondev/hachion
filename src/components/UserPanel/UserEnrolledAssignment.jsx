"use client";

import { useState } from "react";
import "./Dashboard.css";
import "./Home.css";
import { IoArrowBack } from "react-icons/io5";
import { FaCirclePlay } from "react-icons/fa6";
import { useParams, useRouter } from "next/navigation";
import { FaPlay, FaChevronDown, FaChevronUp } from "react-icons/fa";

// Faithful port of CRA's UserEnrolledAssignment.jsx — a hardcoded course-
// player mock (static module/lecture list, unrelated to whatever course is
// actually enrolled). CRA's own only entry point to this page
// (UserEnrolledCards.jsx's share button) links via a plain URL, never a
// react-router navigate(path, {state}) call, so `courseData` was always
// undefined in practice — this always falls back to the `coursename` URL
// param, matching real CRA behavior exactly. Intentionally NOT upgraded to
// real data-fetching; this is scoped as a faithful port of an existing
// non-functional prototype, not a new feature.
const modules = [
  {
    title: "Module 1: Introduction to Web Development",
    duration: "25m 44s",
    lectures: 3,
    items: [
      { title: "1. What is Web Development", videoId: "991tOPuwPxY" },
      { title: "2. Frontend vs Backend", videoId: "sBzRwzY7G-k" },
      { title: "3. HTML Basics", videoId: "UB1O30fR-EE" },
    ],
  },
  {
    title: "Module 2: Advanced HTML & CSS",
    duration: "29m 44s",
    lectures: 2,
    items: [
      { title: "1. CSS Flexbox Deep Dive", videoId: "JJSoEo8JSnc" },
      { title: "2. Responsive Design", videoId: "srvUrASNj0s" },
    ],
  },
];

export default function UserEnrolledAssignment() {
  const rawParams = useParams();
  const coursename = decodeURIComponent(rawParams.coursename || "");
  const router = useRouter();

  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedModule, setExpandedModule] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(null);

  const handlePlayClick = () => setIsPlaying(true);
  const toggleModule = (index) => setExpandedModule(expandedModule === index ? null : index);
  const handleGoBack = () => router.push("/userdashboard/enrolls");

  const handleVideoSelect = (videoId, moduleIndex, itemIndex) => {
    setIsPlaying(true);
    setCurrentVideo({
      videoId,
      moduleIndex,
      itemIndex,
      title: modules[moduleIndex].items[itemIndex].title,
      moduleTitle: modules[moduleIndex].title,
    });
  };

  return (
    <div className="container">
      <div className="user-course-nav" onClick={handleGoBack}>
        <span className="back-icon">
          <IoArrowBack />
        </span>
        {coursename}
      </div>

      <div className="instructor-banner">
        <div className="home-content">
          <div
            className="video-box"
            style={{
              position: "relative",
              width: "100%",
              paddingBottom: "56.25%",
              height: 0,
              overflow: "hidden",
              borderRadius: "12px",
            }}
          >
            {!isPlaying ? (
              <>
                <img
                  src="https://img.youtube.com/vi/991tOPuwPxY/maxresdefault.jpg"
                  alt="Video Thumbnail"
                  className="video-thumbnail"
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
                />
                <button
                  className="video-play-button"
                  onClick={handlePlayClick}
                  style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                >
                  <FaPlay size={32} />
                </button>
              </>
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${currentVideo?.videoId || "991tOPuwPxY"}?autoplay=1`}
                title="Course Video Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: "12px" }}
              ></iframe>
            )}
          </div>

          <div className="user-corse-content">
            <h2 className="user-main-title">{coursename || "Course Bootcamp"}</h2>
            <p className="user-module-text">
              {currentVideo ? `${currentVideo.moduleTitle} — ${currentVideo.title}` : "Module 1: Introduction to Web Development"}
            </p>
          </div>
        </div>

        <div className="home-content">
          <div>
            {modules.map((module, index) => (
              <div key={index} className="user-assignment">
                <div onClick={() => toggleModule(index)} className="flex justify-between items-center p-3">
                  <div className="card-row">
                    <div className="user-module-title">{module.title}</div>
                    {expandedModule === index ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
                  </div>
                  <div className="user-assignment-duration">
                    {module.duration} • {module.lectures} lectures
                  </div>
                </div>

                {expandedModule === index && module.items.length > 0 && (
                  <div className="user-assignment-expand">
                    {module.items.map((item, i) => (
                      <div key={i} className="card-row" onClick={() => handleVideoSelect(item.videoId, index, i)}>
                        <div className="user-content-gap">
                          <FaCirclePlay className="user-video-icon" />
                          <span className="user-course-text">{item.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
