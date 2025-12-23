import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Style.css";
import "./Home.css";
import Learners from "./HomePage/LearnerSection/Learners";
import ExploreDeals from "./ExploreDeals";

const DiscountDeals = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch banners from backend API
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("https://api.test.hachion.co/banner");

        const enabledHomeBanners = (res.data || []).filter(
          (b) => b.home_status === "Enabled" && b.home_banner_image
        );

        setBanners(enabledHomeBanners);
      } catch (error) {
        console.error("Failed to load banners", error);
        setBanners([]);
      }
    })();
  }, []);

  // Auto slide every 5 seconds (safe)
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="course-top">
      {/* ✅ Banner Carousel */}
      {banners.length > 0 && (
        <>
          <div className="discount-banner-carousel">
            <div
              className="discount-banner-wrapper"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {banners.map((banner, index) => (
                <img
                  key={banner.banner_id}
                  src={`https://api.test.hachion.co/uploads/prod/banner_images${banner.home_banner_image}`}
                  alt={`Banner ${index + 1}`}
                  className="discount-banner-slide"
                  onClick={() =>
                    banner.path && window.open(banner.path, "_blank")
                  }
                  style={{
                    cursor: banner.path ? "pointer" : "default",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="discount-banner-indicators">
            {banners.map((_, index) => (
              <span
                key={index}
                className={`discount-indicator ${
                  index === current ? "active" : ""
                }`}
                onClick={() => setCurrent(index)}
              />
            ))}
          </div>
        </>
      )}

      {/* Course Deals */}
      <ExploreDeals />

      {/* Learners Section */}
      <Learners page="home" />
    </div>
  );
};

export default DiscountDeals;
