import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Course.css";
import { useNavigate } from "react-router-dom";

const DropdownCourseList = ({ category }) => {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchCourses = async () => {
      try {
        const { data } = await axios.get("https://api.hachion.co/courses/summary");
        const rows = Array.isArray(data) ? data : [];

        const mapped = rows.map((row) => ({
          id: row[0],
          courseName: row[1],
          courseImage: row[2],
          numberOfClasses: row[3],
          level: row[4],
          amount: row[5],
          discount: row[6],
          total: row[7],
          iamount: row[8],
          idiscount: row[9],
          itotal: row[10],
          courseCategory: row[11],
        }));

        if (isMounted) setCourses(mapped);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCourses();
    return () => (isMounted = false);
  }, []);

  // Filter courses by category
  useEffect(() => {
    if (category && courses.length > 0) {
      const filteredList = courses.filter(
        (course) => course.courseCategory === category
      );
      setFiltered(filteredList);

      // Highlight the first course by default
      if (filteredList.length > 0) {
        setActiveCourse(filteredList[0].courseName);
      } else {
        setActiveCourse(null);
      }
    }
  }, [category, courses]);

  const handleCourseClick = (title) => {
    setActiveCourse(title);
    const slug = title.toLowerCase().replace(/\s+/g, "-");
    navigate(`/coursedetails/${slug}`);
  };

  if (loading) {
    return (
      <div className="scrollable-category-list">
        <ul className="category-menu">
          {Array.from({ length: 6 }).map((_, index) => (
            <li key={index}>
              <div className="skeleton-explore-text title" style={{ padding: "4px 8px" }}>
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
        {filtered.map((course, index) => {
          const isActive =
            hoveredCourse === course.courseName ||
            (!hoveredCourse && activeCourse === course.courseName);

          return (
            <li key={course.id || index}>
              <button
                onMouseEnter={() => setHoveredCourse(course.courseName)}
                onMouseLeave={() => setHoveredCourse(null)}
                onClick={() => handleCourseClick(course.courseName)}
                className={`category-menu-item ${isActive ? "active" : ""}`}
                style={{ padding: "4px 8px", fontWeight: "400" }}
              >
                <div className="category-menu-text">{course.courseName}</div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DropdownCourseList;
