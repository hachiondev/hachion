import React, { useEffect, useState } from "react";
import axios from "axios";
import Banner3 from "../../Assets/banner3.png";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [apiError, setApiError] = useState(false);

  const staticBanner = { home_banner_image: Banner3 };

  useEffect(() => {
    axios
      .get("http://localhost:8080/banner")
      .then((response) => {
        if (response.data.length > 0) {
          // Add static banner at the start
          const combinedBanners = [staticBanner, ...response.data];
          console.log(combinedBanners);
          setBanners(combinedBanners);
          setApiError(false);
        } else {
          setApiError(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching banners:", error);
        setApiError(true);
      });
  }, []);

  const displayBanners = apiError
    ? [staticBanner]
    : [
        staticBanner,
        ...banners.filter((banner) => banner.home_status === "Enabled"),
      ];

  return (
    <div
      id="autoScrollingBanner"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="3000"
    >
      <div className="carousel-indicators">
        {displayBanners.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#autoScrollingBanner"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      <div className="carousel-inner">
        {displayBanners.map((banner, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            {banner.path ? (
              <a href={banner.path}>
                <img
                  src={
                    apiError || index === 0
                      ? banner.home_banner_image
                      : `http://localhost:8080/${banner.home_banner_image}`
                  }
                  className="banner-img"
                  alt={`Banner ${index + 1}`}
                />
              </a>
            ) : (
              <img
                src={
                  apiError || index === 0
                    ? banner.home_banner_image
                    : `http://localhost:8080/${banner.home_banner_image}`
                }
                className="banner-img"
                alt={`Banner ${index + 1}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Banner;