import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Blogs.css";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sitemap = () => {
  const [Category, setCategory] = useState([]);
  const [courses, setCourses] = useState([]);
  const API_URL = "https://api.test.hachion.co/course-categories/all";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: "Bearer 98A4V2IB5X6V7B671Y18QPWMU9Q5TG4S",
            "Content-Type": "application/json",
          },
        });
        setCategory(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("https://api.test.hachion.co/courses/all");
        if (Array.isArray(response.data)) {
          setCourses(response.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching courses:", error.message);
        setCourses([]);
      }
    };

    fetchCourses();
  }, []);

  
  const handleCourseDetails = (coursename) => {
    if (coursename) {
      const formattedName = coursename
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, ""); 
      navigate(`/coursedetails/${formattedName}`);
    }
  };
  return (
    <>
      <div className="about-us container">
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
        <div className="about-us-content container">
          <h1 className="about-us-heading">Hachion Sitemap</h1>
          <div className="about-us-left-content">
            <p className="title">All categories</p>
          </div>
          <div className="sitemap-contenet container">
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
          <div className="sitemap-contenet container">
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
                        e.stopPropagation(); 
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
    </>
  );
};
export default Sitemap;
