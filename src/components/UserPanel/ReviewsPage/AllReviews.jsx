"use client";

import { useMemo, useRef } from "react";
import Image from "next/image";
import { useLearnerReviews } from "@/Api/hooks/HomePageApi/LearnerApi/useLearnerReviews";
import { useCorporateReviews } from "@/Api/hooks/HomePageApi/useCorporateReviews";
import ReviewCarousel, { mapLearnerReview, mapCorporateReview } from "./ReviewCarousel";
import Association from "@/components/UserPanel/Association";
import HomeFaq from "@/components/UserPanel/HomeFaq";
import viewReviewsBanner from "@/assets/viewreviews-banner.webp";
import "../Corporate.css";
import "../Home.css";

const AllReviews = () => {
  const { data: allLearnerReviews = [], isLoading: learnerLoading } = useLearnerReviews();
  const { data: corporateReviewsRaw = [], isLoading: corporateLoading } = useCorporateReviews();

  const studentReviews = useMemo(
    () => allLearnerReviews.filter((r) => r.type === true).map(mapLearnerReview),
    [allLearnerReviews]
  );
  const liveReviews = useMemo(
    () => allLearnerReviews.filter((r) => r.type === true && r.videoLink).map(mapLearnerReview),
    [allLearnerReviews]
  );
  const corporateReviews = useMemo(
    () => corporateReviewsRaw.map(mapCorporateReview),
    [corporateReviewsRaw]
  );

  const feedbackRef = useRef(null);
  const scrollToFeedback = () => {
    feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="home-banner container">
        <div className="home-content">
          <h1 className="home-title">
            Hear From <span className="home-title-span">Our Learners</span>
          </h1>
          <p className="home-title-text">
            Discover how we&rsquo;ve helped students and professionals achieve their goals.
          </p>
          <div className="button-row">
            <button className="home-start-button" onClick={scrollToFeedback}>
              View Success Stories
            </button>
          </div>
        </div>
        <Image className="home-banner-img" src={viewReviewsBanner} alt="Learner feedback banner" priority />
      </div>

      <div ref={feedbackRef}>
        <ReviewCarousel
          heading="Our Corporate Feedback"
          subtitle="Don't take our word for it. Trust our customers."
          reviews={corporateReviews}
          isLoading={corporateLoading}
          emptyMessage="No Corporate Feedback Available"
        />
      </div>

      <ReviewCarousel
        heading="Our Student Feedback"
        subtitle="Don't take our word for it. Trust our customers."
        reviews={studentReviews}
        isLoading={learnerLoading}
        emptyMessage="No Student Feedback Available"
      />

      <ReviewCarousel
        heading="Live Reviews"
        reviews={liveReviews}
        isLoading={learnerLoading}
        emptyMessage="No Live Reviews Available"
      />

      <div className="training-events container">
        <h3 className="it-reviews-head">Our Alumni Works At</h3>
        <div className="it-logos-grid container">
          <Association />
        </div>

        <HomeFaq />
      </div>
    </>
  );
};

export default AllReviews;
