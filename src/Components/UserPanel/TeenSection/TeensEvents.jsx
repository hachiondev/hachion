// src/pages/TeensEvents.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSummerEvents } from "../../../Api/hooks/TeenApi/useSummerEvents";
import { useTrendingData } from "../../../Api/hooks/TrendingApi/useTrendingData";
import { useDiscountRules } from "../../../Api/hooks/TrendingApi/useDiscountRules";
import { useGeoData } from "../../../Api/hooks/TrendingApi/useGeoData";
import { useCountdowns } from "../../../Api/hooks/TrendingApi/useCountdowns";

import CourseCard from "../CourseCard";
import CardsPagination from "../CardsPagination";

import { getRuleDiscountPct, getActiveRuleFor } from "../TrendingSection/utils/discountUtils";

import "../Home.css";

const fmt = (n) => (Math.round((Number(n) || 0) * 100) / 100).toLocaleString();

export default function TeensEvents() {
  const navigate = useNavigate();

  // --------------------------
  // Fetch shared data (same as Trending)
  // --------------------------
  const { data: summerEvents = [], isLoading: loadingSummer } = useSummerEvents();
  const { data: trendingData = [], isLoading: loadingCourses } = useTrendingData();
  const { data: discountRules = [] } = useDiscountRules();
  const { data: geo = {} } = useGeoData();

  const { country = "US", currency = "USD", fxFromUSD = 1 } = geo;

  // --------------------------
  // Local UI state
  // --------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(4);
  const [activeCategory, setActiveCategory] = useState("All");

  // --------------------------
  // Responsive cards per page
  // --------------------------
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w <= 768) setCardsPerPage(2);
      else if (w <= 1024) setCardsPerPage(3);
      else setCardsPerPage(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // --------------------------
  // Merge summer events with trending course data
  // --------------------------
  const summerCourses = useMemo(() => {
    if (!summerEvents.length || !trendingData.length) return [];

    const activeSummer = summerEvents.filter((e) => e.status);

    return activeSummer
      .map((summerEvent) => {
        const courseName = (summerEvent.course_name || "").trim();
        const courseData = trendingData.find(
          (c) => (c.courseName || "").trim() === courseName
        );

        if (!courseData) return null;

        return {
          ...courseData,
          ...summerEvent,
          // Ensure we use the right course name
          courseName: courseData.courseName,
        };
      })
      .filter(Boolean);
  }, [summerEvents, trendingData]);

  // --------------------------
  // Categories derived from summer courses
  // --------------------------
  const categories = useMemo(() => {
    const cats = [
      "All",
      ...new Set(summerCourses.map((c) => c.category_name).filter(Boolean)),
    ];
    return cats;
  }, [summerCourses]);

  // --------------------------
  // Filtered courses
  // --------------------------
  const filtered = useMemo(() => {
    return activeCategory === "All"
      ? summerCourses
      : summerCourses.filter((c) => c.category_name === activeCategory);
  }, [summerCourses, activeCategory]);

  // --------------------------
  // Countdowns (same pattern as Trending)
  // --------------------------
  const regionNames = useMemo(() => {
    return Intl.DisplayNames
      ? new Intl.DisplayNames([navigator.language || "en"], { type: "region" })
      : { of: () => "" };
  }, []);

  const getEndsAt = useMemo(() => {
    return (item) => {
      const rule = getActiveRuleFor(
        item.courseName,
        country,
        discountRules,
        regionNames
      );

      if (!rule) return null;
      const end = rule.endDate ? new Date(rule.endDate) : null;

      return end
        ? new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59)
        : null;
    };
  }, [country, discountRules, regionNames]);

  const countdowns = useCountdowns(filtered, getEndsAt);

  // --------------------------
  // Pagination slicing
  // --------------------------
  const paginated = useMemo(() => {
    const start = Math.max(currentPage - 1, 0);
    return (filtered || []).slice(start, start + cardsPerPage);
  }, [filtered, currentPage, cardsPerPage]);

  // --------------------------
  // Handlers
  // --------------------------
  const handleCardClick = (course) => {
    if (!course?.courseName) return;
    const courseSlug = course.courseName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/coursedetails/${courseSlug}`);
  };

  const loading = loadingSummer || loadingCourses;

  // --------------------------
  // Render
  // --------------------------
  return (
    <div className="training-events container">
      <div className="home-spacing">
        <div className="training-title-head">
          <h2 className="association-head">
            Online IT Training Courses For Teen's
          </h2>

          <div className="card-pagination-container">
            <CardsPagination
              currentPage={currentPage}
              totalCards={filtered.length}
              cardsPerPage={cardsPerPage}
              onPageChange={(p) => setCurrentPage(p)}
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
          Array.from({ length: cardsPerPage }).map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))
        ) : filtered.length > 0 ? (
          paginated.map((course, i) => {
            const trainerName = course.trainerName || "Not Assigned";
            const isIN = country === "IN";
            const isUS = country === "US";

            const mrp = isIN ? course.iamount : course.amount;
            const now = isIN ? course.itotal : course.total;

            const baseMrp = Number(mrp) || 0;
            const baseNow = Number(now) || 0;

            const finalPrice = isUS ? baseNow : baseNow * fxFromUSD;
            const displayMrp = isUS ? baseMrp : baseMrp * fxFromUSD;

            const rulePct = getRuleDiscountPct(
              course.courseName,
              country,
              discountRules,
              regionNames
            );

            const discountPercentage =
              rulePct > 0
                ? rulePct
                : isIN
                ? Number(course.idiscount) || 0
                : Number(course.discount) || 0;

            return (
              <CourseCard
                key={course.id || i}
                course_id={course.id}
                heading={course.courseName}
                month={course.numberOfClasses}
                image={`https://api.hachion.co/${course.courseImage}`}
                trainer_name={trainerName}
                discountPercentage={discountPercentage}
                amount={`${currency} ${fmt(finalPrice)}`}
                totalAmount={`${fmt(displayMrp)}`}
                level={course.level}
                onClick={() => handleCardClick(course)}
                className="course-card"
                timeLeftLabel={countdowns[course.id ?? course.courseName] || ""}
              />
            );
          })
        ) : (
          <p>No courses available.</p>
        )}
      </div>
    </div>
  );
}