import React, { useEffect, useState } from "react";
import TrainingCard from "./TrainingCard";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const TrainingEvents = () => {
  const navigate = useNavigate();
  const [mergedCourses, setMergedCourses] = useState([]);
  const [viewAll, setViewAll] = useState(false);

  const [modeFilter, setModeFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");

  const [courseOptions, setCourseOptions] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scheduleRes, coursesRes] = await Promise.all([
          fetch(
            `/HachionUserDashboad/schedulecourse?timezone=${userTimezone}`
          ).then((res) => res.json()),
          fetch("/HachionUserDashboad/courses/all").then((res) => res.json()),
        ]);

        if (!Array.isArray(scheduleRes) || !Array.isArray(coursesRes)) {
          throw new Error("Invalid API response format");
        }

        const mergedData = scheduleRes.map((scheduleItem) => {
          const matchingCourse = coursesRes.find(
            (course) =>
              course.courseName.toLowerCase().trim() ===
              scheduleItem.schedule_course_name.toLowerCase().trim()
          );

          return {
            ...scheduleItem,
            course_id: matchingCourse?.id || null,
            course_image: matchingCourse?.courseImage || "",
            created_at: matchingCourse?.createdAt || "",
          };
        });

        console.log("Merged Courses:", mergedData);
        setMergedCourses(mergedData);

        const uniqueCourses = [
          ...new Set(coursesRes.map((course) => course.courseName.trim())),
        ];
        setCourseOptions(uniqueCourses);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userTimezone]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const getFilteredCourses = () => {
    const now = new Date();

    return mergedCourses.filter((course) => {
      const courseDate = new Date(course.schedule_date);
      const createdDate = new Date(course.created_at);

      const isToday = courseDate.toDateString() === now.toDateString();
      const isThisWeek =
        (courseDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= 7 &&
        courseDate > now;
      const isNewlyAdded = (now - createdDate) / (1000 * 60 * 60 * 24) <= 7;

      const courseNameMatch =
        !courseFilter ||
        course.schedule_course_name?.toLowerCase().trim() ===
          courseFilter.toLowerCase().trim();

      const modeMatch =
        !modeFilter ||
        course.schedule_mode?.toLowerCase().trim() ===
          modeFilter.toLowerCase().trim();

      const timeMatch =
        !timeFilter ||
        (timeFilter === "today" && isToday) ||
        (timeFilter === "week" && isThisWeek) ||
        (timeFilter === "new" && isNewlyAdded);

      return courseNameMatch && modeMatch && timeMatch;
    });
  };
 

  useEffect(() => {
    setFilteredCourses([]); // Reset state
    setTimeout(() => {
      setFilteredCourses([...getFilteredCourses()]);
    }, 0);
  }, [courseFilter, modeFilter, timeFilter, mergedCourses]);

  const resetFilters = () => {
    setModeFilter("");
    setCourseFilter("");
    setTimeFilter("");
  };

  const handleCourseChange = (e) => setCourseFilter(e.target.value);
  const handleModeChange = (e) => setModeFilter(e.target.value);
  const handleTimeChange = (e) => setTimeFilter(e.target.value);
  return (
    <div className="training-events">
      <div className="training-events-head-upcoming">
        <h1 className="association-head">Upcoming Training Events</h1>
      </div>

      <div className="view-btn">
        <button className="view-all" onClick={() => setViewAll(!viewAll)}>
          {viewAll ? "View Less" : "View All"}
        </button>
      </div>

      <div className="filter-container">
        <div className="filter-section">
          <select value={modeFilter} onChange={handleModeChange}>
            <option value="">All Modes</option>
            <option value="Live Class">Live Class</option>
            <option value="Live Demo">Live Demo</option>
          </select>

          <select value={courseFilter} onChange={handleCourseChange}>
            <option value="">All Courses</option>
            {courseOptions.map((course, idx) => (
              <option key={idx} value={course}>
                {course}
              </option>
            ))}
          </select>

          <select value={timeFilter} onChange={handleTimeChange}>
            <option value="">Any Time</option>
            <option value="new">Newly Added</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
          </select>

          <button className="view-all" onClick={resetFilters}>
            Reset
          </button>
        </div>
      </div>

      <div className="training-card-holder">
        {filteredCourses.length > 0 ? (
          (viewAll ? filteredCourses : filteredCourses.slice(0, 4)).map(
            (course, index) => (
              <TrainingCard
                key={course.course_id || index}
                id={course.course_id}
                heading={course.schedule_course_name}
                image={
                  course.course_image
                    ? `/HachionUserDashboad/${course.course_image}`
                    : ""
                }
                date={
                  course.schedule_date ? formatDate(course.schedule_date) : ""
                }
                time={course.schedule_time || ""}
                duration={
                  course.schedule_duration
                    ? `Duration: ${course.schedule_duration}`
                    : ""
                }
                mode={course.schedule_mode || ""}
              />
            )
          )
        ) : (
          <div className="no-schedules-message">
            <p>No schedules are available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingEvents;