import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TeensCard from './TeensCard';
import CardsPagination from './CardsPagination';
import './Home.css';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const countryToCurrencyMap = {
  IN: 'INR',  US: 'USD',  GB: 'GBP',  AU: 'AUD',  CA: 'CAD',  AE: 'AED',  JP: 'JPY',  EU: 'EUR',
  TH: 'THB',  DE: 'EUR',  FR: 'EUR',  QA: 'QAR',  CN: 'CNY',  RU: 'RUB',  KR: 'KRW',  BR: 'BRL',
  MX: 'MXN',  ZA: 'ZAR',  NL: 'EUR',
};

const TeensEvents = () => {
  const navigate = useNavigate();
  const [summerCourses, setSummerCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(4);
const [currency, setCurrency] = useState('INR');
const [fx, setFx] = useState(1); 
const locale = Intl.DateTimeFormat().resolvedOptions().locale || 'en-US';
const [discountRules, setDiscountRules] = useState([]);
const [country, setCountry] = useState('IN');      
const [fxFromUSD, setFxFromUSD] = useState(1);   
const fmt = (n) => (Math.round((Number(n) || 0) * 100) / 100).toLocaleString(); 
const [countdowns, setCountdowns] = useState({});

  useEffect(() => {
    const fetchSummerCourses = async () => {
      setLoading(true);
      try {
        const summerResponse = await axios.get('https://api.test.hachion.co/summerevents');
        const summerData = summerResponse.data || [];

        const activeSummerCourses = summerData.filter(course => course.status);

        const allCoursesResponse = await axios.get('https://api.test.hachion.co/courses/all');
        const allCourses = allCoursesResponse.data || [];

        const trainersResponse = await axios.get('https://api.test.hachion.co/trainers');
        const allTrainers = trainersResponse.data || [];

        const detailedSummerCourses = activeSummerCourses.map(summerCourse => {
        const courseDetails = allCourses.find(course => course.courseName === summerCourse.course_name);
        const matchedTrainer = allTrainers.find(
          (t) => t.course_name.trim().toLowerCase() === summerCourse.course_name.trim().toLowerCase()
        );

        return {
            ...summerCourse,
            ...courseDetails,
            trainerName: matchedTrainer ? matchedTrainer.trainer_name : "No Trainer",
          };
        });

        const uniqueCategories = [
          'All',
          ...new Set(detailedSummerCourses.map(course => course.category_name)),
        ];

        setCategories(uniqueCategories);
        setSummerCourses(detailedSummerCourses);
      } catch (error) {
        console.error('Error fetching summer courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummerCourses();
  }, []);

  const filteredCourses =
    activeCategory === 'All'
      ? summerCourses
      : summerCourses.filter(course => course.category_name === activeCategory);

  const handleCardClick = (course) => {
    if (!course?.courseName) return;
    const courseSlug = course.courseName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/coursedetails/${courseSlug}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const updateCardsPerPage = () => {
      const width = window.innerWidth;
      if (width <= 768) setCardsPerPage(4); 
      else if (width <= 1024) setCardsPerPage(4);
      else setCardsPerPage(4);
    };

    updateCardsPerPage();
    window.addEventListener('resize', updateCardsPerPage);
    return () => {
      window.removeEventListener('resize', updateCardsPerPage);
    };
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

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
      const { data } = await axios.get("https://api.test.hachion.co/discounts-courses");
      setDiscountRules(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load discount rules", e);
      setDiscountRules([]);
    }
  })();
}, []);

useEffect(() => {
  let stopped = false;

  const compute = () => {
    if (stopped) return;
    const next = {};
    filteredCourses.forEach((c) => {
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
        days > 0
          ? `${days}d ${pad(hours)}h Left`
          : `${pad(hours)}h Left`;

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
}, [filteredCourses, country, discountRules]);


const parseMDY = (s) => dayjs(s, ["MM/DD/YYYY", "YYYY-MM-DD"], true);
const isWithin = (today, start, end) => {
  const s = parseMDY(start), e = parseMDY(end);
  const t = dayjs(today);
  const okS = s.isValid() ? !t.isBefore(s, "day") : true;
  const okE = e.isValid() ? !t.isAfter(e, "day") : true;
  return okS && okE;
};

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


  return (
    <div className="training-events container">
      <div className="training-title-head">
        <div className="home-spacing">
          <h2 className="association-head">Online IT Training Courses For Teen’s</h2>
          <p className="association-head-tag">
            Kickstart your tech journey with expert-led online IT Certification courses for teens and beginners.
          </p>
        </div>

          <div className="card-pagination-container">
            <CardsPagination
              currentPage={currentPage}
              totalCards={filteredCourses.length}
              cardsPerPage={cardsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
      </div>

      {/* Courses */}
      <div className="training-card-holder">
        {loading ? (
          Array.from({ length: cardsPerPage }).map((_, index) => (
            <div className="skeleton-card" key={index}></div>
          ))
        ) : filteredCourses.length > 0 ? (
          filteredCourses
            .slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)
            .map((course, index) => (
              
              <TeensCard
                key={index}
                heading={course.courseName}
                month={course.numberOfClasses}
                image={`https://api.test.hachion.co/${course.courseImage}`}
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
                level={course.levels}
                onClick={() => handleCardClick(course)}
                
                className="course-card"
timeLeftLabel={countdowns[course.id ?? course.courseName] || ""}

              />
            ))
        ) : (
          <p>No courses available.</p>
        )}
      </div>
     
    </div>
  );
};

export default TeensEvents;
