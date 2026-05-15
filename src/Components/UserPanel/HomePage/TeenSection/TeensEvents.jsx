// src/pages/TeensEvents.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSummerEvents } from "../../../../Api/hooks/HomePageApi/TeenApi/useSummerEvents";
import { useDiscountRules } from "../../../../Api/hooks/HomePageApi/TrendingApi/useDiscountRules";
import { useGeoData } from "../../../../Api/hooks/HomePageApi/TrendingApi/useGeoData";
import { useCountdowns } from "../../../../Api/hooks/HomePageApi/TrendingApi/useCountdowns";

import CourseCard from "../../CourseCard";
import CardsPagination from "../../Common/CardsPagination";

import { getRuleDiscountPct, getActiveRuleFor } from "../TrendingSection/utils/discountUtils";

import { useCoursesSummary } from "../../../../Api/hooks/HomePageApi/TrainingApi/useCoursesSummary";
import { useTrainers } from "../../../../Api/hooks/HomePageApi/TrainingApi/useTrainers";



import "../../Home.css";

// const fmt = (n) => (Math.round((Number(n) || 0) * 100) / 100).toLocaleString();
const fmt = (n) => Math.round(Number(n) || 0).toLocaleString();


const normalize = (s) => (s || "").toString().trim().toLowerCase();

export default function TeensEvents() {
  const navigate = useNavigate();
const { data: coursesSummary = [], isLoading: loadingCourses } = useCoursesSummary();
const { data: trainers = [] } = useTrainers();

  // --------------------------
  // Fetch shared data (TanStack hooks)
  // --------------------------
  const { data: summerEvents = [], isLoading: loadingSummer } = useSummerEvents();
  
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
// Build summerCourses ONLY from summerEvents
// (no trending/category comparison)
// --------------------------
const summerCourses = useMemo(() => {
  if (!summerEvents.length || !coursesSummary.length) return [];

  const activeSummer = summerEvents.filter(
    e =>
      e &&
      (e.status === true ||
        e.status === 1 ||
        String(e.status).toLowerCase() === "true")
  );

  return activeSummer
    .map(se => {
      const nameKey = normalize(se.course_name);

      const course = coursesSummary.find(
        c => normalize(c.courseName) === nameKey
      );

      if (!course) return null;

      const trainer = trainers.find(
        t => normalize(t.courseName) === nameKey
      );

      return {
        ...course,                  
        trainerName: trainer?.trainerName || "Not Assigned",
        courseName: course.courseName,
        category_name: se.category_name,
        summerEvent: se,             
      };
    })
    .filter(Boolean);
}, [summerEvents, coursesSummary, trainers]);



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

  if (!course?.courseName || !course?.courseCategory) {
    console.error("Missing category/course", course);
    return;
  }

  const courseSlug = course.courseName
    .toLowerCase()
    .replace(/\s+/g, "-");

  const categorySlug = course.courseCategory
    .toLowerCase()
    .replace(/\s+/g, "-");

  navigate(`/courses/${categorySlug}/${courseSlug}`);
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

// STEP 1: choose correct base values
const baseMrp = isIN
  ? Number(course.iamount) || 0
  : Number(course.amount) || 0;

const baseNow = isIN
  ? Number(course.itotal) || 0
  : Number(course.total) || 0;

// STEP 2: apply conversion ONLY for non-IN & non-US
let finalPrice = baseNow;
let displayMrp = baseMrp;

if (!isIN && !isUS) {
  finalPrice = baseNow * fxFromUSD;
  displayMrp = baseMrp * fxFromUSD;
}


            const rulePct = getRuleDiscountPct(course.courseName, country, discountRules, regionNames);

            const discountPercentage = rulePct > 0 ? rulePct : isIN ? Number(course.idiscount) || 0 : Number(course.discount) || 0;

            return (
              <CourseCard
                key={course.id || i}
                course_id={course.id}
                heading={course.courseName}
                courseCategory={course.courseCategory}
                month={course.numberOfClasses}
                image={`https://api.test.hachion.co/${course.courseImage}`}
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
