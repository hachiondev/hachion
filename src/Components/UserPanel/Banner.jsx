// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Banner3 from "../../Assets/banner3.webp";
// import { Helmet } from "react-helmet";

// const Banner = () => {
//   const [banners, setBanners] = useState([]);
//   const [apiError, setApiError] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const staticBanner = { home_banner_image: Banner3 };

//     const timer = setTimeout(() => {
//       axios
//         .get("https://api.hachion.co/banner")
//         .then((response) => {
//           if (response.data.length > 0) {
//             const combinedBanners = [staticBanner, ...response.data];
//             const validBanners = combinedBanners.filter(b => b.home_banner_image);
// setBanners(validBanners);
//             setApiError(false);
//           } else {
//             setBanners([staticBanner]);
//             setApiError(true);
//           }
//         })
//         .catch((error) => {
//           console.error("Error fetching banners:", error);
//           setBanners([staticBanner]);
//           setApiError(true);
//         })
//         .finally(() => setLoading(false));
//     }, 500);

//     return () => clearTimeout(timer);
//   }, []);

//   // const displayBanners =
//   //   banners.length > 0 ? banners : [{ home_banner_image: Banner3 }];
// const displayBanners =
//   banners.length > 0
//     ? banners.filter(b => b.home_banner_image)
//     : [{ home_banner_image: Banner3 }];
//   return (
//     <>
//       <Helmet>
//         <link rel="preload" as="image" href={Banner3} type="image/webp" fetchpriority="high"/>
//       </Helmet>

//       {loading ? (
//         <div className="banner-skeleton">
//           <div className="banner-skeleton-image" />
//         </div>
//       ) : (
//         <div
//           id="autoScrollingBanner"
//           className="carousel slide"
//           data-bs-ride="carousel"
//           data-bs-interval="3000"
//         >
//           <div className="carousel-indicators">
//             {displayBanners.map((_, index) => (
//               <button
//                 key={index}
//                 type="button"
//                 data-bs-target="#autoScrollingBanner"
//                 data-bs-slide-to={index}
//                 className={index === 0 ? "active" : ""}
//                 aria-label={`Slide ${index + 1}`}
//               />
//             ))}
//           </div>

//           <div className="carousel-inner">
//             {displayBanners.map((banner, index) => {
//               const imageUrl =
//                 index === 0 || apiError
//                   ? banner.home_banner_image
//                   : `https://api.hachion.co/${banner.home_banner_image}`;
//               return (
//                 <div
//                   key={index}
//                   className={`carousel-item ${index === 0 ? "active" : ""}`}
//                 >
//                   {banner.path ? (
//                     <a href={banner.path}>
//                       <img
//                         src={imageUrl}
//                         className="banner-img"
//                         alt={`Banner ${index + 1}`}
//                         loading={index === 0 ? "eager" : "lazy"}
//                         fetchpriority={index === 0 ? "high" : "auto"}
//                         decoding="async"
//                         crossOrigin="anonymous"
//                       />
//                     </a>
//                   ) : (
//                     <img
//                       src={imageUrl}
//                       className="banner-img"
//                       alt={`Banner ${index + 1}`}
//                       loading={index === 0 ? "eager" : "lazy"}
//                       fetchpriority={index === 0 ? "high" : "auto"}
//                       decoding="async"
//                     />
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Banner;

import React, { useEffect, useState, useRef } from "react";
import banner from "../../Assets/newBanner.webp";
import { Link } from "react-router-dom";
import AvatarCount from "./AvatarCount";
import { motion } from "framer-motion";
import "./Home.css";

const Banner = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const postJobRef = useRef(null);

  useEffect(() => {
    console.log("Privacy component mounted. Scrolling to top...");
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="home-banner">
      {/* Left side content */}
      <motion.div
        className="home-content"
        initial={{ x: -150, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <h1 className="home-title">
          <span className="home-title-span">Boost Your Career</span> with
          Industry-Recognized Skills
        </h1>
        <p className="home-title-text">
          Flexible, affordable courses designed to help you achieve your goals,
          whether you're at home, on the go, or anywhere in between.
        </p>
        <div className="avatar-row">
          <AvatarCount /> <span className="home-sub-text">Join with us</span>
        </div>
        <div className="button-row">
          <button className="home-start-button">Start Your Certification</button>
          <Link className="home-browse-button">Browse All Courses</Link>
        </div>
      </motion.div>

      {/* Right side image */}
      <motion.img
        className="home-banner-img"
        src={banner}
        alt="Home banner"
        fetchpriority="high"
        initial={{ x: 150, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
    </div>
  );
};

export default Banner;

