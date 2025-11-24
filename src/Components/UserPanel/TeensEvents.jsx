import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchSummerEvents } from "../../redux/slices/teensSlice";
import { fetchDiscountRules } from "../../redux/slices/discountSlice";
import { fetchGeoAndRates } from "../../redux/slices/currencySlice";
import { fetchTrainers } from "../../redux/slices/trainerSlice";

import CourseCard from "./CourseCard";
import CardsPagination from "./CardsPagination";

const TeensEvents = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔹 Redux State Selectors
  const { summerEvents = [], categories = [], loading = false } = useSelector(
    (state) => state.teens || {}
  );
  const { trainers = [] } = useSelector((state) => state.trainers || {});
  const { rules: discountRules = [] } = useSelector(
    (state) => state.discounts || {}
  );
  const { country = "US", currency = "USD", fxFromUSD = 1 } = useSelector(
    (state) => state.currency || {}
  );

  // 🔹 Local UI State
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(4);

  // ✅ Helper for formatting numbers
  const fmt = (n) =>
    (Math.round((Number(n) || 0) * 100) / 100).toLocaleString();

  // ✅ Data fetching (guarded)
  useEffect(() => {
    if (!summerEvents.length) dispatch(fetchSummerEvents());
    if (!discountRules.length) dispatch(fetchDiscountRules());
    if (!country) dispatch(fetchGeoAndRates());
    if (!trainers.length) dispatch(fetchTrainers());
  }, []);

  // ✅ Responsive Pagination
  useEffect(() => {
    const updateCardsPerPage = () => {
      const width = window.innerWidth;
      if (width <= 768) setCardsPerPage(2);
      else if (width <= 1024) setCardsPerPage(3);
      else setCardsPerPage(4);
    };

    updateCardsPerPage();
    window.addEventListener("resize", updateCardsPerPage);
    return () => window.removeEventListener("resize", updateCardsPerPage);
  }, []);

  // ✅ Filtering + Pagination logic
  const filteredCourses =
    activeCategory === "All"
      ? summerEvents
      : summerEvents.filter(
          (course) => course.category_name === activeCategory
        );

  const handlePageChange = (page) => {
    const maxPage = Math.ceil(filteredCourses.length / cardsPerPage);
    setCurrentPage(Math.min(Math.max(page, 1), maxPage));
  };

  // ✅ Handle card click navigation
  const handleCardClick = (course) => {
    if (!course?.courseName) return;
    const slug = course.courseName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/coursedetails/${slug}`);
  };

  // ✅ Dynamic discount logic
  const getDiscountPercentage = (course) => {
    const rule = discountRules.find(
      (r) =>
        r.status?.toLowerCase() === "active" &&
        (r.courseNames.includes(course.courseName) ||
          r.courseNames.includes("all")) &&
        (r.countryNames.includes(country) ||
          r.countryNames.includes("all"))
    );

    if (rule) return Number(rule.discountPercentage || 0);

    return country === "IN"
      ? Number(course.idiscount) || 0
      : Number(course.discount) || 0;
  };

  return (
    <div className="training-events container">
      {/* ======= Header Section ======= */}
      <div className="home-spacing">
        <div className="training-title-head">
          <h2 className="association-head">
            Online IT Training Courses For Teens
          </h2>
          <div className="card-pagination-container">
            <CardsPagination
              currentPage={currentPage}
              totalCards={filteredCourses.length}
              cardsPerPage={cardsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        <p className="association-head-tag">
          Kickstart your tech journey with expert‑led online IT Certification
          courses for teens and beginners.
        </p>
      </div>

      {/* ======= Course Cards Section ======= */}
      <div className="training-card-holder">
        {loading ? (
          // Loading Skeletons
          Array.from({ length: cardsPerPage }).map((_, idx) => (
            <div className="skeleton-card" key={idx}></div>
          ))
        ) : filteredCourses.length > 0 ? (
           filteredCourses.slice(currentPage - 1, currentPage - 1 + cardsPerPage)
            .map((course, idx) => {
              const trainer = trainers.find(
                (t) =>
                  t.course_name?.trim().toLowerCase() ===
                  course.courseName?.trim().toLowerCase()
              );

              const isIN = country === "IN";
              const mrp = isIN ? course.iamount : course.amount;
              const now = isIN ? course.itotal : course.total;
              const mrpVal = isIN
                ? Number(mrp)
                : Number(mrp) * (fxFromUSD || 1);
              const nowVal = isIN
                ? Number(now)
                : Number(now) * (fxFromUSD || 1);

              return (
                <CourseCard
                  key={idx}
                  heading={course.courseName}
                  month={course.numberOfClasses}
                  image={`https://api.test.hachion.co/${course.courseImage}`}
                  course_id={course.id}
                  trainer_name={trainer?.trainer_name || "Not Assigned"}
                  level={course.level}
                  discountPercentage={getDiscountPercentage(course)}
                  amount={`${currency} ${fmt(nowVal)}`}
                  totalAmount={`${fmt(mrpVal)}`}
                  onClick={() => handleCardClick(course)}
                />
              );
            })
        ) : (
          <p>No courses available.</p>
        )}
      </div>
    </div>
  );
};

export default TeensEvents;