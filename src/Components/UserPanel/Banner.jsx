// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Banner1 from '../../Assets/banner1.png';
// import Banner3 from '../../Assets/banner3.png';
// import Banner2 from '../../Assets/banne3.png';
// import './Home.css';

// const Banner = () => {
//   const navigate = useNavigate();
//   // Function to handle "Explore More" button click
//   const handleExploreMore = () => {
//     console.log("Explore More button clicked. Navigating to /course...");
//     navigate('/course');
//   };

//   const handleJoinNow = () => {
//     console.log("Join Now button clicked. Navigating to /Salesforce-Workshop...");
//     navigate('/Salesforce-Workshop');
//   };

//   useEffect(() => {
//     console.log("Banner component mounted. Initializing Bootstrap carousel...");

//     // Select the carousel element
//     const carousel = document.querySelector('#autoScrollingBanner');

//     // Check if Bootstrap is available
//     if (window.bootstrap && carousel) {
//       new window.bootstrap.Carousel(carousel, {
//         interval: 3000,
//       });

//       console.log("Bootstrap carousel initialized successfully.");
//     } else {
//       console.error("Bootstrap is not loaded or carousel element is missing.");
//     }

//     return () => {
//       console.log("Banner component unmounted. Cleanup executed.");
//     };
//   }, []);

//   return (
//     <>
//       <div id="autoScrollingBanner" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
//         <div className="carousel-indicators">
//           <button type="button" data-bs-target="#autoScrollingBanner" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"
//           onClick={() => console.log("Carousel Indicator 1 clicked.")}></button>
//           <button type="button" data-bs-target="#autoScrollingBanner" data-bs-slide-to="1" aria-label="Slide 2"
//           onClick={() => console.log("Carousel Indicator 2 clicked.")}></button>
//           <button type="button" data-bs-target="#autoScrollingBanner" data-bs-slide-to="2" aria-label="Slide 3"
//           onClick={() => console.log("Carousel Indicator 3 clicked.")}></button>
//         </div>
//         <div className="carousel-inner">
//           <div className="carousel-item active">
//             <img src={Banner1} className="d-block w-100" alt="Banner1" />
//             <div className="carousel-caption">
//               <div className='carousel-btn'>
             
//                 <button className="coupon-btn" onClick={handleExploreMore}>Explore More</button>
//                 </div>
//             </div>
//           </div>
//           <div className="carousel-item">
//             <img src={Banner3} className="d-block w-100" alt="Banner3" />
//             <div className="carousel-caption">
//             <div className='carousel-btn'>
        
//                 <button className="register-now-btn" onClick={handleExploreMore}>Explore More</button>
//               </div>
//             </div>
//           </div>

//           <div className="carousel-item">
//             <img src={Banner2} className="d-block w-100" alt="Banner2" />
//             <div className="carousel-caption">
//             <div className='carousel-join-btn'>
        
//                 <button className="join-now" onClick={handleJoinNow}>Join Now</button>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default Banner;
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './Home.css';

// const Banner = () => {
//   const navigate = useNavigate();
//   const [banners, setBanners] = useState([]);

//   // Fetch banners from API
//   useEffect(() => {
//     const fetchBanners = async () => {
//       try {
//         const response = await axios.get('https://api.hachion.co/banner');
        
//         // Filter out banners where home_banner_image is missing or empty
//         const filteredBanners = response.data.filter(banner => banner.home_banner_image?.trim());

//         setBanners(filteredBanners);
//       } catch (error) {
//         console.error("Error fetching banners:", error);
//       }
//     };

//     fetchBanners();
//   }, []);

//   // Handle button clicks
//   const handleExploreMore = () => navigate('/coursedetails');
//   const handleJoinNow = () => navigate('/Salesforce-Workshop');

//   return (
//     <div id="autoScrollingBanner" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
//       {banners.length > 0 ? (
//         <>
//           <div className="carousel-indicators">
//             {banners.map((_, index) => (
//               <button 
//                 key={index} 
//                 type="button" 
//                 data-bs-target="#autoScrollingBanner" 
//                 data-bs-slide-to={index} 
//                 className={index === 0 ? "active" : ""}
//               ></button>
//             ))}
//           </div>

//           <div className="carousel-inner">
//             {banners.map((banner, index) => (
//               <div key={banner.banner_id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
//                 <img 
//                   src={`https://api.hachion.co/${banner.home_banner_image}`} 
//                   className="d-block w-100" 
//                   alt={`Banner ${banner.banner_id}`} 
//                 />
//                 <div className="carousel-caption">
//                   <div className='carousel-btn'>
//                     {index === banners.length - 1 ? (
//                       <button className="join-now" onClick={handleJoinNow}>Join Now</button>
//                     ) : (
//                       <button className="join-now" onClick={handleExploreMore}>Explore More</button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       ) : (
//         <p className="no-banner-message">No banners available</p>
//       )}
//     </div>
//   );
// };

// export default Banner;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Banner1 from "../../Assets/banner1.png";
import Banner3 from "../../Assets/banner3.png";
import Banner2 from "../../Assets/banne3.png";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [apiError, setApiError] = useState(false);
  const navigate = useNavigate();

  const staticBanner = { home_banner_image: Banner3 }; // This one will always be included

  useEffect(() => {
    axios
      .get("https://api.hachion.co/banner")
      .then((response) => {
        if (response.data.length > 0) {
          // Add static banner at the start
          const combinedBanners = [staticBanner, ...response.data];
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

  const handleExploreMore = () => navigate("/course");
  const handleJoinNow = () => navigate("/Salesforce-Workshop");

  const displayBanners = apiError ? [staticBanner] : banners;

  return (
    <div id="autoScrollingBanner" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
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
          <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
            <img
              src={apiError || index === 0 ? banner.home_banner_image : `https://api.hachion.co/${banner.home_banner_image}`}
              className="d-block w-100"
              alt={`Banner ${index + 1}`}
            />
            <div className="carousel-caption">
              <div className="carousel-btn">
                {index === displayBanners.length - 1 ? (
                  <button className="join-now" onClick={handleJoinNow}>Join Now</button>
                ) : (
                  <button className="join-now" onClick={handleExploreMore}>Explore More</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Banner;

// const Banner = () => {
//   const [banners, setBanners] = useState([]);
//   const [apiError, setApiError] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get("https://api.hachion.co/banner")
//       .then((response) => {
//         if (response.data.length > 0) {
//           setBanners(response.data);
//           setApiError(false);
//         } else {
//           setApiError(true);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching banners:", error);
//         setApiError(true); // Set error flag if API fails
//       });
//   }, []);

//   const handleExploreMore = () => navigate("/course");
//   const handleJoinNow = () => navigate("/Salesforce-Workshop");

//   const displayBanners = apiError
//     ? [{ home_banner_image: Banner1 }, { home_banner_image: Banner3 }, { home_banner_image: Banner2 }]
//     : banners;

//   return (
//     <div id="autoScrollingBanner" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
//       <div className="carousel-indicators">
//         {displayBanners.map((_, index) => (
//           <button
//             key={index}
//             type="button"
//             data-bs-target="#autoScrollingBanner"
//             data-bs-slide-to={index}
//             className={index === 0 ? "active" : ""}
//             aria-label={`Slide ${index + 1}`}
//           ></button>
//         ))}
//       </div>

//       <div className="carousel-inner">
//         {displayBanners.map((banner, index) => (
//           <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
//             <img
//               src={apiError ? banner.home_banner_image : `https://api.hachion.co/${banner.home_banner_image}`}
//               className="d-block w-100"
//               alt={`Banner ${index + 1}`}
//             />
//             <div className="carousel-caption">
//               <div className="carousel-btn">
//                 {index === displayBanners.length - 1 ? (
//                   <button className="join-now" onClick={handleJoinNow}>Join Now</button>
//                 ) : (
//                   <button className="join-now" onClick={handleExploreMore}>Explore More</button>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Banner;
