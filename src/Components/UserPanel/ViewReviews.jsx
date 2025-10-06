import React, { useEffect, useState, useRef } from "react"; 
import axios from "axios";
import Viewreviews from "../../Assets/viewreviews-banner.webp";
import Topbar from "./Topbar";
import NavbarTop from "./NavbarTop";
import Footer from "./Footer";
import StickyBar from "./StickyBar";
import LearnerCard from "./LearnerCard";
import CardsPagination from "./CardsPagination";
import "./Home.css";
import HomeFaq from "./HomeFaq";
import img1 from '../../Assets/image 11.png';
import img2 from '../../Assets/image 12.png';
import img3 from '../../Assets/image 13.png';
import img4 from '../../Assets/image 14.png';
import img5 from '../../Assets/image 15.png';
import img6 from '../../Assets/image 16.png';
import img7 from '../../Assets/image 17.png';
import img8 from '../../Assets/image 18.png';
import img9 from '../../Assets/image 19.png';
import img10 from '../../Assets/image 20.png';
import img11 from '../../Assets/image 21.png';
import img12 from '../../Assets/image 22.png';

const ViewReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(3);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const images = [
    img1, img2, img3, img4, img5, img6,
    img7, img8, img9, img10, img11, img12,
  ];
   const studentFeedbackRef = useRef(null);
   const handleScrollToStudentFeedback = () => {
    studentFeedbackRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch all reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://api.test.hachion.co/userreview");
        setReviews(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Update cards per page based on screen width
  useEffect(() => {
    const updateCardsPerPage = () => {
      const width = window.innerWidth;
      if (width <= 768) setCardsPerPage(1);
      else if (width <= 1024) setCardsPerPage(2);
      else setCardsPerPage(3);
    };

    updateCardsPerPage();
    window.addEventListener("resize", updateCardsPerPage);
    return () => window.removeEventListener("resize", updateCardsPerPage);
  }, []);

  // Scroll button logic
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 800);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Pagination logic
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentReviews = reviews.slice(indexOfFirstCard, indexOfLastCard);

  return (
    <div className="home-background">
      <Topbar />
      <NavbarTop />

      {/* Banner Section */}
      <div className="home-banner container">
        <div className="home-content">
          <h1 className="home-title">
            Hear From
            <span className="home-title-span"> Our Learners</span>
          </h1>
          <p className="home-title-text">
            Discover how we’ve helped students and professionals achieve their goals.
          </p>
          <div className="button-row">
            <button className="home-start-button" onClick={handleScrollToStudentFeedback}>View Success Stories</button>
          </div>
        </div>
        <img
          className="home-banner-img"
          src={Viewreviews}
          alt="Learner feedback banner"
          fetchpriority="high"
        />
      </div>

      {/* Reviews Section */}
      <div className="training-events container">
        <div className="training-title-head">
          <div className="home-spacing">
            <h2 className="association-head">Our Corporate Feedback</h2>
            <p className="association-head-tag">
              Don’t take our word for it. Trust our customers.
            </p>
          </div>

          {/* Pagination on top */}
          <div className="card-pagination-container">
            <CardsPagination
              currentPage={currentPage}
              totalCards={reviews.length}
              cardsPerPage={cardsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* Review Cards */}
        <div className="display-flex row justify-content-center gap-0">
          {loading ? (
            Array.from({ length: cardsPerPage }).map((_, index) => (
              <div className="skeleton-card" key={index}></div>
            ))
          ) : currentReviews.length > 0 ? (
            currentReviews.map((fb) => (
            <div key={fb.review_id} className="col-12 col-md-6 col-lg-4 mb-3">
              <LearnerCard
                name={fb.name}
                location={fb.location}
                content={fb.review}
                profileImage={
                  fb.user_image
                    ? `https://api.test.hachion.co/userreview/${fb.user_image}`
                    : ""
                }
              />
              </div>
            ))
          ) : (
            <p>No reviews available.</p>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="training-events container" ref={studentFeedbackRef}>
        <div className="training-title-head">
          <div className="home-spacing">
            <h2 className="association-head">Our Student Feedback</h2>
            <p className="association-head-tag">
              Don’t take our word for it. Trust our customers.
            </p>
          </div>

          {/* Pagination on top */}
          <div className="card-pagination-container">
            <CardsPagination
              currentPage={currentPage}
              totalCards={reviews.length}
              cardsPerPage={cardsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* Review Cards */}
        <div className="display-flex row justify-content-center gap-0">
          {loading ? (
            Array.from({ length: cardsPerPage }).map((_, index) => (
              <div className="skeleton-card" key={index}></div>
            ))
          ) : currentReviews.length > 0 ? (
            currentReviews.map((fb) => (
            <div key={fb.review_id} className="col-12 col-md-6 col-lg-4 mb-3">
              <LearnerCard
                name={fb.name}
                location={fb.location}
                content={fb.review}
                profileImage={
                  fb.user_image
                    ? `https://api.test.hachion.co/userreview/${fb.user_image}`
                    : ""
                }
              />
              </div>
            ))
          ) : (
            <p>No reviews available.</p>
          )}
        </div>
      </div>

        <div className="training-events container">
        <h3 className="it-reviews-head">Our Alumni Works At</h3>
        <div className="it-logos-grid container">
            {images.map((img, index) => (
            <img
                key={index}
                src={img}
                alt={`logo-${index + 1}`}
                className="it-logo-review"
            />
            ))}
        </div>
        </div>

      <HomeFaq />

      <Footer />
      {showScrollButton && <StickyBar />}
    </div>
  );
};

export default ViewReviews;
