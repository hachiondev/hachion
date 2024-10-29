import React, { useEffect } from 'react';
import Banner1 from '../../Assets/banner1.png';
import Banner2 from '../../Assets/banner2.png';
import './Home.css';

const Banner = () => {
  useEffect(() => {
  
    const carousel = document.querySelector('#autoScrollingBanner');
    const bootstrapCarousel = new window.bootstrap.Carousel(carousel, {
      interval: 3000,
    });
  }, []);

  return (
    <>
      <div id="autoScrollingBanner" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#autoScrollingBanner" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#autoScrollingBanner" data-bs-slide-to="1" aria-label="Slide 2"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={Banner1} className="d-block w-100" alt="Banner1" />
            <div className="carousel-caption">
              <div className='carousel-btn'>
             
                <button className="coupon-btn">Coupon: Hach10</button>
                </div>
            </div>
          </div>
          <div className="carousel-item">
            <img src={Banner2} className="d-block w-100" alt="Banner2" />
            <div className="carousel-caption">
            <div className='carousel-btn'>
        
                <button className="register-now-btn">Register Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;