import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CourseCard from './CourseCard';
import './Home.css';

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

const ExploreDeals = () => {
  const navigate = useNavigate();
  const [trendingCourses, setTrendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewAll, setViewAll] = useState(false);
  const [cardsToShow, setCardsToShow] = useState(8); // default for desktop
  const [currency, setCurrency] = useState('INR');
  const [fx, setFx] = useState(1); 
  const locale = Intl.DateTimeFormat().resolvedOptions().locale || 'en-US';     
  const [country, setCountry] = useState('IN');      
  const [fxFromUSD, setFxFromUSD] = useState(1);     
  const fmt = (n) => (Math.round((Number(n) || 0) * 100) / 100).toLocaleString(); 
  // ✅ Handle responsiveness
  const updateCardsToShow = () => {
    const width = window.innerWidth;
    if (width <= 768) {
      setCardsToShow(1); // mobile -> 1 row
    } else if (width <= 1024) {
      setCardsToShow(4); // tablet -> 2 rows of 2 cards
    } else {
      setCardsToShow(8); // desktop -> 2 rows of 4 cards
    }
  };

  useEffect(() => {
    updateCardsToShow();
    window.addEventListener('resize', updateCardsToShow);
    return () => window.removeEventListener('resize', updateCardsToShow);
  }, []);

  // ✅ Fetch courses
  useEffect(() => {
    const fetchTrendingCourses = async () => {
      setLoading(true);
      try {
        const trendingResponse = await axios.get('https://api.test.hachion.co/trendingcourse');
        const allCoursesResponse = await axios.get('https://api.test.hachion.co/courses/all');
        const trainersResponse = await axios.get('https://api.test.hachion.co/trainers');

        const trendingData = trendingResponse.data || [];
        const allCourses = allCoursesResponse.data || [];
        const allTrainers = trainersResponse.data || [];

        const activeTrendingCourses = trendingData.filter(course => course.status);

        const detailedTrendingCourses = activeTrendingCourses.map(trendingCourse => {
          const courseDetails = allCourses.find(c => c.courseName === trendingCourse.course_name);
          const matchedTrainer = allTrainers.find(
            t => t.course_name.trim().toLowerCase() === trendingCourse.course_name.trim().toLowerCase()
          );

          return {
            ...trendingCourse,
            ...courseDetails,
            trainerName: matchedTrainer ? matchedTrainer.trainer_name : "No Trainer",
          };
        });

        setTrendingCourses(detailedTrendingCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingCourses();
  }, []);

  // ✅ Handle card click
  const handleCardClick = (course) => {
    if (!course?.courseName) return;
    const courseSlug = course.courseName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/coursedetails/${courseSlug}`);
  };

  // ✅ Courses to display (view more/less)
  const displayedCourses = viewAll ? trendingCourses : trendingCourses.slice(0, cardsToShow);
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
    <div className="container">
      {/* <div className="training-title-head"> */}
        <div className="home-spacing">
          <h2 className="association-head">Explore all deals and discounts</h2>
          <p className="association-head-tag">
            Handpicked courses across various categories to help you achieve your learning goals
          </p>
        </div>
      {/* </div> */}

      {/* Courses */}
      <div className="training-card-holder">
        {loading ? (
          Array.from({ length: cardsToShow }).map((_, i) => (
            <div className="skeleton-card" key={i}></div>
          ))
        ) : displayedCourses.length > 0 ? (
          displayedCourses.map((course, index) => (
            <CourseCard
              key={index}
              heading={course.courseName}
              month={course.numberOfClasses}
              image={`https://api.test.hachion.co/${course.courseImage}`}
              course_id={course.id}
              trainer_name={course.trainerName}
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
              level={course.levels}
              onClick={() => handleCardClick(course)}
              className="course-card"
            />
          ))
        ) : (
          <p>No courses available.</p>
        )}
      </div>

      {/* View All / View Less */}
      {trendingCourses.length > cardsToShow && (
        <div className="home-faq-banner container">
          <div className="card-pagination-container">
            <button
              className="home-start-button"
              onClick={() => {
            if (viewAll) {
                document.querySelector(".association-head")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            setViewAll(!viewAll);
            }}>
              {viewAll ? "View Less" : "View More"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreDeals;
