"use client";

import React, { useEffect, useState } from "react";
import "../../Home.css";
import Link from "next/link";

// Ported from the CRA app's
// src/Components/UserPanel/CoursePage/components/TrendingCourseNames.jsx.
// react-router-dom Link -> next/link.
const TrendingCourseNames = () => {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    const fetchTrendingCourses = async () => {
      try {
        const response = await fetch(`https://api.hachion.co/trendingcourse`);
        const data = await response.json();
        const activeCourses = data.filter((course) => course.status === true);
        setCourses(activeCourses);
      } catch (error) {
        console.error("Error fetching trending courses:", error);
      }
    };
    fetchTrendingCourses();
  }, []);

  const getCourseUrl = (courseName) => `/courses/${courseName.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <>
      <div className="trending-data">
        <h2 className="trending-title">Trending Topics</h2>
        <div className="trending-content container">
          {courses.length > 0 ? (
            courses.map((course) => (
              <React.Fragment key={course.trendingcourse_id}>
                <Link href={getCourseUrl(course.course_name)} className="trending-courses" style={{ textDecoration: "none" }}>
                  {course.course_name}
                </Link>
              </React.Fragment>
            ))
          ) : (
            <p>No active courses available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default TrendingCourseNames;
