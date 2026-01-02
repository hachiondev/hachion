import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import styles from "./StudentsSay.module.css";
import { cn } from "../../../../utils";
import { useUserReviewsByCourse } from "../../../../Api/hooks/CourseApi/useUserReviewsByCourse";
import CardsPagination from "../../../UserPanel/Common/CardsPagination";

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

export default function StudentsSay({ onCta }) {
  const [currentStartIndex, setCurrentStartIndex] = useState(1); // Starting card index (1-based)
  const [cardsPerPage, setCardsPerPage] = useState(2); // Show 2 cards per page

  const navigate = useNavigate();
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

  // Calculate paginated reviews - use currentStartIndex (1-based)
  const paginatedReviews = useMemo(() => {
    const startIndex = currentStartIndex - 1; // Convert to 0-based
    const endIndex = startIndex + cardsPerPage;
    return reviews.slice(startIndex, endIndex);
  }, [reviews, currentStartIndex, cardsPerPage]);

  // Reset to first card when tools change or cards per page changes
  useEffect(() => {
    setCurrentStartIndex(1);
  }, [reviews, cardsPerPage]);

  if (isLoading) return null;

  return (
    <section className={styles.wswrap}>
      <div className="container">
        {/* Reviews with Pagination */}
        <div className={styles.wsreviewsSection}>
          <div className={styles.reviewGroup}>
                      <h3 className={styles.wssubhead}>Recent Student Reviews</h3>
          
          {/* Pagination - Show only if there are more than 2 reviews */}
          {reviews.length > cardsPerPage && (
            <div className={styles.cardPaginationContainer}>
              <CardsPagination
                currentPage={currentStartIndex}
                totalCards={reviews.length}
                cardsPerPage={cardsPerPage}
                onPageChange={(newStartIndex) => setCurrentStartIndex(newStartIndex)}
              />
            </div>
          )}
          </div>


          {/* Reviews Grid - Show 2 cards per page */}
          <div className={styles.wsgrid}>
            {paginatedReviews.length === 0 ? (
              <p>No reviews available yet.</p>
            ) : (
              paginatedReviews.map((r) => {
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
              })
            )}
          </div>
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