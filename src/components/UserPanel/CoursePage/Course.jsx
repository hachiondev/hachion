"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "./components/Sidebar";
import SidebarRight from "./components/SidebarRight";
import Pagination from "../Common/Pagination";
import "./Course.css";
import TrendingCourseNames from "./components/TrendingCourseNames";
import InstructorProfile from "./components/InstructorProfile";
import { MdKeyboardArrowRight } from "react-icons/md";

// Ported from the CRA app's src/Components/UserPanel/CoursePage/Course.jsx —
// the /courses catalog listing page (both /courses and /courses/:categoryName
// render this same component in CRA). useParams -> `categoryNameParam` prop
// supplied by the two App Router pages (courses/page.js and
// courses/[categoryName]/page.js). Title/description/canonical now live in
// each page.js's generateMetadata() instead of react-helmet-async/<Canonical>.
const Course = ({
  categoryNameParam = null,
  initialCategories,
  initialCourses,
  initialDiscountRules,
  initialCardsPerPage,
}) => {
  const searchParams = useSearchParams();

  // Single source of truth for the URL-driven category: the route segment
  // (/courses/:categoryName) or the ?category= query param. Both are already
  // reactive (useSearchParams triggers a re-render on change, and
  // categoryNameParam changes whenever Next.js swaps the matched page), so
  // this is a pure per-render derivation rather than state kept in sync via
  // an effect.
  const categoryFromUrl = searchParams.get("category");
  const decodedCategoryFromUrl = categoryFromUrl ? decodeURIComponent(categoryFromUrl) : null;
  const selectedCategoryFromParent = categoryNameParam
    ? decodeURIComponent(categoryNameParam)
    : decodedCategoryFromUrl;

  const [selectedCategory, setSelectedCategory] = useState(selectedCategoryFromParent || "All");
  const [filters, setFilters] = useState({
    categories: [],
    levels: [],
    price: [],
  });
  const bannerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  // Seeded from a server-side User-Agent guess (courseListingData.js) instead
  // of always starting at the desktop default (9) — on a real mobile visit,
  // starting at 9 and correcting to 4 right after mount was the dominant
  // cause of this page's CLS (the whole card grid collapsing post-hydration;
  // confirmed via Lighthouse's layout-shift culprits audit, which attributed
  // essentially all of it to this container). The resize-correction effect
  // below is unchanged and still the source of truth for actual window size.
  const [cardsPerPage, setCardsPerPage] = useState(initialCardsPerPage || 9);
  const [totalCards, setTotalCards] = useState(0);

  useEffect(() => {
    // Re-sync selectedCategory whenever the URL-driven category changes
    // (e.g. clicking a "Browse by Category" link keeps this component
    // mounted under the shared (public) layout) — a legitimate external
    // (URL) -> state sync, not a derivable render-time value, since
    // selectedCategory is also independently mutated by Sidebar's own
    // filter checkboxes via handleFilterChange.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (selectedCategoryFromParent) setSelectedCategory(selectedCategoryFromParent);
  }, [selectedCategoryFromParent]);

  const handleFilterChange = (updatedFilters) => {
    const normalized = {
      categories: Array.isArray(updatedFilters?.categories) ? updatedFilters.categories : [],
      levels: Array.isArray(updatedFilters?.levels) ? updatedFilters.levels : [],
      price: Array.isArray(updatedFilters?.price) ? updatedFilters.price : [],
    };

    if (normalized.categories.length > 0) {
      setSelectedCategory(normalized.categories[0]);
    } else {
      setSelectedCategory("All");
    }

    setFilters(normalized);
    setCurrentPage(1);
  };

  const updateTotalCards = (total) => {
    setTotalCards(total);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const updateCardsPerPage = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setCardsPerPage(4);
      } else if (width <= 1024) {
        setCardsPerPage(6);
      } else if (width <= 1366) {
        setCardsPerPage(9);
      } else {
        setCardsPerPage(9);
      }
    };

    updateCardsPerPage();
    window.addEventListener("resize", updateCardsPerPage);
    return () => window.removeEventListener("resize", updateCardsPerPage);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Return ALL selected categories for the breadcrumb.
  const getBreadcrumbCategories = () => {
    if (filters.categories.length > 0) {
      return filters.categories;
    }
    if (selectedCategoryFromParent) {
      return [selectedCategoryFromParent];
    }
    if (selectedCategory && selectedCategory !== "All") {
      return [selectedCategory];
    }
    return [];
  };

  const displayCategories = getBreadcrumbCategories();

  // This page previously had no <h1> at all (only h2s further down in
  // TrendingCourseNames/InstructorProfile) — genuinely missing on both
  // /courses and /courses/:categoryName. Visually hidden (not a design
  // change; the page's visible heading-like text is the "Count N courses"
  // label/breadcrumb, which stays exactly as-is) but present in the DOM so
  // crawlers and screen readers get one real, dynamic h1 per page.
  const pageHeadingText = selectedCategoryFromParent
    ? `${selectedCategoryFromParent
        .split(/[-\s]+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")} Courses`
    : "All Courses";

  return (
    <div className="course-top">
      <h1
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {pageHeadingText}
      </h1>
      <div ref={bannerRef} className="course-content container">
        <Sidebar
          onFilterChange={handleFilterChange}
          selectedCategoryFromParent={selectedCategoryFromParent}
          initialCategories={initialCategories}
          initialCourses={initialCourses}
          initialDiscountRules={initialDiscountRules}
        />

        <div className="sidebar-right-container">
          {/* Breadcrumb and Course Count */}
          <div className="breadcrumb-course-header">
            <nav aria-label="breadcrumb" className="breadcrumb-nav">
              <ol className="breadcrumb">
                {displayCategories.map((cat, index) => (
                  <li
                    key={index}
                    className="breadcrumb-item active"
                    aria-current={index === displayCategories.length - 1 ? "page" : undefined}
                  >
                    {index > 0 && <MdKeyboardArrowRight />}
                    {cat}
                  </li>
                ))}
              </ol>
            </nav>

            <div className="course-count">
              Count <strong>{totalCards}</strong> courses
            </div>
          </div>

          <SidebarRight
            category={selectedCategory}
            filters={filters}
            currentPage={currentPage}
            cardsPerPage={cardsPerPage}
            onTotalCardsChange={updateTotalCards}
            initialCourses={initialCourses}
          />

          <div className="pagination-container">
            <Pagination
              currentPage={currentPage}
              totalCards={totalCards}
              cardsPerPage={cardsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      <TrendingCourseNames />
      <InstructorProfile />
    </div>
  );
};

export default Course;
