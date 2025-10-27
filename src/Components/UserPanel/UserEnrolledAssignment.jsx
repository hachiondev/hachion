import React, { useState } from "react";
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import Footer from './Footer';
import StickyBar from './StickyBar';
import { IoArrowBack } from "react-icons/io5";
import { FaCirclePlay } from "react-icons/fa6";
import { useParams, useLocation, useNavigate } from "react-router-dom"; // ✅ add useNavigate
import { FaPlay, FaCheckCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function UserEnrolledAssignment() {
  const { coursename } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate(); // ✅ initialize navigate
  const courseData = state?.courseData;

  const [expandedModule, setExpandedModule] = useState(0);

  const modules = [
    {
      title: "Module 1: Introduction to Web Development",
      duration: "25m 44s",
      lectures: 5,
      items: [
        { title: "1. What is Web Development", completed: true },
        { title: "2. What is Web Development", completed: true },
        { title: "3. What is Web Development", completed: false },
      ],
    },
    {
      title: "Module 2: Advanced HTML & CSS",
      duration: "29m 44s",
      lectures: 5,
      items: [],
    },
    {
      title: "Module 3: JavaScript Essentials",
      duration: "22m 44s",
      lectures: 5,
      items: [],
    },
    {
      title: "Module 4: React Basics and Advanced",
      duration: "28m 44s",
      lectures: 5,
      items: [],
    },
    {
      title: "Module 5: Final Capstone Project",
      duration: "23m 44s",
      lectures: 3,
      items: [],
    },
  ];

  const toggleModule = (index) => {
    setExpandedModule(expandedModule === index ? null : index);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Topbar />
      <NavbarTop />
      <div className="container">
        {/* Header */}
        <div className="user-course-nav" onClick={handleGoBack}>
          <span className="back-icon">
            <IoArrowBack />
          </span>
          {courseData?.course_name || coursename}
        </div>

        {/* Main Layout */}
        <div className="instructor-banner">
          <div className="home-content">
            {/* Left Side: Video Player */}
            <div className="relative w-full flex items-center justify-center">
              <button className="bg-blue-600 p-4 rounded-full text-white">
                <FaPlay size={28} />
              </button>
            </div>

            <div className="p-6">
              <h2 className="font-semibold mb-2">
                {courseData?.course_name || "Course Bootcamp"}
              </h2>
              <p className="text-gray-500">
                Module 1: Introduction to Web Development
              </p>
            </div>
          </div>

          {/* Right Side: Course Content */}
          <div className="home-content">
            {/* Modules List */}
            <div>
              {modules.map((module, index) => (
                <div key={index} className="user-assignment">
                  {/* Module Header */}
                  <div
                    onClick={() => toggleModule(index)}
                    className="flex justify-between items-center p-3"
                  >
                    <div className="card-row">
                      <div className="user-course-title">{module.title}</div>
                      {expandedModule === index ? (
                        <FaChevronUp className="text-gray-500" />
                      ) : (
                        <FaChevronDown className="text-gray-500" />
                      )}
                    </div>
                    <div className="user-assignment-duration">
                      {module.duration} • {module.lectures} lectures
                    </div>
                  </div>

                  {/* Module Lectures */}
                  {expandedModule === index && module.items.length > 0 && (
                    <div className="user-assignment-expand">
                      {module.items.map((item, i) => (
                        <div key={i} className="card-row">
                          <div className="user-content-gap">
                            <FaCirclePlay
                              className={`user-video-icon ${
                                item.completed ? "done" : "in-progress"
                              }`}
                            />
                            <span
                              className={`user-course-text ${
                                item.completed ? "done" : "in-progress"
                              }`}
                            >
                              {item.title}
                            </span>
                          </div>
                          <FaCheckCircle
                            className={`user-task ${
                              item.completed ? "done" : "in-progress"
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
              <button className="bg-blue-100 text-blue-700 font-medium px-6 py-3 rounded-xl shadow hover:bg-blue-200 transition">
                Live Support
              </button>
              <button className="bg-blue-600 text-black font-medium px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition">
                Chat with Mentor
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <StickyBar />
    </>
  );
}
