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
  const { rules: discountRules = [] } = useSelector(
    (state) => state.discounts || {}
  );
  const { country = "US", currency = "USD", fxFromUSD = 1 } = useSelector(
    (state) => state.currency || {}
  );

  // ONE-BY-ONE INDEX
  const [visibleStart, setVisibleStart] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(4);

  useEffect(() => {
    if (!trendingCourses.length) dispatch(fetchTrending());
  }, [trendingCourses.length]);

  useEffect(() => {
    if (!discountRules.length) dispatch(fetchDiscountRules());
  }, [discountRules.length]);

  useEffect(() => {
    dispatch(fetchGeoAndRates());
  }, []);

  useEffect(() => {
    if (!trainers.length) dispatch(fetchTrainers());
  }, [trainers.length]);

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

  const filteredCourses = trendingCourses;

  // NEXT / PREV (1 card at a time)
  const handleMove = (dir) => {
    if (dir === "next") {
      if (visibleStart + cardsPerPage < filteredCourses.length)
        setVisibleStart(visibleStart + 1);
    } else {
      if (visibleStart > 0) setVisibleStart(visibleStart - 1);
    }
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
        (r.courseNames.includes(course.courseName) ||
          r.courseNames.includes("all")) &&
        (r.countryNames.includes(country) || r.countryNames.includes("all"))
    );
    if (rule) return Number(rule.discountPercentage || 0);
    return country === "IN"
      ? Number(course.idiscount) || 0
      : Number(course.discount) || 0;
  };

  return (
    <div className="training-events container">
      <div className="home-spacing">
        <div className="training-title-head">
          <h2 className="association-head">
            Trending IT Online Certification Courses
          </h2>

          {/* Reuse your existing UI */}
          <div className="card-pagination-container">
            <CardsPagination
              currentPage={visibleStart + 1}
              totalCards={filteredCourses.length}
              cardsPerPage={cardsPerPage}
              onPageChange={(page) => setVisibleStart(page - 1)}
              onNext={() => handleMove("next")}
              onPrev={() => handleMove("prev")}
            />
          </div>
        </div>

        <p className="association-head-tag text-gray-500 text-lg font-medium">
          Upgrade your skills with Hachion’s flexible, affordable IT courses and
          industry-recognized certifications.
        </p>
      </div>

      <div className="training-card-holder">
        {loading ? (
          Array.from({ length: cardsPerPage }).map((_, i) => (
            <div className="skeleton-card" key={i}></div>
          ))
        ) : filteredCourses.length > 0 ? (
          <>
            <CourseCard
              heading="New Course Details"
              month="30"
              image="/static/banner.png"
              trainer_name="Trainer"
              discountPercentage={10}
              amount={`${currency} ${fmt(99)}`}
              totalAmount={`${fmt(199)}`}
              level="Beginner"
              staticButtonLink="/newcoursedetails"
              className="course-card"
            />

            {filteredCourses
              .slice(visibleStart, visibleStart + (cardsPerPage - 1))
              .map((course, i) => {
                const trainer = trainers.find(
                  (t) =>
                    t.course_name?.trim().toLowerCase() ===
                    course.courseName?.trim().toLowerCase()
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
                    image={`https://api.hachion.co/${course.courseImage}`}
                    trainer_name={trainer?.trainer_name || "Not Assigned"}
                    discountPercentage={getDiscountPercentage(course)}
                    amount={`${currency} ${fmt(finalPrice)}`}
                    totalAmount={`${fmt(displayMrp)}`}
                    level={course.level}
                    onClick={() => handleCardClick(course)}
                    className="course-card"
                  />
                );
              })}
          </>
        ) : (
          <p>No courses available.</p>
        )}
      </div>
    </div>
  );
};

export default Trending;
