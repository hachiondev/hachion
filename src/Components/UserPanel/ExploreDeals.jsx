import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CourseCard from './CourseCard';
import './Home.css';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { BiSearch, BiX } from 'react-icons/bi';
import Pagination from './Common/Pagination';
dayjs.extend(customParseFormat);

const countryToCurrencyMap = {
  IN: 'INR', US: 'USD', GB: 'GBP', AU: 'AUD', CA: 'CAD', AE: 'AED', JP: 'JPY', EU: 'EUR',
  TH: 'THB', DE: 'EUR', FR: 'EUR', QA: 'QAR', CN: 'CNY', RU: 'RUB', KR: 'KRW', BR: 'BRL',
  MX: 'MXN', ZA: 'ZAR', NL: 'EUR',
};

const ExploreDeals = () => {
  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('INR');
  const [fxFromUSD, setFxFromUSD] = useState(1);
  const [country, setCountry] = useState('IN');
  const locale = Intl.DateTimeFormat().resolvedOptions().locale || 'en-US';

  const [discountRules, setDiscountRules] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  
  // 🔴 NEW: Search and Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12;

  // const fmt = (n) =>
  //   (Math.round((Number(n) || 0) * 100) / 100).toLocaleString();

  const fmt = (n) => Math.round(Number(n) || 0).toLocaleString();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const allCoursesResponse = await axios.get(
          'https://api.test.hachion.co/courses/all'
        );
        const trainersResponse = await axios.get(
          'https://api.test.hachion.co/trainers'
        );

        const courses = allCoursesResponse.data || [];
        const trainers = trainersResponse.data || [];

        const merged = courses.map((c) => {
          const matchedTrainer = trainers.find(
            (t) =>
              (t.course_name || '').trim().toLowerCase() ===
              (c.courseName || '').trim().toLowerCase()
          );
          return {
            ...c,
            trainerName: matchedTrainer ? matchedTrainer.trainer_name : '',
          };
        });

        setAllCourses(merged);
      } catch (e) {
        console.error('Error fetching courses/trainers:', e);
        setAllCourses([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const geoResponse = await axios.get(
          'https://ipinfo.io/json?token=82aafc3ab8d25b'
        );
        const cc = geoResponse?.data?.country || 'US';
        setCountry(cc);

        const cur = countryToCurrencyMap[cc] || 'USD';
        setCurrency(cur);

        if (cc === 'IN' || cc === 'US') {
          setFxFromUSD(1);
          return;
        }

        const cached = JSON.parse(
          localStorage.getItem('fxRatesUSD') || 'null'
        );
        const fresh =
          cached && Date.now() - cached.t < 6 * 60 * 60 * 1000;
        let rates = cached?.rates;

        if (!fresh) {
          const exchangeResponse = await axios.get(
            'https://api.exchangerate-api.com/v4/latest/USD'
          );
          rates = exchangeResponse.data.rates;
          localStorage.setItem(
            'fxRatesUSD',
            JSON.stringify({ t: Date.now(), rates })
          );
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
        const { data } = await axios.get(
          'https://api.test.hachion.co/discounts-courses'
        );
        setDiscountRules(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to load discount rules', e);
        setDiscountRules([]);
      }
    })();
  }, []);

  const parseMDY = (s) =>
    dayjs(s, ['MM/DD/YYYY', 'YYYY-MM-DD'], true);
  const STRICT_DATE_WINDOW = true;

  const inWindow = (start, end) => {
    const today = dayjs();
    const s = parseMDY(start);
    const e = parseMDY(end);
    if (STRICT_DATE_WINDOW) {
      const okS = s.isValid() ? !today.isBefore(s, 'day') : true;
      const okE = e.isValid() ? !today.isAfter(e, 'day') : true;
      return okS && okE;
    } else {
      const okE = e.isValid() ? !today.isAfter(e, 'day') : true;
      return okE;
    }
  };

  const regionNames = new Intl.DisplayNames([locale || 'en'], {
    type: 'region',
  });
  const normalizeStr = (s) =>
    (s || '').toString().trim().toLowerCase();

  const expandRuleCountry = (token) => {
    const t = (token || '').toString().trim();
    if (!t) return [];
    if (/^[A-Za-z]{2}$/.test(t)) {
      const code = t.toUpperCase();
      const name = regionNames.of(code) || '';
      return [normalizeStr(code), normalizeStr(name)];
    }
    return [normalizeStr(t)];
  };

  const expandUserCountry = (cc) => {
    const code = (cc || '').toUpperCase();
    const name = regionNames.of(code) || '';
    return new Set([normalizeStr(code), normalizeStr(name)]);
  };

  const getRuleDiscountPct = (courseName, countryCode) => {
    if (!discountRules?.length) return 0;

    const userCountryTokens = expandUserCountry(countryCode);
    const courseKey = normalizeStr(courseName);

    let best = 0;
    for (const r of discountRules) {
      if ((r.status || '').toLowerCase() !== 'active') continue;
      if (!inWindow(r.startDate, r.endDate)) continue;

      const courses = Array.isArray(r.courseNames)
        ? r.courseNames
        : [];
      const countries = Array.isArray(r.countryNames)
        ? r.countryNames
        : [];

      const courseOk =
        courses.some((c) => normalizeStr(c) === courseKey) ||
        courses.some((c) => normalizeStr(c) === 'all');

      const countryOk =
        countries.some((c) => {
          const tokens = expandRuleCountry(c);
          return tokens.some((t) => userCountryTokens.has(t));
        }) ||
        countries.some((c) => normalizeStr(c) === 'all');

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
      if ((r.status || '').toLowerCase() !== 'active') continue;
      if (!inWindow(r.startDate, r.endDate)) continue;

      const courses = Array.isArray(r.courseNames)
        ? r.courseNames
        : [];
      const countries = Array.isArray(r.countryNames)
        ? r.countryNames
        : [];

      const courseOk =
        courses.some((c) => normalizeStr(c) === courseKey) ||
        courses.some((c) => normalizeStr(c) === 'all');

      const countryOk =
        countries.some((c) => {
          const tokens = expandRuleCountry(c);
          return tokens.some((t) => userCountryTokens.has(t));
        }) ||
        countries.some((c) => normalizeStr(c) === 'all');

      if (courseOk && countryOk) return r;
    }
    return null;
  };

  const getSaleEndsAt = (courseName, countryCode) => {
    const rule = getActiveRuleFor(courseName, countryCode);
    if (!rule) return null;
    const end = parseMDY(rule.endDate);
    if (!end.isValid()) return null;
    return end.endOf('day').toDate();
  };

  const keyOf = (c) => c.id ?? c.courseName;

  const getTimeLeftSeconds = (course) => {
    const endsAt = getSaleEndsAt(course.courseName, country);
    if (!endsAt) return Infinity;
    const diffMs = endsAt.getTime() - Date.now();
    if (diffMs <= 0) return Infinity;
    return Math.floor(diffMs / 1000);
  };

  const getPerCourseDiscountPct = (course) => {
    const pct =
      country === 'IN'
        ? course.idiscount != null
          ? Number(course.idiscount)
          : 0
        : course.discount != null
        ? Number(course.discount)
        : 0;
    return isNaN(pct) ? 0 : pct;
  };

  const withRuleActive = useMemo(() => {
    return allCourses
      .map((c) => ({ course: c, secs: getTimeLeftSeconds(c) }))
      .filter((x) => x.secs !== Infinity)
      .sort((a, b) => a.secs - b.secs)
      .map((x) => x.course);
  }, [allCourses, country, discountRules]);

  const seen = useMemo(() => {
    return new Set(withRuleActive.map((c) => keyOf(c)));
  }, [withRuleActive]);

  const withPerCourseDiscount = useMemo(() => {
    return allCourses
      .filter((c) => !seen.has(keyOf(c)))
      .map((c) => ({
        course: c,
        pct: getPerCourseDiscountPct(c),
      }))
      .filter((x) => x.pct > 0)
      .sort((a, b) => b.pct - a.pct)
      .map((x) => x.course);
  }, [allCourses, seen]);

  const orderedCourses = useMemo(() => {
    return [...withRuleActive, ...withPerCourseDiscount];
  }, [withRuleActive, withPerCourseDiscount]);

  // 🔴 CHANGE: Only show courses that have timeLeftLabel (active countdown)
  const activeDealCourses = useMemo(() => {
    return orderedCourses.filter(course => 
      countdowns[keyOf(course)] && countdowns[keyOf(course)] !== ''
    );
  }, [orderedCourses, countdowns]);

  // 🔴 NEW: Search filter
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return activeDealCourses;
    
    const query = searchQuery.toLowerCase().trim();
    return activeDealCourses.filter(course => 
      course.courseName?.toLowerCase().includes(query) ||
      course.category?.toLowerCase().includes(query) ||
      course.trainerName?.toLowerCase().includes(query) ||
      course.level?.toLowerCase().includes(query)
    );
  }, [activeDealCourses, searchQuery]);

  // 🔴 NEW: Pagination
  const totalPages = Math.ceil(filteredCourses.length / cardsPerPage);
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const displayedCourses = filteredCourses.slice(indexOfFirstCard, indexOfLastCard);

  // 🔴 NEW: Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of deals section
    document.querySelector('.association-head')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  useEffect(() => {
    let stopped = false;

    const compute = () => {
      if (stopped) return;
      const next = {};

      orderedCourses.forEach((c) => {
        const key = keyOf(c);
        const endsAt = getSaleEndsAt(c.courseName, country);
        if (!endsAt) return;

        const diffMs = endsAt.getTime() - Date.now();
        if (diffMs <= 0) return;

        const totalSec = Math.floor(diffMs / 1000);
        const days = Math.floor(totalSec / 86400);
        const hours = Math.floor((totalSec % 86400) / 3600);

        const pad = (n) => n.toString().padStart(2, '0');
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
  }, [orderedCourses, country, discountRules]);

const handleCardClick = (course) => {

  if (!course?.courseName || !course?.courseCategory) {
    console.error("Missing category/course", course);
    return;
  }

  const courseSlug = course.courseName
    .toLowerCase()
    .replace(/\s+/g, '-');

  const categorySlug = course.courseCategory
    .toLowerCase()
    .replace(/\s+/g, '-');

  navigate(`/courses/${categorySlug}/${courseSlug}`);
};
  return (
    <div className="container">
      <div className="home-spacing">
        <h2 className="association-head">
          Explore all deals and discounts {!loading && filteredCourses.length > 0 && `(${filteredCourses.length})`}
        </h2>
        <p className="association-head-tag">
          Handpicked courses across various categories to help you
          achieve your learning goals
        </p>
      </div>

      {/* 🔴 NEW: Search Bar with React Icons */}
      <div className="search-input-blog" style={{ marginBottom: '30px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
        <div className="search-input-wrapper-blog">
          <BiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search courses by name, category, trainer, or level..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <BiX />
            </button>
          )}
        </div>
      </div>

      <div className="training-card-holder">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div className="skeleton-card" key={i}></div>
          ))
        ) : displayedCourses.length > 0 ? (
          displayedCourses.map((course) => {
            const cardKey = keyOf(course);
            return (
              <CourseCard
                key={cardKey}
                heading={course.courseName}
                courseCategory={course.courseCategory}
                month={course.numberOfClasses}
                image={`https://api.test.hachion.co/${course.courseImage}`}
                course_id={course.id}
                trainer_name={course.trainerName}
                discountPercentage={(() => {
                  const rulePct = getRuleDiscountPct(
                    course.courseName,
                    country
                  );
                  if (rulePct > 0) return rulePct;
                  return country === 'IN'
                    ? course.idiscount != null
                      ? Number(course.idiscount)
                      : 0
                    : course.discount != null
                    ? Number(course.discount)
                    : 0;
                })()}
                amount={(() => {
                  const isIN = country === 'IN';
                  const isUS = country === 'US';

                  const rawMrp = isIN
                    ? course.iamount
                    : course.amount;
                  const rawNow = isIN
                    ? course.itotal
                    : course.total;

                  const mrpVal = isIN
                    ? Number(rawMrp)
                    : Number(rawMrp) * (isUS ? 1 : fxFromUSD);
                  const nowVal = isIN
                    ? Number(rawNow)
                    : Number(rawNow) * (isUS ? 1 : fxFromUSD);

                  const rulePct = getRuleDiscountPct(
                    course.courseName,
                    country
                  );
                  const effectiveNow =
                    rulePct > 0
                      ? mrpVal * (1 - rulePct / 100)
                      : nowVal;

                  return `${currency} ${fmt(effectiveNow)}`;
                })()}
                totalAmount={(() => {
                  const isIN = country === 'IN';
                  const isUS = country === 'US';
                  const rawMrp = isIN
                    ? course.iamount
                    : course.amount;
                  const mrpVal = isIN
                    ? Number(rawMrp)
                    : Number(rawMrp) * (isUS ? 1 : fxFromUSD);
                  return `${fmt(mrpVal)}`;
                })()}
                level={course.level}
                onClick={() => handleCardClick(course)}
                className="course-card"
                timeLeftLabel={
                  countdowns[cardKey] || ''
                }
              />
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', width: '100%' }}>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>
              {searchQuery ? `No courses found matching "${searchQuery}"` : 'No active deals available.'}
            </p>
            {searchQuery && (
              <button 
                onClick={clearSearch}
                style={{
                  background: '#00AEEF',
                  color: 'white',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      {/* 🔴 NEW: Pagination - Only show if more than 12 courses */}
      {!loading && filteredCourses.length > cardsPerPage && (
        <div className="pagination-container">
          <Pagination
            currentPage={currentPage}
            totalCards={filteredCourses.length}
            cardsPerPage={cardsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ExploreDeals;