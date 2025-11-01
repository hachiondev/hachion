import React, { useState, useEffect } from "react";
import axios from "axios";
import DropdownCard from "./DropdownCard";
import "./Course.css";

const DropdownCardRight = ({ category, currentPage, cardsPerPage }) => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://api.test.hachion.co/courses/all");
        if (isMounted) {
          if (Array.isArray(response.data)) {
            setCourses(response.data);
          } else {
            console.error("Unexpected API response format:", response.data);
            setCourses([]);
          }
        }
      } catch (error) {
        console.error("Error fetching courses:", error.message);
        if (isMounted) setCourses([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCourses();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      if (category) {
        const filtered = courses.filter(
          (course) => course.courseCategory === category
        );
        setFilteredCourses(filtered);
      } else {
        setFilteredCourses([]);
      }
    }
  }, [category, courses, loading]);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCourses.slice(indexOfFirstCard, indexOfLastCard);

  return (
    <div className="course-card-container">
      {loading ? (
        Array.from({ length: cardsPerPage }).map((_, index) => (
          <div key={index} className="course-skeleton-explore-card">
            <div className="skeleton-explore-image"></div>
            <div className="skeleton-explore-text title"></div>
            <div className="skeleton-explore-text subtitle"></div>
          </div>
        ))
      ) : currentCards.length > 0 ? (
        currentCards.map((course, index) => (
          <DropdownCard
            key={course.id || index}
            title={course.courseName}
            image={`https://api.test.hachion.co/${course.courseImage}`}
            level={course.level}
            month={course.numberOfClasses}
            course_id={course.id}
          />
        ))
      ) : (
        <p style={{ paddingTop: "30px", paddingLeft: "20px" }}>
          No courses available for <b>{category}</b>
        </p>
      )}
    </div>
  );
};

export const getTotalCards = (category, courses = []) => {
  if (!courses) return 0;
  return courses.filter((course) => course.courseCategory === category).length;
};

export default DropdownCardRight;
