import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../../CourseCard";
import CardsPagination from "../../CardsPagination";
import "../../Home.css";
import { getActiveRuleFor, getRuleDiscountPct } from "./utils/discountUtils";
import { useTrendingData } from "../../../../Api/hooks/HomePageApi/TrendingApi/useTrendingData";
import { useGeoData } from "../../../../Api/hooks/HomePageApi/TrendingApi/useGeoData";
import { useDiscountRules } from "../../../../Api/hooks/HomePageApi/TrendingApi/useDiscountRules";
import { useCountdowns } from "../../../../Api/hooks/HomePageApi/TrendingApi/useCountdowns";

const fmt = (n) => (Math.round((Number(n) || 0) * 100) / 100).toLocaleString();

const Trending = () => {
  const navigate = useNavigate();

  const { data: trending = [], isLoading } = useTrendingData();
  const { data: geo = {} } = useGeoData();
  const { data: discountRules = [] } = useDiscountRules();

  const { country = "US", currency = "USD", fxFromUSD = 1 } = geo;

  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(4);

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

  // categories derived from trending
  const categories = useMemo(() => {
    const cats = ["All", ...new Set((trending || []).map(c => c.category_name).filter(Boolean))];
    return cats;
  }, [trending]);

  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    return activeCategory === "All"
      ? trending
      : (trending || []).filter(c => c.category_name === activeCategory);
  }, [trending, activeCategory]);

  // countdowns
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


  // pagination slicing
  const paginated = useMemo(() => {
    const start = Math.max(currentPage - 1, 0);
    return (filtered || []).slice(start, start + cardsPerPage);
  }, [filtered, currentPage, cardsPerPage]);

  const handleCardClick = (course) => {
    if (!course?.courseName) return;
    const courseSlug = course.courseName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/coursedetails/${courseSlug}`);
  };

  return (
    <div className="training-events container">
      <div className="home-spacing">
        <div className="training-title-head">
          <h2 className="association-head">Trending IT Online Certification Courses</h2>

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
          Upgrade your skills with Hachion’s flexible, affordable IT courses and industry-recognized certifications.
        </p>
      </div>

      <div className="training-card-holder">
        {isLoading ? (
          Array.from({ length: cardsPerPage }).map((_, i) => <div className="skeleton-card" key={i} />)
        ) : (filtered.length > 0) ? (
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

            const rulePct = getRuleDiscountPct(course.courseName, country, discountRules, Intl.DisplayNames ? new Intl.DisplayNames([navigator.language || 'en'], { type: 'region' }) : { of: () => "" });
            const discountPercentage = rulePct > 0 ? rulePct : (isIN ? (course.idiscount != null ? Number(course.idiscount) : 0) : (course.discount != null ? Number(course.discount) : 0));

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
};

export default Trending;
