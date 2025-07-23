import React, { useEffect, useState } from "react";
import axios from "axios";
import Banner3 from "../../Assets/banner3.webp";
import { Helmet } from "react-helmet";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    const staticBanner = { home_banner_image: Banner3 };

    const timer = setTimeout(() => {
      axios
        .get("https://api.hachion.co/banner")
        .then((response) => {
          if (response.data.length > 0) {
            const combinedBanners = [staticBanner, ...response.data];
            setBanners(combinedBanners);
            setApiError(false);
          } else {
            setBanners([staticBanner]);
            setApiError(true);
          }
        })
        .catch((error) => {
          console.error("Error fetching banners:", error);
          setBanners([staticBanner]);
          setApiError(true);
        });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const displayBanners =
    banners.length > 0 ? banners : [{ home_banner_image: Banner3 }];

  return (
    <>
      <Helmet>
        <link rel="preload" as="image" href={Banner3} type="image/webp" fetchpriority="high"/>
      </Helmet>

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
            />
          ))}
        </div>

        <div className="carousel-inner">
          {displayBanners.map((banner, index) => {
            const imageUrl =
              index === 0 || apiError
                ? banner.home_banner_image
                : `https://api.hachion.co/${banner.home_banner_image}`;

            return (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                {banner.path ? (
                  <a href={banner.path}>
                    <img
                      src={imageUrl}
                      className="banner-img"
                      alt={`Banner ${index + 1}`}
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchpriority={index === 0 ? "high" : "auto"}
                      decoding="async"
                      crossOrigin="anonymous"
                    />
                  </a>
                ) : (
                  <img
                    src={imageUrl}
                    className="banner-img"
                    alt={`Banner ${index + 1}`}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchpriority={index === 0 ? "high" : "auto"}
                    decoding="async"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Banner;
