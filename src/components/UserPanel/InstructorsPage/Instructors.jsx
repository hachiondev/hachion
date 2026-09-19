"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import "../Style.css";
import "../Home.css";
import { TbSlashes } from "react-icons/tb";
import { MdOutlineStar } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { HiPlayCircle } from "react-icons/hi2";
import axios from "axios";
import Pagination from "../Common/Pagination";
import { IoSearch } from "react-icons/io5";
import { useCourses } from "@/Api/hooks/HomePageApi/NavbarApi/useCourses";
import { useTrainers } from "@/Api/hooks/HomePageApi/TrainingApi/useTrainers";
import Loader from "../Common/Loader/Loader";
import { useTrainerOptions } from "@/Api/hooks/InstructorSection/useTrainerOptions";
import TrainingEvents from "../HomePage/TrainingSection/TrainingEvents";
import Learners from "../HomePage/LearnerSection/Learners";

const isCourseOpen = (courseName) => {
  if (!courseName) return false;
  const blockedCourses = ["az-500", "az-900", "az-5000"];
  return !blockedCourses.includes(courseName.toLowerCase().trim());
};
const makeEnrollKey = (trainerName, courseName) =>
  `${trainerName?.trim().toLowerCase()}::${courseName?.replace(/\+/g, " ")?.trim().toLowerCase()}`;
const getTrainerCourseCount = (allTrainers, trainerName) => {
  return new Set(
    allTrainers
      .filter((t) => t.trainer_name?.trim().toLowerCase() === trainerName?.trim().toLowerCase())
      .map((t) => t.course_name?.replace(/\+/g, " ")?.trim().toLowerCase())
  ).size;
};
const normalize = (str) => str?.trim().toLowerCase() ?? "";
const decodeHtml = (html) => {
  if (!html) return "";
  return html.replace(/\\u003C/g, "<").replace(/\\u003E/g, ">").replace(/\\u0026/g, "&");
};

// Module-level so the reference never changes across renders — an inline
// `= []` destructuring default creates a brand-new array every render
// while a query is still loading, which cascades through every useMemo/
// useEffect keyed on that value and re-fires them every render (an
// infinite "Maximum update depth exceeded" loop, confirmed via the
// enrollCounts effect below repeatedly re-fetching while trainers/
// teacherOptions/coursesData are loading).
const EMPTY_ARRAY = [];

// Ported from the CRA app's src/Components/UserPanel/InstructorsPage/Instructors.jsx
// (the /instructor-profiles page). Dropped: useTrainersByCourse (fetched but its
// result was never read anywhere in the original — dead network call) and the
// useNavigate import (the one call site using it was already commented out in
// the original). Also dropped 3 leftover debug console.log calls that ran on
// every card render.
const Instructors = () => {
  const titleRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(16);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [showAllSummaries, setShowAllSummaries] = useState({});
  const [enrollCounts, setEnrollCounts] = useState({});

  const { data: coursesData = EMPTY_ARRAY } = useCourses();
  const { data: trainers = EMPTY_ARRAY, isLoading, isError, error } = useTrainers();
  const { data: teacherOptions = EMPTY_ARRAY } = useTrainerOptions();

  useEffect(() => {
    if (Array.isArray(coursesData)) {
      setCourses(coursesData.map((c) => c.courseName));
    }
  }, [coursesData]);

  useEffect(() => {
    setSelectedTeacher("");
    setCurrentPage(1);
  }, [selectedCourse]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTeacher]);

  const summaryMap = useMemo(() => {
    const map = {};
    teacherOptions.forEach((t) => {
      map[t.trainer_name?.trim().toLowerCase()] = t.summary;
    });
    return map;
  }, [teacherOptions]);

  // /trainers/summary (useTrainers, below) only returns trainerName/courseName
  // pairs — no photo. /trainersnames-unique (useTrainerOptions, already
  // fetched for summaryMap above) has the real trainerImage path, so look
  // it up the same way instead of a second network call.
  const imageMap = useMemo(() => {
    const map = {};
    teacherOptions.forEach((t) => {
      map[t.trainer_name?.trim().toLowerCase()] = t.trainerImage;
    });
    return map;
  }, [teacherOptions]);

  const filteredTrainers = useMemo(() => {
    return trainers
      .map((t) => {
        const trainerName = t.trainer_name || t.trainerName;
        const courseName = t.course_name || t.courseName;
        const key = trainerName?.trim().toLowerCase();
        return {
          ...t,
          trainer_name: trainerName,
          course_name: courseName,
          summary: summaryMap[key] || "",
          trainerImage: t.trainerImage || imageMap[key] || "",
        };
      })
      .filter((trainer) => {
        const term = normalize(searchTerm);
        const matchesSearch =
          term === "" ||
          normalize(trainer.trainer_name).includes(term) ||
          normalize(trainer.course_name).includes(term);
        const matchesTeacher = selectedTeacher ? normalize(trainer.trainer_name) === normalize(selectedTeacher) : true;
        const matchesCourse = selectedCourse ? normalize(trainer.course_name) === normalize(selectedCourse) : true;
        return matchesSearch && matchesCourse && matchesTeacher;
      });
  }, [trainers, searchTerm, selectedTeacher, selectedCourse, summaryMap]);

  const teacherDropdownOptions = useMemo(() => {
    if (selectedCourse) {
      return [
        ...new Set(
          trainers
            .filter((t) => normalize(t.course_name) === normalize(selectedCourse))
            .map((t) => t.trainer_name?.trim())
            .filter(Boolean)
        ),
      ];
    }
    return teacherOptions.map((t) => (typeof t === "string" ? t : t.trainer_name));
  }, [selectedCourse, trainers, teacherOptions]);

  const toggleShowAll = (trainerId) => {
    setShowAllSummaries((prev) => ({ ...prev, [trainerId]: !prev[trainerId] }));
  };

  useEffect(() => {
    const updateCardsPerPage = () => {
      const width = window.innerWidth;
      if (width <= 768) setCardsPerPage(4);
      else if (width <= 1024) setCardsPerPage(12);
      else setCardsPerPage(4);
    };
    updateCardsPerPage();
    window.addEventListener("resize", updateCardsPerPage);
    return () => window.removeEventListener("resize", updateCardsPerPage);
  }, []);

  useEffect(() => {
    if (!filteredTrainers.length) return;
    const fetchCounts = async () => {
      const counts = {};
      await Promise.all(
        filteredTrainers.map(async (trainer) => {
          if (!isCourseOpen(trainer.course_name)) return;
          try {
            const res = await axios.get(`https://api.hachion.co/enroll/count`, {
              params: {
                trainerName: trainer.trainer_name,
                courseName: trainer.course_name.replace(/\s+/g, "+"),
              },
            });
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

  if (isError) return <div>{error?.message || "Something went wrong"}</div>;

  const groupedTrainers = Object.values(
    filteredTrainers.reduce((acc, trainer) => {
      const name = trainer.trainer_name?.trim().toLowerCase();
      if (!acc[name]) {
        acc[name] = { ...trainer, summary: trainer.summary, courses: [trainer.course_name] };
      } else if (!acc[name].courses.includes(trainer.course_name)) {
        acc[name].courses.push(trainer.course_name);
      }
      return acc;
    }, {})
  );

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = groupedTrainers.slice(indexOfFirstCard, indexOfLastCard);
  const totalCards = groupedTrainers.length;

  return (
    <div className="course-top">
      <div className="instructor-profile-banner">
        <h1 className="instructor-profile-title">Instructor Profiles</h1>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="instructor-breadcrumb-item">
              <Link href="/">Home</Link> <TbSlashes color="#00aeef" />
            </li>
            <li className="instructor-breadcrumb-item active" aria-current="page">
              Instructor Profiles
            </li>
          </ol>
        </nav>
      </div>

      <div className="container">
        <p ref={titleRef} className="expert-title">
          Instructors ({filteredTrainers.length})
        </p>

        <div className="instructors-filter">
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

          <div className="expert-filter-item">
            <label htmlFor="course">Courses:</label>
            <select id="course" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
              <option value="">All Courses</option>
              {courses.map((course, idx) => (
                <option key={idx} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <div className="expert-filter-item">
            <label htmlFor="teacher">Teacher:</label>
            <select id="teacher" value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}>
              <option value="">All Teachers</option>
              {teacherDropdownOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

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

        <div className="recent-entries-container">
          <div className="profiles-grid">
            {isLoading ? (
              // Renders the page shell (banner/breadcrumb/filters above)
              // immediately instead of swapping the whole page for a bare
              // spinner, then reserves roughly the grid's real footprint so
              // the swap to actual cards doesn't reflow content that was
              // already visible — this was the dominant CLS source on this
              // page (measured ~2000px of page-height growth in one step).
              Array.from({ length: cardsPerPage }).map((_, i) => (
                <div key={i} className="instructor-card skeleton-card" aria-hidden="true" />
              ))
            ) : currentCards.length > 0 ? (
              currentCards.map((trainer) => {
                const courseCount = trainer.courses
                  ? trainer.courses.length
                  : getTrainerCourseCount(trainers, trainer.trainer_name);
                const enrollKey = makeEnrollKey(trainer.trainer_name, trainer.course_name);
                const studentCount = enrollCounts[enrollKey] ?? 0;
                const trainerKey = trainer.id || `${trainer.trainer_name}-${trainer.course_name}`;
                const isSummaryExpanded = showAllSummaries[trainerKey];
                return (
                  <div className="instructor-card" key={trainerKey}>
                    <div className="card-course-details">
                      <div className="instructor-image">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          alt={trainer.trainer_name}
                          src={trainer.trainerImage ? `https://api.hachion.co/${trainer.trainerImage}` : "/defaulttrainer.jpg"}
                          className="instructor-image-single"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/defaulttrainer.jpg";
                          }}
                        />
                      </div>

                      <div className="instrctor-content">
                        <p className="expert-name">{trainer.trainer_name}</p>
                        <p
                          className="expert-course"
                          style={{ whiteSpace: "normal", overflow: "visible", textOverflow: "unset", display: "block" }}
                        >
                          {trainer.courses ? trainer.courses.join(", ") : trainer.course_name}
                        </p>

                        <div className="expert-about">
                          <p className="expert-me">About Me</p>
                          <div
                            className={`expert-detail ${isSummaryExpanded ? "expanded" : "collapsed"}`}
                            dangerouslySetInnerHTML={{
                              __html: decodeHtml(trainer.summary || "No summary available"),
                            }}
                          />
                          {trainer.summary && (
                            <button className="read-more-btn" onClick={() => toggleShowAll(trainerKey)}>
                              {isSummaryExpanded ? "Read Less ↑" : "Read More ↓"}
                            </button>
                          )}
                        </div>

                        <hr className="faq-seperater" />

                        <div className="card-row">
                          <div className="instructor-rating">{renderStarRating(trainer.trainerUserRating || 5)}</div>

                          {isCourseOpen(trainer.course_name) && (
                            <p className="student-count">
                              <FiUsers className="student-count-icon" />
                              <span className="student-count-number">{studentCount}</span>
                              <span className="student-count-text">Students</span>
                            </p>
                          )}

                          <div className="course-count">
                            <HiPlayCircle className="course-count-icon" />
                            <span className="course-count-number">{courseCount}</span>
                            <span className="course-count-text">Courses</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="no-results-message">No instructors found.</p>
            )}
          </div>

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
