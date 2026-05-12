import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useNavigate } from "react-router-dom";

import UserEnrolledCards from "./UserEnrolledCards";
import "../../Dashboard.css";

import { useEnrollAll } from "../../../../Api/hooks/UserDashboardApi/useEnrollAll";
import { useAllCourses } from "../../../../Api/hooks/SitemapPageApi/useAllCourses";
import { useTrainerOptions } from "../../../../Api/hooks/InstructorSection/useTrainerOptions";
import Loader from "../../Common/Loader/Loader";

dayjs.extend(customParseFormat);

export default function UserEnrolledCourses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("Enrolled Courses");

  const { data: allEroll = [], isLoading: enrollLoading } = useEnrollAll();
  const { data: allCourses = [], isLoading: coursesLoading } = useAllCourses();
  const { data: allTrainers = [], isLoading: trainersLoading } =
    useTrainerOptions();

  const normalize = (str) => (str || "").toString().trim().toLowerCase();

  useEffect(() => {
    if (!allEroll.length || !allCourses.length) return;

    const user = JSON.parse(localStorage.getItem("loginuserData"));
    const email = user?.email;
    if (!email) return;

    const todayDate = dayjs().startOf("day");

    const mergedCourses = allEroll
      .filter((e) => e.email === email)
      .map((e) => {
        const course = allCourses.find(
          (c) => normalize(c.courseName) === normalize(e.course_name)
        );

        const trainerObj = allTrainers.find(
          (t) => normalize(t.course_name) === normalize(e.course_name)
        );

        const enrollDate = dayjs(e.enroll_date, "YYYY-MM-DD");
        const mode = (e.mode || "").toLowerCase();

        let baseStatus = "ENROLLED";

        // Scenario 1: Before scheduled date
        if (todayDate.isBefore(enrollDate, "day")) {
          baseStatus = "ENROLLED";
        }
        // Scenario 2: On scheduled date
        else if (todayDate.isSame(enrollDate, "day")) {
          baseStatus = "IN_PROGRESS";
        }
        // Scenario 3: After scheduled date
        else if (todayDate.isAfter(enrollDate, "day")) {
          if (mode.includes("demo")) {
            // Live Demo: directly completed
            baseStatus = "COMPLETED";
          } else if (mode.includes("class")) {
            // Live Class: allow 3 days window
            const endWindow = enrollDate.add(3, "day");
            if (todayDate.isAfter(endWindow, "day")) {
              baseStatus = "COMPLETED";
            } else {
              baseStatus = "IN_PROGRESS";
            }
          } else {
            baseStatus = "COMPLETED";
          }
        }

        let progress = 0;
        if (baseStatus === "IN_PROGRESS") progress = 50;
        if (baseStatus === "COMPLETED") progress = 100;

        const isLiveClass =
          course?.mode?.toLowerCase().includes("live") ||
          e.mode?.toLowerCase().includes("live");

        return {
          ...e,
          ...course,
          trainer: course?.trainer || trainerObj?.trainer_name,
          baseStatus,
          progress,
          isLiveClass,
          formattedDate: enrollDate.isValid()
            ? enrollDate.format("MMM-DD-YYYY")
            : "",
          uniqueId: `${e.email}-${e.course_name}-${e.enroll_date}`,
        };
      });

    setCourses(mergedCourses);
  }, [allEroll, allCourses, allTrainers]);

  const filteredCourses = useMemo(() => {
    if (activeTab === "Enrolled Courses") {
      return courses.filter(
        (c) => c.baseStatus === "ENROLLED" || c.baseStatus === "IN_PROGRESS"
      );
    }
    if (activeTab === "Completed Courses") {
      return courses.filter((c) => c.baseStatus === "COMPLETED");
    }
    return [];
  }, [activeTab, courses]);

  if (enrollLoading || coursesLoading || trainersLoading) {
    return (
      <p className="wishlist-empty">
        <Loader />
      </p>
    );
  }

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
        {filteredCourses.length ? (
          <div className="wishlist-grid">
            {filteredCourses.map((course) => {
              let buttonStatus;
              if (course.baseStatus === "COMPLETED") {
                buttonStatus = "Completed";
              } else if (course.baseStatus === "IN_PROGRESS") {
                buttonStatus = "In Progress";
              } else {
                buttonStatus = "Enrolled";
              }

              return (
                <UserEnrolledCards
                  key={course.uniqueId}
                  heading={course.course_name || course.courseName}
                  image={`https://api.test.hachion.co/${course.courseImage}`}
                  level={course.level}
                  trainer_name={course.trainer}
                  month={course.numberOfClasses}
                  progress={course.progress}
                  isLiveClass={course.isLiveClass}
                  date={course.formattedDate}
                  status={buttonStatus}
                  courseData={course}
                  type={course.type}
                  activeTab={activeTab}
                  forceCompleted={activeTab === "Completed Courses"}
                />
              );
            })}
          </div>
        ) : (
          <p className="wishlist-empty">
            {activeTab === "Enrolled Courses"
              ? "No enrolled courses found."
              : "No completed courses found."}
          </p>
        )}
      </div>

      <button className="explore-btn" onClick={() => navigate("/courses")}>
        Explore All Courses
      </button>
    </>
  );
}
