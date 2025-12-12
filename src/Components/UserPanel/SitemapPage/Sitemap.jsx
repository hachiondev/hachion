import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Blogs.css";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCourses } from "../../../Api/hooks/HomePageApi/NavbarApi/useCourses";
import { useCategories } from "../../../Api/hooks/SitemapPageApi/useCategories";
import { useAllCourses } from "../../../Api/hooks/SitemapPageApi/useAllCourses";
import Loader from "../Loader/Loader";

const Sitemap = () => {
  const navigate = useNavigate();
  const { data: course = [] } = useCourses();
  const { data: Category = [], isLoading: loadingCategories, error: categoryError } = useCategories();
  const { data: courses = [], isLoading: loadingCourses, error: coursesError } = useAllCourses();

    if (loadingCategories || loadingCourses) {
    return (
      <Loader/>
    );
  }

  // ❗ Error UI
  if (categoryError || coursesError) {
    return (
      <div className="error-container">
        <h3>Something went wrong</h3>
        <p>Please try again later.</p>
      </div>
    );
  }

const handleCategoryClick = (categoryName) => {
  navigate("/coursedetails", {
    state: { selectedCategory: categoryName }
  });

  window.scrollTo(0, 0);
};

  const handleCourseDetails = (coursename) => {
    if (coursename) {
      const formatted = coursename.toLowerCase().replace(/\s+/g, "-");
      navigate(`/coursedetails/${formatted}`);
    }
  };

  console.log("course", course);
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
            <div className="div_category">
              {Category.map((item, index) => (
                <div key={index} className="col-12 col-md-6">
                  <button
                    className="txtCoursebtn mt-2"
                    onClick={() => handleCategoryClick(item.name)}
                  >
                    {item.name}
                  </button>
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
