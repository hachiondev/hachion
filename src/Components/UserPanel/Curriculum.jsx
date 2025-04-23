import React, { useState, useEffect, useRef } from "react";
import "./Course.css";
import axios from "axios";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { BsFillPlayCircleFill } from "react-icons/bs";
import { useParams } from "react-router-dom";
import loginPopupImg from "../../Assets/loginpopup.png";
import logo from "../../Assets/logo.png";

const Curriculum = () => {
  const [showMore, setShowMore] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [curriculum, setCurriculum] = useState([]);
  const [matchedCourseName, setMatchedCourseName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const modalRef = useRef(null);

  const { courseName } = useParams();

  useEffect(() => {
    const redirectPath = localStorage.getItem("redirectAfterLogin");
    if (redirectPath) {
      localStorage.removeItem("redirectAfterLogin");
    }
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://api.hachion.co/courses/all");
        const courseNameFromUrl = courseName
          ?.toLowerCase()
          ?.replace(/\s+/g, "-");
        const matchedCourse = response.data.find(
          (c) =>
            c.courseName.toLowerCase().replace(/\s+/g, "-") ===
            courseNameFromUrl
        );

        if (matchedCourse) {
          setMatchedCourseName(matchedCourse.courseName.trim());
        } else {
          setError("Course not found.");
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
        setError("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseName]);

  useEffect(() => {
    if (!matchedCourseName) return;

    const fetchCurriculum = async () => {
      try {
        const response = await axios.get("https://api.hachion.co/curriculum");
        const filteredCurriculum = response.data.filter(
          (item) =>
            item.course_name &&
            item.course_name.trim().toLowerCase() ===
              matchedCourseName.toLowerCase()
        );
        setCurriculum(filteredCurriculum);
      } catch (error) {
        console.error("Error fetching Curriculum:", error.message);
        setError("Failed to load Curriculum.");
      }
    };

    fetchCurriculum();
  }, [matchedCourseName]);

  const handleViewMore = () => {
    setShowMore(!showMore);
  };

  const handleToggleExpand = (index) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const showLoginModal = () => setIsLoginModalVisible(true);
  const hideLoginModal = () => setIsLoginModalVisible(false);

  const downloadPdf = () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      showLoginModal();
      return;
    }

    if (!curriculum || curriculum.length === 0) {
      alert("No curriculum found for this course.");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("loginuserData"));
    if (!userData) {
      showLoginModal();
      return;
    }

    const curriculumWithPdf = curriculum.find((item) => item.curriculum_pdf);
    if (curriculumWithPdf) {
      const fileName = curriculumWithPdf.curriculum_pdf.split("/").pop();
      const fullPdfUrl = `https://api.hachion.co/curriculum/${curriculumWithPdf.curriculum_pdf}`;
      window.open(fullPdfUrl, "_blank", "noopener,noreferrer");
    } else {
      alert("No brochure available for this course.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        hideLoginModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`curriculum ${showMore ? "curriculum-expanded" : ""}`}>
      <div className="curriculum-head">
        <h1 className="qa-heading">{matchedCourseName} Curriculum</h1>
        <button className="btn-curriculum" onClick={downloadPdf}>
          <BsFileEarmarkPdfFill className="btn-pdf-icon" /> Download Brochure
        </button>
      </div>

      <div className="curriculum-topic">
        {curriculum.length > 0 ? (
          curriculum
            .slice(0, showMore ? curriculum.length : 5)
            .map((item, index) => (
              <div key={index}>
                <div
                  className="curriculum-content"
                  onClick={() => handleToggleExpand(index)}
                >
                  <p>{item.title}</p>
                  <p>{expandedTopics[index] ? <FaMinus /> : <FaPlus />}</p>
                </div>
                {expandedTopics[index] && (
                  <div className="topic-details">
                    <ul
                      className="bullet-list"
                      dangerouslySetInnerHTML={{ __html: item.topic }}
                    />
                    <div className="video-buttons">
                      {item.link &&
                        item.link.split("\n").map((videoLink, i) => {
                          const validUrl = videoLink.trim().startsWith("http")
                            ? videoLink.trim()
                            : `https://${videoLink.trim()}`;
                          return (
                            <button
                              key={i}
                              className="play-btn"
                              onClick={() =>
                                window.open(
                                  validUrl,
                                  "_blank",
                                  "noopener,noreferrer"
                                )
                              }
                            >
                              <div className="play-icon-btn">
                                <BsFillPlayCircleFill
                                  size={24}
                                  color="#00AEEF"
                                />
                              </div>
                              Preview
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            ))
        ) : (
          <p>No Curriculum available for this course.</p>
        )}
      </div>

      {curriculum.length > 5 && (
        <div className="view-div">
          <button className="view-more-btn" onClick={handleViewMore}>
            {showMore ? "View Less" : "View More"}
          </button>
        </div>
      )}

      {isLoginModalVisible && (
        <div className="login-modal">
          <div className="login-modal-content" ref={modalRef}>
            <img src={logo} alt="logo" className="hlogo" />
            <button className="close-modal-btn" onClick={hideLoginModal}>
              ×
            </button>
            <h2 className="modal-title">Download Brochure</h2>
            <div className="modal-body-login">
              <div className="modal-left">
                <h4 style={{ color: "#000" }}>Don’t miss out!</h4>
                <br />
                <p>
                  Just log in to the{" "}
                  <span className="web-name">Hachion website</span> to unlock
                  this feature.
                </p>
                <button
                  className="login-btn"
                  onClick={() => {
                    localStorage.setItem(
                      "redirectAfterLogin",
                      window.location.pathname
                    );
                    window.location.href = "/login";
                  }}
                >
                  Login
                </button>
                <button className="cancel-btn" onClick={hideLoginModal}>
                  Cancel
                </button>
              </div>
              <div className="modal-right">
                <img src={loginPopupImg} alt="Login Prompt" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Curriculum;
