import React, { useEffect, useState } from "react";
import PopupUpcomingCard from "./PopupUpcomingCard";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const PopupUpcomingCourses = () => {
  const navigate = useNavigate();
  const [mergedCourses, setMergedCourses] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modeFilter, setModeFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [courseOptions, setCourseOptions] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  // ✅ Get user's timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [scheduleRes, coursesRes] = await Promise.all([
          fetch(
            `https://api.test.hachion.co/schedulecourse?timezone=${userTimezone}`
          ).then((res) => res.json()),
          
          fetch("https://api.test.hachion.co/courses/all").then((res) => res.json()),
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
        setMergedCourses(mergedData);

        const uniqueCourses = [
          ...new Set(scheduleRes.map((course) => course.schedule_course_name.trim())),
        ];

        setCourseOptions(uniqueCourses);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
      setLoading(false);
    }
    };

    fetchData();
  }, [userTimezone]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
  
    // Force date to be parsed as local
    const parts = dateString.split("-");
    const localDate = new Date(parts[0], parts[1] - 1, parts[2]);
  
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(localDate);
  };
 const getFilteredCourses = () => {
    const now = new Date();
  
    const filtered = mergedCourses.filter((course) => {
      const courseDate = new Date(course.schedule_date);
      const createdDate = new Date(course.created_at);
  
      const isToday = courseDate.toDateString() === now.toDateString();
      const isThisWeek =
        (courseDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= 7 &&
        courseDate > now;
      const isNewlyAdded = (now - createdDate) / (1000 * 60 * 60 * 24) <= 7;
  
      const courseNameMatch =
        !courseFilter ||
        course.schedule_course_name?.toLowerCase().trim().includes(courseFilter.toLowerCase().trim());
  
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
  
    const grouped = {};
    filtered.forEach((item) => {
      const key = item.schedule_course_name.trim().toLowerCase();
      if (!grouped[key]) {
        grouped[key] = {
          ...item,
          sessions: [],
        };
      }
      grouped[key].sessions.push({
        date: item.schedule_date,
        time: item.schedule_time,
      });
    });
  
    return Object.values(grouped);
  };
  
  
  useEffect(() => {
    setFilteredCourses([]); // Reset state
    setTimeout(() => {
      setFilteredCourses([...getFilteredCourses()]);
    }, 0);
  }, [courseFilter, modeFilter, timeFilter, mergedCourses]);

  return (
    <div className="container">
        <p className="popup-title-text">Upcoming Training and events in your location</p>

     <div className="popup-card-holder">
  {loading ? (
    // 🔄 Skeletons while loading
    Array.from({ length: 4 }).map((_, i) => (
      <div className="skeleton-card" key={i}></div>
    ))
  ) : filteredCourses.length > 0 ? (
    (viewAll ? filteredCourses : filteredCourses.slice(0, 4)).map(
      (course, index) => (
        <PopupUpcomingCard
          key={course.course_id || index}
          id={course.course_id}
          heading={course.schedule_course_name}
          discountPercentage={course.discount}
          trainer_name={course.trainerName}
          level={course.levels}
          image={
            course.course_image
              ? `https://api.test.hachion.co/${course.course_image}`
              : ""
          }
          date={course.schedule_date ? formatDate(course.schedule_date) : ""}
          time={course.schedule_time || ""}
          duration={
            course.schedule_duration
              ? `Duration: ${course.schedule_duration}`
              : ""
          }
          mode={course.schedule_mode || ""}
          scheduleCount={course.sessions?.length || 0}
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

export default PopupUpcomingCourses;