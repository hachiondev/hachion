"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Style.css";
import "./Home.css";
import Learners from "./HomePage/LearnerSection/Learners";
import ExploreDeals from "./ExploreDeals";
import { API_BASE_URL } from "@/lib/apiBase";

// Ported from the CRA app's src/Components/UserPanel/DiscountDeals.jsx
// (the /discountdeals page). Metadata/canonical live in
// app/(public)/discountdeals/page.js via the Next.js Metadata API instead
// of react-helmet-async/<Canonical>.
const DiscountDeals = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/banner`);
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

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="course-top">
      {banners.length > 0 && (
        <>
          <div className="discount-banner-carousel">
            <div
              className="discount-banner-wrapper"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {banners.map((banner, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={banner.banner_id}
                  src={`${API_BASE_URL}/uploads/prod/banner_images/${banner.home_banner_image}`}
                  alt={`Banner ${index + 1}`}
                  className="discount-banner-slide"
                  onClick={() => banner.path && window.open(banner.path, "_blank")}
                  style={{ cursor: banner.path ? "pointer" : "default" }}
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
        </>
      )}

      <ExploreDeals />

      <Learners page="home" />
    </div>
  );
};

export default DiscountDeals;
