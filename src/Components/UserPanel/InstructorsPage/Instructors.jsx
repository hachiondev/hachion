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
import { useAllCourses } from "../../../Api/hooks/SitemapPageApi/useAllCourses";
import { useTrainers } from "../../../Api/hooks/HomePageApi/TrainingApi/useTrainers";
import Loader from "../Common/Loader/Loader";
import { useTrainerOptions } from "../../../Api/hooks/InstructorSection/useTrainerOptions";
import { useQueries } from "@tanstack/react-query";
import { useEnrollCounts } from "../../../Api/hooks/InstructorSection/useEnrollCounts";
import TrainingEvents from '../HomePage/TrainingSection/TrainingEvents'
import Learners from "../HomePage/LearnerSection/Learners";

const Instructors = () => {
  const titleRef = useRef(null);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(16);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const { data: courseAll } = useAllCourses();
  const { data: trainers = [], isLoading, isError, error } = useTrainers();
  const { data: teacherOptions = [] } = useTrainerOptions();


  // const [enrollCounts, setEnrollCounts] = useState({});
  const countKey = (t) => `${t.trainer_name}::${t.course_name}`;

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
     Filters
  ----------------------------- */

  const filteredTrainers = useMemo(() => {


    return trainers.filter((trainer) => {


      const term = searchTerm.toLowerCase().trim();



      const matchesSearch =
        term === "" ||
        trainer.trainer_name?.toLowerCase().includes(term) ||
        trainer.course_name?.toLowerCase().includes(term);

      const matchesTeacher = selectedTeacher
        ? trainer.trainer_name === selectedTeacher
        : true;

      const matchesCourse = selectedCourse
        ? trainer.course_name === selectedCourse
        : true;

      return matchesSearch && matchesCourse && matchesTeacher;
    });
  }, [trainers, searchTerm, selectedTeacher, selectedCourse]);


  /* -----------------------------
     Responsive pagination size
  ----------------------------- */
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


  const enrollCounts = useEnrollCounts({
    trainers: filteredTrainers,
    countKey,
  });


  // // Replace your current useEffect with this optimized version
  // useEffect(() => {
  //   if (!Array.isArray(enrollQueries) || enrollQueries.length === 0) return;

  //   // Only update if there are actual changes
  //   const updates = {};
  //   let hasUpdates = false;

  //   enrollQueries.forEach((q) => {
  //     if (!q?.data || !Array.isArray(q.queryKey)) return;

  //     const [, trainerName, courseName] = q.queryKey;
  //     if (!trainerName || !courseName) return;

  //     const key = `${trainerName}::${courseName}`;

  //     // Only update if the value is different from current
  //     if (enrollCounts[key] !== q.data) {
  //       updates[key] = q.data;
  //       hasUpdates = true;
  //     }
  //   });

  //   if (hasUpdates) {
  //     setEnrollCounts(prev => ({
  //       ...prev,
  //       ...updates
  //     }));
  //   }
  // }, [enrollQueries]); // Only depend on enrollQueries


  /* -----------------------------
     Helpers
  ----------------------------- */
  const formatForUrl = (str) =>
    str.toLowerCase().replace(/\s+/g, "-");

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

  if (isLoading) return <Loader />;
  if (isError) return <div>{error?.message || "Something went wrong"}</div>;

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredTrainers.slice(
    indexOfFirstCard,
    indexOfLastCard
  );
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
        <p ref={titleRef} className="expert-title">
          Instructors ({filteredTrainers.length})</p>
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
              {teacherOptions.map((trainer) => (
                <option
                  key={trainer.trainer_id || trainer.id || trainer.trainer_name}
                  value={trainer.trainer_name}
                >
                  {trainer.trainer_name}
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
              currentCards.map((trainer) => (
                <div className="instructor-card" key={trainer.id}>
                  <div className="card-course-details">
                    <div className="instructor-image">
                      <img
                        alt={trainer.trainer_name}
                        src={
                          trainer.trainerImage
                            ? `https://api.test.hachion.co/${trainer.trainerImage}`
                            : "instructordefault.png"
                        }
                        className="instructor-image-single"
                      />

                    </div>
                    <div className="instrctor-content">
                      <p className="expert-name">{trainer.trainer_name}</p>
                      <p className="expert-course">{trainer.course_name}</p>
                     <div className="expert-about">
  <p className="expert-me">About Me</p>

  <div
    className="expert-detail"
    dangerouslySetInnerHTML={{ __html: trainer.summary }}
  />
</div>

                      <hr className="faq-seperater" />
                      <div className="card-row">
                        <div className="instructor-rating">
                          {renderStarRating(trainer.trainerUserRating || 5)}
                        </div>


                        {/* {(enrollCounts[`${trainer.trainer_name}::${trainer.course_name}`] ?? 0) > 0 && ( */}
                        <p className="student-count">
                          {enrollCounts[`${trainer.trainer_name}::${trainer.course_name}`]}
                          <FiUsers className="student-count-icon" />
                          <span className="student-count-number">236,568</span>
                          <span className="student-count-text">Students</span>
                        </p>
                        {/* )} */}

                        <div className="course-count">
                          <HiPlayCircle className="course-count-icon" />
                          <span className="course-count-number">8</span>
                          <span className="course-count-text">Courses</span>
                        </div>
                      </div>
                      <button
                        className="view-profile-btn"
                        onClick={() =>
                          navigate(`/${formatForUrl(trainer.course_name)}-${trainer.trainer_name}-instructor-details`, { state: { trainer, enrollCount: (enrollCounts[`${trainer.trainer_name}::${trainer.course_name}`] ?? 0), } })
                        }
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No instructors found.</p>
            )}
          </div>

          {/* Pagination */}
          <div className="pagination-container">
            <Pagination
              currentPage={currentPage}
              totalCards={totalCards}
              cardsPerPage={cardsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
        <TrainingEvents/>
        <Learners/>
      </div>
    </div>
  );
};

export default Instructors;