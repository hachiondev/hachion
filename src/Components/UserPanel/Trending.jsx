import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchTrending } from "../../redux/slices/trendingSlice";
import { fetchDiscountRules } from "../../redux/slices/discountSlice";
import { fetchTrainers } from "../../redux/slices/trainerSlice";
import { fetchGeoAndRates } from "../../redux/slices/currencySlice";

import CardsPagination from "./CardsPagination";
import CourseCard from "./CourseCard";
import "./Home.css";

const fmt = (n) => (Math.round((Number(n) || 0) * 100) / 100).toLocaleString();

const Trending = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { trendingCourses = [], loading = false } = useSelector(
    (state) => state.trending || {}
  );
  const { trainers = [] } = useSelector((state) => state.trainers || {});
  const { rules: discountRules = [] } = useSelector((state) => state.discounts || {});
  const { country = "US", currency = "USD", fxFromUSD = 1 } = useSelector(
    (state) => state.currency || {}
  );

  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(4);

  useEffect(() => {
     if (!trendingCourses.length) dispatch(fetchTrending());
    if (!discountRules.length) dispatch(fetchDiscountRules());
    if (!country) dispatch(fetchGeoAndRates());
    if (!trainers) dispatch(fetchTrainers());
 }, []);

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

  const filteredCourses =
    activeCategory === "All"
      ? trendingCourses
      : trendingCourses.filter((course) => course.category_name === activeCategory);

  const handlePageChange = (page) => {
    const total = filteredCourses.length;
    const max = Math.ceil(total / cardsPerPage);
    setCurrentPage(Math.min(Math.max(page, 1), max));
  };

  const handleCardClick = (course) => {
    if (!course?.courseName) return;
    const slug = course.courseName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/coursedetails/${slug}`);
  };

  const getDiscountPercentage = (course) => {
    const rule = discountRules.find(
      (r) =>
        r.status?.toLowerCase() === "active" &&
        (r.courseNames.includes(course.courseName) || r.courseNames.includes("all")) &&
        (r.countryNames.includes(country) || r.countryNames.includes("all"))
    );
    if (rule) return Number(rule.discountPercentage || 0);
    return country === "IN" ? Number(course.idiscount) || 0 : Number(course.discount) || 0;
  };

  return (
    <div className="training-events container">
      <div className="home-spacing">
        <div className="training-title-head">
          <h2 className="association-head">Trending IT Online Certification Courses</h2>

          <div className="card-pagination-container">
            <CardsPagination
              currentPage={currentPage}
              totalCards={filteredCourses.length}
              cardsPerPage={cardsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        <p className="association-head-tag text-gray-500 text-lg font-medium">
          Upgrade your skills with Hachion’s flexible, affordable IT courses and industry-recognized certifications.
        </p>
      </div>

      <div className="training-card-holder">
        {loading ? (
          Array.from({ length: cardsPerPage }).map((_, i) => (
            <div className="skeleton-card" key={i}></div>
          ))
        ) : filteredCourses.length > 0 ? (
           filteredCourses.slice(currentPage - 1, currentPage - 1 + cardsPerPage)
            .map((course, i) => {
              const trainer = trainers.find(
                (t) =>
                  t.course_name?.trim().toLowerCase() === course.courseName?.trim().toLowerCase()
              );

              const isIN = country === "IN";
              const isUS = country === "US";

              const mrp = isIN ? course.iamount : course.amount;
              const now = isIN ? course.itotal : course.total;

              const finalPrice = isUS ? Number(now) : Number(now) * fxFromUSD;
              const displayMrp = isUS ? Number(mrp) : Number(mrp) * fxFromUSD;

              return (
                <CourseCard
                  key={i}
                  heading={course.courseName}
                  month={course.numberOfClasses}
                  image={`https://api.test.hachion.co/${course.courseImage}`}
                  trainer_name={trainer?.trainer_name || "Not Assigned"}
                  discountPercentage={getDiscountPercentage(course)}
                  amount={`${currency} ${fmt(finalPrice)}`}
                  totalAmount={`${fmt(displayMrp)}`}
                  level={course.level}
                  onClick={() => handleCardClick(course)}
                  className="course-card"
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

export default Trending;
