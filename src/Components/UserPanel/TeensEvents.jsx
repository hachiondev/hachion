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

  const { summerEvents = [], loading = false } = useSelector(
    (state) => state.teens || {}
  );
  const { trainers = [] } = useSelector((state) => state.trainers || {});
  const { rules: discountRules = [] } = useSelector(
    (state) => state.discounts || {}
  );
  const { country = "US", currency = "USD", fxFromUSD = 1 } = useSelector(
    (state) => state.currency || {}
  );

  // ONE-BY-ONE INDEX SLIDER
  const [visibleStart, setVisibleStart] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(4);

  const fmt = (n) =>
    (Math.round((Number(n) || 0) * 100) / 100).toLocaleString();

  useEffect(() => {
  if (summerEvents.length === 0) dispatch(fetchSummerEvents());
}, [summerEvents.length]);

useEffect(() => {
  if (trainers.length === 0) dispatch(fetchTrainers());
}, [trainers.length]);

useEffect(() => {
  if (discountRules.length === 0) dispatch(fetchDiscountRules());
}, [discountRules.length]);

useEffect(() => {
  if (!country) dispatch(fetchGeoAndRates());
}, [country]);

  // Responsive card count
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

  const filteredCourses = summerEvents;

  // NEXT / PREV → moves by ONE card
  const moveSlider = (dir) => {
    if (dir === "next") {
      if (visibleStart + cardsPerPage < filteredCourses.length)
        setVisibleStart(visibleStart + 1);
    } else {
      if (visibleStart > 0) setVisibleStart(visibleStart - 1);
    }
  };

  const handleCardClick = (course) => {
    const slug = course.courseName?.toLowerCase().replace(/\s+/g, "-");
    navigate(`/coursedetails/${slug}`);
  };

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
      <div className="home-spacing">
        <div className="training-title-head">
          <h2 className="association-head">
            Online IT Training Courses For Teens
          </h2>

          <div className="card-pagination-container">
            <CardsPagination
              currentPage={visibleStart + 1}
              totalCards={filteredCourses.length}
              cardsPerPage={cardsPerPage}
              onNext={() => moveSlider("next")}
              onPrev={() => moveSlider("prev")}
              onPageChange={(page) => setVisibleStart(page - 1)}
            />
          </div>
        </div>

        <p className="association-head-tag">
          Kickstart your tech journey with expert-led online IT Certification
          courses for teens and beginners.
        </p>
      </div>

      <div className="training-card-holder">
        {loading ? (
          Array.from({ length: cardsPerPage }).map((_, idx) => (
            <div className="skeleton-card" key={idx}></div>
          ))
        ) : filteredCourses.length > 0 ? (
          filteredCourses
            .slice(visibleStart, visibleStart + cardsPerPage)
            .map((course, idx) => {
              const trainer = trainers.find(
                (t) =>
                  t.course_name?.trim().toLowerCase() ===
                  course.courseName?.trim().toLowerCase()
              );

              const isIN = country === "IN";
              const mrp = isIN ? course.iamount : course.amount;
              const now = isIN ? course.itotal : course.total;

              const finalMrp = isIN ? Number(mrp) : Number(mrp) * fxFromUSD;
              const finalNow = isIN ? Number(now) : Number(now) * fxFromUSD;

              return (
                <CourseCard
                  key={idx}
                  heading={course.courseName}
                  month={course.numberOfClasses}
                  image={`https://api.hachion.co/${course.courseImage}`}
                  course_id={course.id}
                  trainer_name={trainer?.trainer_name || "Not Assigned"}
                  level={course.level}
                  discountPercentage={getDiscountPercentage(course)}
                  amount={`${currency} ${fmt(finalNow)}`}
                  totalAmount={`${fmt(finalMrp)}`}
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
