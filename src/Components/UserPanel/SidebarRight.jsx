
import React, { useState, useEffect } from "react";
import axios from "axios";
import SidebarCard from "./SidebarCard";
import "./Course.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);



const SidebarRight = ({ filters, currentPage, cardsPerPage, onTotalCardsChange }) => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
const [discountRules, setDiscountRules] = useState([]);
const [country, setCountry] = useState('US');   
const [countdowns, setCountdowns] = useState({});
  const [currency, setCurrency] = useState('INR');
  const [fxFromUSD, setFxFromUSD] = useState(1);
  const fmt = (n) => (Math.round((Number(n) || 0) * 100) / 100).toLocaleString();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("https://api.test.hachion.co/courses/all");
        if (Array.isArray(response.data)) {
          setCourses(response.data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error.message);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;

    
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((c) => filters.categories.includes(c.courseCategory));
    }

    if (filters.levels && filters.levels.length > 0 && !filters.levels.includes("All Levels")) {
      filtered = filtered.filter((c) => filters.levels.includes(c.levels));
    }

    if (filters.price && filters.price.length > 0) {
      filtered = filtered.filter((c) => {
        const priceType = c.itotal > 0 ? "Paid" : "Free";
        return filters.price.includes(priceType);
      });
    }

    setFilteredCourses(filtered);
    if (onTotalCardsChange) {
      onTotalCardsChange(filtered.length);
    }
  }, [filters, courses, onTotalCardsChange]);

useEffect(() => {
  const detect = async () => {
    try {
      const geo = await axios.get('https://ipinfo.io/json?token=82aafc3ab8d25b');
      const cc = geo?.data?.country || 'US';
      setCountry(cc);
    } catch (e) {
      setCountry('US');
    }
  };
  detect();
}, []);


useEffect(() => {
  const fetchRules = async () => {
    try {
      const { data } = await axios.get('https://api.test.hachion.co/discounts-courses');
      setDiscountRules(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load discount rules', e);
      setDiscountRules([]);
    }
  };
  fetchRules();
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
  } else {
    const okE = e.isValid() ? !today.isAfter(e, "day") : true;
    return okE;
  }
};

const locale = Intl.DateTimeFormat().resolvedOptions().locale || 'en-US';
const regionNames = new Intl.DisplayNames([locale || 'en'], { type: 'region' });
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

const getRuleDiscountPct = (courseName, countryCode) => {
  if (!discountRules?.length) return 0;
  const userCountryTokens = expandUserCountry(countryCode);
  const courseKey = normalizeStr(courseName);
  let best = 0;

  for (const r of discountRules) {
    if ((r.status || "").toLowerCase() !== "active") continue;
    if (!inWindow(r.startDate, r.endDate)) continue;

    const courses = Array.isArray(r.courseNames) ? r.courseNames : [];
    const countries = Array.isArray(r.countryNames) ? r.countryNames : [];

    const courseOk =
      courses.some(c => normalizeStr(c) === courseKey) ||
      courses.some(c => normalizeStr(c) === "all");

    const countryOk =
      countries.some(c => {
        const tokens = expandRuleCountry(c);
        return tokens.some(t => userCountryTokens.has(t));
      }) ||
      countries.some(c => normalizeStr(c) === "all");

    if (courseOk && countryOk) {
      const pct = Number(r.discountPercentage || 0);
      if (pct > best) best = pct;
    }
  }
  return best;
};

const getActiveRuleFor = (courseName, countryCode) => {
  if (!discountRules?.length) return null;
  const userCountryTokens = expandUserCountry(countryCode);
  const courseKey = normalizeStr(courseName);

  for (const r of discountRules) {
    if ((r.status || "").toLowerCase() !== "active") continue;
    if (!inWindow(r.startDate, r.endDate)) continue;

    const courses = Array.isArray(r.courseNames) ? r.courseNames : [];
    const countries = Array.isArray(r.countryNames) ? r.countryNames : [];

    const courseOk =
      courses.some(c => normalizeStr(c) === courseKey) ||
      courses.some(c => normalizeStr(c) === "all");

    const countryOk =
      countries.some(c => {
        const tokens = expandRuleCountry(c);
        return tokens.some(t => userCountryTokens.has(t));
      }) ||
      countries.some(c => normalizeStr(c) === "all");

    if (courseOk && countryOk) return r; 
  }
  return null;
};

const getSaleEndsAt = (courseName, countryCode) => {
  const rule = getActiveRuleFor(courseName, countryCode);
  if (!rule) return null;
  const end = parseMDY(rule.endDate);
  if (!end.isValid()) return null;
  return end.endOf("day").toDate();
};

useEffect(() => {
  let stopped = false;

  const compute = () => {
    if (stopped) return;

    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const visible = filteredCourses.slice(indexOfFirstCard, indexOfLastCard);

    const next = {};
    visible.forEach((c) => {
      const endsAt = getSaleEndsAt(c.courseName, country);
      if (!endsAt) return;

      const diffMs = endsAt.getTime() - Date.now();
      if (diffMs <= 0) return;

      const totalSec = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSec / 86400);
      const hours = Math.floor((totalSec % 86400) / 3600);

      const pad = (n) => n.toString().padStart(2, "0");
      const label =
        days > 0
          ? `${days}d ${pad(hours)}h Left`
          : `${pad(hours)}h Left`;

      next[c.id ?? c.courseName] = label;
    });

    setCountdowns(next);
  };

  compute();
  const t = setInterval(compute, 1000);
  return () => {
    stopped = true;
    clearInterval(t);
  };
}, [filteredCourses, currentPage, cardsPerPage, country, discountRules]);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCourses.slice(indexOfFirstCard, indexOfLastCard);

  return (
    <div className="course-card-container">
      {currentCards.length > 0 ? (
        currentCards.map((course, index) => (
          <SidebarCard
            key={course.id || index}
            heading={course.courseName}
            image={`https://api.test.hachion.co/${course.courseImage}`}
            
            discountPercentage={
    (() => {
      const rulePct = getRuleDiscountPct(course.courseName, country);
      if (rulePct > 0) return rulePct;
      return country === 'IN'
        ? (course.idiscount != null ? Number(course.idiscount) : 0)
        : (course.discount  != null ? Number(course.discount)  : 0);
    })()
  }
            amount={
                (() => {
                  const isIN = country === 'IN';
                  const isUS = country === 'US';

                  const rawMrp = isIN ? course.iamount : course.amount;
                  const rawNow = isIN ? course.itotal  : course.total;

                  const mrpVal = isIN ? Number(rawMrp) : (Number(rawMrp) * (isUS ? 1 : fxFromUSD));
                  const nowVal = isIN ? Number(rawNow) : (Number(rawNow) * (isUS ? 1 : fxFromUSD));

                  const rulePct = getRuleDiscountPct(course.courseName, country);
                  const effectiveNow = rulePct > 0
                    ? mrpVal * (1 - rulePct / 100)
                    : nowVal;

                  return `${currency} ${fmt(effectiveNow)}`;
                })()
              }
              totalAmount={
                (() => {
                  const isIN = country === 'IN';
                  const isUS = country === 'US';
                  const rawMrp = isIN ? course.iamount : course.amount;
                  const mrpVal = isIN ? Number(rawMrp) : (Number(rawMrp) * (isUS ? 1 : fxFromUSD));
                  return `${fmt(mrpVal)}`;
                })()
              }
            level={course.levels}
            month={course.numberOfClasses}
            course_id={course.id}
            timeLeftLabel={countdowns[course.id ?? course.courseName] || ""}
          />
        ))
      ) : (
        <p style={{ paddingTop: "30px", paddingLeft: "20px" }}>No courses available</p>
      )}
    </div>
  );
};

export default SidebarRight;
