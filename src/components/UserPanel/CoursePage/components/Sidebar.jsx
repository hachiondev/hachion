"use client";

import React, { useState, useEffect, useMemo } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { LuListFilter } from "react-icons/lu";
import { useRouter } from "next/navigation";
import "../Course.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useCategories } from "@/Api/hooks/SitemapPageApi/useCategories";
import Loader from "../../Common/Loader/Loader";
import { useAllCourses } from "@/Api/hooks/SitemapPageApi/useAllCourses";
import { useGeoData } from "@/Api/hooks/HomePageApi/TrendingApi/useGeoData";
import { useDiscountRules } from "@/Api/hooks/HomePageApi/TrendingApi/useDiscountRules";
import { slugifyCourseText } from "../courseRouteUtils";
dayjs.extend(customParseFormat);

// Ported from the CRA app's src/Components/UserPanel/CoursePage/components/Sidebar.jsx.
// useNavigate -> useRouter; the CRA useState(window.innerWidth <= 480) initializer
// read `window` during the initial render, which crashes on the server — deferred
// to a mount-only effect instead (matching the resize-listener effect's own logic).
const Sidebar = ({
  onFilterChange,
  selectedCategoryFromParent,
  initialCategories,
  initialCourses,
  initialDiscountRules,
}) => {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState(["All Levels"]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [expanded, setExpanded] = useState({
    category: true,
    level: true,
    price: true,
  });
  const [isMobileView, setIsMobileView] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const LEVELS = ["All Levels", "Beginner", "Intermediate", "Expert"];
  const PRICE = ["Free", "Paid"];
  const { data: categories = [], isLoading: loadingCategories, error: categoryError } = useCategories(initialCategories);
  const { data: courses = [], isLoading: loadingCourses, error: coursesError } = useAllCourses("allCourses", initialCourses);
  const { data: geoData } = useGeoData();
  const country = geoData?.country || "US";
  const { data: discountRules = [] } = useDiscountRules(initialDiscountRules);
  const normalize = (v = "") => v.toString().trim().toLowerCase();

  const slugifyCategory = (text = "") => slugifyCourseText(text);

  useEffect(() => {
    // Reads a browser-only API (window), so the initial value can't be
    // computed during SSR render — set once on mount, matching CRA's
    // useState(window.innerWidth <= 480) initializer (480px threshold only
    // applies to this first read; the resize listener below uses 768px,
    // matching CRA's own pre-existing mismatch between the two).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileView(window.innerWidth <= 480);

    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const categoryFromParent = selectedCategoryFromParent;

    if (!categories.length) return;

    if (categoryFromParent) {
      const categoryToSelect = categories.find(
        (c) =>
          normalize(c.name) === normalize(categoryFromParent) ||
          slugifyCategory(c.name) === slugifyCategory(categoryFromParent)
      );

      if (!categoryToSelect) return;

      // Syncs from the selectedCategoryFromParent prop (URL-driven, an
      // external source) — legitimate prop -> state sync, not derivable
      // during render since it also depends on the async categories fetch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedCategories([categoryToSelect.name]);
      onFilterChange({
        categories: [categoryToSelect.name],
        levels: [],
        price: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, selectedCategoryFromParent]);

  const toggleSection = (section) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (value, type) => {
    let updated;

    if (type === "category") {
      updated = selectedCategories.includes(value)
        ? selectedCategories.filter((c) => c !== value)
        : [...selectedCategories, value];
      setSelectedCategories(updated);

      const categoryPath = updated.length === 1 ? `/courses/${slugifyCategory(updated[0])}` : "/courses";
      router.replace(categoryPath);
    } else if (type === "level") {
      if (value === "All Levels") {
        updated = ["All Levels"];
      } else {
        updated = selectedLevels.includes(value)
          ? selectedLevels.filter((l) => l !== value)
          : [...selectedLevels.filter((l) => l !== "All Levels"), value];

        if (updated.length === 0) updated = ["All Levels"];
      }
      setSelectedLevels(updated);
    } else if (type === "price") {
      updated = selectedPrice.includes(value) ? selectedPrice.filter((p) => p !== value) : [...selectedPrice, value];
      setSelectedPrice(updated);
    }

    const levelsRaw = type === "level" ? updated : selectedLevels;
    const levelsForFilter = levelsRaw.includes("All Levels") ? [] : levelsRaw;

    onFilterChange({
      categories: type === "category" ? updated : selectedCategories,
      levels: levelsForFilter,
      price: type === "price" ? updated : selectedPrice,
    });
  };

  const parseMDY = (s) => dayjs(s, ["MM/DD/YYYY", "YYYY-MM-DD"], true);
  const STRICT_DATE_WINDOW = true;

  const inWindow = (start, end) => {
    const today = dayjs();
    const s = parseMDY(start);
    const e = parseMDY(end);
    if (STRICT_DATE_WINDOW) {
      const okS = s.isValid() ? !today.isBefore(s, "day") : true;
      const okE = e.isValid() ? !today.isAfter(e, "day") : true;
      return okS && okE;
    }
    const okE = e.isValid() ? !today.isAfter(e, "day") : true;
    return okE;
  };

  const normalizeStr = (s) => (s || "").toString().trim().toLowerCase();

  // Intl.DisplayNames construction is measurably expensive — built once
  // (Intl is available in both Node/SSR and the browser, so no window guard
  // is needed) instead of on every render, matching SidebarRight.jsx's copy
  // of this same computation.
  const regionNames = useMemo(() => {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale || "en-US";
    return new Intl.DisplayNames([locale || "en"], { type: "region" });
  }, []);

  const expandRuleCountry = (token) => {
    const t = (token || "").toString().trim();
    if (!t) return [];
    if (/^[A-Za-z]{2}$/.test(t)) {
      const code = t.toUpperCase();
      const name = regionNames.of(code) || "";
      return [normalizeStr(code), normalizeStr(name)];
    }
    return [normalizeStr(t)];
  };

  const expandUserCountry = (cc) => {
    const code = (cc || "").toUpperCase();
    const name = regionNames.of(code) || "";
    return new Set([normalizeStr(code), normalizeStr(name)]);
  };

  // Pure derivation of the "best offer" banner from discountRules/courses/
  // country — computed with useMemo instead of an effect+4 state variables
  // (no side effect here besides the render output, so no effect is needed).
  const { offerPct, offerCourse, offerDaysLeft, offerFromRule } = useMemo(() => {
    const userCountryTokens = expandUserCountry(country);
    let bestRule = null;
    let bestPct = 0;

    for (const r of discountRules) {
      if ((r?.status || "").toLowerCase() !== "active") continue;
      if (!inWindow(r.startDate, r.endDate)) continue;

      const countries = Array.isArray(r.countryNames) ? r.countryNames : [];
      const countryOk =
        countries.some((c) => {
          const tokens = expandRuleCountry(c);
          return tokens.some((t) => userCountryTokens.has(t));
        }) || countries.some((c) => normalizeStr(c) === "all");

      if (!countryOk) continue;

      const pct = Number(r.discountPercentage || 0);
      if (pct > bestPct) {
        bestPct = pct;
        bestRule = r;
      }
    }

    if (bestRule && bestPct > 0) {
      const list = Array.isArray(bestRule.courseNames) ? bestRule.courseNames : [];
      const firstSpecific = list.find((n) => n && normalizeStr(n) !== "all") || "All Courses";

      const end = parseMDY(bestRule.endDate);
      const daysLeft = end.isValid() ? Math.max(0, end.endOf("day").diff(dayjs(), "day")) : null;

      return { offerPct: bestPct, offerCourse: firstSpecific, offerDaysLeft: daysLeft, offerFromRule: true };
    }

    const num = (x) => {
      const n = Number(String(x ?? "").replace(/[^\d.-]/g, ""));
      return Number.isFinite(n) ? n : 0;
    };

    const pctField = country === "IN" ? "idiscount" : "discount";
    const mrpField = country === "IN" ? "iamount" : "amount";

    const best = (courses || []).reduce(
      (acc, c) => {
        const pct = num(c?.[pctField]);
        if (pct <= 0) return acc;

        const mrp = num(c?.[mrpField]);
        const savings = (mrp * pct) / 100;

        if (pct > acc.pct || (pct === acc.pct && savings > acc.savings)) {
          return { pct, savings, course: c };
        }
        return acc;
      },
      { pct: 0, savings: 0, course: null }
    );

    if (best.course) {
      return { offerPct: best.pct, offerCourse: best.course.courseName || "", offerDaysLeft: null, offerFromRule: false };
    }
    return { offerPct: 0, offerCourse: "", offerDaysLeft: null, offerFromRule: false };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountRules, courses, country]);

  if (loadingCategories || loadingCourses) {
    // min-height matches the real sidebar's typical (viewport-capped/sticky)
    // footprint, so swapping in the real filter list once data loads
    // doesn't add to the page's multi-stage CLS on /courses. loadingCountry
    // is deliberately excluded: categories/courses now arrive pre-seeded via
    // initialData (server-fetched in page.js), so this gate no longer fires
    // on a normal SSR'd page load; geo/currency genuinely can't be known
    // server-side (client-only IP lookup), and country already defaults to
    // "US" below, matching the same SSR-defaults-to-US convention already
    // used by the course-details page's JSON-LD pricing.
    return (
      <div className="sidebar-drawer" style={{ minHeight: "100vh" }}>
        <Loader />
      </div>
    );
  }

  if (categoryError || coursesError) {
    return (
      <div className="error-container">
        <h3>Something went wrong</h3>
        <p>Please try again later.</p>
      </div>
    );
  }

  const sidebarContent = (
    <div className="categories-sidebar">
      {/* Categories */}
      <div className="sidebar-section">
        <div className="sidebar-heading" onClick={() => toggleSection("category")}>
          <span>Categories</span>
          {expanded.category ? <IoIosArrowUp className="sidebar-arrow" /> : <IoIosArrowDown className="sidebar-arrow" />}
        </div>
        {expanded.category && (
          <div className="sidebar-options">
            {categories.map((cat) => (
              <label key={cat.id} className="sidebar-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.name)}
                  onChange={() => handleCheckboxChange(cat.name, "category")}
                />
                {cat.name}
              </label>
            ))}
          </div>
        )}
      </div>
      <hr className="faq-seperater" />

      {/* Levels */}
      <div className="sidebar-section">
        <div className="sidebar-heading" onClick={() => toggleSection("level")}>
          <span>Levels</span>
          {expanded.level ? <IoIosArrowUp className="sidebar-arrow" /> : <IoIosArrowDown className="sidebar-arrow" />}
        </div>
        {expanded.level && (
          <div className="sidebar-options">
            {LEVELS.map((level) => (
              <label key={level} className="sidebar-checkbox">
                <input
                  type="checkbox"
                  checked={selectedLevels.includes(level)}
                  onChange={() => handleCheckboxChange(level, "level")}
                />
                {level}
              </label>
            ))}
          </div>
        )}
      </div>
      <hr className="faq-seperater" />

      {/* Price */}
      <div className="sidebar-section">
        <div className="sidebar-heading" onClick={() => toggleSection("price")}>
          <span>Price</span>
          {expanded.price ? <IoIosArrowUp className="sidebar-arrow" /> : <IoIosArrowDown className="sidebar-arrow" />}
        </div>
        {expanded.price && (
          <div className="sidebar-options">
            {PRICE.map((p) => (
              <label key={p} className="sidebar-checkbox">
                <input
                  type="checkbox"
                  checked={selectedPrice.includes(p)}
                  onChange={() => handleCheckboxChange(p, "price")}
                />
                {p}
              </label>
            ))}
          </div>
        )}
      </div>
      <hr className="faq-seperater" />

      {offerPct > 0 && (
        <div className="sidebar-offer">
          <h3 className="home-blog-title">{`Get ${offerPct}% Off ${offerCourse || "Courses"}!`}</h3>

          {offerFromRule && offerDaysLeft != null && offerDaysLeft >= 0 && (
            <p className="home-sub-text">
              {`Hurry! Sale Ends in ${offerDaysLeft} ${offerDaysLeft === 1 ? "Day" : "Days"}`}
            </p>
          )}

          <button
            className="home-start-button"
            onClick={() => {
              router.push("/discountdeals");
            }}
          >
            Start Today
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {isMobileView ? (
        <>
          <button className="home-start-button" onClick={() => setIsOpen(true)}>
            <LuListFilter style={{ marginBottom: "3px" }} /> Filter
          </button>
          {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}
          <div className={`sidebar-drawer ${isOpen ? "open" : ""}`}>
            <div className="category-drawer-header">
              <button className="filter-close-btn" onClick={() => setIsOpen(false)} aria-label="Close filters">
                ✕
              </button>
            </div>
            {sidebarContent}
          </div>
        </>
      ) : (
        sidebarContent
      )}
    </>
  );
};

export default Sidebar;
