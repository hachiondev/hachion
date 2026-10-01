"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import { FaStar } from "react-icons/fa";
import { LuCrown } from "react-icons/lu";
import { MdKeyboardArrowRight } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { IoMdPlayCircle } from "react-icons/io";
import axios from "axios";
import Link from "next/link";
import CourseCard from "../CourseCard";
import LearnerCard from "../HomePage/LearnerSection/components/LearnerCard";
import { useTrainers } from "@/Api/hooks/HomePageApi/TrainingApi/useTrainers";
import { useTrainerOptions } from "@/Api/hooks/InstructorSection/useTrainerOptions";
import { useAllCourses } from "@/Api/hooks/SitemapPageApi/useAllCourses";
import { useTrainerCourseReviews } from "@/Api/hooks/InstructorSection/useTrainerCourseReviews";
import { useGeoData } from "@/Api/hooks/HomePageApi/TrendingApi/useGeoData";
import Loader from "../Common/Loader/Loader";
import "../CoursePage/Course.css";
import "../Style.css";
import "../Home.css";
import "../Corporate.css";
import styles from "./InstructorDetails.module.css";
import { API_BASE_URL } from "@/lib/apiBase";

const EMPTY_ARRAY = [];

// This page's URL identifies a trainer by a slugified trainer_name alone
// (/instructor-profiles/[trainerSlug]) rather than CRA's own
// `/:trainer_name-instructor-details` route. CRA's listing page actually
// builds that link from `${courseSlug}-${trainerName}-instructor-details`
// (a course+trainer combined string), while InstructorDetails.jsx only ever
// matched on trainer_name alone — a pre-existing mismatch that never
// surfaced because the "View Profile" button that would use it is commented
// out in the CRA source. This route uses the slug shape the lookup logic
// actually expects.
const slugifyName = (name = "") => name.trim().toLowerCase().replace(/\s+/g, "-");

const InstructorDetails = () => {
  const router = useRouter();
  const rawParams = useParams();
  const trainerSlug = decodeURIComponent(rawParams.trainerSlug || "");

  const [enrollCount, setEnrollCount] = useState(0);
  // `/trainers/summary` (useTrainers) only returns { trainerName, courseName }
  // (camelCase, one row per trainer+course) — used below just to map each
  // course to its trainer's name. The trainer's own rich profile (real
  // trainer_name/course_name/summary/trainerImage/trainerRating fields, one
  // row per unique trainer) lives at /trainersnames-unique (useTrainerOptions)
  // instead — CRA's InstructorDetails.jsx only ever fetched from
  // /trainers/summary and read fields (trainer_name, trainerImage,
  // trainerUserRating) that endpoint doesn't actually have, so on a real,
  // direct page load (the only way to reach this page — its own "View
  // Profile" link is commented out in the CRA source) it always fell through
  // to "No trainer found." This fetches the same second endpoint
  // Instructors.jsx (the listing page) already uses for its own trainer
  // summaries, rather than inventing a new one.
  const { data: trainersData = EMPTY_ARRAY, isLoading: trainersLoading } = useTrainers();
  const { data: trainerOptions = EMPTY_ARRAY, isLoading: trainerOptionsLoading } = useTrainerOptions();
  const { data: allCoursesData = EMPTY_ARRAY, isLoading: coursesLoading } = useAllCourses();

  const trainer = useMemo(() => {
    if (!trainerSlug || !trainerOptions.length) return null;
    return trainerOptions.find((t) => slugifyName(t.trainer_name) === trainerSlug.toLowerCase()) || null;
  }, [trainerOptions, trainerSlug]);

  const { data: reviews = EMPTY_ARRAY } = useTrainerCourseReviews(trainer?.trainer_name, trainer?.course_name);
  // Reuses the same currency-conversion hook TrainingEvents/CourseCard rely
  // on elsewhere — CRA's own version of this page hand-rolled its own
  // country/exchange-rate lookup + localStorage cache instead of reusing it,
  // since this hook didn't exist there. Same output, no duplicated logic.
  const { data: geoData } = useGeoData();
  const country = geoData?.country || "IN";
  const currency = geoData?.currency || "INR";
  const fxFromUSD = geoData?.fxFromUSD || 1;

  const fmt = (n) => Math.round(Number(n) || 0).toLocaleString();

  const allCourses = useMemo(() => {
    if (!allCoursesData.length || !trainersData.length) return EMPTY_ARRAY;
    return allCoursesData.map((course) => {
      const trainerData = trainersData.find((t) => t.courseName?.trim().toLowerCase() === course.courseName?.trim().toLowerCase());
      return { ...course, trainerName: trainerData ? trainerData.trainerName : "No Trainer" };
    });
  }, [allCoursesData, trainersData]);

  const trainerCourses = useMemo(() => {
    if (!trainer) return EMPTY_ARRAY;
    return allCourses.filter((course) => course.courseName?.trim().toLowerCase() === trainer.course_name?.trim().toLowerCase());
  }, [allCourses, trainer]);

  // Real enrolled-student count for this trainer+course — reuses the exact
  // same /enroll/count endpoint the Instructors.jsx listing page already
  // calls per-card. CRA's InstructorDetails.jsx instead received this as a
  // react-router navigate(path, {state}) handoff from that listing page;
  // since a fresh page load here has no equivalent, this fetches it directly.
  useEffect(() => {
    if (!trainer?.trainer_name || !trainer?.course_name) return;
    let cancelled = false;
    axios
      .get(`${API_BASE_URL}/enroll/count`, {
        params: { trainerName: trainer.trainer_name, courseName: trainer.course_name.replace(/\s+/g, "+") },
      })
      .then((res) => {
        if (!cancelled) setEnrollCount(res.data?.count ?? 0);
      })
      .catch((err) => console.error("Enroll count error", err));
    return () => {
      cancelled = true;
    };
  }, [trainer?.trainer_name, trainer?.course_name]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const handleCardClick = (course) => {
    if (!course?.courseName || !course?.courseCategory) {
      console.error("Missing category/course", course);
      return;
    }
    const courseSlug = course.courseName.toLowerCase().replace(/\s+/g, "-");
    const categorySlug = course.courseCategory.toLowerCase().replace(/\s+/g, "-");
    router.push(`/courses/${categorySlug}/${courseSlug}`);
  };

  if (trainerOptionsLoading || (trainersLoading && coursesLoading)) {
    return <Loader />;
  }
  if (!trainer) {
    return <div>No trainer found.</div>;
  }

  return (
    <div className="course-top">
      <div className="blogs-header">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item">
              <Link href="/instructor-profiles">Instructor Profiles</Link> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Instructor {trainer.trainer_name} Profile
            </li>
          </ol>
        </nav>
      </div>

      <div className="container">
        <div className={styles.container}>
          <Avatar alt={trainer.trainer_name} src={trainer.trainerImage ? `${API_BASE_URL}/${trainer.trainerImage}` : ""} className={styles.avatar} />

          <div className={styles.contentWrapper}>
            <div className={styles.mainContent}>
              <div className={styles.nameSection}>
                <h4 className={styles.name}>{trainer.trainer_name}</h4>
                <span className={styles.badge}>
                  <LuCrown size={14} /> Top Rated
                </span>
              </div>

              <p className={styles.courseName}>{trainer.course_name || "Instructor"}</p>

              <div className={styles.statsContainer}>
                <div className={styles.statItem}>
                  <FaStar className={styles.starIcon} />
                  <span className={styles.statValue}>{trainer.trainerRating || 5}</span>
                  <span className={styles.statLabel}>({reviews.length} reviews)</span>
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
          </div>
        </div>

        <div className="mt-3">
          <h6 className="fw-semibold">ABOUT ME</h6>
          <div
            className="full-review"
            dangerouslySetInnerHTML={{
              __html: trainer.summary?.trim() || "This trainer is highly skilled and has helped many students achieve their goals.",
            }}
          />
        </div>

        <p className="expert-title mt-3">Courses ({trainerCourses.length})</p>
        <div className="training-card-holder">
          {trainerCourses.length > 0 ? (
            trainerCourses.map((course, idx) => (
              <CourseCard
                key={idx}
                heading={course.courseName}
                courseCategory={course.courseCategory}
                month={course.numberOfClasses || course.duration || 0}
                image={`${API_BASE_URL}/${course.courseImage || course.image}`}
                trainer_name={trainer.trainer_name}
                discountPercentage={country === "IN" ? (course.idiscount != null ? Number(course.idiscount) : 0) : course.discount != null ? Number(course.discount) : 0}
                amount={(() => {
                  const isIN = country === "IN";
                  const isUS = country === "US";
                  const rawNow = isIN ? course.itotal : course.total;
                  const valNow = isIN ? Number(rawNow) : Number(rawNow) * (isUS ? 1 : fxFromUSD);
                  return `${currency} ${fmt(valNow)}`;
                })()}
                totalAmount={(() => {
                  const isIN = country === "IN";
                  const isUS = country === "US";
                  const rawMrp = isIN ? course.iamount : course.amount;
                  const valMrp = isIN ? Number(rawMrp) : Number(rawMrp) * (isUS ? 1 : fxFromUSD);
                  return `${fmt(valMrp)}`;
                })()}
                level={course.levels || course.level}
                onClick={() => handleCardClick(course)}
                className="course-card"
              />
            ))
          ) : (
            <p>No courses available for this trainer.</p>
          )}
        </div>

        <p className="expert-title mt-3">Students Feedback</p>
        <div className="feedback-grid">
          {reviews.length > 0 ? (
            reviews.map((fb) => (
              <LearnerCard key={fb.review_id} name={fb.name} location={fb.location} content={fb.review} rating={fb.rating} profileImage={fb.user_image ? `${API_BASE_URL}/userreview/${fb.user_image}` : ""} />
            ))
          ) : (
            <p>No reviews available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorDetails;
