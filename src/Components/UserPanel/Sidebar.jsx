
import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { LuListFilter } from "react-icons/lu";
import { useLocation, useNavigate } from 'react-router-dom';
import "./Course.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useCategories } from "../../Api/hooks/SitemapPageApi/useCategories";
import Loader from "./Loader/Loader";
import { useAllCourses } from "../../Api/hooks/SitemapPageApi/useAllCourses";
import { useGeoData } from "../../Api/hooks/HomePageApi/TrendingApi/useGeoData";
import { useDiscountRules } from "../../Api/hooks/HomePageApi/TrendingApi/useDiscountRules";
dayjs.extend(customParseFormat);

const Sidebar = ({ onFilterChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const preSelectedCategory = location.state?.selectedCategory || null;
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState(["All Levels"]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [expanded, setExpanded] = useState({
    category: true,
    level: true,
    price: true,
  });
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 480);
  const [isOpen, setIsOpen] = useState(false);
  const LEVELS = ["All Levels", "Beginner", "Intermediate", "Expert"];
  const PRICE = ["Free", "Paid"];
  const [offerPct, setOfferPct] = useState(0);
  const [offerCourse, setOfferCourse] = useState("");
  const [offerDaysLeft, setOfferDaysLeft] = useState(null);
  const [offerFromRule, setOfferFromRule] = useState(false);
  const { data: categories = [], isLoading: loadingCategories, error: categoryError } = useCategories();
  const { data: courses = [], isLoading: loadingCourses, error: coursesError } = useAllCourses();
  const { data: geoData, isLoading: loadingCountry, error: countryError } = useGeoData();
  const country = geoData?.country || "US";
  const { data: discountRules = [] } = useDiscountRules();

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      const first = categories[0].name;

      setSelectedCategories([first]);

      onFilterChange({
        categories: [first],
        levels: selectedLevels.includes("All Levels") ? [] : selectedLevels,
        price: selectedPrice,
      });
    }
  }, [categories]);

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
      updated = selectedPrice.includes(value)
        ? selectedPrice.filter((p) => p !== value)
        : [...selectedPrice, value];
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

  useEffect(() => {
    onFilterChange({
      categories: selectedCategories,
      levels: [],
      price: selectedPrice,
    });

  }, []);

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

  const locale = Intl.DateTimeFormat().resolvedOptions().locale || "en-US";
  const regionNames = new Intl.DisplayNames([locale || "en"], { type: "region" });
  const normalizeStr = (s) => (s || "").toString().trim().toLowerCase();

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
  useEffect(() => {

    const userCountryTokens = expandUserCountry(country);
    let bestRule = null;
    let bestPct = 0;

    for (const r of discountRules) {
      if ((r?.status || "").toLowerCase() !== "active") continue;
      if (!inWindow(r.startDate, r.endDate)) continue;

      const countries = Array.isArray(r.countryNames) ? r.countryNames : [];
      const countryOk =
        countries.some(c => {
          const tokens = expandRuleCountry(c);
          return tokens.some(t => userCountryTokens.has(t));
        }) || countries.some(c => normalizeStr(c) === "all");

      if (!countryOk) continue;

      const pct = Number(r.discountPercentage || 0);
      if (pct > bestPct) {
        bestPct = pct;
        bestRule = r;
      }
    }

    if (bestRule && bestPct > 0) {

      const list = Array.isArray(bestRule.courseNames) ? bestRule.courseNames : [];
      const firstSpecific =
        list.find(n => n && normalizeStr(n) !== "all") || "All Courses";

      const end = parseMDY(bestRule.endDate);
      const daysLeft = end.isValid()
        ? Math.max(0, end.endOf("day").diff(dayjs(), "day"))
        : null;

      setOfferPct(bestPct);
      setOfferCourse(firstSpecific);
      setOfferDaysLeft(daysLeft);
      setOfferFromRule(true);
      return;
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
      setOfferPct(best.pct);
      setOfferCourse(best.course.courseName || "");
      setOfferDaysLeft(null);
      setOfferFromRule(false);
    } else {
      setOfferPct(0);
      setOfferCourse("");
      setOfferDaysLeft(null);
      setOfferFromRule(false);
    }

  }, [discountRules, courses, country]);

  useEffect(() => {
  if (preSelectedCategory) {
    setSelectedCategories([preSelectedCategory]);

    onFilterChange({
      categories: [preSelectedCategory],
      levels: [],
      price: [],
    });
  }
}, [preSelectedCategory]);


  if (loadingCategories || loadingCourses || loadingCountry) {
    return (
      <Loader/>
    );
  }

  // ❗ Error UI
  if (categoryError || coursesError || countryError) {
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
          {expanded.category ? (
            <IoIosArrowUp className="sidebar-arrow" />
          ) : (
            <IoIosArrowDown className="sidebar-arrow" />
          )}
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
          {expanded.level ? (
            <IoIosArrowUp className="sidebar-arrow" />
          ) : (
            <IoIosArrowDown className="sidebar-arrow" />
          )}
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
          {expanded.price ? (
            <IoIosArrowUp className="sidebar-arrow" />
          ) : (
            <IoIosArrowDown className="sidebar-arrow" />
          )}
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
      {/* <div className="sidebar-offer">
      <h3 className="home-blog-title">Get 50% Off Development Courses!</h3>
      <p className="home-sub-text">Hurry! Sale Ends in 2 Days</p>
      <button className="home-start-button" onClick={() => {navigate("/discountdeals");}}>Start Today</button>
      </div> */}
      {offerPct > 0 && (
        <div className="sidebar-offer">
          <h3 className="home-blog-title">
            {`Get ${offerPct}% Off ${offerCourse || "Courses"}!`}
          </h3>

          {offerFromRule && offerDaysLeft != null && offerDaysLeft >= 0 && (
            <p className="home-sub-text">
              {`Hurry! Sale Ends in ${offerDaysLeft} ${offerDaysLeft === 1 ? "Day" : "Days"}`}
            </p>
          )}

          <button
            className="home-start-button"
            onClick={() => { navigate("/discountdeals"); }}
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
            <LuListFilter style={{ marginBottom: '3px' }} /> Filter
          </button>
          {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}
          <div className={`sidebar-drawer ${isOpen ? "open" : ""}`}>
            <div className="category-drawer-header">
              {/* <span>Filters</span> */}
              <button className="filter-close-btn" onClick={() => setIsOpen(false)}>✕</button>
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

