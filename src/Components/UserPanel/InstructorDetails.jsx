import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { FaStar, FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { LuCrown } from "react-icons/lu";
import Topbar from "./Topbar";
import NavbarTop from "./NavbarTop";
import Footer from "./Footer";
import StickyBar from "./StickyBar";
import { MdKeyboardArrowRight } from 'react-icons/md';
import axios from "axios";
import CourseCard from "./CourseCard";
import LearnerCard from "./LearnerCard";
import { SlGlobe } from "react-icons/sl";
import { GoPeople } from "react-icons/go";
import { IoMdPlayCircle } from "react-icons/io";

const countryToCurrencyMap = {
  IN: "INR", US: "USD", GB: "GBP", AU: "AUD", CA: "CAD", AE: "AED", JP: "JPY",
  EU: "EUR", TH: "THB", DE: "EUR", FR: "EUR", QA: "QAR", CN: "CNY", RU: "RUB",
  KR: "KRW", BR: "BRL", MX: "MXN", ZA: "ZAR", NL: "EUR"
};

const InstructorDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trainer_name } = useParams();

  const [trainer, setTrainer] = useState(location.state?.trainer || null);
  const [enrollCount, setEnrollCount] = useState(location.state?.enrollCount ?? 0);

  const [allCourses, setAllCourses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("INR");
  const [fxFromUSD, setFxFromUSD] = useState(1);
  const [country, setCountry] = useState("IN");

const trainerCourses = allCourses.filter(course =>
  trainer?.trainer_name &&
  course.trainerName?.toLowerCase() === trainer.trainer_name.toLowerCase()
);

  const fmt = (n) => (Math.round((Number(n) || 0) * 100) / 100).toLocaleString();

  
  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        if (!trainer) {
          const res = await axios.get("https://api.test.hachion.co/trainers");
          const foundTrainer = res.data.find(t => t.trainer_name.toLowerCase() === trainer_name.toLowerCase());
          setTrainer(foundTrainer || null);
        }
      } catch (err) {
        console.error("Error fetching trainer:", err);
      }
    };
    fetchTrainer();
  }, [trainer, trainer_name]);

  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const resCourses = await axios.get("https://api.test.hachion.co/courses/all");
        const resTrainers = await axios.get("https://api.test.hachion.co/trainers");
        const coursesWithTrainer = resCourses.data.map(course => {
          const trainerData = resTrainers.data.find(t => 
            t.course_name?.trim().toLowerCase() === course.courseName?.trim().toLowerCase()
          );
          return {
            ...course,
            trainerName: trainerData ? trainerData.trainer_name : "No Trainer",
          };
        });
        setAllCourses(coursesWithTrainer);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  
useEffect(() => {
  const fetchReviewsByCourse = async () => {
    if (!trainer?.course_name) return;
    try {
      const url = `https://api.test.hachion.co/userreview/instructor/${encodeURIComponent(trainer.course_name)}`;
      const res = await axios.get(url);
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching course reviews:", err);
      setReviews([]);
    }
  };
  fetchReviewsByCourse();
}, [trainer?.course_name]);


  useEffect(() => {
    (async () => {
      try {
        const geoResponse = await axios.get("https://ipinfo.io/json?token=82aafc3ab8d25b");
        const cc = geoResponse?.data?.country || "US";
        setCountry(cc);
        const cur = countryToCurrencyMap[cc] || "USD";
        setCurrency(cur);

        const cached = JSON.parse(localStorage.getItem("fxRatesUSD") || "null");
        const fresh = cached && (Date.now() - cached.t) < 6 * 60 * 60 * 1000;
        let rates = cached?.rates;
        if (!fresh) {
          const exchangeResponse = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
          rates = exchangeResponse.data.rates;
          localStorage.setItem("fxRatesUSD", JSON.stringify({ t: Date.now(), rates }));
        }
        setFxFromUSD(rates[cur] || 1);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleCardClick = (course) => {
    if (!course?.courseName) return;
    const courseSlug = course.courseName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/coursedetails/${courseSlug}`);
  };

  if (loading) return <div>Loading...</div>;
  if (!trainer) return <div>No trainer found.</div>;

  return (
    <div className="course-top">
      <Topbar />
      <NavbarTop />

      {/* Breadcrumb */}
      <div className="blogs-header">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/">Home</a> <MdKeyboardArrowRight /></li>
            <li className="breadcrumb-item"><a href="/instructor-profiles">Instructor Profiles</a> <MdKeyboardArrowRight /></li>
            <li className="breadcrumb-item active" aria-current="page">Instructor {trainer.trainer_name} Profile</li>
          </ol>
        </nav>
      </div>

      <div className="container">
        {/* Trainer Profile */}
        <div className="border-0 shadow-sm p-4 d-flex flex-column flex-md-row align-items-start">
          <Avatar
            alt={trainer.trainer_name}
            src={trainer.profileImage || " "}
            sx={{ width: 100, height: 100, borderRadius: "50%", marginRight: "10px" }}
          />
          <div className="flex-grow-1 d-flex flex-column flex-md-row justify-content-between">
            <div>
              <div className="d-flex align-items-center mb-2">
                <h4 className="mb-0 fw-bold me-2">{trainer.trainer_name}</h4>
                <span className="badge top-badge"><LuCrown /> Top Rated</span>
              </div>
              <p className="text-black mb-2">{trainer.course_name || "Instructor"}</p>
              <div className="d-flex flex-wrap">
                <div className="me-4 d-flex align-items-center">
                  <FaStar className="text-warning me-1" />
                  <span className="fw-semibold">{trainer.trainerUserRating || 5}</span>
                  <small className="text-black ms-1">({reviews.length} reviews)</small>
                </div>
                <div className="me-4">
                  {/* <span className="fw-semibold"><GoPeople size="20" color="#00aeef"/> {{enrollCount}}</span> */}
                    <span className="fw-semibold">
    <GoPeople size="20" color="#00aeef"/> {enrollCount ?? 0}
  </span>
                  <small className="text-black"> students</small>
                </div>
                <div>
                  <span className="fw-semibold"><IoMdPlayCircle size="20" color="#00aeef"/> {trainerCourses.length}</span>
                  <small className="text-black"> courses</small>
                </div>
              </div>
            </div>
            {/* <div className="text-md-end mt-3 mt-md-0">
              <a href={trainer.website || "#"} target="_blank" rel="noreferrer" className="text-info d-block mb-2"><SlGlobe /> {trainer.website || "https://www.hachion.co"}</a>
              <div className="social-icons d-inline-flex gap-2">
                <a href={trainer.facebook || "#"}><FaFacebookF /></a>
                <a href={trainer.twitter || "#"}><FaTwitter /></a>
                <a href={trainer.instagram || "#"}><FaInstagram /></a>
                <a href={trainer.youtube || "#"}><FaYoutube /></a>
                <a href={trainer.whatsapp || "#"}><FaWhatsapp /></a>
              </div>
            </div> */}
          </div>
          </div>
        {/* About Section */}
        <div className="mt-3">
          <h6 className="fw-semibold">ABOUT ME</h6>
          <p className="text-black">
            {trainer.summary || "This trainer is highly skilled and has helped many students achieve their goals."}
          </p>
        </div>

        {/* Courses */}
<p className="expert-title mt-3">Courses ({trainerCourses.length})</p>
<div className="training-card-holder">
  {trainerCourses.length > 0 ? trainerCourses.map((course, idx) => (
    <CourseCard
      key={idx}
      heading={course.courseName}
      month={course.numberOfClasses || course.duration || 0}
      image={`https://api.test.hachion.co/${course.courseImage || course.image}`}
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
      level={course.levels || course.level}
      onClick={() => handleCardClick(course)}
      className="course-card"
    />
  )) : <p>No courses available for this trainer.</p>}
</div>

        {/* Reviews */}
        <p className="expert-title mt-3">Students Feedback</p>
        <div className="feedback-grid">
          {reviews.length > 0 ? reviews.map(fb => (
            <LearnerCard
              key={fb.review_id}
              name={fb.name}
              location={fb.location}
              content={fb.review}
              rating={fb.rating}
              profileImage={fb.user_image ? `https://api.test.hachion.co/userreview/${fb.user_image}` : ""}
            />
          )) : <p>No reviews available.</p>}
        </div>
      </div>

      <Footer />
      <StickyBar />
    </div>
  );
};

export default InstructorDetails;
