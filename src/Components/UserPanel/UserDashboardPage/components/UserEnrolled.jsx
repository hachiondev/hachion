import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useNavigate } from "react-router-dom";

import UserEnrolledCards from "../../UserEnrolledCards";
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

  // ✅ TanStack Query hooks with safe defaults
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

    const today = dayjs().startOf("day");

    const mergedCourses = allEroll
      .filter((e) => e.email === email)
      .map((e) => {
        const course = allCourses.find(
          (c) => normalize(c.courseName) === normalize(e.course_name)
        );

        const trainerObj = allTrainers.find(
          (t) => normalize(t.course_name) === normalize(e.course_name)
        );

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

        const isValidDate = parsedDate.isValid();
        const isFuture = isValidDate && parsedDate.isAfter(today, "day");
        const isPast = isValidDate && parsedDate.isBefore(today, "day");

        let baseStatus = "ENROLLED";
        if (isFuture) baseStatus = "UPCOMING";
        else if (isPast) baseStatus = "COMPLETED";

        let progress = e.progress || 0;
        if (baseStatus === "COMPLETED") progress = 100;

        const isLiveClass =
          course?.mode?.toLowerCase() === "live" ||
          e.mode?.toLowerCase() === "live";

        return {
          ...e,
          ...course,
          trainer: course?.trainer || trainerObj?.trainer_name,
          baseStatus,
          progress,
          isLiveClass,
          formattedDate: isValidDate
            ? parsedDate.format("MMM-DD-YYYY")
            : "",
          uniqueId: `${e.email}-${e.course_name}-${e.demo_date || e.enroll_date}`,
        };
      });

    setCourses(mergedCourses);
  }, [allEroll, allCourses, allTrainers]);

  // ✅ Filtered courses - FIXED: Properly filter based on activeTab
  const filteredCourses = useMemo(() => {
    if (activeTab === "Enrolled Courses") {
      return courses.filter(
        (c) => c.baseStatus === "ENROLLED" || c.baseStatus === "UPCOMING"
      );
    }
    if (activeTab === "Completed Courses") {
      return courses.filter((c) => c.baseStatus === "COMPLETED");
    }
    return [];
  }, [activeTab, courses]);

  // ✅ Loader state
  if (enrollLoading || coursesLoading || trainersLoading) {
    return <p className="wishlist-empty"><Loader /></p>;
  }

  return (
    <>
      {/* Tabs */}
      <div className="dashboard-activity-title">
        {["Enrolled Courses", "Completed Courses"].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => {
              setActiveTab(tab);
              // ✅ Force re-render by resetting filteredCourses
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Courses */}
      <div className="wishlist-container">
        {filteredCourses.length ? (
          <div className="wishlist-grid">
            {filteredCourses.map((course) => {
              // ✅ Determine button label based on activeTab
              let buttonStatus;
              if (activeTab === "Completed Courses") {
                buttonStatus = "Completed";
              } else if (course.baseStatus === "UPCOMING") {
                buttonStatus = "Upcoming Demo";
              } else {
                buttonStatus = "Enrolled to Demo";
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
                  status={buttonStatus} // ✅ Pass correct status based on activeTab
                  courseData={course}
                  type={course.type}
                  activeTab={activeTab}
                  // ✅ Force complete courses to show 100% progress in Completed tab
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

      {/* CTA */}
      <button
        className="explore-btn"
        onClick={() => navigate("/coursedetails")}
      >
        Explore All Courses
      </button>
    </>
  );
}