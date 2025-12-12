// src/pages/TeensEvents.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSummerEvents } from "../../../../Api/hooks/HomePageApi/TeenApi/useSummerEvents";
import { useTrendingData } from "../../../../Api/hooks/HomePageApi/TrendingApi/useTrendingData";
import { useDiscountRules } from "../../../../Api/hooks/HomePageApi/TrendingApi/useDiscountRules";
import { useGeoData } from "../../../../Api/hooks/HomePageApi/TrendingApi/useGeoData";
import { useCountdowns } from "../../../../Api/hooks/HomePageApi/TrendingApi/useCountdowns";

import CourseCard from "../../CourseCard";
import CardsPagination from "../../CardsPagination";

import { getRuleDiscountPct, getActiveRuleFor } from "../TrendingSection/utils/discountUtils";

import "../../Home.css";

const fmt = (n) => (Math.round((Number(n) || 0) * 100) / 100).toLocaleString();

const normalize = (s) => (s || "").toString().trim().toLowerCase();

export default function TeensEvents() {
  const navigate = useNavigate();

  // --------------------------
  // Fetch shared data (TanStack hooks)
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
  // Build set of active summer categories
  // (only events considered active)
  // --------------------------
  const summerCategories = useMemo(() => {
    if (!Array.isArray(summerEvents) || summerEvents.length === 0) return new Set();
    return new Set(
      summerEvents
        .filter((e) => e && (e.status === true || e.status === 1 || String(e.status).toLowerCase() === "true"))
        .map((e) => normalize(e.category_name))
        .filter(Boolean)
    );
  }, [summerEvents]);

  // --------------------------
  // Merge by CATEGORY:
  // For every trending course, if its category matches any summer category,
  // include it in summerCourses. Also attach the matching summer events (if any)
  // --------------------------
  const summerCourses = useMemo(() => {
    if (!Array.isArray(trendingData) || trendingData.length === 0) return [];
    if (!summerCategories || summerCategories.size === 0) return [];

    // Helper to get course category from trending item
    const getCourseCategory = (c) =>
      normalize(c.courseCategory || c.category_name || c.course_category || c.courseCategoryName);

    // For each trending course, if its category is in summerCategories, include it.
    const matched = trendingData
      .map((course) => {
        const courseCatNorm = getCourseCategory(course);
        if (!courseCatNorm || !summerCategories.has(courseCatNorm)) return null;

        // attach any summer events for this category (could be multiple)
        const matchedSummerEvents = summerEvents.filter(
          (se) => normalize(se.category_name) === courseCatNorm && (se.status === true || se.status == 1 || String(se.status).toLowerCase() === "true")
        );

        // Build a merged object — prefer trending fields but also include summer-specific info
        return {
          ...course,
          // attach array of matching summer events (useful if you want to display dates)
          summerEvents: matchedSummerEvents,
          // courseName normalization fallback
          courseName: course.course_name || course.courseName || course.name || "",
          // ensure category_name exists
          category_name: course.category_name || course.courseCategory || "",
        };
      })
      .filter(Boolean);

    return matched;
  }, [trendingData, summerCategories, summerEvents]);

  // --------------------------
  // Categories derived from summerCourses (for filter UI)
  // --------------------------
  const categories = useMemo(() => {
    const cats = ["All"];
    summerCourses.forEach((c) => {
      if (c && c.category_name) cats.push(c.category_name);
    });
    return [...new Set(cats)];
  }, [summerCourses]);

  // --------------------------
  // Filtered list according to activeCategory
  // --------------------------
  const filtered = useMemo(() => {
    if (activeCategory === "All") return summerCourses;
    return summerCourses.filter((c) => normalize(c.category_name) === normalize(activeCategory));
  }, [summerCourses, activeCategory]);

  // --------------------------
  // Countdowns: reuse getActiveRuleFor via a stable regionNames + getEndsAt
  // --------------------------
  const regionNames = useMemo(() => {
    return Intl.DisplayNames ? new Intl.DisplayNames([navigator.language || "en"], { type: "region" }) : { of: () => "" };
  }, []);

  const getEndsAt = useMemo(() => {
    return (item) => {
      const rule = getActiveRuleFor(item.courseName, country, discountRules, regionNames);
      if (!rule) return null;
      const end = rule.endDate ? new Date(rule.endDate) : null;
      return end ? new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59) : null;
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

  // Reset page when filtered length changes to keep UI stable
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, cardsPerPage, filtered.length]);

  // --------------------------
  // Render
  // --------------------------
  return (
    <div className="training-events container">
      <div className="home-spacing">
        <div className="training-title-head">
          <h2 className="association-head">Online IT Training Courses For Teen's</h2>

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
          Kickstart your tech journey with expert-led online IT Certification courses for teens and beginners.
        </p>
      </div>

      <div className="training-card-holder">
        {loading ? (
          Array.from({ length: cardsPerPage }).map((_, i) => <div key={i} className="skeleton-card" />)
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

            const rulePct = getRuleDiscountPct(course.courseName, country, discountRules, regionNames);

            const discountPercentage = rulePct > 0 ? rulePct : isIN ? Number(course.idiscount) || 0 : Number(course.discount) || 0;

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
