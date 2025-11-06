import React, { useEffect, useState } from "react";
import TrainingCard from "./TrainingCard";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { IoSearch } from "react-icons/io5";
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

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
  
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [discountRules, setDiscountRules] = useState([]);
const [country, setCountry] = useState('US');
const locale = Intl.DateTimeFormat().resolvedOptions().locale || 'en';
const regionNames = new Intl.DisplayNames([locale], { type: 'region' });

useEffect(() => {
  (async () => {
    try {
      const resp = await fetch('https://ipinfo.io/json?token=82aafc3ab8d25b');
      const data = await resp.json();
      setCountry((data?.country || 'US').toUpperCase());
    } catch {
      setCountry('US');
    }
  })();
}, []);

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
            idiscount: Number(matchingCourse?.idiscount ?? 0),
level: matchingCourse?.level ||""
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


  const normalizeStr = (s) => (s || "").toString().trim().toLowerCase();
const parseMDY = (s) => dayjs(s, ["MM/DD/YYYY", "YYYY-MM-DD"], true);
const inWindow = (start, end) => {
  const today = dayjs();
  const s = parseMDY(start);
  const e = parseMDY(end);
  const okS = s.isValid() ? !today.isBefore(s, "day") : true;
  const okE = e.isValid() ? !today.isAfter(e, "day") : true;
  return okS && okE;
};
const expandRuleCountry = (token) => {
  const t = (token || "").toString().trim();
  if (!t) return [];
  if (/^[A-Za-z]{2}$/.test(t)) {
    const code = t.toUpperCase();
    const name = regionNames.of(code) || "";
    return [normalizeStr(code), normalizeStr(name)];
  }
  return [normalizeStr(t)];
};
const expandUserCountry = (cc) => {
  const code = (cc || "").toUpperCase();
  const name = regionNames.of(code) || "";
  return new Set([normalizeStr(code), normalizeStr(name)]);
};
const getRuleDiscountPct = (courseName, countryCode) => {
  if (!discountRules?.length) return 0;
  const userCountryTokens = expandUserCountry(countryCode);
  const courseKey = normalizeStr(courseName);
  let best = 0;
  for (const r of discountRules) {
    if ((r.status || "").toLowerCase() !== "active") continue;
    if (!inWindow(r.startDate, r.endDate)) continue;
    const courses = Array.isArray(r.courseNames) ? r.courseNames : [];
    const countries = Array.isArray(r.countryNames) ? r.countryNames : [];
    const courseOk =
      courses.some(c => normalizeStr(c) === courseKey) ||
      courses.some(c => normalizeStr(c) === "all");
    const countryOk =
      countries.some(c => {
        const tokens = expandRuleCountry(c);
        return tokens.some(t => userCountryTokens.has(t));
      }) ||
      countries.some(c => normalizeStr(c) === "all");
    if (courseOk && countryOk) {
      const pct = Number(r.discountPercentage || 0);
      if (pct > best) best = pct;
    }
  }
  return best;
};

  const formatDate = (dateString) => {
    if (!dateString) return "";

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
    setFilteredCourses([]); 
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

  const handleSearchIconClick = () => {
  };

  useEffect(() => {
  (async () => {
    try {
      const resp = await fetch('https://api.test.hachion.co/discounts-courses');
      const data = await resp.json();
      setDiscountRules(Array.isArray(data) ? data : []);
    } catch {
      setDiscountRules([]);
    }
  })();
}, []);

  return (
    <div className="container">
      <div className="training-events-head-upcoming">
        <div className="home-spacing">
        <h2 className="association-head">Upcoming Trainings at Hachion</h2>
        <p className="association-head-tag">Empower your future with hands-on training and expert guidance from Hachion’s certified instructors.</p>
      </div>

      {/* <div className="card-pagination-container">
        <button className="view-all" onClick={() => setViewAll(!viewAll)}>
          {viewAll ? "View Less" : "View All"}
        </button>
      </div> */}
      

    <div className="filter-container">
  <div className="filter-section">
    {/* Mode Select */}
    <select
    className="custom-select-drop"
    aria-label="Filter by mode"
      id="modeFilter"
      value={modeFilter}
      onChange={(e) => handleModeChange(e)}
    >
      <option value="">All Modes</option>
      <option value="Live Class">Live Class</option>
      <option value="Live Demo">Live Demo</option>
    </select>

    {/* Time Select */}
    <select
    className="custom-select-drop"
    aria-label="Filter by time"
      id="timeFilter"
      value={timeFilter}
      onChange={(e) => handleTimeChange(e)}
    >
      <option value="">Any Time</option>
      <option value="today">Today</option>
      <option value="week">This Week</option>
    </select>

          {/* <div className="course-search-container"> */}
        <form className="d-flex" role="search">
       <div className="input-group custom-search" style={{height: '48px'}}>
      <input
        type="text"
        className="form-control border-0"
        placeholder="Search for Courses"
        value={courseFilter}
        onChange={handleCourseChange}
         onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();      
          e.stopPropagation();
          handleSearchIconClick(); 
        }
      }}
        list="course-options"
        style={{
         outline: "none",
          boxShadow: "none",
           }}
      />
    <button
  className="btn btn-info d-flex align-items-center justify-content-center search-btn"
  type="button"                    
  aria-label="Search courses"
  onClick={handleSearchIconClick}
>
  <IoSearch size={20} className="text-white" />
</button>
    </div>
    </form>

<datalist id="course-options">
  {courseOptions
    .filter((course) =>
      course.toLowerCase() !== courseFilter.toLowerCase() && 
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
          
          discountPercentage={
  (() => {
    const rulePct = getRuleDiscountPct(course.schedule_course_name, country);
    if (rulePct > 0) return rulePct;
    return country === 'IN'
      ? (course.idiscount != null ? Number(course.idiscount) : 0)
      : (course.discount  != null ? Number(course.discount)  : 0);
  })()
}

          trainer_name={course.trainerName}
          level={course.level}
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