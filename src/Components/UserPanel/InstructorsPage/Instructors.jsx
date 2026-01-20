import React, { useState, useEffect, useRef, useMemo } from "react";
import "../Style.css";
import "../Home.css";
import { TbSlashes } from "react-icons/tb";
import Avatar from "@mui/material/Avatar";
import { MdOutlineStar } from "react-icons/md";
import Pagination from "../Common/Pagination";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAllCourses } from "../../../Api/hooks/SitemapPageApi/useAllCourses";
import { useTrainers } from "../../../Api/hooks/HomePageApi/TrainingApi/useTrainers";
import Loader from "../Common/Loader/Loader";
import { useTrainerOptions } from "../../../Api/hooks/InstructorSection/useTrainerOptions";
import { useEnrollCounts } from "../../../Api/hooks/InstructorSection/useEnrollCounts";
import styles from './Instructors.module.css';
import CardsPagination from "../Common/CardsPagination";

const Instructors = () => {
  const titleRef = useRef(null);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const { data: courseAll } = useAllCourses();
  const { data: trainers = [], isLoading, isError, error } = useTrainers();
  const { data: teacherOptions = [] } = useTrainerOptions();

  const countKey = (t) => `${t.trainer_name || ''}::${t.course_name || ''}`;

  /* -----------------------------
     Courses list
  ----------------------------- */
  useEffect(() => {
    if (Array.isArray(courseAll)) {
      setCourses(courseAll.map((c) => c.courseName));
    }
  }, [courseAll]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  /* -----------------------------
     Filters - With proper null checks
  ----------------------------- */
  const filteredTrainers = useMemo(() => {
    if (!Array.isArray(trainers)) return [];

    return trainers.filter((trainer) => {
      if (!trainer) return false;

      const term = searchTerm.toLowerCase().trim();
      const trainerName = trainer.trainer_name || "";
      const courseName = trainer.course_name || "";

      const matchesSearch =
        term === "" ||
        trainerName.toLowerCase().includes(term) ||
        courseName.toLowerCase().includes(term);

      const matchesTeacher = selectedTeacher
        ? trainerName === selectedTeacher
        : true;

      const matchesCourse = selectedCourse
        ? courseName === selectedCourse
        : true;

      return matchesSearch && matchesCourse && matchesTeacher;
    });
  }, [trainers, searchTerm, selectedTeacher, selectedCourse]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCourse, selectedTeacher]);

  const enrollCounts = useEnrollCounts({
    trainers: filteredTrainers,
    countKey,
  });

  /* -----------------------------
     Helpers
  ----------------------------- */
  const formatForUrl = (str) =>
    str ? str.toLowerCase().replace(/\s+/g, "-") : "";

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // if (titleRef.current) {
    //   const offsetTop = titleRef.current.offsetTop - 20;
    //   window.scrollTo({ top: offsetTop, behavior: "smooth" });
    // }
  };

  const renderStarRating = (rating) => (
    <div className="rating-display">
      <MdOutlineStar className="star-icon" />
      <span className="rating-number">{rating || 0}</span>
    </div>
  );

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCourse("");
    setSelectedTeacher("");
    setCurrentPage(1);
  };

  if (isLoading) return <Loader />;
  if (isError) return <div>{error?.message || "Something went wrong"}</div>;

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredTrainers.slice(indexOfFirstCard, indexOfLastCard);
  const totalCards = filteredTrainers.length;

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
        {/* <p ref={titleRef} className="expert-title">
          {totalCards > 0 
            ? `Showing Instructor ${currentPage} of ${totalCards}`
            : 'No Instructors Found'
          }
        </p> */}

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
                placeholder="Search by instructor name or course..."
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
              {Array.isArray(courses) && courses.map((course, idx) => (
                <option key={idx} value={course}>{course}</option>
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
              {Array.isArray(teacherOptions) && teacherOptions.map((trainer, idx) => (
                <option
                  key={trainer.trainer_id || trainer.id || `teacher-${idx}`}
                  value={trainer.trainer_name || ""}
                >
                  {trainer.trainer_name || "Unknown"}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <div className="expert-filter-item">
            <button
              className="btn btn-secondary"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Instructor Section with Single Card View */}
        <section className={styles.iswrap}>
          <div className="container">
            <div className={styles.ishead}>
              <h2>Meet Your Instructor</h2>
              <p>Learn from industry veterans with years of real-world experience</p>
            </div>

            {currentCards.length > 0 ? (
              <div className={styles.iscardsContainer}>
                {/* Pagination */}
                <div className={styles.paginationBottom}>
                  <p ref={titleRef}
                  // className="expert-title"
                  >
                    {totalCards > 0
                      ? `Showing Instructor ${currentPage} of ${totalCards}`
                      : 'No Instructors Found'
                    }
                  </p>
                  <CardsPagination
                    currentPage={currentPage}
                    totalCards={totalCards}
                    cardsPerPage={cardsPerPage}
                    onPageChange={handlePageChange}
                  />
                </div>
                {/* Single Card View */}
                <div className={styles.singleCardView}>
                  {currentCards.map((trainer) => {
                    const trainerName = trainer.trainer_name || "Instructor";
                    const courseName = trainer.course_name || "Course";
                    const trainerImage = trainer.trainerImage;
                    const trainerBio = trainer.trainer_bio || "Experienced instructor with industry expertise.";
                    const trainerRating = trainer.trainerUserRating || 5;
                    const otherCourses = Array.isArray(trainer.other_courses) ? trainer.other_courses : [];
                    const key = `${trainerName}::${courseName}`;
                    const studentCount = enrollCounts[key] ?? 0;

                    return (
                      <div className={styles.iscard} key={trainer.id || `trainer-${currentPage}`}>
                        {/* Photo */}
                        <div className={styles.isphoto}>
  <img
    src="/instructordefault.png"
    alt={`${trainerName} headshot`}
    onError={(e) => {
                e.currentTarget.src = "/InstructorDefaultImage.webp";
              }}
  />
</div>

                        {/* Content */}
                        <div className={styles.iscontent}>
                          <div className={styles.istopline}>
                            <span className={styles.isbadge}>⭐ Top Instructor</span>
                            <h3 className={styles.isname}>{trainerName}</h3>
                          </div>

                          <div className={styles.istitle}>{courseName}</div>

                          <div className={styles.isstats}>
                            <div className={styles.isstat}>
                              <div className={styles.isstatval}>
                                <span className={styles.isstatico}>
                                  <img src="/users.png" alt="Students" />
                                </span>
                                {studentCount} Students
                              </div>
                              <div className={styles.isstatlab}>Students Taught</div>
                            </div>

                            <div className={styles.isstat}>
                              <div className={styles.isstatval}>
                                <span className={styles.isstatico}>
                                  <img src="/users.png" alt="Rating" />
                                </span>
                                {trainerRating}
                                <span style={{ color: "#f5a623", fontSize: "18px", marginLeft: "4px" }}>
                                  ★
                                </span>
                              </div>
                              <div className={styles.isstatlab}>Instructor Rating</div>
                            </div>
                          </div>

                          <p className={styles.isbio}>{trainerBio}</p>

                          {(courseName || otherCourses.length > 0) && (
                            <>
                              <div className={styles.issubhead}>Courses:</div>
                              <ul className={styles.islist}>
                                {courseName && <li>{courseName}</li>}
                                {otherCourses.map((course, index) => (
                                  <li key={`course-${index}`}>{course}</li>
                                ))}
                              </ul>
                            </>
                          )}

                          {/* <div className={styles.isactions}>
                            <button
                              className={`${styles.isbtn} ${styles.isbtnprimary}`}
                              onClick={() =>
                                navigate(
                                  `/${formatForUrl(courseName)}-${formatForUrl(trainerName)}-instructor-details`,
                                  {
                                    state: {
                                      trainer,
                                      enrollCount: studentCount,
                                    },
                                  }
                                )
                              }
                            >
                              View Full Profile
                            </button>
                          </div> */}
                        </div>
                      </div>
                    );
                  })}
                </div>


              </div>
            ) : (
              <div className={styles.noInstructors}>
                <p>No instructors found matching your filters.</p>
                <button
                  className={`${styles.isbtn} ${styles.isbtnprimary}`}
                  onClick={handleResetFilters}
                  style={{ marginTop: '20px' }}
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Instructors;