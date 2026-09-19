"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import DiscountCourseCard from "./DiscountCourseCard";
import Nodiscount from "@/assets/nodiscount.webp";
import { useGeoData } from "@/Api/hooks/HomePageApi/TrendingApi/useGeoData";
import { useDiscountRules } from "@/Api/hooks/HomePageApi/TrendingApi/useDiscountRules";
import { useCountdowns } from "@/Api/hooks/HomePageApi/TrendingApi/useCountdowns";
import { useCoursesSummary } from "@/Api/hooks/HomePageApi/TrainingApi/useCoursesSummary";
import { getRuleDiscountPct, getActiveRuleFor } from "../../TrendingSection/utils/discountUtils";
import Image from "next/image";
import "../../../Corporate.css";
const fmt = n => Math.round(Number(n) || 0).toLocaleString();
const DiscountCards = () => {
  const router = useRouter();
  const {
    data: geo = {},
    isLoading: loadingGeo
  } = useGeoData();
  const {
    data: discountRules = []
  } = useDiscountRules();
  const {
    data: allCourses = [],
    isLoading: loadingCourses
  } = useCoursesSummary();
  const {
    country = "US",
    currency = "USD",
    fxFromUSD = 1
  } = geo;
  const loading = loadingCourses || loadingGeo;
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerRow, setCardsPerRow] = useState(2);
  const [showIndicators, setShowIndicators] = useState(true);
  const regionNames = useMemo(() => {
    return Intl.DisplayNames ? new Intl.DisplayNames([typeof navigator !== 'undefined' ? navigator.language : "en"], {
      type: "region"
    }) : {
      of: () => ""
    };
  }, []);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) setCardsPerRow(1);else if (window.innerWidth < 992) setCardsPerRow(2);else setCardsPerRow(2);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const orderedCourses = useMemo(() => {
    if (!allCourses.length || !discountRules.length) return [];
    const getSaleEndsAtMs = courseName => {
      const rule = getActiveRuleFor(courseName, country, discountRules, regionNames);
      if (!rule) return Infinity;
      const end = rule.endDate ? new Date(rule.endDate) : null;
      if (!end) return Infinity;
      const endsAt = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59);
      return endsAt.getTime();
    };
    return allCourses.map(course => ({
      course,
      endMs: getSaleEndsAtMs(course.courseName)
    })).filter(x => x.endMs !== Infinity).sort((a, b) => a.endMs - b.endMs).map(x => x.course);
  }, [allCourses, country, discountRules, regionNames]);
  const totalPages = useMemo(() => Math.max(1, orderedCourses.length - cardsPerRow + 1), [orderedCourses.length, cardsPerRow]);
  const currentCourses = useMemo(() => {
    const startIndex = currentPage;
    return orderedCourses.slice(startIndex, startIndex + cardsPerRow);
  }, [orderedCourses, currentPage, cardsPerRow]);
  const goToNext = useCallback(() => {
    setCurrentPage(prev => {
      const next = prev + 1;
      return next >= totalPages ? 0 : next;
    });
  }, [totalPages]);
  const goToPrev = useCallback(() => {
    setCurrentPage(prev => {
      const next = prev - 1;
      return next < 0 ? totalPages - 1 : next;
    });
  }, [totalPages]);
  const getEndsAt = useCallback(item => {
    const rule = getActiveRuleFor(item.courseName, country, discountRules, regionNames);
    if (!rule) return null;
    const end = rule.endDate ? new Date(rule.endDate) : null;
    return end ? new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59) : null;
  }, [country, discountRules, regionNames]);
  const countdowns = useCountdowns(currentCourses, getEndsAt);
  const handleCardClick = useCallback(course => {
    if (!course?.courseName || !course?.courseCategory) {
      console.error("Missing category/course", course);
      return;
    }
    const courseSlug = course.courseName.toLowerCase().replace(/\s+/g, "-");
    const categorySlug = course.courseCategory.toLowerCase().replace(/\s+/g, "-");
    router.push(`/courses/${categorySlug}/${courseSlug}`);
  }, [router]);
  return <div className="position-relative text-center">
      {orderedCourses.length > 1 && <>
          <FaAngleLeft className="custom-cards-arrow left-cards-arrow" onClick={goToPrev} />
          <FaAngleRight className="custom-cards-arrow right-cards-arrow" onClick={goToNext} />
        </>}

      <div className="d-flex justify-content-center gap-3 flex-wrap">
        {/* Loading skeleton */}
        {loading && Array.from({
        length: cardsPerRow
      }).map((_, idx) => <div className="skeleton-card" key={idx}></div>)}

        {/* No discount courses available */}
        {!loading && orderedCourses.length === 0 && <div className="no-discounts-msg text-center py-4 d-flex flex-column align-items-center">
            <Image src={Nodiscount} alt="No discounts" className="no-discount-image mb-3" width={180} style={{
          height: "auto",
          objectFit: "contain"
        }} />
            <p style={{ fontWeight: 600 }}>No discounts available right now</p>
          </div>}

        {/* Render discount cards */}
        {!loading && orderedCourses.length > 0 && currentCourses.map((course, idx) => {
        const isIN = country === "IN";
        const isUS = country === "US";
        const mrp = isIN ? course.iamount : course.amount;
        const baseMrp = Number(mrp) || 0;
        const displayMrp = isIN ? baseMrp : baseMrp * fxFromUSD;
        const rulePct = getRuleDiscountPct(course.courseName, country, discountRules, regionNames);
        const effectiveNow = displayMrp * (1 - rulePct / 100);
        return <DiscountCourseCard key={course.id || idx} heading={course.courseName} courseCategory={course.courseCategory} month={course.numberOfClasses} image={`https://api.hachion.co/${course.courseImage}`} course_id={course.id} discountPercentage={rulePct} amount={`${currency} ${fmt(effectiveNow)}`} totalAmount={`${fmt(displayMrp)}`} trainer_name={course.trainerName} level={course.level} onClick={() => handleCardClick(course)} className="course-card" timeLeftLabel={countdowns[course.id ?? course.courseName] || ""} />;
      })}
      </div>

      {/* Page indicators */}
      {showIndicators && orderedCourses.length > 1 && <div className="page-indicators">
          {Array.from({
        length: totalPages
      }).map((_, idx) => <span key={idx} className={`indicator-dot ${currentPage === idx ? "active" : ""}`} onClick={() => setCurrentPage(idx)}></span>)}
        </div>}
    </div>;
};
export default DiscountCards;
