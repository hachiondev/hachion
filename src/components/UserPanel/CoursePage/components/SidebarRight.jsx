"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import SidebarCard from "../../SidebarCard";
import "../Course.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useAllCourses } from "@/Api/hooks/SitemapPageApi/useAllCourses";
import { API_BASE_URL } from "@/lib/apiBase";
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

const SkeletonCard = () => <div className="sidebar-card skeleton-card"></div>;

// Ported from the CRA app's
// src/Components/UserPanel/CoursePage/components/SidebarRight.jsx.
// Courses now come from the same useAllCourses("allCourses") React Query
// hook Sidebar.jsx uses (same queryKey → TanStack Query shares the one
// in-flight/cached request between the two sibling components instead of
// each firing its own /courses/all call) — previously this was a genuine
// duplicate request, flagged in the original CRA port as a known
// inefficiency. Trainers are still fetched separately here (a distinct
// endpoint no shared hook covers) and merged in exactly as before.
const SidebarRight = ({ filters, currentPage, cardsPerPage, onTotalCardsChange, initialCourses }) => {
  const { data: rawCourses = [], isLoading: loadingCourses } = useAllCourses("allCourses", initialCourses);
  const [trainers, setTrainers] = useState([]);
  const [discountRules, setDiscountRules] = useState([]);
  const [country, setCountry] = useState("US");
  const [countdowns, setCountdowns] = useState({});
  const [currency, setCurrency] = useState("INR");
  const [fxFromUSD, setFxFromUSD] = useState(1);
  const fmt = (n) => Math.round(Number(n) || 0).toLocaleString();
  const normalize = (s) => (s || "").toString().trim().toLowerCase();

  // Same merge logic as before, just re-run whenever the (now shared)
  // courses list or the trainers fetch settles, instead of inline in a
  // single combined fetch effect.
  const courses = useMemo(() => {
    if (!trainers.length) return rawCourses;
    return rawCourses.map((c) => {
      if (c.trainer) return c;
      const match = trainers.find((t) => normalize(t.course_name) === normalize(c.courseName));
      return match ? { ...c, trainer: match.trainer_name } : c;
    });
  }, [rawCourses, trainers]);
  const loading = loadingCourses;

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/trainers`);
        setTrainers(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching trainers:", error.message);
      }
    };
    fetchTrainers();
  }, []);

  // Pure derivation of the filtered list from filters/courses/country —
  // computed with useMemo instead of state+effect (no side effect other
  // than the notify-parent call below, which stays in its own effect).
  const filteredCourses = useMemo(() => {
    let filtered = courses;
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((c) => filters.categories.includes(c.courseCategory));
    }
    if (filters.levels && filters.levels.length > 0) {
      filtered = filtered.filter((c) => filters.levels.includes(c.level));
    }
    if (filters.price && filters.price.length > 0) {
      filtered = filtered.filter((c) => {
        const paidAmount = country === "IN" ? Number(c.itotal || 0) : Number(c.total || 0);
        const priceType = paidAmount > 0 ? "Paid" : "Free";
        return filters.price.includes(priceType);
      });
    }
    return filtered;
  }, [filters, courses, country]);

  useEffect(() => {
    if (onTotalCardsChange) {
      onTotalCardsChange(filteredCourses.length);
    }
  }, [filteredCourses, onTotalCardsChange]);

  useEffect(() => {
    (async () => {
      try {
        const geo = await axios.get("https://ipinfo.io/json?token=82aafc3ab8d25b");
        const cc = geo?.data?.country || "US";
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
          const exchangeResponse = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
          rates = exchangeResponse.data.rates;
          localStorage.setItem("fxRatesUSD", JSON.stringify({ t: Date.now(), rates }));
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

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/discounts-courses`);
        setDiscountRules(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load discount rules", e);
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

  // Intl.DisplayNames construction is measurably expensive — built once
  // (not per render/per countdown tick) since locale never changes during
  // the component's lifetime.
  const regionNames = useMemo(() => {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale || "en-US";
    return new Intl.DisplayNames([locale || "en"], { type: "region" });
  }, []);
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
  // getRuleDiscountPct/getActiveRuleFor were previously plain functions that
  // each looped over the full discountRules array from scratch — and were
  // called up to 3x per visible card (discountPercentage, amount, and again
  // every second from the countdown interval below), so with 9 cards this
  // was re-scanning discountRules dozens of times per second. countryCode is
  // always the current `country` state at every call site, so the whole
  // lookup can be precomputed once per [discountRules, country] change
  // instead. Preserves both original selection rules exactly, just computed
  // in one pass: discountPercentage is the *highest* pct among matching
  // rules (as before), while the rule used for the countdown end-date is
  // still the *first* matching rule in discountRules order (as before) —
  // these can legitimately be different rules if a course has more than one
  // active, country-matching discount at once, so they're tracked
  // separately rather than collapsed into a single "best" rule per course.
  const discountByCourse = useMemo(() => {
    const map = new Map();
    if (!discountRules?.length) return map;
    const userCountryTokens = expandUserCountry(country);
    const courseKeys = new Set(courses.map((c) => normalizeStr(c.courseName)));
    for (const r of discountRules) {
      if ((r.status || "").toLowerCase() !== "active") continue;
      if (!inWindow(r.startDate, r.endDate)) continue;
      const ruleCourses = Array.isArray(r.courseNames) ? r.courseNames : [];
      const countries = Array.isArray(r.countryNames) ? r.countryNames : [];
      const appliesToAllCourses = ruleCourses.some((c) => normalizeStr(c) === "all");
      const countryOk =
        countries.some((c) => {
          const tokens = expandRuleCountry(c);
          return tokens.some((t) => userCountryTokens.has(t));
        }) || countries.some((c) => normalizeStr(c) === "all");
      if (!countryOk) continue;
      const pct = Number(r.discountPercentage || 0);

      const applyTo = appliesToAllCourses
        ? courseKeys
        : new Set(ruleCourses.map((c) => normalizeStr(c)).filter((c) => courseKeys.has(c)));

      for (const courseKey of applyTo) {
        const existing = map.get(courseKey);
        if (!existing) {
          map.set(courseKey, { pct, firstRule: r });
        } else {
          existing.pct = Math.max(existing.pct, pct);
          // firstRule stays whichever rule was encountered first in
          // discountRules order — matches original getActiveRuleFor.
        }
      }
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountRules, country, courses]);
  const getRuleDiscountPct = (courseName) => discountByCourse.get(normalizeStr(courseName))?.pct || 0;
  const getActiveRuleFor = (courseName) => discountByCourse.get(normalizeStr(courseName))?.firstRule || null;
  const getSaleEndsAt = (courseName) => {
    const rule = getActiveRuleFor(courseName);
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
        const endsAt = getSaleEndsAt(c.courseName);
        if (!endsAt) return;
        const diffMs = endsAt.getTime() - Date.now();
        if (diffMs <= 0) return;
        const totalSec = Math.floor(diffMs / 1000);
        const days = Math.floor(totalSec / 86400);
        const hours = Math.floor((totalSec % 86400) / 3600);
        const pad = (n) => n.toString().padStart(2, "0");
        const label = days > 0 ? `${days}d ${pad(hours)}h Left` : `${pad(hours)}h Left`;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredCourses, currentPage, cardsPerPage, country, discountRules]);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCourses.slice(indexOfFirstCard, indexOfLastCard);

  return (
    <div className="course-card-container">
      {loading
        ? Array.from({ length: cardsPerPage }).map((_, i) => <SkeletonCard key={i} />)
        : currentCards.length > 0
        ? currentCards.map((course, index) => {
            // Computed once per card per render instead of the previous
            // duplicate getRuleDiscountPct() calls (one for
            // discountPercentage, one again for amount).
            const isIN = country === "IN";
            const isUS = country === "US";
            const rulePct = getRuleDiscountPct(course.courseName);
            const discountPercentage =
              rulePct > 0 ? rulePct : isIN ? Number(course.idiscount || 0) : Number(course.discount || 0);
            const rawMrp = isIN ? course.iamount : course.amount;
            const rawNow = isIN ? course.itotal : course.total;
            const mrpVal = isIN ? Number(rawMrp) : Number(rawMrp) * (isUS ? 1 : fxFromUSD);
            const nowVal = isIN ? Number(rawNow) : Number(rawNow) * (isUS ? 1 : fxFromUSD);
            const effectiveNow = rulePct > 0 ? mrpVal * (1 - rulePct / 100) : nowVal;

            return (
              <SidebarCard
                key={course.id || index}
                heading={course.courseName}
                courseCategory={course.courseCategory}
                image={`${API_BASE_URL}/${course.courseImage}`}
                priority={currentPage === 1 && index === 0}
                discountPercentage={discountPercentage}
                amount={`${currency} ${fmt(effectiveNow)}`}
                totalAmount={`${fmt(mrpVal)}`}
                level={course.level}
                trainer_name={course.trainer}
                month={course.numberOfClasses}
                course_id={course.id}
                timeLeftLabel={countdowns[course.id ?? course.courseName] || ""}
              />
            );
          })
        : (
            <p style={{ paddingTop: "30px", paddingLeft: "20px" }}>No courses available</p>
          )}
    </div>
  );
};

export default SidebarRight;
