import { useParams, useNavigate } from "react-router-dom";
import styles from "./StudentsSay.module.css";
import { cn } from "../../utils";
import { useUserReviewsByCourse } from "../../Api/hooks/CourseApi/useUserReviewsByCourse";

/* ===============================
   Star Icon
=============================== */
const Star = ({ active }) => (
  <svg viewBox="0 0 24 24" width="16" height="16">
    <path
      fill={active ? "currentColor" : "#ddd"}
      d="M12 17.3l6.18 3.7-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"
    />
  </svg>
);

/* ===============================
   Static KPI + Categories
=============================== */
const kpi = [
  { label: "Overall Rating", value: "4.9/5" },
  { label: "Total Reviews", value: "2,847" },
  { label: "Completion Rate", value: "96%" },
];

const categories = [
  { title: "Course Content Quality", score: 4.9, bar: 92 },
  { title: "Instructor Expertise", score: 4.8, bar: 90 },
  { title: "Learning Support", score: 4.9, bar: 92 },
  { title: "Career Impact", score: 4.7, bar: 88 },
];

export default function StudentsSay({ onCta }) {

   const navigate = useNavigate();
  // const handleCta = onCta || (() => navigate("/coursedetails"));

  const handleCta = onCta || (() => {
  console.log("Navigating to /coursedetails");
  navigate("/coursedetails");
});


  /* ===============================
     Get & normalize course name
  =============================== */
  const { courseName } = useParams();

  const rawSlug = courseName ? decodeURIComponent(courseName) : "";

  const normalizeCourseSlug = (slug) =>
    slug
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  const courseNameForApi = rawSlug ? normalizeCourseSlug(rawSlug) : "";

  /* ===============================
     Fetch reviews by course
  =============================== */
  const {
    data: reviews = [],
    isLoading,
  } = useUserReviewsByCourse(courseNameForApi);

  if (isLoading) return null;

  return (
    <section className={styles.wswrap}>
      <div className="container">
        {/* Header */}
        {/* <div className={styles.wshead}>
          <h2>What Our Students Say</h2>
          <p>Real feedback from our community of learners</p>
        </div> */}

        {/* KPI chips */}
        {/* <div className={styles.wskpis}>
          {kpi.map((x) => (
            <div key={x.label} className={styles.wskpi}>
              <div className={styles.wskpival}>{x.value}</div>
              <div className={styles.wskpilab}>{x.label}</div>
            </div>
          ))}
        </div> */}

        {/* Category Ratings */}
        {/* <div className={styles.wscats}>
          {categories.map((c) => (
            <div key={c.title} className={styles.wscat}>
              <div className={styles.wscattitle}>{c.title}</div>
              <div className={styles.wscatscore}>⭐ {c.score}</div>
              <div className={styles.wsbar}>
                <div
                  className={styles.wsbarfill}
                  style={{ width: `${c.bar}%` }}
                />
              </div>
              <div className={styles.wsresp}>2847 responses</div>
            </div>
          ))}
        </div> */}

        {/* Reviews */}
        <h3 className={styles.wssubhead}>Recent Student Reviews</h3>

        <div className={styles.wsgrid}>
          {reviews.length === 0 && (
            <p style={{ opacity: 0.6 }}>No reviews available yet.</p>
          )}

          {reviews.slice(0, 4).map((r) => {
            const safeRating = Math.min(Number(r.rating) || 0, 5);

            return (
              <article key={r.review_id} className={styles.wscard}>
                <div className={styles.wscardhead}>
                  <div>
                    <div className={styles.wsname}>
                      {r.name || "Anonymous Student"}
                    </div>
                    <div className={styles.wsrole}>
                      {r.course_name}
                    </div>
                  </div>

                  <div className={styles.wsrating}>
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} active={idx < safeRating} />
                    ))}
                    <span className={styles.wsratingnum}>
                      {safeRating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <p className={styles.wstext}>{r.review}</p>
              </article>
            );
          })}
        </div>

        {/* CTA */}
        <div className={styles.wscta}>
          <div className={styles.wsctatitle}>
            Join 45,000+ Satisfied Students
          </div>
          <p>Experience the same transformation that thousands have achieved</p>
          <button type="button" className={styles.wsctabtn} onClick={handleCta}>
            Start Your Journey Today
          </button>
        </div>
      </div>
    </section>
  );
}