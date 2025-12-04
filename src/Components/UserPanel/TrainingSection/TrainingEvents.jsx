// src/pages/TrainingEvents.jsx
import React, { useState, useMemo } from "react";
import TrainingCard from "./TrainingCard";
import "../Home.css";

// === IMPORTING TANSTACK QUERY HOOKS ===
import { useScheduleCourses } from "../../../Api/hooks/TrainingApi/useScheduleCourses";
import { useDiscountRules } from "../../../Api/hooks/TrendingApi/useDiscountRules";
import { useTrendingData } from "../../../Api/hooks/TrendingApi/useTrendingData";
import { useGeoData } from "../../../Api/hooks/TrendingApi/useGeoData";
import { getRuleDiscountPct } from "../TrendingSection/utils/discountUtils";

const TrainingEvents = () => {

  const userTimezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    []
  );

  // === Region names for discount calculation ===
  const regionNames = useMemo(() => {
    return Intl.DisplayNames
      ? new Intl.DisplayNames([navigator.language || "en"], { type: "region" })
      : { of: () => "" };
  }, []);

  const [viewAll, setViewAll] = useState(false);

  // ==== TANSTACK QUERIES (Shared across all components) ====
  const { data: scheduleRes = [], isLoading: loadingSchedule } =
    useScheduleCourses(userTimezone);

  const { data: coursesRes = [], isLoading: loadingCourses } =
    useTrendingData();

  const { data: discountRules = [], isLoading: loadingDiscounts } =
    useDiscountRules();

  const { data: geo = {}, isLoading: loadingGeo } = useGeoData();

  const { country = "US" } = geo;

  const loading = loadingSchedule || loadingCourses || loadingDiscounts || loadingGeo;

  // ========== MERGE SCHEDULE + COURSE SUMMARY ==========
  const mergedCourses = useMemo(() => {
    return scheduleRes.map((scheduleItem) => {
      const match = coursesRes.find(
        (c) =>
          c.courseName.toLowerCase().trim() ===
          scheduleItem.schedule_course_name.toLowerCase().trim()
      );

      return {
        ...scheduleItem,
        trainerName: scheduleItem.trainer_name,
        course_id: match?.id || null,
        course_image: match?.courseImage || "",
        created_at: match?.createdAt || "",
        numberOfClasses: match?.numberOfClasses || null,
        discount: match?.discount || 0,
        idiscount: match?.idiscount || 0,
        level: match?.level || "",
      };
    });
  }, [scheduleRes, coursesRes]);

  // ===================================================
  // FILTER UI States
  // ===================================================
  const [modeFilter, setModeFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");

  const normalizeStr = (s) => (s || "").trim().toLowerCase();

  // ====================================================
  // FILTERING LOGIC (memoized)
  // ====================================================
  const filteredCourses = useMemo(() => {
    const now = new Date();

    const filtered = mergedCourses.filter((course) => {
      const courseDate = new Date(course.schedule_date);
      const createdDate = new Date(course.created_at);

      const isToday = courseDate.toDateString() === now.toDateString();
      const isThisWeek =
        (courseDate - now) / (1000 * 60 * 60 * 24) <= 7 && courseDate > now;
      const isNewlyAdded = (now - createdDate) / (1000 * 60 * 60 * 24) <= 7;

      const courseNameMatch =
        !courseFilter ||
        course.schedule_course_name
          .toLowerCase()
          .includes(courseFilter.toLowerCase());

      const modeMatch =
        !modeFilter ||
        course.schedule_mode.toLowerCase() === modeFilter.toLowerCase();

      const timeMatch =
        !timeFilter ||
        (timeFilter === "today" && isToday) ||
        (timeFilter === "week" && isThisWeek) ||
        (timeFilter === "new" && isNewlyAdded);

      return courseNameMatch && modeMatch && timeMatch;
    });

    // Group sessions
    const grouped = {};
    filtered.forEach((item) => {
      const key = normalizeStr(item.schedule_course_name);
      if (!grouped[key]) grouped[key] = { ...item, sessions: [] };
      grouped[key].sessions.push({
        date: item.schedule_date,
        time: item.schedule_time,
      });
    });

    return Object.values(grouped);
  }, [mergedCourses, courseFilter, modeFilter, timeFilter]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const parts = dateString.split("-");
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const resetFilters = () => {
    setModeFilter("");
    setCourseFilter("");
    setTimeFilter("");
  };

  return (
    <div className="container">
      <div className="home-spacing">
        <div className="training-events-head-upcoming">
          <div className="home-spacing">
            <h2 className="association-head">Upcoming Trainings at Hachion</h2>
            <p className="association-head-mobile">
              Empower your future with hands-on training and expert guidance from
              Hachion's certified instructors.
            </p>
          </div>

          {/* Filters */}
          <div className="filter-container">
            <div className="filter-section">
              <select
                className="custom-select-drop"
                aria-label="Filter by mode"
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
              >
                <option value="">All Modes</option>
                <option value="Live Class">Live Class</option>
                <option value="Live Demo">Live Demo</option>
              </select>

              <select
                className="custom-select-drop"
                aria-label="Filter by time"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="">Any Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
              </select>

              <input
                type="text"
                className="form-control"
                placeholder="Search for Courses"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
              />

              <button className="view-all" onClick={resetFilters}>
                Reset
              </button>
            </div>
          </div>
        </div>

        <p className="association-head-desktop">
          Empower your future with hands-on training and expert guidance from
          Hachion's certified instructors.
        </p>
      </div>

      {/* Cards */}
      <div className="training-card-holder">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div className="skeleton-card" key={i}></div>
          ))
        ) : filteredCourses.length > 0 ? (
          (viewAll ? filteredCourses : filteredCourses.slice(0, 4)).map(
            (course, index) => {
              // Use shared discount calculation utility
              const rulePct = getRuleDiscountPct(
                course.schedule_course_name,
                country,
                discountRules,
                regionNames
              );

              const discountPercentage =
                rulePct > 0
                  ? rulePct
                  : country === "IN"
                    ? Number(course.idiscount) || 0
                    : Number(course.discount) || 0;

              return (
                <TrainingCard
                  key={course.course_id || index}
                  id={course.course_id}
                  heading={course.schedule_course_name}
                  discountPercentage={discountPercentage}
                  trainer_name={course.trainerName}
                  level={course.level}
                  month={course.numberOfClasses}
                  image={
                    course.course_image
                      ? `https://api.hachion.co/${course.course_image}`
                      : ""
                  }
                  date={formatDate(course.schedule_date)}
                  time={course.schedule_time}
                  duration={
                    course.schedule_duration
                      ? `Duration: ${course.schedule_duration}`
                      : ""
                  }
                  mode={course.schedule_mode}
                  scheduleCount={course.sessions?.length || 0}
                />
              );
            }
          )
        ) : (
          <div className="no-schedules-message">
            <p>No schedules are available</p>
          </div>
        )}
      </div>

      <div className="home-faq-banner container">
        <div className="card-pagination-container">
          <button
            className="home-start-button"
            onClick={() => {
              if (viewAll) {
                document
                  .querySelector(".training-events-head-upcoming")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }
              setViewAll(!viewAll);
            }}
            aria-label={viewAll ? "View fewer courses" : "View more courses"}
          >
            {viewAll ? "View Less" : "View More"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingEvents;