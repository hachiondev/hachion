import React, { useState, useEffect } from "react";
import "./Course.css";
import { useParams } from "react-router-dom";
import axios from "axios";

const Qacourse = () => {
  const { courseName } = useParams(); // Extract course_id from URL params
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://api.hachion.co/courses/all");
        const courseData = response.data.find(
          (c) => c.courseName.toLowerCase().replace(/\s+/g, "-") === courseName
        );
        setCourse(courseData);
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseName]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!course) return <div>Course not found</div>;
  return (
    <>
      <div className="qa-course">
        <div className="qa-course-heading">
          <h1 className="qa-heading"> About {course.courseName}</h1>

          <div
            className="qa-sub-content"
            dangerouslySetInnerHTML={{
              __html: course?.courseDescription?.trim() || "",
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Qacourse;
