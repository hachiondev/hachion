import React, { useState, useEffect } from 'react';
import './Corporate.css';
import './Blogs.css';
import { Carousel, Modal } from 'react-bootstrap';
import LearnerCard from './LearnerCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';

const WorkshopLearners = ({ page }) => {
  const [reviews, setReviews] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showModal, setShowModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('https://api.hachion.co/userreview');
        const data = await response.json();

        if (Array.isArray(data)) {
          const filteredReviews = data.filter(
            (review) =>
              review.type === true &&
              review.display &&
              typeof review.display === 'string' &&
              review.display.split(',').map((d) => d.trim()).includes(page)
          );
          setReviews(filteredReviews);
        } else {
          console.error('Invalid API response', data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [page]);

  const chunkArray = (arr, chunkSize) => {
    return arr.reduce((acc, _, i) => {
      if (i % chunkSize === 0) acc.push(arr.slice(i, i + chunkSize));
      return acc;
    }, []);
  };

  const groupedReviews = chunkArray(reviews, isMobile ? 1 : 3);

  const handleReadMore = (index) => {
    setActiveIndex(index);
    setShowModal(true);
  };

  const goToPrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? groupedReviews.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % groupedReviews.length);
  };

  return (
    <div>
      <div className="workshop-content">
        <h2 className="workshop-heading">Our Students Feedback</h2>
      </div>

      <div className="learner-background">
        <Carousel
          activeIndex={activeIndex}
          onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
          indicators={false}
          controls={false}
          interval={null}
        >
          {groupedReviews.map((group, index) => (
            <Carousel.Item key={index}>
              <div className="learner-card-container">
                {group.map((review, idx) => (
                  <LearnerCard
                    key={review.review_id}
                    name={review.name}
                    profile={review.course_name}
                    location={review.location}
                    content={review.review}
                    social_id={review.social_id}
                    rating={review.rating}
                    profileImage={
                      review.user_image
                        ? `https://api.hachion.co/${review.user_image}`
                        : ''
                    }
                    onReadMore={() =>
                      handleReadMore(index * (isMobile ? 1 : 3) + idx)
                    }
                  />
                ))}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>

        {/* Arrows and Indicators */}
        <div className="carousel-nav">
          <FaAngleLeft className="custom-prev-icon" onClick={goToPrev} />

          <div className="indicator-wrapper">
            <ul className="carousel-indicators-line">
              {groupedReviews.map((_, index) => (
                <li
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={index === activeIndex ? 'active' : ''}
                />
              ))}
            </ul>
          </div>

          <FaAngleRight className="custom-next-icon" onClick={goToNext} />
        </div>

        {/* Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Student Review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Carousel
              activeIndex={activeIndex}
              onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
              indicators={false}
              prevIcon={<FaAngleLeft className="custom-prev-icon" />}
              nextIcon={<FaAngleRight className="custom-next-icon" />}
              interval={null}
            >
              {reviews.map((review, index) => (
                <Carousel.Item key={index}>
                  <div className="full-review">
                    <h3>{review.name}</h3>
                    <p>{review.review}</p>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default WorkshopLearners;
