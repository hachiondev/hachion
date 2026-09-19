"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import "../Blogs.css";
import { MdKeyboardArrowRight } from "react-icons/md";

export default function Sitemap() {
  const [category, setCategory] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Proxied through our own API route so the upstream bearer token
        // never reaches the client bundle (see src/app/api/sitemap-categories).
        const response = await axios.get("/api/sitemap-categories");
        setCategory(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const slugify = (text = "") =>
    text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`https://api.hachion.co/courses/all`);
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

  return (
    <div className="about-us container">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/">Home</Link> <MdKeyboardArrowRight />{" "}
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
            {category.map((item, index) => {
              const formattedCategory = slugify(item.name || item.category_name || item.category || "");
              return (
                <div key={index} className="col-12 col-md-6">
                  <p className="txtCategory mt-2">
                    <Link className="txtCoursebtn" href={`/courses/${formattedCategory}`} prefetch={false}>
                      {item.name}
                    </Link>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="about-us-content" style={{ marginTop: "20px" }}>
        <div className="about-us-left-content">
          <p className="title title_allcourse ">All Courses</p>
        </div>
        <div className="sitemap-contenet container">
          <div className="div_category">
            {courses.map((item, index) => {
              const formattedCategory = (item.courseCategory || "")
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
              const formattedName = (item.courseName || "")
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
              return (
                <div key={index} className="col-12 col-md-6 d-flex flex-column">
                  <p className="txtCategory ">
                    <Link className="txtCoursebtn" href={`/courses/${formattedCategory}/${formattedName}`} prefetch={false}>
                      {item.courseName}
                    </Link>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
