"use client";

import { useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import LearnerCard from "@/components/UserPanel/HomePage/LearnerSection/components/LearnerCard";

// Shared "Our Corporate Feedback" / "Our Student Feedback" / "Live Reviews"
// carousel on the View All Reviews page — same card/arrow mechanics as the
// homepage's Learners.jsx (reuses LearnerCard, which already owns its own
// "Read More" dialog), but with a configurable heading/subtitle/empty
// state so one component serves all three review sources instead of
// duplicating the carousel logic three times.
const ReviewCarousel = ({ heading, subtitle, reviews = [], isLoading, emptyMessage }) => {
  const [cardsPerRow, setCardsPerRow] = useState(3);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) setCardsPerRow(1);
      else if (window.innerWidth < 992) setCardsPerRow(2);
      else setCardsPerRow(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setStartIndex(0);
  }, [reviews.length]);

  // Clamped rather than stored in state: keeps the visible window in
  // bounds immediately after a resize changes cardsPerRow, with no extra
  // render/effect needed.
  const maxStartIndex = Math.max(0, reviews.length - cardsPerRow);
  const clampedStartIndex = Math.min(startIndex, maxStartIndex);
  const isAtStart = clampedStartIndex <= 0;
  const isAtEnd = clampedStartIndex >= maxStartIndex;

  const goToNext = () => setStartIndex(Math.min(clampedStartIndex + 1, maxStartIndex));
  const goToPrev = () => setStartIndex(Math.max(clampedStartIndex - 1, 0));

  const currentReviews = reviews.slice(clampedStartIndex, clampedStartIndex + cardsPerRow);

  const showArrows = !isLoading && reviews.length > cardsPerRow;

  return (
    <div className="training-events container">
      <div className="training-title-head">
        <div className="home-spacing">
          <h2 className="association-head">{heading}</h2>
          {subtitle && <p className="association-head-tag">{subtitle}</p>}
        </div>

        {showArrows && (
          <div className="cards-pagination">
            <button type="button" className="arrow" onClick={goToPrev} disabled={isAtStart} aria-label="Previous review">
              <FaAngleLeft />
            </button>
            <button type="button" className="arrow" onClick={goToNext} disabled={isAtEnd} aria-label="Next review">
              <FaAngleRight />
            </button>
          </div>
        )}
      </div>

      <div className="display-flex row justify-content-center gap-0">
        {isLoading &&
          Array.from({ length: cardsPerRow }).map((_, i) => (
            <div key={i} className="col-12 col-md-6 col-lg-4 mb-3">
              <div className="skeleton-card" />
            </div>
          ))}

        {!isLoading && reviews.length === 0 && (
          <div className="col-12 text-center py-4">
            <p className="text-dark mb-0">{emptyMessage}</p>
          </div>
        )}

        {!isLoading &&
          currentReviews.map((review) => (
            <div key={review.review_id ?? review.corporateReviewId} className="col-12 col-md-6 col-lg-4 mb-3">
              <LearnerCard
                name={review.name}
                location={review.location}
                company={review.company}
                role={review.role}
                content={review.content}
                rating={review.rating}
                profileImage={review.profileImage}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

// Normalizes /userreview records (name/review/user_image) to the shape
// LearnerCard/ReviewCarousel expect.
export const mapLearnerReview = (review) => ({
  review_id: review.review_id,
  name: review.name,
  location: review.location,
  company: review.company,
  role: review.role,
  content: review.review,
  rating: review.rating,
  profileImage: review.user_image ? `https://api.hachion.co/userreview/${review.user_image}` : "",
});

// Normalizes /corporatereview records (employeeName/comment/companyLogo) to
// the same shape.
export const mapCorporateReview = (review) => ({
  corporateReviewId: review.corporateReviewId,
  name: review.employeeName,
  location: review.location,
  company: review.company,
  role: review.role,
  content: review.comment,
  rating: review.employeeRating,
  profileImage: review.companyLogo
    ? `https://api.hachion.co/corporatereview/logos/${review.companyLogo.replace(/^logos\//, "")}`
    : "",
});

export default ReviewCarousel;
