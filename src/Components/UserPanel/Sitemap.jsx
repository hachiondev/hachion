import React, { useEffect, useState } from "react";
import axios from "axios";
import Topbar from "./Topbar";
import NavbarTop from "./NavbarTop";
import "./Blogs.css";
import { MdKeyboardArrowRight } from "react-icons/md";
import StickyBar from "./StickyBar";
import Footer from "./Footer";
import { FaArrowUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const Sitemap = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [Category, setCategory] = useState([]); // Dynamic Category
  const [courses, setCourses] = useState([]);
  const API_URL = "https://api.hachion.co/course-categories/all";
  const navigate = useNavigate();
  // Scroll to top function
  const scrollToTop = () => {
    console.log("Scroll to top clicked!");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: "Bearer 98A4V2IB5X6V7B671Y18QPWMU9Q5TG4S", // Replace with your token if needed
            "Content-Type": "application/json",
          },
        });

        setCategory(response.data); // Assuming response.data is an array of categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch courses from the API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("https://api.hachion.co/courses/all");
        if (Array.isArray(response.data)) {
          setCourses(response.data); // Set the courses if data is an array
        } else {
          console.error("Unexpected API response format:", response.data);
          setCourses([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error("Error fetching courses:", error.message);
        setCourses([]); // Fallback to an empty array
      }
    };

    fetchCourses();
  }, []);

  // Handle button click to navigate
  const handleCourseDetails = (coursename) => {
    if (coursename) {
      const formattedName = coursename.toLowerCase().replace(/\s+/g, "-"); // Format course name
      navigate(`/coursedetails/${formattedName}`);
    }
  };

  return (
    <>
      <Topbar />
      <NavbarTop />
      <div className="about-us">
        <div className='blogs-header'>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a> <MdKeyboardArrowRight />{" "}
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Sitemap
            </li>
          </ol>
        </nav>
        </div>
        <div className="about-us-content" style={{ color: "#6a6a6a" }}>
          <h1 className="about-us-heading">Hachion Sitemap</h1>
          <div className="about-us-left-content">
            <p className="title">All categories</p>
          </div>
          <div className="sitemap-contenet">
            <div class="div_category">
              {Category.map((item, index) => (
                <div key={index} class="col-12 col-md-6">
                  <p class="txtCategory mt-2">
                    <a href="/coursedetails">{item.name}</a>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="about-us-content" style={{ marginTop: "20px" }}>
          <div className="about-us-left-content">
            <p className="title title_allcourse ">All Courses</p>
          </div>
          <div className="sitemap-contenet">
            <div class="div_category">
              {courses.map((item, index) => (
                <div key={index} class="col-12 col-md-6 d-flex flex-column">
                  <p class="txtCategory ">
                    {/* <a href="#" onClick={handleCourseDetails(item.courseName)}>
                      {item.courseName}
                    </a> */}
                    <button
                      className="txtCoursebtn"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent parent click event
                        handleCourseDetails(item.courseName);
                      }}
                    >
                      {item.courseName}
                    </button>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {showScrollButton && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <FaArrowUp />
        </button>
      )}

      <StickyBar />
    </>
  );
};
export default Sitemap;
