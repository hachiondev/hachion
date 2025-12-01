import React, { useState, useEffect } from "react";
import DiscountBanner1 from "../../Assets/d1.webp";
import DiscountBanner2 from "../../Assets/d2.webp";
import DiscountBanner3 from "../../Assets/d3.webp";
import "./Style.css";
import "./Home.css";
import Learners from "./Learners";
import ExploreDeals from "./ExploreDeals";

const DiscountDeals = () => {
  const banners = [DiscountBanner1, DiscountBanner2, DiscountBanner3];
  const [current, setCurrent] = useState(0);

  // Auto slide every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  return (
    <div className="course-top">
      {/* ✅ Carousel */}
      <div className="discount-banner-carousel ">
        {/* Slides */}
        <div
          className="discount-banner-wrapper"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <img
              key={index}
              src={banner}
              alt={`Banner ${index + 1}`}
              className="discount-banner-slide"
            />
          ))}
        </div>
      </div>

      <div className="discount-banner-indicators">
        {banners.map((_, index) => (
          <span
            key={index}
            className={`discount-indicator ${index === current ? "active" : ""}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>

      {/* <div className="home-faq-data container">
        <div className="view-faq-content">
          <HelpFaq />
        </div>
      </div> */}
      <ExploreDeals />
      <Learners page="home"/>
    </div>
  );
};

export default DiscountDeals;