import React, { useState, useEffect } from "react";
import "./Corporate.css";
import LearnerCard from "./LearnerCard";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {  useNavigate } from 'react-router-dom';

const Learners = ({ page }) => {
  const navigate= useNavigate();
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerRow, setCardsPerRow] = useState(3);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("https://api.test.hachion.co/userreview");
        const data = await response.json();
        if (Array.isArray(data)) {
          const filteredReviews = data.filter(
            (review) =>
              review.type === true &&
              review.display &&
              review.display.split(",").map((d) => d.trim()).includes(page)
          );
          setReviews(filteredReviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();

    const handleResize = () => {
      if (window.innerWidth < 576) setCardsPerRow(1);
      else if (window.innerWidth < 992) setCardsPerRow(2);
      else setCardsPerRow(3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [page]);

  const totalPages = Math.ceil(reviews.length / cardsPerRow);

  const goToNext = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const goToPrev = () =>
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));

  const startIndex = currentPage * cardsPerRow;
  const currentReviews = reviews.slice(startIndex, startIndex + cardsPerRow);

  const handleReadMore = (index) => {
    setActiveIndex(startIndex + index);
    setShowModal(true);
  };

  return (
    <div className="home-faq-banner container">
    <div className="learner-data position-relative">
      <h2 className="learner-title text-center">
        What Our Learners Are Saying
      </h2>
      <p className="learner-title-tag text-center mb-4">
        At Hachion, our learners’ success speaks louder than words. 
        From students just starting their IT journey to professionals advancing their careers, thousands have trusted us to deliver world-class online IT training, hands-on projects, and certification support.
      </p>

      <div className="position-relative text-center">
      {/* Left Arrow */}
      <FaAngleLeft className="custom-arrow left-arrow" onClick={goToPrev} />
      {/* Right Arrow */}
      <FaAngleRight className="custom-arrow right-arrow" onClick={goToNext} />

      <div className="display-flex row justify-content-center gap-0">
        {currentReviews.map((review, index) => (
          <div key={review.review_id} className="col-12 col-md-6 col-lg-4 mb-3">
            <LearnerCard
              name={review.name}
              location={review.location}
              company={review.company}
              role={review.role}
              content={review.review}
              profileImage={
                review.user_image
                  ? `https://api.test.hachion.co/userreview/${review.user_image}`
                  : ""
              }
              onReadMore={() => handleReadMore(index)}
            />
          </div>
        ))}
      </div>
      </div>

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Student Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reviews[activeIndex] && (
            <div className="full-review">
              <h3>{reviews[activeIndex].name}</h3>
              <p>{reviews[activeIndex].review}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
    <button className="home-start-button" onClick={() => {navigate("/view-all-reviews");}}>View More Reviews</button>
    </div>
  );
};

export default Learners;
