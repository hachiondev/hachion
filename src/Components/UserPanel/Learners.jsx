// import React, { useState, useEffect } from "react";
// import "./Corporate.css";
// import { Carousel, Modal } from "react-bootstrap";
// import LearnerCard from "./LearnerCard";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

// const Learners = ({ page }) => {
//   const [reviews, setReviews] = useState([]);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const [showModal, setShowModal] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(0);

//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         const response = await fetch("https://api.test.hachion.co/userreview");
//         const data = await response.json();

//         if (Array.isArray(data)) {
//           const filteredReviews = data.filter(
//             (review) =>
//               review.type === true &&
//               review.display &&
//               typeof review.display === "string" &&
//               review.display.split(",").map((d) => d.trim()).includes(page)
//           );
//           setReviews(filteredReviews);
//         } else {
//           console.error("Invalid API response", data);
//         }
//       } catch (error) {
//         console.error("Error fetching reviews:", error);
//       }
//     };

//     fetchReviews();

//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [page]);

//   const chunkArray = (arr, chunkSize) => {
//     return arr.reduce((acc, _, i) => {
//       if (i % chunkSize === 0) acc.push(arr.slice(i, i + chunkSize));
//       return acc;
//     }, []);
//   };

//   const groupedReviews = chunkArray(reviews, isMobile ? 1 : 3);

//   const handleReadMore = (index) => {
//     setActiveIndex(index);
//     setShowModal(true);
//   };

//   const goToPrev = () => {
//     setActiveIndex((prevIndex) =>
//       prevIndex === 0 ? groupedReviews.length - 1 : prevIndex - 1
//     );
//   };

//   const goToNext = () => {
//     setActiveIndex((prevIndex) => (prevIndex + 1) % groupedReviews.length);
//   };

//   return (
//     <div className="training-events">
//       <div className="association">
//         <h2 className="association-head">Our Students Feedback</h2>
//       </div>

//       <div className="learner-background">
//         <Carousel
//           activeIndex={activeIndex}
//           onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
//           indicators={false}
//           controls={false}
//           interval={null}
//           slide={true}
//         >
//           {groupedReviews.map((group, index) => (
//             <Carousel.Item key={index}>
//               <div className="learner-card-container">
//                 {group.map((review, idx) => (
//                   <LearnerCard
//                     key={review.review_id}
//                     name={review.name}
//                     profile={review.course_name}
//                     location={review.location}
//                     content={review.review}
//                     social_id={review.social_id}
//                     rating={review.rating}
//                     profileImage={
//                       review.user_image
//                         ? `https://api.test.hachion.co/userreview/${review.user_image}`
//                         : ""
//                     }
//                     onReadMore={() =>
//                       handleReadMore(index * (isMobile ? 1 : 3) + idx)
//                     }
//                   />
//                 ))}
//               </div>
//             </Carousel.Item>
//           ))}
//         </Carousel>

//         {/* Arrows and Line Indicators */}
//         <div className="carousel-nav">
//   <FaAngleLeft className="custom-prev-icon" onClick={goToPrev} />

//   <div className="indicator-wrapper">
//     <ul className="carousel-indicators-line">
//       {groupedReviews.map((_, index) => (
//         <li
//           key={index}
//           onClick={() => setActiveIndex(index)}
//           className={index === activeIndex ? "active" : ""}
//         />
//       ))}
//     </ul>
//   </div>

//   <FaAngleRight className="custom-next-icon" onClick={goToNext} />
// </div>

//         {/* Modal */}
//         <Modal
//           show={showModal}
//           onHide={() => setShowModal(false)}
//           centered
//           size="lg"
//         >
//           <Modal.Header closeButton>
//             <Modal.Title>Student Review</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Carousel
//               activeIndex={activeIndex}
//               onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
//               indicators={false}
//               prevIcon={<FaAngleLeft className="custom-prev-icon" />}
//               nextIcon={<FaAngleRight className="custom-next-icon" />}
//               interval={null}
//                slide={true}
//             >
//               {reviews.map((review, index) => (
//                 <Carousel.Item key={index}>
//                   <div className="full-review">
//                     <h3>{review.name}</h3>
//                     <p>{review.review}</p>
//                   </div>
//                 </Carousel.Item>
//               ))}
//             </Carousel>
//           </Modal.Body>
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default Learners;

// import React, { useState, useEffect } from "react";
// import "./Corporate.css";
// import { Carousel, Modal } from "react-bootstrap";
// import LearnerCard from "./LearnerCard";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

// const Learners = ({ page }) => {
//   const [reviews, setReviews] = useState([]);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const [showModal, setShowModal] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(0);

//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         const response = await fetch("https://api.test.hachion.co/userreview");
//         const data = await response.json();

//         if (Array.isArray(data)) {
//           const filteredReviews = data.filter(
//             (review) =>
//               review.type === true &&
//               review.display &&
//               typeof review.display === "string" &&
//               review.display.split(",").map((d) => d.trim()).includes(page)
//           );
//           setReviews(filteredReviews);
//         } else {
//           console.error("Invalid API response", data);
//         }
//       } catch (error) {
//         console.error("Error fetching reviews:", error);
//       }
//     };

//     fetchReviews();

//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [page]);

//   const chunkArray = (arr, chunkSize) => {
//     return arr.reduce((acc, _, i) => {
//       if (i % chunkSize === 0) acc.push(arr.slice(i, i + chunkSize));
//       return acc;
//     }, []);
//   };

//   const groupedReviews = chunkArray(reviews, isMobile ? 1 : 3);

//   const handleReadMore = (index) => {
//     setActiveIndex(index);
//     setShowModal(true);
//   };

//   const goToPrev = () => {
//     setActiveIndex((prevIndex) =>
//       prevIndex === 0 ? groupedReviews.length - 1 : prevIndex - 1
//     );
//   };

//   const goToNext = () => {
//     setActiveIndex((prevIndex) => (prevIndex + 1) % groupedReviews.length);
//   };

//   return (
//     <div className="learner-data">
//         <h2 className="learner-title">What Our Learners Are Saying</h2>
//         <p className="learner-title-tag">At Hachion, our learners’ success speaks louder than words. 
//           From students just starting their IT journey to professionals advancing their careers, 
//           thousands have trusted us to deliver world-class online IT training, hands-on projects, and certification support.</p>

//       <div className="learner-background">
//         <Carousel
//           activeIndex={activeIndex}
//           onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
//           indicators={false}
//           controls={false}
//           interval={null}
//           slide={true}
//         >
//           {groupedReviews.map((group, index) => (
//             <Carousel.Item key={index}>
//               <div className="learner-card-container">
//                 {group.map((review, idx) => (
//                   <LearnerCard
//                     key={review.review_id}
//                     name={review.name}
//                     profile={review.course_name}
//                     location={review.location}
//                     content={review.review}
//                     social_id={review.social_id}
//                     rating={review.rating}
//                     profileImage={
//                       review.user_image
//                         ? `https://api.test.hachion.co/userreview/${review.user_image}`
//                         : ""
//                     }
//                     onReadMore={() =>
//                       handleReadMore(index * (isMobile ? 1 : 3) + idx)
//                     }
//                   />
//                 ))}
//               </div>
//             </Carousel.Item>
//           ))}
//         </Carousel>

//         {/* Arrows and Line Indicators */}
//         <div className="carousel-nav">
//   <FaAngleLeft className="custom-prev-icon" onClick={goToPrev} />

//   <div className="indicator-wrapper">
//     <ul className="carousel-indicators-line">
//       {groupedReviews.map((_, index) => (
//         <li
//           key={index}
//           onClick={() => setActiveIndex(index)}
//           className={index === activeIndex ? "active" : ""}
//         />
//       ))}
//     </ul>
//   </div>

//   <FaAngleRight className="custom-next-icon" onClick={goToNext} />
// </div>

//         {/* Modal */}
//         <Modal
//           show={showModal}
//           onHide={() => setShowModal(false)}
//           centered
//           size="lg"
//         >
//           <Modal.Header closeButton>
//             <Modal.Title>Student Review</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Carousel
//               activeIndex={activeIndex}
//               onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
//               indicators={false}
//               prevIcon={<FaAngleLeft className="custom-prev-icon" />}
//               nextIcon={<FaAngleRight className="custom-next-icon" />}
//               interval={null}
//                slide={true}
//             >
//               {reviews.map((review, index) => (
//                 <Carousel.Item key={index}>
//                   <div className="full-review">
//                     <h3>{review.name}</h3>
//                     <p>{review.review}</p>
//                   </div>
//                 </Carousel.Item>
//               ))}
//             </Carousel>
//           </Modal.Body>
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default Learners;

import React, { useState, useEffect } from "react";
import "./Corporate.css";
import LearnerCard from "./LearnerCard";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Learners = ({ page }) => {
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerRow, setCardsPerRow] = useState(3);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("https://api.test.hachion.co/userreview");
        const data = await response.json();
        if (Array.isArray(data)) {
          const filteredReviews = data.filter(
            (review) =>
              review.type === true &&
              review.display &&
              review.display.split(",").map((d) => d.trim()).includes(page)
          );
          setReviews(filteredReviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();

    const handleResize = () => {
      if (window.innerWidth < 576) setCardsPerRow(1);
      else if (window.innerWidth < 992) setCardsPerRow(2);
      else setCardsPerRow(3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [page]);

  const totalPages = Math.ceil(reviews.length / cardsPerRow);

  const goToNext = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const goToPrev = () =>
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));

  const startIndex = currentPage * cardsPerRow;
  const currentReviews = reviews.slice(startIndex, startIndex + cardsPerRow);

  const handleReadMore = (index) => {
    setActiveIndex(startIndex + index);
    setShowModal(true);
  };

  return (
    <div className="learner-data container position-relative">
      <h2 className="learner-title text-center">
        What Our Learners Are Saying
      </h2>
      <p className="learner-title-tag text-center mb-4">
        At Hachion, our learners’ success speaks louder than words. 
        From students just starting their IT journey to professionals advancing their careers, thousands have trusted us to deliver world-class online IT training, hands-on projects, and certification support.
      </p>

      {/* Left Arrow */}
      <FaAngleLeft className="custom-arrow left-arrow" onClick={goToPrev} />
      {/* Right Arrow */}
      <FaAngleRight className="custom-arrow right-arrow" onClick={goToNext} />

      <div className="display-flex row justify-content-center gap-0">
        {currentReviews.map((review, index) => (
          <div key={review.review_id} className="col-12 col-md-6 col-lg-4 mb-3">
            <LearnerCard
              name={review.name}
              location={review.location}
              content={review.review}
              profileImage={
                review.user_image
                  ? `https://api.test.hachion.co/userreview/${review.user_image}`
                  : ""
              }
              onReadMore={() => handleReadMore(index)}
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Student Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reviews[activeIndex] && (
            <div className="full-review">
              <h3>{reviews[activeIndex].name}</h3>
              <p>{reviews[activeIndex].review}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Learners;
