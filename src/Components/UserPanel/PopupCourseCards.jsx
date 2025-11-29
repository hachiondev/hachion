import React, { useState, useEffect } from "react";
import "./Corporate.css";
import "./Blogs.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import DiscountCourseCard from "./DiscountCourseCard";
import "bootstrap/dist/css/bootstrap.min.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const countryToCurrencyMap = {
  IN: 'INR', US: 'USD', GB: 'GBP', AU: 'AUD', CA: 'CAD', AE: 'AED', JP: 'JPY', EU: 'EUR',
  TH: 'THB', DE: 'EUR', FR: 'EUR', QA: 'QAR', CN: 'CNY', RU: 'RUB', KR: 'KRW', BR: 'BRL',
  MX: 'MXN', ZA: 'ZAR', NL: 'EUR',
};

const DiscountCards = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerRow, setCardsPerRow] = useState(2);
  const [trendingCourses, setTrendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showIndicators, setShowIndicators] = useState(true);
  const [currency, setCurrency] = useState('INR');
  const [fxFromUSD, setFxFromUSD] = useState(1);
  const locale = Intl.DateTimeFormat().resolvedOptions().locale || 'en-US';
  const [country, setCountry] = useState('IN');
  const [discountRules, setDiscountRules] = useState([]);
  const [countdowns, setCountdowns] = useState({});

  const fmt = (n) => (Math.round((Number(n) || 0) * 100) / 100).toLocaleString();

  const handleResize = () => {
  if (window.innerWidth < 576) setCardsPerRow(1);
  else if (window.innerWidth < 992) setCardsPerRow(2);
  else setCardsPerRow(2);

  // 👇 Add this line
  setShowIndicators(window.innerWidth >= 768); // show only from tablet width and up
};

  useEffect(() => {
  (async () => {
    setLoading(true);
    try {
      
      const allCoursesResponse = await axios.get("https://api.hachion.co/courses/summary");
      const trainersResponse   = await axios.get("https://api.hachion.co/trainers");

      const rows = Array.isArray(allCoursesResponse.data) ? allCoursesResponse.data : [];

      
      const courses = rows.map((row) => ({
        id: row[0],
        courseName: row[1],
        courseImage: row[2],
        numberOfClasses: row[3],
        level: row[4],
        amount: row[5],
        discount: row[6],
        total: row[7],
        iamount: row[8],
        idiscount: row[9],
        itotal: row[10],
        courseCategory: row[11],
      }));

      const trainers = trainersResponse.data || [];


      const merged = courses.map((c) => {
        const matchedTrainer = trainers.find(
          t =>
            (t.course_name || '').trim().toLowerCase() ===
            (c.courseName   || '').trim().toLowerCase()
        );
        return {
          ...c,
          trainerName: matchedTrainer ? matchedTrainer.trainer_name : "",
        };
      });

      setTrendingCourses(merged);
    } catch (e) {
      console.error("Error fetching courses/trainers:", e);
      setTrendingCourses([]);
    } finally {
      setLoading(false);
    }
  })();
}, []);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) setCardsPerRow(1);
      else if (window.innerWidth < 992) setCardsPerRow(2);
      else setCardsPerRow(2);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const geoResponse = await axios.get('https://ipinfo.io/json?token=82aafc3ab8d25b');
        const cc = geoResponse?.data?.country || 'US';
        setCountry(cc);

        const cur = countryToCurrencyMap[cc] || 'USD';
        setCurrency(cur);

        if (cc === 'IN' || cc === 'US') { setFxFromUSD(1); return; }

        const cached = JSON.parse(localStorage.getItem('fxRatesUSD') || 'null');
        const fresh = cached && (Date.now() - cached.t) < 6 * 60 * 60 * 1000;
        let rates = cached?.rates;

        if (!fresh) {
          const exchangeResponse = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
          rates = exchangeResponse.data.rates;
          localStorage.setItem('fxRatesUSD', JSON.stringify({ t: Date.now(), rates }));
        }

        setFxFromUSD(rates[cur] || 1);
      } catch (e) {
        console.error('Currency detection/FX failed', e);
        setCountry('US');
        setCurrency('USD');
        setFxFromUSD(1);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("https://api.hachion.co/discounts-courses");
        setDiscountRules(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load discount rules", e);
        setDiscountRules([]);
      }
    })();
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

  const keyOf = (c) => (c.id ?? c.courseName);

const getTimeLeftSeconds = (course) => {
  const endsAt = getSaleEndsAt(course.courseName, country);
  if (!endsAt) return Infinity;
  const diffMs = endsAt.getTime() - Date.now();
  if (diffMs <= 0) return Infinity;
  return Math.floor(diffMs / 1000);
};

// ✅ Stable sale end timestamp (used for ordering so cards don't reshuffle every second)
const getSaleEndsAtMs = (courseName, countryCode) => {
  const endsAt = getSaleEndsAt(courseName, countryCode);
  return endsAt ? endsAt.getTime() : Infinity;
};

const getPerCourseDiscountPct = (course) => {
  const pct = country === 'IN'
    ? (course.idiscount != null ? Number(course.idiscount) : 0)
    : (course.discount  != null ? Number(course.discount)  : 0);
  return isNaN(pct) ? 0 : pct;
};
// ✅ Use stable sale-end timestamp so order doesn't change every second
const withRuleActive = trendingCourses
  .map((c) => ({
    course: c,
    endMs: getSaleEndsAtMs(c.courseName, country),
  }))
  .filter((x) => x.endMs !== Infinity)      // only courses with an active rule
  .sort((a, b) => a.endMs - b.endMs)        // earliest ending deal first
  .map((x) => x.course);

const seen = new Set(withRuleActive.map((c) => keyOf(c)));

const withPerCourseDiscount = trendingCourses
  .filter((c) => !seen.has(keyOf(c)))
  .map((c) => ({ course: c, pct: getPerCourseDiscountPct(c) }))
  .filter((x) => x.pct > 0)
  .sort((a, b) => b.pct - a.pct)
  .map((x) => x.course);

const orderedCourses = [...withRuleActive, ...withPerCourseDiscount];


const totalPages = Math.max(1, orderedCourses.length - cardsPerRow + 1);
const startIndex = currentPage;
const currentCourses = orderedCourses.slice(startIndex, startIndex + cardsPerRow);

  const goToNext = () => {
  setCurrentPage((prev) => {
    const next = prev + 1;
    return next >= totalPages ? 0 : next;
  });
};

const goToPrev = () => {
  setCurrentPage((prev) => {
    const next = prev - 1;
    return next < 0 ? totalPages - 1 : next;
  });
};

  useEffect(() => {
  let stopped = false;
  const compute = () => {
    if (stopped) return;
    const next = {};
    currentCourses.forEach((c) => {
      const key = c.id ?? c.courseName;
      const endsAt = getSaleEndsAt(c.courseName, country);
      if (!endsAt) return;
      const diffMs = endsAt.getTime() - Date.now();
      if (diffMs <= 0) return;

      const totalSec = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSec / 86400);
      const hours = Math.floor((totalSec % 86400) / 3600);

      const pad = (n) => n.toString().padStart(2, "0");
      const label = days > 0
        ? `${days}d ${pad(hours)}h Left`
        : `${pad(hours)}h Left`;

      next[key] = label;
    });
    setCountdowns(next);
  };
  compute();
  const t = setInterval(compute, 1000);
  return () => { stopped = true; clearInterval(t); };
}, [currentCourses, country, discountRules]);

  const handleCardClick = (course) => {
    if (!course?.courseName) return;
    const courseSlug = course.courseName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/coursedetails/${courseSlug}`);
  };

  return (
    <div className="position-relative text-center">
      {/* Left Arrow */}
      <FaAngleLeft className="custom-cards-arrow left-cards-arrow" onClick={goToPrev} />
      {/* Right Arrow */}
      <FaAngleRight className="custom-cards-arrow right-cards-arrow" onClick={goToNext} />

      <div className="d-flex justify-content-center gap-3 flex-wrap">
        {loading
          ? Array.from({ length: cardsPerRow }).map((_, idx) => (
              <div className="skeleton-card" key={idx}></div>
            ))
          : currentCourses.map((course, idx) => (
              <DiscountCourseCard
                key={idx}
                heading={course.courseName}
                month={course.numberOfClasses}
                image={`https://api.hachion.co/${course.courseImage}`}
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
                trainer_name={course.trainerName}
                level={course.level}
                onClick={() => handleCardClick(course)}
                className="course-card"
                timeLeftLabel={countdowns[course.id ?? course.courseName] || ""}
              />
            ))}
      </div>

      {showIndicators && (
      <div className="page-indicators">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <span
            key={idx}
            className={`indicator-dot ${currentPage === idx ? "active" : ""}`}
            onClick={() => setCurrentPage(idx)}
          ></span>
        ))}
      </div>
    )}
    </div>
  );
};

export default DiscountCards;
