import React, { useEffect, useState } from "react";
import axios from "axios";
import UserEnrolledCards from "./UserEnrolledCards";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

dayjs.extend(customParseFormat);

export default function UserEnrolledCourses() {
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("Enrolled Courses");
  const navigate = useNavigate();

  const normalize = (s) => (s || "").toString().trim().toLowerCase();

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("loginuserData"));
        const email = user?.email;
        if (!email) return;

        const [enrollRes, coursesRes, trainersRes] = await Promise.all([
          axios.get("https://api.test.hachion.co/enroll"),
          axios.get("https://api.test.hachion.co/courses/all"),
          axios.get("https://api.test.hachion.co/trainers"),
        ]);

        const allEnrollments = Array.isArray(enrollRes.data) ? enrollRes.data : [];
        const allCourses = Array.isArray(coursesRes.data) ? coursesRes.data : [];
        const allTrainers = Array.isArray(trainersRes.data) ? trainersRes.data : [];

        const userEnrollments = allEnrollments.filter((e) => e.email === email);
        const currentDate = dayjs().startOf("day");

        const merged = userEnrollments.map((e) => {
          const course = allCourses.find(
            (c) => normalize(c.courseName) === normalize(e.course_name)
          );
          const trainerObj = allTrainers.find(
            (t) => normalize(t.course_name) === normalize(e.course_name)
          );

          // Handle all possible date fields
          const rawDate =
            e.demo_date ||
            e.demoDate ||
            e.end_date ||
            e.endDate ||
            e.completionDate ||
            e.enroll_date;

          const parsedDate = dayjs(rawDate, [
            "YYYY-MM-DD",
            "MM/DD/YYYY",
            "DD/MM/YYYY",
            "YYYY-MM-DDTHH:mm:ssZ",
          ]);

          const isDateValid = parsedDate.isValid();
          const dateIsFuture = isDateValid && parsedDate.isAfter(currentDate, "day");
          const dateIsPast = isDateValid && parsedDate.isBefore(currentDate, "day");

          // Determine initial status
          let status = "Enrolled to Demo";
          if (dateIsFuture) status = "Upcoming Demo";
          else if (dateIsPast) status = "Completed";

          // Handle progress & completion
          let progress = e.progress || 0;
          let isCompleted =
            progress === 100 ||
            e.status?.toLowerCase() === "completed" ||
            status === "Completed";

          if (dateIsPast && progress < 100) {
            progress = 100; // ✅ Auto-complete after demo date
            isCompleted = true;
            status = "Completed";
          }

          // Live class detection
          const isLiveClass =
            course?.mode?.toLowerCase() === "live" ||
            e.mode?.toLowerCase() === "live";

          return {
            ...e,
            ...course,
            trainer: course?.trainer || trainerObj?.trainer_name,
            status: isCompleted ? "Completed" : status,
            progress,
            isLiveClass,
            formattedDate: isDateValid ? parsedDate.format("MMM-DD-YYYY") : "",
          };
        });

        setCourses(merged);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
      }
    };
    fetchEnrollments();
  }, []);

  return (
    <>
      <div className="dashboard-activity-title">
        {["Enrolled Courses", "Completed Courses"].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="wishlist-container">
        {(() => {
          let filteredCourses = [];

          if (activeTab === "Enrolled Courses") {
            filteredCourses = courses.filter(
              (course) =>
                course.status === "Upcoming Demo" ||
                course.status === "Enrolled to Demo"
            );
          } else if (activeTab === "Completed Courses") {
            filteredCourses = courses.filter(
              (course) => course.status === "Completed"
            );
          }

          return filteredCourses.length > 0 ? (
            <div className="wishlist-grid">
              {filteredCourses.map((course, index) => (
                <UserEnrolledCards
                  key={course.id || index}
                  heading={course.course_name || course.courseName}
                  image={`https://api.test.hachion.co/${course.courseImage}`}
                  level={course.level}
                  trainer_name={course.trainer}
                  month={course.numberOfClasses}
                  progress={course.progress || 0}
                  status={course.status}
                  isLiveClass={course.isLiveClass}
                  date={course.formattedDate}
                  courseData={course}
                />
              ))}
            </div>
          ) : (
            <p className="wishlist-empty">
              {activeTab === "Enrolled Courses"
                ? "No enrolled courses found."
                : "No completed courses found."}
            </p>
          );
        })()}
      </div>

      <button className="explore-btn" onClick={() => navigate("/coursedetails")}>
        Explore All Courses
      </button>
    </>
  );
}
