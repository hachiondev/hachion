import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Course.css";
import { useNavigate } from "react-router-dom";
import { MdArrowForwardIos } from "react-icons/md";

const DropdownCourseList = ({ category }) => {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchCourses = async () => {
      try {
        const { data } = await axios.get("https://api.hachion.co/courses/all");
        if (isMounted) setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCourses();
    return () => (isMounted = false);
  }, []);

  useEffect(() => {
    if (category && courses.length > 0) {
      const filteredList = courses.filter(
        (course) => course.courseCategory === category
      );
      setFiltered(filteredList);
    }
  }, [category, courses]);

  const handleCourseClick = (title) => {
    const slug = title.toLowerCase().replace(/\s+/g, "-");
    navigate(`/coursedetails/${slug}`);
  };

  if (loading) {
    return (
      <div className="scrollable-category-list">
        <ul className="category-menu">
          {Array.from({ length: 6 }).map((_, index) => (
            <li key={index}>
              <div
                className="skeleton-explore-text title"
                style={{ padding: "4px 8px" }}
              >
                <div className="skeleton-text-line"></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (filtered.length === 0)
    return <p className="dropdown-no-courses">No courses in {category}</p>;

  return (
    <div className="scrollable-category-list">
      <ul className="category-menu">
        {filtered.map((course, index) => (
          <li key={course.id || index}>
            <button
              onClick={() => handleCourseClick(course.courseName)}
              className="category-menu-item"
              style={{ padding: "4px 8px", fontWeight: "400" }}
            >
              <div className="category-menu-text">{course.courseName}</div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownCourseList;
