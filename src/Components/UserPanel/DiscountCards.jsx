import React, { useState, useEffect } from "react";
import "./Corporate.css";
import "./Blogs.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import DiscountCourseCard from "./DiscountCourseCard";
import "bootstrap/dist/css/bootstrap.min.css";
import Nodiscount from "../../Assets/nodiscount.webp";
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

const DiscountCards = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerRow, setCardsPerRow] = useState(2);
  const [trendingCourses, setTrendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [currency, setCurrency] = useState("INR");
  const [fxFromUSD, setFxFromUSD] = useState(1);
  const locale = Intl.DateTimeFormat().resolvedOptions().locale || "en-US";
  const [country, setCountry] = useState("IN");
  const [discountRules, setDiscountRules] = useState([]);
  const [countdowns, setCountdowns] = useState({});

  const fmt = (n) =>
    (Math.round((Number(n) || 0) * 100) / 100).toLocaleString();

  // ---------------------------------------------------
  // FIXED: Only ONE resize listener
  // ---------------------------------------------------
  useEffect(() => {
    const updateCards = () => {
      if (window.innerWidth < 576) setCardsPerRow(1);
      else setCardsPerRow(2);
    };
    updateCards();
    window.addEventListener("resize", updateCards);
    return () => window.removeEventListener("resize", updateCards);
  }, []);

  // ---------------------------------------------------
  // LOAD COURSES + TRAINERS
  // ---------------------------------------------------
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const allCoursesResponse = await axios.get(
          "https://api.test.hachion.co/courses/summary"
        );
        const trainersResponse = await axios.get(
          "https://api.test.hachion.co/trainers"
        );

        const rows = Array.isArray(allCoursesResponse.data)
          ? allCoursesResponse.data
          : [];

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
            (t) =>
              (t.course_name || "").trim().toLowerCase() ===
              (c.courseName || "").trim().toLowerCase()
          );
          return { ...c, trainerName: matchedTrainer?.trainer_name || "" };
        });

        setTrendingCourses(merged);
      } catch (err) {
        console.error("Error fetching:", err);
        setTrendingCourses([]);
      }
      setLoading(false);
    })();
  }, []);

  // ---------------------------------------------------
  // CURRENCY + GEO LOCATION
  // ---------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        const geo = await axios.get(
          "https://ipinfo.io/json?token=82aafc3ab8d25b"
        );
        const cc = geo?.data?.country || "US";
        setCountry(cc);

        const cur = countryToCurrencyMap[cc] || "USD";
        setCurrency(cur);

        if (cc === "IN" || cc === "US") {
          setFxFromUSD(1);
          return;
        }

        const exch = await axios.get(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        setFxFromUSD(exch.data.rates[cur] || 1);
      } catch (_) {
        setCurrency("USD");
        setFxFromUSD(1);
      }
    })();
  }, []);

  // ---------------------------------------------------
  // DISCOUNT RULES
  // ---------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          "https://api.test.hachion.co/discounts-courses"
        );
        setDiscountRules(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Rule load fail:", err);
      }
    })();
  }, []);

  // Helpers
  const parseMDY = (s) => dayjs(s, ["MM/DD/YYYY", "YYYY-MM-DD"], true);

  const inWindow = (start, end) => {
    const today = dayjs();
    const s = parseMDY(start);
    const e = parseMDY(end);
    return (
      (!s.isValid() || !today.isBefore(s, "day")) &&
      (!e.isValid() || !today.isAfter(e, "day"))
    );
  };

  const normalizeStr = (s) => (s || "").trim().toLowerCase();

  const regionNames = new Intl.DisplayNames([locale], { type: "region" });

  const expandRuleCountry = (token) => {
    if (!token) return [];
    const t = token.trim();
    if (/^[A-Za-z]{2}$/.test(t)) {
      const code = t.toUpperCase();
      const name = regionNames.of(code) || "";
      return [normalizeStr(code), normalizeStr(name)];
    }
    return [normalizeStr(t)];
  };

  const expandUserCountry = (cc) => {
    const code = cc.toUpperCase();
    const name = regionNames.of(code) || "";
    return new Set([normalizeStr(code), normalizeStr(name)]);
  };

  const getActiveRuleFor = (courseName, countryCode) => {
    const courseKey = normalizeStr(courseName);
    const userTokens = expandUserCountry(countryCode);

    for (const r of discountRules) {
      if ((r.status || "").toLowerCase() !== "active") continue;
      if (!inWindow(r.startDate, r.endDate)) continue;

      const courses = r.courseNames || [];
      const countries = r.countryNames || [];

      const courseOk =
        courses.some((c) => normalizeStr(c) === courseKey) ||
        courses.some((c) => normalizeStr(c) === "all");

      const countryOk =
        countries.some((c) =>
          expandRuleCountry(c).some((k) => userTokens.has(k))
        ) ||
        countries.some((c) => normalizeStr(c) === "all");

      if (courseOk && countryOk) return r;
    }

    return null;
  };

  const getSaleEndsAt = (courseName, countryCode) => {
    const rule = getActiveRuleFor(courseName, countryCode);
    if (!rule) return null;
    const end = parseMDY(rule.endDate);
    return end.isValid() ? end.endOf("day").toDate() : null;
  };

  const getRuleDiscountPct = (courseName, countryCode) => {
    let best = 0;
    const courseKey = normalizeStr(courseName);
    const userTokens = expandUserCountry(countryCode);

    for (const r of discountRules) {
      if ((r.status || "").toLowerCase() !== "active") continue;
      if (!inWindow(r.startDate, r.endDate)) continue;

      const courses = r.courseNames || [];
      const countries = r.countryNames || [];

      const courseOk =
        courses.some((c) => normalizeStr(c) === courseKey) ||
        courses.some((c) => normalizeStr(c) === "all");

      const countryOk =
        countries.some((c) =>
          expandRuleCountry(c).some((k) => userTokens.has(k))
        ) ||
        countries.some((c) => normalizeStr(c) === "all");

      if (courseOk && countryOk) {
        best = Math.max(best, Number(r.discountPercentage || 0));
      }
    }
    return best;
  };

  // ---------------------------------------------------
  // ORDERED COURSES (ACTIVE DISCOUNT FIRST)
  // ---------------------------------------------------
  const orderedCourses = trendingCourses
    .map((c) => ({
      course: c,
      endMs: getSaleEndsAt(c.courseName, country)?.getTime() || Infinity,
    }))
    .filter((x) => x.endMs !== Infinity)
    .sort((a, b) => a.endMs - b.endMs)
    .map((x) => x.course);

  // ---------------------------------------------------
  // PAGINATION (BUG FREE)
  // ---------------------------------------------------
  const totalPages = Math.max(1, orderedCourses.length - cardsPerRow + 1);

  const goToNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const goToPrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const startIndex = currentPage;
  const currentCourses = orderedCourses.slice(
    startIndex,
    startIndex + cardsPerRow
  );

  // ---------------------------------------------------
  // COUNTDOWN TIMER
  // ---------------------------------------------------
  useEffect(() => {
    const t = setInterval(() => {
      const next = {};
      currentCourses.forEach((c) => {
        const endsAt = getSaleEndsAt(c.courseName, country);
        if (!endsAt) return;
        const diff = endsAt.getTime() - Date.now();
        if (diff <= 0) return;

        const sec = Math.floor(diff / 1000);
        const days = Math.floor(sec / 86400);
        const hours = Math.floor((sec % 86400) / 3600);
        const pad = (n) => n.toString().padStart(2, "0");

        next[c.id] =
          days > 0 ? `${days}d ${pad(hours)}h Left` : `${pad(hours)}h Left`;
      });
      setCountdowns(next);
    }, 1000);

    return () => clearInterval(t);
  }, [currentCourses, country, discountRules]);

  const handleCardClick = (course) => {
    const slug = course.courseName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/coursedetails/${slug}`);
  };

  return (
    <div className="position-relative text-center">

      {/* ARROWS WITH DISABLE LOGIC */}
      {orderedCourses.length > cardsPerRow && (
        <>
          <FaAngleLeft
            className={`custom-cards-arrow left-cards-arrow ${
              currentPage === 0 ? "disabled-arrow" : ""
            }`}
            onClick={currentPage === 0 ? null : goToPrev}
          />

          <FaAngleRight
            className={`custom-cards-arrow right-cards-arrow ${
              currentPage >= totalPages - 1 ? "disabled-arrow" : ""
            }`}
            onClick={currentPage >= totalPages - 1 ? null : goToNext}
          />
        </>
      )}

      <div className="d-flex justify-content-center gap-3 flex-wrap">
        {loading &&
          Array.from({ length: cardsPerRow }).map((_, idx) => (
            <div className="skeleton-card" key={idx}></div>
          ))}

        {!loading && orderedCourses.length === 0 && (
          <div className="no-discounts-msg text-center py-4 d-flex flex-column align-items-center">
            <img
              src={Nodiscount}
              alt="No discounts"
              className="no-discount-image mb-3"
              style={{
                width: "180px",
                height: "auto",
                objectFit: "contain",
              }}
            />
            <h5>No discounts available right now</h5>
          </div>
        )}

        {!loading &&
          orderedCourses.length > 0 &&
          currentCourses.map((course, idx) => {
            const rulePct = getRuleDiscountPct(course.courseName, country);

            const isIN = country === "IN";
            const isUS = country === "US";

            const rawMrp = isIN ? course.iamount : course.amount;
            const rawNow = isIN ? course.itotal : course.total;

            const mrpVal = isIN
              ? Number(rawMrp)
              : Number(rawMrp) * (isUS ? 1 : fxFromUSD);

            const effectiveNow = mrpVal * (1 - rulePct / 100);

            return (
              <DiscountCourseCard
                key={idx}
                heading={course.courseName}
                month={course.numberOfClasses}
                image={`https://api.test.hachion.co/${course.courseImage}`}
                course_id={course.id}
                discountPercentage={rulePct}
                amount={`${currency} ${fmt(effectiveNow)}`}
                totalAmount={`${fmt(mrpVal)}`}
                trainer_name={course.trainerName}
                level={course.level}
                onClick={() => handleCardClick(course)}
                timeLeftLabel={countdowns[course.id] || ""}
              />
            );
          })}
      </div>

      {/* INDICATORS */}
      {orderedCourses.length > 1 && (
        <div className="page-indicators">
          {Array.from({ length: totalPages }).map((_, i) => (
            <span
              key={i}
              className={`indicator-dot ${currentPage === i ? "active" : ""}`}
              onClick={() => setCurrentPage(i)}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscountCards;
