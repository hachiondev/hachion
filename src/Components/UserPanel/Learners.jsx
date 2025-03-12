import React, { useState, useEffect } from 'react';
import './Corporate.css';
// import { ImQuotesLeft, ImQuotesRight } from "react-icons/im";
import { Carousel } from 'react-bootstrap';
import LearnerCard from './LearnerCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';

const Learners = () => {
  const [reviews, setReviews] = useState([]); // State to store API data
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Fetch data from the API
    const fetchReviews = async () => {
      try {
        const response = await fetch('https://api.hachion.co/userreview'); // Replace with your API URL
        const data = await response.json();
        setReviews(data); // Update state with API data
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();

    // Handle responsive design
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='training-events'>
      <div className='association'>
        <h1 className='association-head'>Our Students Feedback</h1>
      </div>

      {/* <ImQuotesLeft className='left-quotes' /> */}
      {/* <div className='learner-cover'> */}
      <div className='learner-background'>
        <Carousel
          indicators={true}
          prevIcon={<FaAngleLeft className="custom-prev-icon" />}
          nextIcon={<FaAngleRight className="custom-next-icon" />}
          interval={null}
        >
          {/* Divide reviews into chunks for Carousel Items */}
          {reviews.map((review, index) => (
            <Carousel.Item key={index}>
              <div className='learner-card-item'>
                {/* Render the first card */}
                <LearnerCard
    key={review.review_id}
    name={review.name}
    profile={review.course_name}
    location={review.location}
    content={review.review}
    social_id={review.social_id}
    rating={review.rating}
    image={review.user_image?`https://api.hachion.co/${review.user_image}` : ''}
  />
                {/* Conditionally render the second card for desktop/tablet */}
                {!isMobile && reviews[index + 1] && (
                  <LearnerCard
                    name={reviews[index + 1].name}
                    profile={reviews[index + 1].course_name}
                    location={reviews[index + 1].location}
                    content={reviews[index + 1].review}
                    image={reviews[index + 1].user_image}
                  />
                )}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
      {/* <ImQuotesRight className='right-quotes' /> */}
    </div>
  );
};

export default Learners;