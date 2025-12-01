import React, { useState, useEffect, useRef } from "react";
import "./Style.css";
import "./Home.css";
import { TbSlashes } from "react-icons/tb";
import Avatar from "@mui/material/Avatar";
import { MdOutlineStar } from "react-icons/md";
import axios from "axios";
import Pagination from './Pagination';
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Instructors = () => {
  const titleRef = useRef(null);
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(16);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
const [teacherOptions, setTeacherOptions] = useState([]);
  
const [enrollCounts, setEnrollCounts] = useState({}); 
const countKey = (t) => `${t.trainer_name}::${t.course_name}`;


  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true);
        const trainerRes = await axios.get("https://api.test.hachion.co/trainers");
        setTrainers(trainerRes.data);
      } catch (err) {
        console.error("Error fetching trainers:", err);
        setError("Failed to fetch trainers");
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
  }, []);

  useEffect(() => {
  const fetchTeacherOptions = async () => {
    try {
      const res = await axios.get("https://api.test.hachion.co/trainersnames-unique");
      if (Array.isArray(res.data)) {
        setTeacherOptions(res.data);
      }
    } catch (err) {
      console.error("Error fetching unique trainers:", err);
    }
  };
  fetchTeacherOptions();
}, []);

  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("https://api.test.hachion.co/courses/all");
        if (Array.isArray(res.data)) {
          setCourses(res.data.map(c => c.courseName));
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);
  
const filteredTrainers = trainers.filter((trainer) => {
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

  useEffect(() => {
    const updateCardsPerPage = () => {
      const width = window.innerWidth;
      if (width <= 768) setCardsPerPage(4);
      else if (width <= 1024) setCardsPerPage(12);
      else setCardsPerPage(16);
    };
    updateCardsPerPage();
    window.addEventListener("resize", updateCardsPerPage);
    return () => window.removeEventListener("resize", updateCardsPerPage);
  }, []);


  useEffect(() => {
  if (!filteredTrainers.length) return;

  
  const toFetch = filteredTrainers.filter(t => enrollCounts[countKey(t)] == null);

  if (!toFetch.length) return;

  const requests = toFetch.map(t =>
    axios.get("https://api.test.hachion.co/enroll/count", {
      params: {
        trainerName: t.trainer_name,
        courseName: t.course_name, 
      },
    }).then(res => ({ key: countKey(t), count: res.data?.count ?? 0 }))
      .catch(() => ({ key: countKey(t), count: 0 }))
  );

  Promise.all(requests).then(rows => {
    setEnrollCounts(prev => {
      const next = { ...prev };
      rows.forEach(r => { next[r.key] = r.count; });
      return next;
    });
  });
}, [filteredTrainers]); 
const formatForUrl = (str) => 
  str.toLowerCase().replace(/\s+/g, "-"); 

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredTrainers.slice(indexOfFirstCard, indexOfLastCard);
  const totalCards = filteredTrainers.length;

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
                     <Avatar
  alt={trainer.trainer_name}
  src={
    trainer.trainerImage
      ? `https://api.test.hachion.co/${trainer.trainerImage}`
      : ""
  }
  variant="square"
/>

                    </div>
                    <p className="expert-name">{trainer.trainer_name}</p>
                    <p className="expert-course">{trainer.course_name}</p>
                    <hr className="faq-seperater"/>
                    <div className="card-row">
  <div className="instructor-rating">
    {renderStarRating(trainer.trainerUserRating || 5)}
  </div>

  {(enrollCounts[`${trainer.trainer_name}::${trainer.course_name}`] ?? 0) > 0 && (
    <p className="instructor-rating">
      {enrollCounts[`${trainer.trainer_name}::${trainer.course_name}`]} Students
    </p>
  )}
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
      </div>
    </div>
  );
};

export default Instructors;
