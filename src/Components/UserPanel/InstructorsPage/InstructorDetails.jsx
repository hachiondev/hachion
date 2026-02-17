import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { FaStar } from "react-icons/fa";
import { LuCrown } from "react-icons/lu";
import { MdKeyboardArrowRight } from 'react-icons/md';
import axios from "axios";
import CourseCard from "../CourseCard";
import { GoPeople } from "react-icons/go";
import { IoMdPlayCircle } from "react-icons/io";
import LearnerCard from "../HomePage/LearnerSection/components/LearnerCard";
import { useTrainers } from "../../../Api/hooks/HomePageApi/TrainingApi/useTrainers";
import { useAllCourses } from "../../../Api/hooks/SitemapPageApi/useAllCourses";
import Loader from "../Common/Loader/Loader";
import { useTrainerCourseReviews } from "../../../Api/hooks/InstructorSection/useTrainerCourseReviews";
import { useGeoData } from "../../../Api/hooks/HomePageApi/TrendingApi/useGeoData";
import styles from './InstructorDetails.module.css';

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
  // const [reviews, setReviews] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("INR");
  const [fxFromUSD, setFxFromUSD] = useState(1);
  const [country, setCountry] = useState("IN");
  const { data: trainersData = [], isLoading: trainersLoading } = useTrainers();
  const { data: allCoursesData = [], isLoading: coursesLoading } = useAllCourses();
  const {
    data: reviews = [],
    isLoading: reviewsLoading,
    isError: reviewsError,
  } = useTrainerCourseReviews(
    trainer?.trainer_name,
    trainer?.course_name
  );

  const { data: geoData = {} } = useGeoData();

  // const trainerCourses = allCourses.filter(course =>
  //   trainer?.trainer_name &&
  //   course.trainerName?.toLowerCase() === trainer.trainer_name.toLowerCase()
  // );

  const trainerCourses = allCourses.filter(course =>
    course.courseName?.trim().toLowerCase() ===
    trainer.course_name?.trim().toLowerCase()
  );


  // const fmt = (n) => (Math.round((Number(n) || 0) * 100) / 100).toLocaleString();
  const fmt = (n) => Math.round(Number(n) || 0).toLocaleString();



  useEffect(() => {
    // const fetchTrainer = async () => {
    try {
      if (!trainer) {
        // const res = await axios.get("https://api.test.hachion.co/trainers");
        const foundTrainer = trainersData.find(t => t.trainer_name.toLowerCase() === trainer_name.toLowerCase());
        setTrainer(foundTrainer || null);
      }
    } catch (err) {
      console.error("Error fetching trainer:", err);
    }
    // };
    // fetchTrainer();
  }, [trainer, trainer_name]);


  useEffect(() => {
    // Set loading based on hook states
    // setLoading(trainersLoading || coursesLoading);

    // Only process when both data are available
    if (!allCoursesData || !trainersData || trainersLoading || coursesLoading) {
      return;
    }

    try {
      const coursesWithTrainer = allCoursesData.map(course => {
        const trainerData = trainersData.find(t =>
          t.course_name?.trim().toLowerCase() === course.courseName?.trim().toLowerCase()
        );
        return {
          ...course,
          trainerName: trainerData ? trainerData.trainer_name : "No Trainer",
        };
      });

      setAllCourses(coursesWithTrainer);
    } catch (err) {
      console.error("Error processing courses:", err);
    }
  }, [allCoursesData, trainersData, trainersLoading, coursesLoading]);


  // useEffect(() => {
  //   const fetchReviewsByCourse = async () => {
  //     if (!trainer?.course_name) return;
  //     try {
  //       const url = `https://api.test.hachion.co/userreview/instructor/${encodeURIComponent(trainer.course_name)}`;
  //       const res = await axios.get(url);
  //       setReviews(Array.isArray(res.data) ? res.data : []);
  //     } catch (err) {
  //       console.error("Error fetching course reviews:", err);
  //       setReviews([]);
  //     }
  //   };
  //   fetchReviewsByCourse();
  // }, [trainer?.course_name]);
  // useEffect(() => {
  //   const fetchReviewsByTrainerAndCourse = async () => {
  //     if (!trainer?.trainer_name || !trainer?.course_name) return;
  //     try {
  //       const url = `https://api.test.hachion.co/userreview/instructor/${encodeURIComponent(
  //         trainer.trainer_name
  //       )}/${encodeURIComponent(trainer.course_name)}`;
  //       const res = await axios.get(url);
  //       setReviews(Array.isArray(res.data) ? res.data : []);
  //     } catch (err) {
  //       console.error("Error fetching trainer+course reviews:", err);
  //       setReviews([]);
  //     }
  //   };
  //   fetchReviewsByTrainerAndCourse();
  // }, [trainer?.trainer_name, trainer?.course_name]);


  useEffect(() => {
    (async () => {
      try {
        // const geoResponse = await axios.get("https://ipinfo.io/json?token=82aafc3ab8d25b");
        const cc = geoData.country || "US";
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

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  const handleCardClick = (course) => {
    if (!course?.courseName) return;
    const courseSlug = course.courseName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/coursedetails/${courseSlug}`);
  };

  if (trainersLoading && coursesLoading) return <Loader />;
  if (!trainer) return <div>No trainer found.</div>;

  return (
    <div className="course-top">
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
        <div className={styles.container}>
          <Avatar
            alt={trainer.trainer_name}
            src={
              trainer.trainerImage
                ? `https://api.test.hachion.co/${trainer.trainerImage}`
                : ""
            }
            className={styles.avatar}
          />

          <div className={styles.contentWrapper}>
            <div className={styles.mainContent}>
              <div className={styles.nameSection}>
                <h4 className={styles.name}>{trainer.trainer_name}</h4>
                <span className={styles.badge}>
                  <LuCrown size={14} /> Top Rated
                </span>
              </div>

              <p className={styles.courseName}>
                {trainer.course_name || "Instructor"}
              </p>

              <div className={styles.statsContainer}>
                <div className={styles.statItem}>
                  <FaStar className={styles.starIcon} />
                  <span className={styles.statValue}>
                    {trainer.trainerUserRating || 5}
                  </span>
                  <span className={styles.statLabel}>
                    ({reviews.length} reviews)
                  </span>
                </div>

                <div className={styles.statItem}>
                  <span className={styles.statValue}>
                    <GoPeople className={styles.iconBlue} size={18} />
                    {enrollCount ?? 0}
                  </span>
                  <span className={styles.statLabel}>students</span>
                </div>

                <div className={styles.statItem}>
                  <span className={styles.statValue}>
                    <IoMdPlayCircle className={styles.iconBlue} size={18} />
                    {trainerCourses.length}
                  </span>
                  <span className={styles.statLabel}>courses</span>
                </div>
              </div>
            </div>

            {/* Optional: Add action buttons here if needed */}
            {/* <div className={styles.rightSection}>
          <button className={styles.actionButton}>
            View Profile
          </button>
        </div> */}
          </div>
        </div>
        {/* About Section */}
        <div className="mt-3">
          <h6 className="fw-semibold">ABOUT ME</h6>
          <div
            className="full-review"
            dangerouslySetInnerHTML={{
              __html:
                trainer.summary?.trim() ||
                "This trainer is highly skilled and has helped many students achieve their goals.",
            }}
          />
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
              trainer_name={trainer.trainer_name}
              discountPercentage={
                country === 'IN'
                  ? (course.idiscount != null ? Number(course.idiscount) : 0)
                  : (course.discount != null ? Number(course.discount) : 0)
              }
              amount={
                (() => {
                  const isIN = country === 'IN';
                  const isUS = country === 'US';

                  const rawNow = isIN ? course.itotal : course.total;
                  const rawMrp = isIN ? course.iamount : course.amount;

                  const valNow = isIN ? Number(rawNow) : (Number(rawNow) * (isUS ? 1 : fxFromUSD));
                  return `${currency} ${fmt(valNow)}`;
                })()
              }
              totalAmount={
                (() => {
                  const isIN = country === 'IN';
                  const isUS = country === 'US';

                  const rawNow = isIN ? course.itotal : course.total;
                  const rawMrp = isIN ? course.iamount : course.amount;

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
    </div>
  );
};

export default InstructorDetails;
