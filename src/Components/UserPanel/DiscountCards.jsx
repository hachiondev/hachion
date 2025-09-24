// import React, { useState, useEffect } from "react";
// import "./Corporate.css";
// import DiscountCourseCard from './DiscountCourseCard';
// import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
// import "bootstrap/dist/css/bootstrap.min.css";
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const DiscountCards = () => {
//   const navigate = useNavigate();
//   const [trendingCourses, setTrendingCourses] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTrendingCourses = async () => {
//       setLoading(true);
//       try {
//         const trendingResponse = await axios.get('https://api.test.hachion.co/trendingcourse');
//         const trendingData = trendingResponse.data || [];

//         const activeTrendingCourses = trendingData.filter(course => course.status);

//         const allCoursesResponse = await axios.get('https://api.test.hachion.co/courses/all');
//         const allCourses = allCoursesResponse.data || [];

//         const trainersResponse = await axios.get('https://api.test.hachion.co/trainers');
//         const allTrainers = trainersResponse.data || [];

//         const detailedTrendingCourses = activeTrendingCourses.map(trendingCourse => {
//           const courseDetails = allCourses.find(course => course.courseName === trendingCourse.course_name);
//           const matchedTrainer = allTrainers.find(
//             (t) => t.course_name.trim().toLowerCase() === trendingCourse.course_name.trim().toLowerCase()
//           );

//           return {
//             ...trendingCourse,
//             ...courseDetails,
//             trainerName: matchedTrainer ? matchedTrainer.trainer_name : "No Trainer",
//           };
//         });

//         setTrendingCourses(detailedTrendingCourses);
//       } catch (error) {
//         console.error('Error fetching trending courses:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTrendingCourses();
//   }, []);

//   const handleCardClick = (course) => {
//     if (!course?.courseName) return;
//     const courseSlug = course.courseName.toLowerCase().replace(/\s+/g, '-');
//     navigate(`/coursedetails/${courseSlug}`);
//   };

//   const totalSlides = Math.ceil(trendingCourses.length / 2);

//   const goToNext = () => {
//     setActiveIndex((prev) => (prev + 1) % totalSlides);
//   };

//   const goToPrev = () => {
//     setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
//   };

//   const getCurrentCourses = () => {
//     const start = activeIndex * 2;
//     return trendingCourses.slice(start, start + 2);
//   };

//   return (
//     <div className="container position-relative">
//       {/* Left Arrow */}
//       <FaAngleLeft className="custom-arrow left-arrow" onClick={goToPrev} />

//       <div className="training-card-holder">
    //     {loading ? (
    //       Array.from({ length: 2 }).map((_, index) => (
    //         <div className="skeleton-card" key={index}></div>
    //       ))
    //     ) : getCurrentCourses().length > 0 ? (
    //       getCurrentCourses().map((course, index) => (
    //         <DiscountCourseCard
    //           key={index}
    //           heading={course.courseName}
    //           month={course.numberOfClasses}
    //           image={`https://api.test.hachion.co/${course.courseImage}`}
    //           course_id={course.id}
    //           discountPercentage={course.discount}
    //           trainer_name={course.trainerName}
    //           level={course.levels}
    //           onClick={() => handleCardClick(course)}
    //           className="course-card"
    //         />
    //       ))
    //     ) : (
    //       <p>No courses available.</p>
    //     )}
    //   </div>

//       {/* Right Arrow */}
//       <FaAngleRight className="custom-arrow right-arrow" onClick={goToNext} />

//       {/* Bottom Indicators */}
//       <div className="indicators">
//         {Array.from({ length: totalSlides }).map((_, i) => (
//           <span
//             key={i}
//             className={`dot ${i === activeIndex ? "active" : ""}`}
//             onClick={() => setActiveIndex(i)}
//           ></span>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DiscountCards;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./Blogs.css";
// import { useNavigate } from "react-router-dom";
// import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
// import { Carousel } from "react-bootstrap";
// import DiscountCourseCard from "./DiscountCourseCard";

// const DiscountCards = () => {
//   const navigate = useNavigate();
//   const [trendingCourses, setTrendingCourses] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTrendingCourses = async () => {
//       setLoading(true);
//       try {
//         const trendingResponse = await axios.get("https://api.test.hachion.co/trendingcourse");
//         const trendingData = trendingResponse.data || [];

//         const activeTrendingCourses = trendingData.filter((course) => course.status);

//         const allCoursesResponse = await axios.get("https://api.test.hachion.co/courses/all");
//         const allCourses = allCoursesResponse.data || [];

//         const trainersResponse = await axios.get("https://api.test.hachion.co/trainers");
//         const allTrainers = trainersResponse.data || [];

//         const detailedTrendingCourses = activeTrendingCourses.map((trendingCourse) => {
//           const courseDetails = allCourses.find(
//             (course) => course.courseName === trendingCourse.course_name
//           );
//           const matchedTrainer = allTrainers.find(
//             (t) =>
//               t.course_name.trim().toLowerCase() ===
//               trendingCourse.course_name.trim().toLowerCase()
//           );

//           return {
//             ...trendingCourse,
//             ...courseDetails,
//             trainerName: matchedTrainer ? matchedTrainer.trainer_name : "No Trainer",
//           };
//         });

//         setTrendingCourses(detailedTrendingCourses);
//       } catch (error) {
//         console.error("Error fetching trending courses:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTrendingCourses();
//   }, []);

//   const handleCardClick = (course) => {
//     if (!course?.courseName) return;
//     const courseSlug = course.courseName.toLowerCase().replace(/\s+/g, "-");
//     navigate(`/coursedetails/${courseSlug}`);
//   };

//   // Group courses in chunks of 2
//   const groupedCourses = [];
//   for (let i = 0; i < trendingCourses.length; i += 2) {
//     groupedCourses.push(trendingCourses.slice(i, i + 2));
//   }

//   const goToPrev = () => {
//     setActiveIndex((prevIndex) =>
//       prevIndex === 0 ? groupedCourses.length - 1 : prevIndex - 1
//     );
//   };

//   const goToNext = () => {
//     setActiveIndex((prevIndex) => (prevIndex + 1) % groupedCourses.length);
//   };

//   return (
//     <div className="recent-entries-container">
//       <Carousel
//         activeIndex={activeIndex}
//         onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
//         indicators={false}
//         controls={false}
//         interval={null}
//       >
//         {groupedCourses.map((group, index) => (
//           <Carousel.Item key={index}>
//             <div className="limited-card-holder">
//               {loading
//                 ? Array.from({ length: 2 }).map((_, idx) => (
//                     <div className="skeleton-card" key={idx}></div>
//                   ))
//                 : group.map((course, idx) => (
//                     <DiscountCourseCard
//                       key={idx}
//                       heading={course.courseName}
//                       month={course.numberOfClasses}
//                       image={`https://api.test.hachion.co/${course.courseImage}`}
//                       course_id={course.id}
//                       discountPercentage={course.discount}
//                       amount={course.itotal}
//                       totalAmount={course.iamount}
//                       trainer_name={course.trainerName}
//                       level={course.levels}
//                       onClick={() => handleCardClick(course)}
//                       className="course-card"
//                     />
//                   ))}
//             </div>
//           </Carousel.Item>
//         ))}
//       </Carousel>

//       {/* Buttons & Indicators */}
//       <div className="carousel-controls">
//         <button className="arrow custom-prev" onClick={goToPrev}>
//           <IoIosArrowBack />
//         </button>

//         <div className="indicator-wrapper">
//           <ul className="carousel-indicators-line">
//             {groupedCourses.map((_, index) => (
//               <li
//                 key={index}
//                 onClick={() => setActiveIndex(index)}
//                 className={index === activeIndex ? "active" : ""}
//               />
//             ))}
//           </ul>
//         </div>

//         <button className="arrow custom-next" onClick={goToNext}>
//           <IoIosArrowForward />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DiscountCards;

import React, { useState, useEffect } from "react";
import "./Corporate.css";
import "./Blogs.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import DiscountCourseCard from "./DiscountCourseCard";
import "bootstrap/dist/css/bootstrap.min.css";

const DiscountCards = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerRow, setCardsPerRow] = useState(2);
  const [trendingCourses, setTrendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch trending courses
  useEffect(() => {
    const fetchTrendingCourses = async () => {
      setLoading(true);
      try {
        const trendingResponse = await axios.get(
          "https://api.test.hachion.co/trendingcourse"
        );
        const trendingData = trendingResponse.data || [];
        const activeTrendingCourses = trendingData.filter((course) => course.status);

        const allCoursesResponse = await axios.get("https://api.test.hachion.co/courses/all");
        const allCourses = allCoursesResponse.data || [];

        const trainersResponse = await axios.get("https://api.test.hachion.co/trainers");
        const allTrainers = trainersResponse.data || [];

        const detailedTrendingCourses = activeTrendingCourses.map((trendingCourse) => {
          const courseDetails = allCourses.find(
            (course) => course.courseName === trendingCourse.course_name
          );
          const matchedTrainer = allTrainers.find(
            (t) =>
              t.course_name.trim().toLowerCase() ===
              trendingCourse.course_name.trim().toLowerCase()
          );

          return {
            ...trendingCourse,
            ...courseDetails,
            trainerName: matchedTrainer ? matchedTrainer.trainer_name : "No Trainer",
          };
        });

        setTrendingCourses(detailedTrendingCourses);
      } catch (error) {
        console.error("Error fetching trending courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingCourses();
  }, []);

  // Handle responsive cards per row
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) setCardsPerRow(1);
      else if (window.innerWidth < 992) setCardsPerRow(2);
      else setCardsPerRow(2);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(trendingCourses.length / cardsPerRow);

  const goToNext = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const goToPrev = () =>
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));

  const startIndex = currentPage * cardsPerRow;
  const currentCourses = trendingCourses.slice(startIndex, startIndex + cardsPerRow);

  const handleCardClick = (course) => {
    if (!course?.courseName) return;
    const courseSlug = course.courseName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/coursedetails/${courseSlug}`);
  };

  return (
    <div className="position-relative">
      {/* Left Arrow */}
      <FaAngleLeft className="custom-cards-arrow left-cards-arrow" onClick={goToPrev} />
      {/* Right Arrow */}
      <FaAngleRight className="custom-cards-arrow right-cards-arrow" onClick={goToNext} />

      <div className="d-flex justify-content-center gap-3 flex-wrap">
        {loading
          ? Array.from({ length: cardsPerRow }).map((_, idx) => (
              <div className="skeleton-card" key={idx}></div>
            ))
          : currentCourses.map((course, idx) => (
              <DiscountCourseCard
                key={idx}
                heading={course.courseName}
                month={course.numberOfClasses}
                image={`https://api.test.hachion.co/${course.courseImage}`}
                course_id={course.id}
                discountPercentage={course.discount}
                amount={course.itotal}
                totalAmount={course.iamount}
                trainer_name={course.trainerName}
                level={course.levels}
                onClick={() => handleCardClick(course)}
                className="course-card"
              />
            ))}
      </div>
    </div>
  );
};

export default DiscountCards;
