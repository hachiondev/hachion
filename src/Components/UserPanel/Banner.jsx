import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Banner1 from '../../Assets/banner1.png';
import Banner3 from '../../Assets/banner3.png';
import Banner2 from '../../Assets/bann3.png';
import './Home.css';

const Banner = () => {
  const navigate = useNavigate();
  // Function to handle "Explore More" button click
  const handleExploreMore = () => {
    console.log("Explore More button clicked. Navigating to /course...");
    navigate('/course');
  };

  useEffect(() => {
    console.log("Banner component mounted. Initializing Bootstrap carousel...");

    // Select the carousel element
    const carousel = document.querySelector('#autoScrollingBanner');

    // Check if Bootstrap is available
    if (window.bootstrap && carousel) {
      new window.bootstrap.Carousel(carousel, {
        interval: 3000,
      });

      console.log("Bootstrap carousel initialized successfully.");
    } else {
      console.error("Bootstrap is not loaded or carousel element is missing.");
    }

    return () => {
      console.log("Banner component unmounted. Cleanup executed.");
    };
  }, []);

  return (
    <>
      <div id="autoScrollingBanner" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#autoScrollingBanner" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"
          onClick={() => console.log("Carousel Indicator 1 clicked.")}></button>
          <button type="button" data-bs-target="#autoScrollingBanner" data-bs-slide-to="1" aria-label="Slide 2"
          onClick={() => console.log("Carousel Indicator 2 clicked.")}></button>
          <button type="button" data-bs-target="#autoScrollingBanner" data-bs-slide-to="2" aria-label="Slide 3"
          onClick={() => console.log("Carousel Indicator 3 clicked.")}></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={Banner1} className="d-block w-100" alt="Banner1" />
            <div className="carousel-caption">
              <div className='carousel-btn'>
             
                <button className="coupon-btn" onClick={handleExploreMore}>Explore More</button>
                </div>
            </div>
          </div>
          <div className="carousel-item">
            <img src={Banner3} className="d-block w-100" alt="Banner3" />
            <div className="carousel-caption">
            <div className='carousel-btn'>
        
                <button className="register-now-btn" onClick={handleExploreMore}>Explore More</button>
              </div>
            </div>
          </div>

          <div className="carousel-item">
          <a href="/Salesforce-Workshop">
            <img src={Banner2} className="d-block w-100" alt="Banner2" />
            </a>
            <div className="carousel-caption">
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Banner;