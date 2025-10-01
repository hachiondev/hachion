import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiMenuUnfold3Line } from 'react-icons/ri';
import axios from 'axios';
import CourseCard from './CourseCard';
import CardsPagination from './CardsPagination';
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
const Trending = () => {
  const navigate = useNavigate();
  const [trendingCourses, setTrendingCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(4);
  const [totalCards, setTotalCards] = useState(0);
  const [topCount, setTopCount] = useState(() => {
    const width = window.innerWidth;
    if (width <= 768) return 0; 
    if (width <= 1024) return 4; 
    return 6; 
  });

  const [currency, setCurrency] = useState('INR');
  const [fx, setFx] = useState(1); 
  const locale = Intl.DateTimeFormat().resolvedOptions().locale || 'en-US';     
  const [country, setCountry] = useState('IN');      
  const [fxFromUSD, setFxFromUSD] = useState(1);     
  const fmt = (n) => (Math.round((Number(n) || 0) * 100) / 100).toLocaleString(); 
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 768) setTopCount(0);
      else if (width <= 1024) setTopCount(4);
      else setTopCount(6);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchTrendingCourses = async () => {
      setLoading(true);
      try {
        const trendingResponse = await axios.get('https://api.test.hachion.co/trendingcourse');
        const trendingData = trendingResponse.data || [];

        const activeTrendingCourses = trendingData.filter(course => course.status);

        const allCoursesResponse = await axios.get('https://api.test.hachion.co/courses/all');
        const allCourses = allCoursesResponse.data || [];

        const trainersResponse = await axios.get('https://api.test.hachion.co/trainers');
        const allTrainers = trainersResponse.data || [];

        const detailedTrendingCourses = activeTrendingCourses.map(trendingCourse => {
          const courseDetails = allCourses.find(course => course.courseName === trendingCourse.course_name);
         const matchedTrainer = allTrainers.find(
          (t) => t.course_name.trim().toLowerCase() === trendingCourse.course_name.trim().toLowerCase()
        );

        return {
          ...trendingCourse,
          ...courseDetails,
          trainerName: matchedTrainer ? matchedTrainer.trainer_name : "No Trainer",
        };
      });

        const uniqueCategories = [
          'All',
          ...new Set(detailedTrendingCourses.map(course => course.category_name)),
        ];

        setCategories(uniqueCategories);
        setTrendingCourses(detailedTrendingCourses);
      } catch (error) {
        console.error('Error fetching trending courses:', error);
      } finally {
      setLoading(false);
    }
    };

    fetchTrendingCourses();
  }, []);

  const filteredCourses =
    activeCategory === 'All'
      ? trendingCourses
      : trendingCourses.filter(course => course.category_name === activeCategory);

  const handleCardClick = (course) => {
    if (!course?.courseName) return;
    const courseSlug = course.courseName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/coursedetails/${courseSlug}`);
  };
 const updateTotalCards = (total) => {
    setTotalCards(total);
  };

  useEffect(() => {
    window.scrollTo(0, 0);  
    
    
    const updateCardsPerPage = () => {
      const width = window.innerWidth;
        setCardsPerPage(4);
    };
    updateCardsPerPage();
    window.addEventListener('resize', updateCardsPerPage);
    return () => {
      window.removeEventListener('resize', updateCardsPerPage);
    };
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, window.scrollY);
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
    <div className="training-events container">
      <div className="training-title-head">
        <div className="home-spacing">
        <h2 className="association-head">Trending IT Online Certification Courses</h2>
        <p className="association-head-tag">Upgrade your skills with Hachion’s flexible, affordable IT courses and industry-recognized certifications.</p>
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
    </div>
  );
};

export default Trending;
