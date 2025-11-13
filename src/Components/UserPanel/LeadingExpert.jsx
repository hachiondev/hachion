import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CourseCard from "./CourseCard";
import CardsPagination from "./CardsPagination";
import "./Corporate.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const countryToCurrencyMap = {
  IN: "INR",
  US: "USD",
  GB: "GBP",
  AU: "AUD",
  CA: "CAD",
  AE: "AED",
  JP: "JPY",
  EU: "EUR",
  TH: "THB",
  DE: "EUR",
  FR: "EUR",
  QA: "QAR",
  CN: "CNY",
  RU: "RUB",
  KR: "KRW",
  BR: "BRL",
  MX: "MXN",
  ZA: "ZAR",
  NL: "EUR",
};

const LeadingExpert = () => {
  const navigate = useNavigate();
  const [courseCards, setCourseCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(4);
  const [loading, setLoading] = useState(true);
  const [discountRules, setDiscountRules] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const [currency, setCurrency] = useState("INR");
  const [country, setCountry] = useState("IN");
  const [fxFromUSD, setFxFromUSD] = useState(1);

  const locale = Intl.DateTimeFormat().resolvedOptions().locale || "en-US";
  const fmt = (n) =>
    (Math.round((Number(n) || 0) * 100) / 100).toLocaleString();

useEffect(() => {
  const fetchCourses = async () => {
    try {
      setLoading(true);

      const [corporateRes, allCoursesRes, trainersRes] = await Promise.all([
        axios.get("https://api.test.hachion.co/corporatecourse"),
        axios.get("https://api.test.hachion.co/courses/all"),
        axios.get("https://api.test.hachion.co/trainers"),
      ]);

      const activeCorporateCourses = (corporateRes.data || []).filter(
        (item) => item.status === true
      );

      const allCourses = allCoursesRes.data || [];
      const allTrainers = trainersRes.data || [];

      const trainerByCourse = new Map(
        allTrainers.map((t) => [
          (t.course_name || "").trim().toLowerCase(),
          t.trainer_name || "",
        ])
      );

      const combinedCourses = activeCorporateCourses.map((corpCourse) => {
        const key = (corpCourse.course_name || "").trim().toLowerCase();

        const matchedCourse = allCourses.find(
          (course) =>
            (course.courseName || "").trim().toLowerCase() === key
        );

        const trainerName = trainerByCourse.get(key) || "";

        return {
          ...(matchedCourse || {}),
          courseName: corpCourse.course_name, 
          image: matchedCourse
            ? `https://api.test.hachion.co/${matchedCourse.courseImage}`
            : "",
          id: matchedCourse ? matchedCourse.id : Math.random(),
          amount: matchedCourse ? matchedCourse.amount : 0,

          numberOfClasses: matchedCourse ? matchedCourse.numberOfClasses : "",

          trainerName,
        };
      });

      setCourseCards(combinedCourses);
    } catch (error) {
      console.error("Error fetching corporate courses:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchCourses();
}, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          "https://api.test.hachion.co/discounts-courses"
        );
        setDiscountRules(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load discount rules", e);
        setDiscountRules([]);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const geoResponse = await axios.get(
          "https://ipinfo.io/json?token=82aafc3ab8d25b"
        );
        const cc = geoResponse?.data?.country || "US";
        setCountry(cc);

        const cur = countryToCurrencyMap[cc] || "USD";
        setCurrency(cur);

        if (cc === "IN" || cc === "US") {
          setFxFromUSD(1);
          return;
        }

        const cached = JSON.parse(localStorage.getItem("fxRatesUSD") || "null");
        const fresh = cached && Date.now() - cached.t < 6 * 60 * 60 * 1000;
        let rates = cached?.rates;

        if (!fresh) {
          const exchangeResponse = await axios.get(
            "https://api.exchangerate-api.com/v4/latest/USD"
          );
          rates = exchangeResponse.data.rates;
          localStorage.setItem(
            "fxRatesUSD",
            JSON.stringify({ t: Date.now(), rates })
          );
        }

        setFxFromUSD(rates[cur] || 1);
      } catch (e) {
        console.error("Currency detection/FX failed", e);
        setCountry("US");
        setCurrency("USD");
        setFxFromUSD(1);
      }
    })();
  }, []);

  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, window.scrollY);
  };

  
  const parseMDY = (s) => dayjs(s, ["MM/DD/YYYY", "YYYY-MM-DD"], true);

  const inWindow = (start, end) => {
    const today = dayjs();
    const s = parseMDY(start);
    const e = parseMDY(end);
    const okS = s.isValid() ? !today.isBefore(s, "day") : true;
    const okE = e.isValid() ? !today.isAfter(e, "day") : true;
    return okS && okE;
  };

  const normalizeStr = (s) => (s || "").toString().trim().toLowerCase();
  const regionNames = new Intl.DisplayNames([locale || "en"], {
    type: "region",
  });

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
        courses.some((c) => normalizeStr(c) === courseKey) ||
        courses.some((c) => normalizeStr(c) === "all");
      const countryOk =
        countries.some((c) => {
          const tokens = expandRuleCountry(c);
          return tokens.some((t) => userCountryTokens.has(t));
        }) ||
        countries.some((c) => normalizeStr(c) === "all");
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
        courses.some((c) => normalizeStr(c) === courseKey) ||
        courses.some((c) => normalizeStr(c) === "all");
      const countryOk =
        countries.some((c) => {
          const tokens = expandRuleCountry(c);
          return tokens.some((t) => userCountryTokens.has(t));
        }) ||
        countries.some((c) => normalizeStr(c) === "all");
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
      const next = {};
      courseCards.forEach((c) => {
        const key = c.id ?? c.courseName;
        const endsAt = getSaleEndsAt(c.courseName, country);
        if (!endsAt) return;
        const diffMs = endsAt.getTime() - Date.now();
        if (diffMs <= 0) return;
        const totalSec = Math.floor(diffMs / 1000);
        const days = Math.floor(totalSec / 86400);
        const hours = Math.floor((totalSec % 86400) / 3600);
        const pad = (n) => n.toString().padStart(2, "0");
        const label =
          days > 0 ? `${days}d ${pad(hours)}h Left` : `${pad(hours)}h Left`;
        next[key] = label;
      });
      setCountdowns(next);
    };
    compute();
    const t = setInterval(compute, 1000);
    return () => {
      stopped = true;
      clearInterval(t);
    };
  }, [courseCards, country, discountRules]);

  const handleCardClick = (course) => {
    if (!course?.courseName) return;
    const slug = course.courseName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/coursedetails/${slug}`);
  };

  return (
    <div className="training-events container">
      <div className="training-title-head">
        <div className="home-spacing">
          <h2 className="association-head">Future-Ready Learning Paths</h2>
          <p className="association-head-tag">
            Explore our Corporate Courses designed to empower professionals and
            boost your team’s capabilities.
          </p>
        </div>

        <div className="card-pagination-container">
          <CardsPagination
            currentPage={currentPage}
            totalCards={courseCards.length}
            cardsPerPage={cardsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <div className="training-card-holder">
        {loading ? (
          Array.from({ length: cardsPerPage }).map((_, i) => (
            <div className="skeleton-card" key={i}></div>
          ))
        ) : courseCards.length > 0 ? (
          courseCards
            .slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)
            .map((course, index) => {
              const priceInCurrency = (course.amount / fxFromUSD).toFixed(2);
              return (
                <CourseCard
                  key={index}
                  heading={course.courseName}
                  image={course.image}
                  level={course.level}
                  month={course.numberOfClasses}
                  onClick={() => handleCardClick(course)}
                course_id={course.id}
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

      const rawMrp   = isIN ? course.iamount : course.amount; 
      const rawNow   = isIN ? course.itotal  : course.total;  

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
                trainer_name={course.trainerName}
                 
                  timeLeftLabel={
                    countdowns[course.id ?? course.courseName] || ""
                  }
                />
              );
            })
        ) : (
          <p>No corporate courses available.</p>
        )}
      </div>
    </div>
  );
};

export default LeadingExpert;
