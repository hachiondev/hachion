"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./StudentsSay.module.css";
import { cn } from "@/utils";
import { useUserReviewsByCourse } from "@/Api/hooks/CourseApi/useUserReviewsByCourse";
import CardsPagination from "@/components/UserPanel/Common/CardsPagination";

const Star = ({ active }) => (
  <svg viewBox="0 0 24 24" width="16" height="16">
    <path fill={active ? "currentColor" : "#ddd"} d="M12 17.3l6.18 3.7-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

// Ported from the CRA app's
// src/Components/UserPanel/NewcoursePage/components/StudentsSay.jsx.
// useNavigate -> useRouter.
export default function StudentsSay({ onCta }) {
  const [currentStartIndex, setCurrentStartIndex] = useState(1);
  const [cardsPerPage] = useState(2);
  const [expandedReviews, setExpandedReviews] = useState({});

  const router = useRouter();
  const handleCta =
    onCta ||
    (() => {
      router.push("/courses");
    });

  const { courseName } = useParams();
  const rawSlug = courseName ? decodeURIComponent(courseName) : "";

  const normalizeCourseSlug = (slug) =>
    slug
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  const courseNameForApi = rawSlug ? normalizeCourseSlug(rawSlug) : "";

  const { data: reviews = [], isLoading } = useUserReviewsByCourse(courseNameForApi);

  const paginatedReviews = useMemo(() => {
    const startIndex = currentStartIndex - 1;
    const endIndex = startIndex + cardsPerPage;
    return reviews.slice(startIndex, endIndex);
  }, [reviews, currentStartIndex, cardsPerPage]);

  const toggleReadMore = (id) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    // Resets pagination when the reviews list (an external, fetched source)
    // or cardsPerPage changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentStartIndex(1);
  }, [reviews, cardsPerPage]);

  if (isLoading) return null;

  return (
    <section className={styles.wswrap}>
      <div className="container">
        <div className={styles.wsreviewsSection}>
          <div className={styles.reviewGroup}>
            <h3 className={styles.wssubhead}>Recent Student Reviews</h3>

            {reviews.length > cardsPerPage && (
              <div className={styles.cardPaginationContainer}>
                <CardsPagination currentPage={currentStartIndex} totalCards={reviews.length} cardsPerPage={cardsPerPage} onPageChange={(newStartIndex) => setCurrentStartIndex(newStartIndex)} />
              </div>
            )}
          </div>

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
                        <div className={styles.wsname}>{r.name || "Anonymous Student"}</div>
                        <div className={styles.wsrole}>{r.course_name}</div>
                      </div>

                      <div className={styles.wsrating}>
                        {[...Array(5)].map((_, idx) => (
                          <Star key={idx} active={idx < safeRating} />
                        ))}
                        <span className={styles.wsratingnum}>{safeRating.toFixed(1)}</span>
                      </div>
                    </div>

                    <p className={cn(styles.wstext, !expandedReviews[r.review_id] && styles.clamp2)}>{r.review}</p>

                    {r.review?.length > 120 && (
                      <button type="button" className={styles.readMoreBtn} onClick={() => toggleReadMore(r.review_id)}>
                        {expandedReviews[r.review_id] ? "Read less" : "Read more"}
                      </button>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </div>

        <div className={styles.wscta}>
          <div className={styles.wsctatitle}>Join 45,000+ Satisfied Students</div>
          <p>Experience the same transformation that thousands have achieved</p>
          <button type="button" className={styles.wsctabtn} onClick={handleCta}>
            Start Your Journey Today
          </button>
        </div>
      </div>
    </section>
  );
}
