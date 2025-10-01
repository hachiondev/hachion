import React, { useEffect, useState } from "react";
import TrainingCard from "./TrainingCard";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { IoSearch } from "react-icons/io5";
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";

const TrainingEvents = () => {
  const navigate = useNavigate();
  const [mergedCourses, setMergedCourses] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modeFilter, setModeFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [isModeOpen, setIsModeOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
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
console.log("Trainer for", scheduleItem.schedule_course_name, "is", scheduleItem.trainer_name);
          return {
            ...scheduleItem,
            trainerName: scheduleItem.trainer_name, 
            course_id: matchingCourse?.id || null,
            course_image: matchingCourse?.courseImage || "",
            created_at: matchingCourse?.createdAt || "",
            numberOfClasses: matchingCourse?.numberOfClasses || null,
            discount: Number(matchingCourse?.discount ?? 0), 
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

  const resetFilters = () => {
    setModeFilter("");
    setCourseFilter("");
    setTimeFilter("");
  };

  // Event handlers for dropdown changes
  const handleCourseChange = (e) => setCourseFilter(e.target.value);
  const handleModeChange = (e) => setModeFilter(e.target.value);
  const handleTimeChange = (e) => setTimeFilter(e.target.value);

  const handleSearchIconClick = () => {
  };
  return (
    <div className="container">
      <div className="training-events-head-upcoming">
        <div className="home-spacing">
        <h2 className="association-head">Upcoming Trainings at Hachion</h2>
        <p className="association-head-tag">Kickstart your academic journey with expert-led online 
training for SAT and ACT success</p>
      </div>

      {/* <div className="card-pagination-container">
        <button className="view-all" onClick={() => setViewAll(!viewAll)}>
          {viewAll ? "View Less" : "View All"}
        </button>
      </div> */}
      

      <div className="filter-container">
        <div className="filter-section">

    {/* Mode Dropdown */}
    <div className="dropdown">
      <button
        className="btn d-flex text-nowrap align-items-center"
        type="button"
        id="modeDropdown"
        data-bs-toggle="dropdown"
        aria-expanded={isModeOpen}
        style={{backgroundColor: '#E9E7E7', height: '48px', fontSize: '14px'}}
        onClick={() => setIsModeOpen(!isModeOpen)}
      >
        {modeFilter || "All Modes"}
        {isModeOpen ? (
          <MdKeyboardArrowUp className="ms-1 arrow-icon" />
          ) : (
          <MdKeyboardArrowDown className="ms-1 arrow-icon" />
          )}
      </button>
      <ul className="dropdown-menu" aria-labelledby="modeDropdown">
        <li>
          <button className="dropdown-item" onClick={() => handleModeChange({ target: { value: "" } })}>
            All Modes
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={() => handleModeChange({ target: { value: "Live Class" } })}>
            Live Class
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={() => handleModeChange({ target: { value: "Live Demo" } })}>
            Live Demo
          </button>
        </li>
      </ul>
    </div>

    {/* Time Dropdown */}
    <div className="dropdown">
      <button
        className="btn d-flex text-nowrap align-items-center"
        type="button"
        id="timeDropdown"
        data-bs-toggle="dropdown"
        aria-expanded={isTimeOpen}
        style={{backgroundColor: '#E9E7E7', height: '48px', fontSize: '14px'}}
        onClick={() => setIsTimeOpen(!isTimeOpen)}
      >
        {timeFilter || "Any Time"}
        {isTimeOpen ? (
          <MdKeyboardArrowUp className="ms-1 arrow-icon" />
          ) : (
          <MdKeyboardArrowDown className="ms-1 arrow-icon" />
          )}
      </button>
      <ul className="dropdown-menu" aria-labelledby="timeDropdown">
        <li>
          <button className="dropdown-item" onClick={() => handleTimeChange({ target: { value: "" } })}>
            Any Time
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={() => handleTimeChange({ target: { value: "new" } })}>
            Newly Added
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={() => handleTimeChange({ target: { value: "today" } })}>
            Today
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={() => handleTimeChange({ target: { value: "week" } })}>
            This Week
          </button>
        </li>
      </ul>
    </div>

          {/* <div className="course-search-container"> */}
        <form className="d-flex" role="search">
       <div className="input-group custom-search" style={{height: '48px'}}>
      <input
        type="text"
        className="form-control border-0"
        placeholder="Search for Courses"
        value={courseFilter}
        onChange={handleCourseChange}
        list="course-options"
        style={{
         outline: "none",
          boxShadow: "none",
           }}
      />
      <button className="btn btn-info d-flex align-items-center justify-content-center search-btn"
      type="submit" onClick={handleSearchIconClick}>
        <IoSearch size={20} className="text-white" />
      </button>
    </div>
    </form>

<datalist id="course-options">
  {courseOptions
    .filter((course) =>
      course.toLowerCase() !== courseFilter.toLowerCase() && // ✨ Hide exact match
      course.toLowerCase().includes(courseFilter.toLowerCase())
    )
    .map((course, idx) => (
      <option key={idx} value={course} />
    ))}
</datalist>

          <button className="view-all" onClick={resetFilters}>
            Reset
          </button>
        </div>
      </div>
      </div>

     <div className="training-card-holder">
  {loading ? (
    // 🔄 Skeletons while loading
    Array.from({ length: 4 }).map((_, i) => (
      <div className="skeleton-card" key={i}></div>
    ))
  ) : filteredCourses.length > 0 ? (
    
    (viewAll ? filteredCourses : filteredCourses.slice(0, 4)).map(
      (course, index) => (

        <TrainingCard
          key={course.course_id || index}
          id={course.course_id}
          heading={course.schedule_course_name}
          discountPercentage={course.discount}
          trainer_name={course.trainerName}
          level={course.levels}
          month={course.numberOfClasses}
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
<div className="home-faq-banner container">
<div className="card-pagination-container">
        <button className="home-start-button" onClick={() => {
      if (viewAll) {
        document.querySelector(".training-events-head-upcoming")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setViewAll(!viewAll);
    }}>
          {viewAll ? "View Less" : "View More"}
        </button>
      </div>
      </div>
    </div>
  );
};

export default TrainingEvents;