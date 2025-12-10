import React, { useEffect, useState, useMemo } from "react";
import TrainingCard from "./TrainingCard";
import "../../Home.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { IoSearch } from "react-icons/io5";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useGeoData } from "../../../../Api/hooks/TrendingApi/useGeoData";
import { useScheduleCourses } from "../../../../Api/hooks/TrainingApi/useScheduleCourses";
import { useCoursesSummary } from "../../../../Api/hooks/TrainingApi/useCoursesSummary";
import { useDiscountRules } from "../../../../Api/hooks/TrendingApi/useDiscountRules";

dayjs.extend(customParseFormat);

const TrainingEvents = () => {
  const [viewAll, setViewAll] = useState(false);
  const [modeFilter, setModeFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");

  const { data: geoData } = useGeoData();
  const { data: coursesSummaryRes = [], isLoading: loadingCourses } = useCoursesSummary();
  const { data: discountRulesData = [], isLoading: loadingDiscounts } = useDiscountRules();

  const userTimezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    []
  );

  const { data: scheduleRes = [], isLoading: loadingSchedule } =
    useScheduleCourses(userTimezone);

  const locale = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().locale || "en",
    []
  );

  const regionNames = useMemo(
    () => new Intl.DisplayNames([locale], { type: "region" }),
    [locale]
  );

  const country = useMemo(
    () => (geoData?.country || "US").toUpperCase(),
    [geoData]
  );

  const discountRules = useMemo(
    () => (Array.isArray(discountRulesData) ? discountRulesData : []),
    [discountRulesData]
  );

  const loading = loadingSchedule || loadingCourses || loadingDiscounts;

  // -----------------------------
  // Merge courses
  // -----------------------------
  const mergedCourses = useMemo(() => {
    if (!Array.isArray(scheduleRes) || !Array.isArray(coursesSummaryRes)) return [];

    return scheduleRes.map((scheduleItem) => {
      const scheduleName = scheduleItem?.schedule_course_name;

      const matchingCourse = coursesSummaryRes.find((c) => {
        const courseName = c?.courseName;
        if (!scheduleName || !courseName) return false;

        return (
          courseName.toLowerCase().trim() ===
          scheduleName.toLowerCase().trim()
        );
      });

      return {
        ...scheduleItem,
        trainerName: scheduleItem.trainer_name,
        course_id: matchingCourse?.id || null,
        course_image: matchingCourse?.courseImage || "",
        created_at: matchingCourse?.createdAt || "",
        numberOfClasses: matchingCourse?.numberOfClasses || null,
        discount: Number(matchingCourse?.discount ?? 0),
        idiscount: Number(matchingCourse?.idiscount ?? 0),
        level: matchingCourse?.level || "",
      };
    });
  }, [scheduleRes, coursesSummaryRes]);

  // -----------------------------
  // Course List Options
  // -----------------------------
  const courseOptions = useMemo(() => {
    if (!Array.isArray(scheduleRes)) return [];
    return [
      ...new Set(
        scheduleRes.map((course) => course.schedule_course_name.trim())
      ),
    ];
  }, [scheduleRes]);

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
        courses.some((c) => normalizeStr(c) === courseKey) ||
        courses.some((c) => normalizeStr(c) === "all");

      const countryOk =
        countries.some((c) => {
          const tokens = expandRuleCountry(c);
          return tokens.some((t) => userCountryTokens.has(t));
        }) ||
        countries.some((c) => normalizeStr(c) === "all");

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

  // -----------------------------
  // FILTERED COURSES (useMemo instead of useEffect+state)
  // -----------------------------
  const filteredCourses = useMemo(() => {
    const now = new Date();

    const filtered = mergedCourses.filter((course) => {
      const courseDate = new Date(course.schedule_date);
      const createdDate = new Date(course.created_at);

      const isToday = courseDate.toDateString() === now.toDateString();
      const isThisWeek =
        (courseDate - now) / (1000 * 60 * 60 * 24) <= 7 &&
        courseDate >= now;
      const isNew = (now - createdDate) / (1000 * 60 * 60 * 24) <= 7;

      const courseMatch =
        !courseFilter ||
        course.schedule_course_name
          ?.toLowerCase()
          .includes(courseFilter.toLowerCase());

      const modeMatch =
        !modeFilter ||
        course.schedule_mode?.toLowerCase() === modeFilter.toLowerCase();

      const timeMatch =
        !timeFilter ||
        (timeFilter === "today" && isToday) ||
        (timeFilter === "week" && isThisWeek) ||
        (timeFilter === "new" && isNew);

      return courseMatch && modeMatch && timeMatch;
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
  }, [courseFilter, modeFilter, timeFilter, mergedCourses]);

  // -----------------------------
  // Handlers
  // -----------------------------
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
              Empower your future with hands-on training and expert guidance.
            </p>
          </div>

          {/* FILTERS */}
          <div className="filter-container">
            <div className="filter-section">
              <select
                className="custom-select-drop"
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
              >
                <option value="">All Modes</option>
                <option value="Live Class">Live Class</option>
                <option value="Live Demo">Live Demo</option>
              </select>

              <select
                className="custom-select-drop"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="">Any Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
              </select>

              <form className="d-flex">
                <div className="input-group custom-search" style={{ height: 48 }}>
                  <input
                    type="text"
                    className="form-control border-0"
                    placeholder="Search for Courses"
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    list="course-options"
                    style={{ outline: "none", boxShadow: "none" }}
                  />

                  <button
                    className="btn btn-info d-flex align-items-center justify-content-center search-btn"
                    type="button"
                  >
                    <IoSearch size={20} className="text-white" />
                  </button>
                </div>
              </form>

              <datalist id="course-options">
                {courseOptions
                  .filter(
                    (course) =>
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

        <p className="association-head-desktop">
          Empower your future with hands-on training and expert guidance.
        </p>
      </div>

      {/* TRAINING CARDS */}
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
                discountPercentage={(() => {
                  const rulePct = getRuleDiscountPct(
                    course.schedule_course_name,
                    country
                  );
                  if (rulePct > 0) return rulePct;

                  return country === "IN"
                    ? Number(course.idiscount)
                    : Number(course.discount);
                })()}
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

      {/* VIEW MORE */}
      <div className="home-faq-banner container">
        <div className="card-pagination-container">
          <button
            className="home-start-button"
            onClick={() => {
              if (viewAll) {
                document
                  .querySelector(".training-events-head-upcoming")
                  ?.scrollIntoView({ behavior: "smooth" });
              }
              setViewAll(!viewAll);
            }}
          >
            {viewAll ? "View Less" : "View More"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingEvents;
