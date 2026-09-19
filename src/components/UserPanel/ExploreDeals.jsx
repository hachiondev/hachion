"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import CourseCard from "./CourseCard";
import "./Home.css";
// .search-input-blog/.search-clear-btn (Blogs.css) and .course-top/
// .skeleton-card (Course.css) aren't in Home.css — imported here directly
// so this page has them regardless of what else renders alongside it.
import "./Blogs.css";
import "./CoursePage/Course.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { BiSearch, BiX } from "react-icons/bi";
import Pagination from "./Common/Pagination";
import { useDiscountRules } from "@/Api/hooks/HomePageApi/TrendingApi/useDiscountRules";
import { useGeoData } from "@/Api/hooks/HomePageApi/TrendingApi/useGeoData";
import { getRuleDiscountPct, getActiveRuleFor } from "./HomePage/TrendingSection/utils/discountUtils";
import axios from "axios";

dayjs.extend(customParseFormat);

// Ported from the CRA app's src/Components/UserPanel/ExploreDeals.jsx
// (the /discountdeals page's course grid). useNavigate -> useRouter;
// discount-rule/geo-country/currency logic reuses the same hooks and
// discountUtils already shared by the Home page's Trending/TeensEvents
// sections instead of re-implementing it inline.
const ExploreDeals = () => {
  const router = useRouter();
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countdowns, setCountdowns] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12;

  const { data: discountRules = [] } = useDiscountRules();
  const { data: geo = {} } = useGeoData();
  const { country = "US", currency = "USD", fxFromUSD = 1 } = geo;

  const fmt = (n) => Math.round(Number(n) || 0).toLocaleString();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [allCoursesResponse, trainersResponse] = await Promise.all([
          axios.get(`https://api.hachion.co/courses/all`),
          axios.get(`https://api.hachion.co/trainers`),
        ]);
        const courses = allCoursesResponse.data || [];
        const trainers = trainersResponse.data || [];
        const merged = courses.map((c) => {
          const matchedTrainer = trainers.find(
            (t) => (t.course_name || "").trim().toLowerCase() === (c.courseName || "").trim().toLowerCase()
          );
          return { ...c, trainerName: matchedTrainer ? matchedTrainer.trainer_name : "" };
        });
        setAllCourses(merged);
      } catch (e) {
        console.error("Error fetching courses/trainers:", e);
        setAllCourses([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const regionNames = useMemo(() => {
    return Intl.DisplayNames
      ? new Intl.DisplayNames([typeof navigator !== "undefined" ? navigator.language : "en"], { type: "region" })
      : { of: () => "" };
  }, []);

  const parseMDY = (s) => dayjs(s, ["MM/DD/YYYY", "YYYY-MM-DD"], true);
  const keyOf = (c) => c.id ?? c.courseName;

  const getSaleEndsAt = (courseName) => {
    const rule = getActiveRuleFor(courseName, country, discountRules, regionNames);
    if (!rule) return null;
    const end = parseMDY(rule.endDate);
    if (!end.isValid()) return null;
    return end.endOf("day").toDate();
  };

  const getTimeLeftSeconds = (course) => {
    const endsAt = getSaleEndsAt(course.courseName);
    if (!endsAt) return Infinity;
    const diffMs = endsAt.getTime() - Date.now();
    if (diffMs <= 0) return Infinity;
    return Math.floor(diffMs / 1000);
  };

  const getPerCourseDiscountPct = (course) => {
    const pct = country === "IN"
      ? (course.idiscount != null ? Number(course.idiscount) : 0)
      : (course.discount != null ? Number(course.discount) : 0);
    return isNaN(pct) ? 0 : pct;
  };

  const withRuleActive = useMemo(() => {
    return allCourses
      .map((c) => ({ course: c, secs: getTimeLeftSeconds(c) }))
      .filter((x) => x.secs !== Infinity)
      .sort((a, b) => a.secs - b.secs)
      .map((x) => x.course);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCourses, country, discountRules]);

  const seen = useMemo(() => new Set(withRuleActive.map((c) => keyOf(c))), [withRuleActive]);

  const withPerCourseDiscount = useMemo(() => {
    return allCourses
      .filter((c) => !seen.has(keyOf(c)))
      .map((c) => ({ course: c, pct: getPerCourseDiscountPct(c) }))
      .filter((x) => x.pct > 0)
      .sort((a, b) => b.pct - a.pct)
      .map((x) => x.course);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCourses, seen, country]);

  const orderedCourses = useMemo(
    () => [...withRuleActive, ...withPerCourseDiscount],
    [withRuleActive, withPerCourseDiscount]
  );

  const activeDealCourses = useMemo(() => {
    return orderedCourses.filter((course) => countdowns[keyOf(course)] && countdowns[keyOf(course)] !== "");
  }, [orderedCourses, countdowns]);

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return activeDealCourses;
    const query = searchQuery.toLowerCase().trim();
    return activeDealCourses.filter(
      (course) =>
        course.courseName?.toLowerCase().includes(query) ||
        course.category?.toLowerCase().includes(query) ||
        course.trainerName?.toLowerCase().includes(query) ||
        course.level?.toLowerCase().includes(query)
    );
  }, [activeDealCourses, searchQuery]);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const displayedCourses = filteredCourses.slice(indexOfFirstCard, indexOfLastCard);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    document.querySelector(".association-head")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const clearSearch = () => setSearchQuery("");

  useEffect(() => {
    let stopped = false;
    const compute = () => {
      if (stopped) return;
      const next = {};
      orderedCourses.forEach((c) => {
        const key = keyOf(c);
        const endsAt = getSaleEndsAt(c.courseName);
        if (!endsAt) return;
        const diffMs = endsAt.getTime() - Date.now();
        if (diffMs <= 0) return;
        const totalSec = Math.floor(diffMs / 1000);
        const days = Math.floor(totalSec / 86400);
        const hours = Math.floor((totalSec % 86400) / 3600);
        const pad = (n) => n.toString().padStart(2, "0");
        next[key] = days > 0 ? `${days}d ${pad(hours)}h Left` : `${pad(hours)}h Left`;
      });
      setCountdowns(next);
    };
    compute();
    const t = setInterval(compute, 1000);
    return () => {
      stopped = true;
      clearInterval(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderedCourses, country, discountRules]);

  const handleCardClick = (course) => {
    if (!course?.courseName || !course?.courseCategory) return;
    const courseSlug = course.courseName.toLowerCase().replace(/\s+/g, "-");
    const categorySlug = course.courseCategory.toLowerCase().replace(/\s+/g, "-");
    router.push(`/courses/${categorySlug}/${courseSlug}`);
  };

  return (
    <div className="container">
      <div className="home-spacing">
        <h1 className="association-head">
          Explore all deals and discounts {!loading && filteredCourses.length > 0 && `(${filteredCourses.length})`}
        </h1>
        <p className="association-head-tag">
          Handpicked courses across various categories to help you achieve your learning goals
        </p>
      </div>

      <div
        className="search-input-blog"
        style={{ marginBottom: "30px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}
      >
        <div className="search-input-wrapper-blog">
          <BiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search courses by name, category, trainer, or level..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button className="search-clear-btn" onClick={clearSearch} aria-label="Clear search">
              <BiX />
            </button>
          )}
        </div>
      </div>

      <div className="training-card-holder">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <div className="skeleton-card" key={i}></div>)
        ) : displayedCourses.length > 0 ? (
          displayedCourses.map((course) => {
            const cardKey = keyOf(course);
            const isIN = country === "IN";
            const isUS = country === "US";
            const rawMrp = isIN ? course.iamount : course.amount;
            const rawNow = isIN ? course.itotal : course.total;
            const mrpVal = isIN ? Number(rawMrp) : Number(rawMrp) * (isUS ? 1 : fxFromUSD);
            const nowVal = isIN ? Number(rawNow) : Number(rawNow) * (isUS ? 1 : fxFromUSD);
            const rulePct = getRuleDiscountPct(course.courseName, country, discountRules, regionNames);
            const effectiveNow = rulePct > 0 ? mrpVal * (1 - rulePct / 100) : nowVal;
            const discountPercentage = rulePct > 0 ? rulePct : getPerCourseDiscountPct(course);
            return (
              <CourseCard
                key={cardKey}
                heading={course.courseName}
                courseCategory={course.courseCategory}
                month={course.numberOfClasses}
                image={`https://api.hachion.co/${course.courseImage}`}
                course_id={course.id}
                trainer_name={course.trainerName}
                discountPercentage={discountPercentage}
                amount={`${currency} ${fmt(effectiveNow)}`}
                totalAmount={`${fmt(mrpVal)}`}
                level={course.level}
                onClick={() => handleCardClick(course)}
                className="course-card"
                timeLeftLabel={countdowns[cardKey] || ""}
              />
            );
          })
        ) : (
          <div style={{ textAlign: "center", padding: "40px", width: "100%" }}>
            <p style={{ fontSize: "1.1rem", color: "#666" }}>
              {searchQuery ? `No courses found matching "${searchQuery}"` : "No active deals available."}
            </p>
            {searchQuery && (
              <button
                onClick={clearSearch}
                style={{
                  background: "#00AEEF",
                  color: "white",
                  border: "none",
                  padding: "8px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      {!loading && filteredCourses.length > cardsPerPage && (
        <div className="pagination-container">
          <Pagination
            currentPage={currentPage}
            totalCards={filteredCourses.length}
            cardsPerPage={cardsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ExploreDeals;
