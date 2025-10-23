import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarCard from "./SidebarCard";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

dayjs.extend(customParseFormat);

const countryToCurrencyMap = {
  IN: "INR", US: "USD", GB: "GBP", AU: "AUD", CA: "CAD", AE: "AED",
  JP: "JPY", EU: "EUR", TH: "THB", DE: "EUR", FR: "EUR", QA: "QAR",
  CN: "CNY", RU: "RUB", KR: "KRW", BR: "BRL", MX: "MXN", ZA: "ZAR", NL: "EUR",
};

export default function UserEnrolledCourses() {
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [discountRules, setDiscountRules] = useState([]);
  const [country, setCountry] = useState("US");
  const [currency, setCurrency] = useState("USD");
  const [fxFromUSD, setFxFromUSD] = useState(1);
  const [countdowns, setCountdowns] = useState({});
  const navigate = useNavigate();

  const fmt = (n) => (Math.round((Number(n) || 0) * 100) / 100).toLocaleString();
  const normalize = (s) => (s || "").toString().trim().toLowerCase();

  // --- Fetch enrolled courses ---
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("loginuserData"));
        const email = user?.email;
        if (!email) return;

        const [enrollRes, coursesRes, trainersRes] = await Promise.all([
          axios.get("https://api.test.hachion.co/enroll"),
          axios.get("https://api.test.hachion.co/courses/all"),
          axios.get("https://api.test.hachion.co/trainers"),
        ]);

        const allEnrollments = Array.isArray(enrollRes.data) ? enrollRes.data : [];
        const allCourses = Array.isArray(coursesRes.data) ? coursesRes.data : [];
        const allTrainers = Array.isArray(trainersRes.data) ? trainersRes.data : [];

        const userEnrollments = allEnrollments.filter(e => e.email === email);

        const merged = userEnrollments.map(e => {
          const course = allCourses.find(c => normalize(c.courseName) === normalize(e.course_name));
          const trainerObj = allTrainers.find(t => normalize(t.course_name) === normalize(e.course_name));
          return {
            ...e,
            ...course,
            trainer: course?.trainer || trainerObj?.trainer_name || "Hachion Expert",
          };
        });

        setCourses(merged);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
      }
    };
    fetchEnrollments();
  }, []);

  // --- Fetch discount rules ---
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const { data } = await axios.get("https://api.test.hachion.co/discounts-courses");
        setDiscountRules(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load discount rules", e);
        setDiscountRules([]);
      }
    };
    fetchRules();
  }, []);

  // --- Detect user location & currency ---
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

  // --- Discount helpers ---
  const parseMDY = (s) => dayjs(s, ["MM/DD/YYYY", "YYYY-MM-DD"], true);
  const inWindow = (start, end) => {
    const today = dayjs();
    const s = parseMDY(start);
    const e = parseMDY(end);
    const okS = s.isValid() ? !today.isBefore(s, "day") : true;
    const okE = e.isValid() ? !today.isAfter(e, "day") : true;
    return okS && okE;
  };

  const locale = Intl.DateTimeFormat().resolvedOptions().locale || "en-US";
  const regionNames = new Intl.DisplayNames([locale], { type: "region" });
  const expandRuleCountry = (token) => {
    if (!token) return [];
    if (/^[A-Za-z]{2}$/.test(token)) {
      const code = token.toUpperCase();
      const name = regionNames.of(code) || "";
      return [code.toLowerCase(), name.toLowerCase()];
    }
    return [token.toLowerCase()];
  };
  const expandUserCountry = (cc) => {
    const code = (cc || "").toUpperCase();
    const name = regionNames.of(code) || "";
    return new Set([code.toLowerCase(), name.toLowerCase()]);
  };

  const getRuleDiscountPct = (courseName, countryCode) => {
    if (!discountRules.length) return 0;
    const userCountryTokens = expandUserCountry(countryCode);
    const courseKey = normalize(courseName);
    let best = 0;

    discountRules.forEach(r => {
      if ((r.status || "").toLowerCase() !== "active") return;
      if (!inWindow(r.startDate, r.endDate)) return;

      const courseOk = Array.isArray(r.courseNames)
        ? r.courseNames.some(c => normalize(c) === courseKey || normalize(c) === "all")
        : false;

      const countryOk = Array.isArray(r.countryNames)
        ? r.countryNames.some(c => expandRuleCountry(c).some(t => userCountryTokens.has(t)) || normalize(c) === "all")
        : false;

      if (courseOk && countryOk) {
        const pct = Number(r.discountPercentage || 0);
        if (pct > best) best = pct;
      }
    });

    return best;
  };

  // --- Countdown for enrolled course demos ---
  useEffect(() => {
    let stopped = false;

    const computeCountdowns = () => {
      if (stopped) return;
      const next = {};
      courses.forEach(c => {
        const endDate = new Date(c.enroll_date);
        if (!endDate) return;

        const diffMs = endDate.getTime() - Date.now();
        if (diffMs <= 0) return;

        const totalSec = Math.floor(diffMs / 1000);
        const days = Math.floor(totalSec / 86400);
        const hours = Math.floor((totalSec % 86400) / 3600);
        const pad = (n) => n.toString().padStart(2, "0");
        next[c.id ?? c.courseName] = days > 0 ? `${days}d ${pad(hours)}h Left` : `${pad(hours)}h Left`;
      });
      setCountdowns(next);
    };

    computeCountdowns();
    const t = setInterval(computeCountdowns, 1000);
    return () => { stopped = true; clearInterval(t); };
  }, [courses]);

  return (
    <>
    <div className="courses-enrolled">
        <nav className="dashboard-nav">My Enrolled Courses</nav>
      </div>
      <div className="wishlist-container">
        {courses.length > 0 ? (
          <div className="wishlist-grid">
            {courses.map((course, index) => {
              const rulePct = getRuleDiscountPct(course.courseName, country);
              const isIN = country === "IN";
              const isUS = country === "US";

              const rawMrp = isIN ? course.iamount : course.amount;
              const rawNow = isIN ? course.itotal : course.total;
              const mrpVal = isIN ? Number(rawMrp) : Number(rawMrp) * (isUS ? 1 : fxFromUSD);
              const nowVal = isIN ? Number(rawNow) : Number(rawNow) * (isUS ? 1 : fxFromUSD);
              const effectiveNow = rulePct > 0 ? mrpVal * (1 - rulePct / 100) : nowVal;

              return (
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
                            level={course.level}
                            trainer_name={course.trainer} 
                            month={course.numberOfClasses}
                            course_id={course.id}
                            timeLeftLabel={countdowns[course.id ?? course.courseName] || ""}
                          />
              );
            })}
          </div>
        ) : (
          <p className="wishlist-empty">No enrolled courses found.</p>
        )}
      </div>

      <button className="explore-btn" onClick={() => navigate("/coursedetails")}>
        Explore All Courses
      </button>
    </>
  );
}
