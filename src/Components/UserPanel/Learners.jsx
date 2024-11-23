import React, { useState, useEffect } from 'react';
import './Corporate.css';
import { ImQuotesLeft, ImQuotesRight } from "react-icons/im";
import { Carousel } from 'react-bootstrap';
import LearnerCard from './LearnerCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';

const Learners = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);  // Mobile devices
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div className='training-events'>
        <div className='association'>
          <h1 className='association-head'>Our Students Feedback</h1>
        </div>
        
        <ImQuotesLeft className='left-quotes' />
        <div className='learner-cover'>
          <Carousel
            indicators={true} 
            prevIcon={<FaAngleLeft className="custom-prev-icon" />} 
            nextIcon={<FaAngleRight className="custom-next-icon" />} 
            interval={null} 
          >
            <Carousel.Item>
              <div className='learner-card-item'>
                <LearnerCard
                  name='Dhananjay'
                  profile='Android app developer'
                  location='Canada'
                  content='Hachion is a great place for fresher’s can learn good communication skills and subjects in this institute and they will place you according to your talent.'
                />
                {/* Conditionally render the second card for desktop/tablet */}
                {!isMobile && (
                  <LearnerCard
                    name='Henry Lee'
                    profile='IOS app developer'
                    location='USA'
                    content='The best training and placement institute that I came across, created a good platform for achieving my dream as an IOS developer.'
                  />
                )}
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className='learner-card-item'>
                <LearnerCard
                  name='John Doe'
                  profile='Web Developer'
                  location='UK'
                  content='Excellent learning experience, great instructors, and fantastic career support. You can learn along with your work because of flexible timing.'
                />
                {!isMobile && (
                  <LearnerCard
                    name='Jane Smith'
                    profile='Data Scientist'
                    location='Australia'
                    content='The training was comprehensive and the placement support was exceptional. This is the best learning platform for any individual to boost technical skills.'
                  />
                )}
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className='learner-card-item'>
                <LearnerCard
                  name='Doe'
                  profile='Android Developer'
                  location='Us'
                  content='Excellent learning experience, great instructors, and fantastic career support. You can learn along with your work because of flexible timing.'
                />
                {!isMobile && (
                  <LearnerCard
                    name='Smith'
                    profile='Data Scientist'
                    location='Australia'
                    content='The training was comprehensive and the placement support was exceptional. This is the best learning platform for any individual to boost technical skills.'
                  />
                )}
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className='learner-card-item'>
                <LearnerCard
                  name='Sam'
                  profile='Web Developer'
                  location='UK'
                  content='Excellent learning experience, great instructors, and fantastic career support. You can learn along with your work because of flexible timing.'
                />
                {!isMobile && (
                  <LearnerCard
                    name='Raj'
                    profile='Data Scientist'
                    location='Australia'
                    content='The training was comprehensive and the placement support was exceptional. This is the best learning platform for any individual to boost technical skills.'
                  />
                )}
              </div>
            </Carousel.Item>
          </Carousel>
        </div>
        <ImQuotesRight className='right-quotes' />
      </div>
    </>
  );
}

export default Learners;
