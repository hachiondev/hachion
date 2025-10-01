import React, { useState, useEffect } from "react";
import "./Corporate.css";
import "./Blogs.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import DiscountCourseCard from "./DiscountCourseCard";
import "bootstrap/dist/css/bootstrap.min.css";

const countryToCurrencyMap = {
  IN: 'INR',
  US: 'USD',
  GB: 'GBP',
  AU: 'AUD',
  CA: 'CAD',
  AE: 'AED',
  JP: 'JPY',
  EU: 'EUR',
  TH: 'THB',
  DE: 'EUR',
  FR: 'EUR',
  QA: 'QAR',
  CN: 'CNY',
  RU: 'RUB',
  KR: 'KRW',
  BR: 'BRL',
  MX: 'MXN',
  ZA: 'ZAR',
  NL: 'EUR',
};
const DiscountCards = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerRow, setCardsPerRow] = useState(2);
  const [trendingCourses, setTrendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('INR');
const [fx, setFx] = useState(1); 
const locale = Intl.DateTimeFormat().resolvedOptions().locale || 'en-US';

   
const [country, setCountry] = useState('IN');      
const [fxFromUSD, setFxFromUSD] = useState(1);     


const fmt = (n) => (Math.round((Number(n) || 0) * 100) / 100).toLocaleString(); 
  useEffect(() => {
    const fetchTrendingCourses = async () => {
      setLoading(true);
      try {
        const trendingResponse = await axios.get(
          "https://api.test.hachion.co/trendingcourse"
        );
        const trendingData = trendingResponse.data || [];
        const activeTrendingCourses = trendingData.filter((course) => course.status);

        const allCoursesResponse = await axios.get("https://api.test.hachion.co/courses/all");
        const allCourses = allCoursesResponse.data || [];

        const trainersResponse = await axios.get("https://api.test.hachion.co/trainers");
        const allTrainers = trainersResponse.data || [];

        const detailedTrendingCourses = activeTrendingCourses.map((trendingCourse) => {
          const courseDetails = allCourses.find(
            (course) => course.courseName === trendingCourse.course_name
          );
          const matchedTrainer = allTrainers.find(
            (t) =>
              t.course_name.trim().toLowerCase() ===
              trendingCourse.course_name.trim().toLowerCase()
          );

          return {
            ...trendingCourse,
            ...courseDetails,
            trainerName: matchedTrainer ? matchedTrainer.trainer_name : "No Trainer",
          };
        });

        setTrendingCourses(detailedTrendingCourses);
      } catch (error) {
        console.error("Error fetching trending courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingCourses();
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

  const totalPages = Math.ceil(trendingCourses.length / cardsPerRow);

  const goToNext = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const goToPrev = () =>
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));

  const startIndex = currentPage * cardsPerRow;
  const currentCourses = trendingCourses.slice(startIndex, startIndex + cardsPerRow);

  const handleCardClick = (course) => {
    if (!course?.courseName) return;
    const courseSlug = course.courseName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/coursedetails/${courseSlug}`);
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
                image={`https://api.test.hachion.co/${course.courseImage}`}
                course_id={course.id}
                
                  discountPercentage={
  country === 'IN'
    ? (course.idiscount != null ? Number(course.idiscount) : 0)
    : (course.discount  != null ? Number(course.discount)  : 0)
}
                amount={
  (() => {
    const isIN = country === 'IN';
    const isUS = country === 'US';

    const rawNow   = isIN ? course.itotal  : course.total;   
    const rawMrp   = isIN ? course.iamount : course.amount;  

    const valNow = isIN ? Number(rawNow) : (Number(rawNow) * (isUS ? 1 : fxFromUSD));
    return `${currency} ${fmt(valNow)}`;
  })()
}
totalAmount={
  (() => {
    const isIN = country === 'IN';
    const isUS = country === 'US';

    const rawNow   = isIN ? course.itotal  : course.total;
    const rawMrp   = isIN ? course.iamount : course.amount;

    const valMrp = isIN ? Number(rawMrp) : (Number(rawMrp) * (isUS ? 1 : fxFromUSD));
    return `${fmt(valMrp)}`;
  })()
}
                trainer_name={course.trainerName}
                level={course.levels}
                onClick={() => handleCardClick(course)}
                className="course-card"
              />
            ))}
      </div>

      {/* Page Indicators */}
      <div className="page-indicators mt-3">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <span
            key={idx}
            className={`indicator-dot ${currentPage === idx ? "active" : ""}`}
            onClick={() => setCurrentPage(idx)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default DiscountCards;
