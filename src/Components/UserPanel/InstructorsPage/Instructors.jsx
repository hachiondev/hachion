import React, { useState, useEffect, useRef, useMemo } from "react";
import "../Style.css";
import "../Home.css";
import { TbSlashes } from "react-icons/tb";
import Avatar from "@mui/material/Avatar";
import { MdOutlineStar } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { HiPlayCircle } from "react-icons/hi2";
import axios from "axios";
import Pagination from "../Common/Pagination";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import { useCourses } from "../../../Api/hooks/HomePageApi/NavbarApi/useCourses";
import { useTrainersByCourse } from "../../../Api/hooks/CourseApi/useTrainersByCourse";
import { useTrainers } from "../../../Api/hooks/HomePageApi/TrainingApi/useTrainers";
import Loader from "../Common/Loader/Loader";
import { useTrainerOptions } from "../../../Api/hooks/InstructorSection/useTrainerOptions";

import TrainingEvents from '../HomePage/TrainingSection/TrainingEvents';
import Learners from "../HomePage/LearnerSection/Learners";

const isCourseOpen = (courseName) => {
  if (!courseName) return false;

  const blockedCourses = ["az-500", "az-900", "az-5000"];

  return !blockedCourses.includes(courseName.toLowerCase().trim());
};

const makeEnrollKey = (trainerName, courseName) =>
  `${trainerName?.trim().toLowerCase()}::${courseName
    ?.replace(/\+/g, " ")
    ?.trim()
    .toLowerCase()}`;

const getTrainerCourseCount = (allTrainers, trainerName) => {
  return new Set(
    allTrainers
      .filter(
        (t) =>
          t.trainer_name?.trim().toLowerCase() ===
          trainerName?.trim().toLowerCase()
      )
      .map((t) => t.course_name?.replace(/\+/g, " ")?.trim().toLowerCase())
  ).size;
};

// ✅ Normalize helper — strips extra spaces, lowercases for comparison
const normalize = (str) => str?.trim().toLowerCase() ?? "";

const Instructors = () => {
  const titleRef = useRef(null);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(16);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [showAllSummaries, setShowAllSummaries] = useState({});
  const [enrollCounts, setEnrollCounts] = useState({});

  const { data: coursesData = [] } = useCourses();
  const { data: trainers = [], isLoading, isError, error } = useTrainers();
  const { data: teacherOptions = [] } = useTrainerOptions();
  const { data: trainersByCourse = [] } = useTrainersByCourse(selectedCourse);

  /* -----------------------------
     Courses list
  ----------------------------- */
  useEffect(() => {
    if (Array.isArray(coursesData)) {
      setCourses(coursesData.map((c) => c.courseName));
    }
  }, [coursesData]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  /* -----------------------------
     Reset teacher when course changes
  ----------------------------- */
  // ✅ When user picks a different course, clear selected teacher
  // so the teacher dropdown re-populates correctly and doesn't
  // leave a stale teacher selected that doesn't belong to the new course.
  useEffect(() => {
    setSelectedTeacher("");
    setCurrentPage(1);
  }, [selectedCourse]);

  // ✅ Reset page when search or teacher changes too
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTeacher]);

  /* -----------------------------
     Filters
  ----------------------------- */
  const filteredTrainers = useMemo(() => {
    return trainers.filter((trainer) => {
      const term = normalize(searchTerm);

      // Search matches trainer name OR course name
      const matchesSearch =
        term === "" ||
        normalize(trainer.trainer_name).includes(term) ||
        normalize(trainer.course_name).includes(term);

      // ✅ Normalize both sides before comparing to avoid case/space mismatches
      const matchesTeacher = selectedTeacher
        ? normalize(trainer.trainer_name) === normalize(selectedTeacher)
        : true;

      const matchesCourse = selectedCourse
        ? normalize(trainer.course_name) === normalize(selectedCourse)
        : true;

      return matchesSearch && matchesCourse && matchesTeacher;
    });
  }, [trainers, searchTerm, selectedTeacher, selectedCourse]);

  /* -----------------------------
     Teacher dropdown options
  ----------------------------- */
  // ✅ When a course is selected, derive teacher options directly from the
  // filtered trainers list (same normalization) instead of relying solely
  // on the trainersByCourse API which may return mismatched data.
  const teacherDropdownOptions = useMemo(() => {
    if (selectedCourse) {
      // Get unique trainer names that actually teach the selected course
      const names = [
        ...new Set(
          trainers
            .filter(
              (t) => normalize(t.course_name) === normalize(selectedCourse)
            )
            .map((t) => t.trainer_name?.trim())
            .filter(Boolean)
        ),
      ];
      return names;
    }
    // No course selected — use the full teacher options list
    return teacherOptions.map((t) =>
      typeof t === "string" ? t : t.trainer_name
    );
  }, [selectedCourse, trainers, teacherOptions]);

  const toggleShowAll = (trainerId) => {
    setShowAllSummaries((prev) => ({
      ...prev,
      [trainerId]: !prev[trainerId],
    }));
  };

  /* -----------------------------
     Responsive pagination size
  ----------------------------- */
  useEffect(() => {
    const updateCardsPerPage = () => {
      const width = window.innerWidth;
      if (width <= 768) setCardsPerPage(4);
      else if (width <= 1024) setCardsPerPage(12);
      else setCardsPerPage(4); // ✅ Fixed: was hardcoded to 4 on desktop
    };

    updateCardsPerPage();
    window.addEventListener("resize", updateCardsPerPage);
    return () => window.removeEventListener("resize", updateCardsPerPage);
  }, []);

  /* -----------------------------
     Enroll counts
  ----------------------------- */
  useEffect(() => {
    if (!filteredTrainers.length) return;

    const fetchCounts = async () => {
      const counts = {};

      await Promise.all(
        filteredTrainers.map(async (trainer) => {
          if (!isCourseOpen(trainer.course_name)) return;

          try {
            const res = await axios.get(
              "https://api.test.hachion.co/enroll/count",
              {
                params: {
                  trainerName: trainer.trainer_name,
                  courseName: trainer.course_name.replace(/\s+/g, "+"),
                },
              }
            );

            const key = makeEnrollKey(trainer.trainer_name, trainer.course_name);
            counts[key] = res.data?.count ?? 0;
          } catch (err) {
            console.error("Enroll count error", err);
          }
        })
      );

      setEnrollCounts(counts);
    };

    fetchCounts();
  }, [filteredTrainers]);

  const formatForUrl = (str) => str.toLowerCase().replace(/\s+/g, "-");

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (titleRef.current) {
      const offsetTop = titleRef.current.offsetTop - 20;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  };

  const renderStarRating = (rating) => (
    <div className="rating-display">
      <MdOutlineStar className="star-icon" />
      <span className="rating-number">{rating || 0}</span>
    </div>
  );

  if (isLoading) return <Loader />;
  if (isError) return <div>{error?.message || "Something went wrong"}</div>;

  // const indexOfLastCard = currentPage * cardsPerPage;
  // const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  // const currentCards = filteredTrainers.slice(indexOfFirstCard, indexOfLastCard);
  // const totalCards = filteredTrainers.length;

  // Group trainers so each trainer appears only once
const groupedTrainers = Object.values(
  filteredTrainers.reduce((acc, trainer) => {
    const name = trainer.trainer_name?.trim().toLowerCase();

    if (!acc[name]) {
      acc[name] = {
        ...trainer,
        courses: [trainer.course_name],
      };
    } else {
      if (!acc[name].courses.includes(trainer.course_name)) {
        acc[name].courses.push(trainer.course_name);
      }
    }

    return acc;
  }, {})
);

const indexOfLastCard = currentPage * cardsPerPage;
const indexOfFirstCard = indexOfLastCard - cardsPerPage;
const currentCards = groupedTrainers.slice(indexOfFirstCard, indexOfLastCard);
const totalCards = groupedTrainers.length;
  /* -----------------------------
     UI
  ----------------------------- */
  return (
    <div className="course-top">
      {/* Banner */}
      <div className="instructor-profile-banner">
        <h1 className="instructor-profile-title">Instructor Profiles</h1>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="instructor-breadcrumb-item">
              <a href="/">Home</a> <TbSlashes color="#00aeef" />
            </li>
            <li className="instructor-breadcrumb-item active" aria-current="page">
              Instructor Profiles
            </li>
          </ol>
        </nav>
      </div>

      <div className="container">
        {/* ✅ Count reflects filtered results accurately */}
        <p ref={titleRef} className="expert-title">
          Instructors ({filteredTrainers.length})
        </p>

        {/* Filters */}
        <div className="instructors-filter">
          {/* Search */}
          <div className="expert-filter-item search-item">
            <label htmlFor="search">Search:</label>
            <div className="search-input-wrapper">
              <IoSearch className="expert-search-icon" />
              <input
                type="text"
                id="search"
                placeholder="Search in your teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Courses */}
          <div className="expert-filter-item">
            <label htmlFor="course">Courses:</label>
            <select
              id="course"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">All Courses</option>
              {courses.map((course, idx) => (
                <option key={idx} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          {/* Teachers */}
          <div className="expert-filter-item">
            <label htmlFor="teacher">Teacher:</label>
            <select
              id="teacher"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
            >
              <option value="">All Teachers</option>
              {/* ✅ Uses derived options based on selected course */}
              {teacherDropdownOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <div className="expert-filter-item">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearchTerm("");
                setSelectedCourse("");
                setSelectedTeacher("");
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Trainer Cards */}
        <div className="recent-entries-container">
          <div className="profiles-grid">
            {currentCards.length > 0 ? (
              currentCards.map((trainer) => {
                // const courseCount = getTrainerCourseCount(
                //   trainers,
                //   trainer.trainer_name
                // );
const courseCount = trainer.courses
  ? trainer.courses.length
  : getTrainerCourseCount(trainers, trainer.trainer_name);
                const enrollKey = makeEnrollKey(
                  trainer.trainer_name,
                  trainer.course_name
                );

                const studentCount = enrollCounts[enrollKey] ?? 0;

                const trainerKey =
                  trainer.id || `${trainer.trainer_name}-${trainer.course_name}`;
                const isSummaryExpanded = showAllSummaries[trainerKey];

                return (
                  <div className="instructor-card" key={trainerKey}>
                    <div className="card-course-details">
                      <div className="instructor-image">
                        <img
                          alt={trainer.trainer_name}
                          src={
                            trainer.trainerImage
                              ? `https://api.test.hachion.co/${trainer.trainerImage}`
                              : "defaulttrainer.jpg"
                          }
                          className="instructor-image-single"
                        />
                      </div>

                      <div className="instrctor-content">
                        <p className="expert-name">{trainer.trainer_name}</p>
                        {/* <p className="expert-course">{trainer.course_name}</p> */}
                        {/* <p className="expert-course">
  {trainer.courses ? trainer.courses.join(", ") : trainer.course_name}
</p> */}
<p
  className="expert-course"
  style={{
    whiteSpace: "normal",
    overflow: "visible",
    textOverflow: "unset",
    display: "block",
  }}
>
  {trainer.courses ? trainer.courses.join(", ") : trainer.course_name}
</p>

                        <div className="expert-about">
                          <p className="expert-me">About Me</p>
                          <div
                            className={`expert-detail ${
                              isSummaryExpanded ? "expanded" : "collapsed"
                            }`}
                            dangerouslySetInnerHTML={{ __html: trainer.summary }}
                          />
                          {trainer.summary && (
                            <button
                              className="read-more-btn"
                              onClick={() => toggleShowAll(trainerKey)}
                            >
                              {isSummaryExpanded ? "Read Less ↑" : "Read More ↓"}
                            </button>
                          )}
                        </div>

                        <hr className="faq-seperater" />

                        <div className="card-row">
                          <div className="instructor-rating">
                            {renderStarRating(trainer.trainerUserRating || 5)}
                          </div>

                          {isCourseOpen(trainer.course_name) && (
                            <p className="student-count">
                              <FiUsers className="student-count-icon" />
                              <span className="student-count-number">
                                {studentCount}
                              </span>
                              <span className="student-count-text">Students</span>
                            </p>
                          )}

                          <div className="course-count">
                            <HiPlayCircle className="course-count-icon" />
                            <span className="course-count-number">{courseCount}</span>
                            <span className="course-count-text">Courses</span>
                          </div>
                        </div>

                        {/* <button
                          className="view-profile-btn"
                          onClick={() =>
                            navigate(
                              `/${formatForUrl(trainer.course_name)}-${trainer.trainer_name}-instructor-details`,
                              {
                                state: {
                                  trainer,
                                  enrollCount: studentCount,
                                },
                              }
                            )
                          }
                        >
                          View Profile
                        </button> */}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // ✅ Now correctly shows when filters return no results
              <p className="no-results-message">No instructors found.</p>
            )}
          </div>

          {/* Pagination */}
          {totalCards > cardsPerPage && (
            <div className="pagination-container">
              <Pagination
                currentPage={currentPage}
                totalCards={totalCards}
                cardsPerPage={cardsPerPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>

        <TrainingEvents />
        
        <Learners page="corporate" />
      </div>
    </div>
  );
};

export default Instructors;