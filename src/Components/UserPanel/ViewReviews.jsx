import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Viewreviews from "../../Assets/viewreviews-banner.webp";
import Topbar from "./Topbar";
import NavbarTop from "./NavbarTop";
import Footer from "./Footer";
import StickyBar from "./StickyBar";
import LearnerCard from "./LearnerCard";
import CardsPagination from "./CardsPagination";
import VideoReviewCard from "./VideoReviewCard";
import HomeFaq from "./HomeFaq";

import img1 from '../../Assets/cl1.webp';
import img2 from '../../Assets/cl2.webp';
import img3 from '../../Assets/cl3.webp';
import img4 from '../../Assets/cl4.webp';
import img5 from '../../Assets/cl5.webp';
import img6 from '../../Assets/cl6.webp';
import img7 from '../../Assets/cl7.webp';
import img8 from '../../Assets/cl8.webp';
import img9 from '../../Assets/cl9.webp';
import img10 from '../../Assets/cl10.webp';
import img11 from '../../Assets/cl11.webp';
import img12 from '../../Assets/cl12.webp';

import "./Home.css";
import "./Corporate.css";

const ViewReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardsPerPage, setCardsPerPage] = useState(3);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Pagination states
  const [corporatePage, setCorporatePage] = useState(1);
  const [studentPage, setStudentPage] = useState(1);
  const [livePage, setLivePage] = useState(1);

  const images = [
    img1, img2, img3, img4, img5, img6,
    img7, img8, img9, img10, img11, img12
  ];

  const studentFeedbackRef = useRef(null);
  const handleScrollToStudentFeedback = () => {
    studentFeedbackRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch reviews from API
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

  // Cards per page responsive
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

  // Scroll to top button
  useEffect(() => {
    const handleScroll = () => setShowScrollButton(window.scrollY > 800);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Pagination handlers
  const handleCorporatePageChange = (page) => setCorporatePage(page);
  const handleStudentPageChange = (page) => setStudentPage(page);
  const handleLivePageChange = (page) => setLivePage(page);

  // Paginated slices
  const corporateStart = (corporatePage - 1) * cardsPerPage;
  const studentStart = (studentPage - 1) * cardsPerPage;
  const liveStart = (livePage - 1) * cardsPerPage;

  const corporateReviews = reviews.slice(corporateStart, corporateStart + cardsPerPage);
  const studentReviews = reviews.slice(studentStart, studentStart + cardsPerPage);
  const liveReviews = reviews.slice(liveStart, liveStart + cardsPerPage);

  // Convert YouTube watch URLs to embed URLs
const getEmbedUrl = (url) => {
  if (!url) return "";
  let videoId = "";

  // Handles "youtube.com/watch?v=VIDEO_ID"
  if (url.includes("youtube.com/watch")) {
    const urlParams = new URLSearchParams(url.split("?")[1]);
    videoId = urlParams.get("v");
  }

  // Handles "youtu.be/VIDEO_ID"
  else if (url.includes("youtu.be/")) {
    videoId = url.split("/").pop();
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
};

  // Video modal handler
  const handlePlayVideo = (videoUrl) => {
    setSelectedVideo(getEmbedUrl(videoUrl));
  };

  const closeModal = () => setSelectedVideo(null);

  return (
    <div className="home-background">
      <Topbar />
      <NavbarTop />

      {/* Banner */}
      <div className="home-banner container">
        <div className="home-content">
          <h1 className="home-title">
            Hear From <span className="home-title-span">Our Learners</span>
          </h1>
          <p className="home-title-text">
            Discover how we’ve helped students and professionals achieve their goals.
          </p>
          <div className="button-row">
            <button className="home-start-button" onClick={handleScrollToStudentFeedback}>
              View Success Stories
            </button>
          </div>
        </div>
        <img className="home-banner-img" src={Viewreviews} alt="Learner feedback banner" />
      </div>

      {/* Corporate Feedback */}
      <div className="training-events container">
        <div className="training-title-head">
          <div className="home-spacing">
            <h2 className="association-head">Our Corporate Feedback</h2>
            <p className="association-head-tag">Don’t take our word for it. Trust our customers.</p>
          </div>
          <CardsPagination
            currentPage={corporatePage}
            totalCards={reviews.length}
            cardsPerPage={cardsPerPage}
            onPageChange={handleCorporatePageChange}
          />
        </div>
        <div className="display-flex row justify-content-center gap-0">
          {loading ? Array.from({ length: cardsPerPage }).map((_, i) => (
            <div className="skeleton-card" key={i}></div>
          )) : corporateReviews.map((fb) => (
            <div key={fb.review_id} className="col-12 col-md-6 col-lg-4 mb-3">
              <LearnerCard
                name={fb.name}
                location={fb.location}
                content={fb.review}
                profileImage={fb.user_image ? `https://api.test.hachion.co/userreview/${fb.user_image}` : ""}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Student Feedback */}
      <div className="training-events container" ref={studentFeedbackRef}>
        <div className="training-title-head">
          <div className="home-spacing">
            <h2 className="association-head">Our Student Feedback</h2>
            <p className="association-head-tag">Don’t take our word for it. Trust our customers.</p>
          </div>
          <CardsPagination
            currentPage={studentPage}
            totalCards={reviews.length}
            cardsPerPage={cardsPerPage}
            onPageChange={handleStudentPageChange}
          />
        </div>
        <div className="display-flex row justify-content-center gap-0">
          {loading ? Array.from({ length: cardsPerPage }).map((_, i) => (
            <div className="skeleton-card" key={i}></div>
          )) : studentReviews.map((fb) => (
            <div key={fb.review_id} className="col-12 col-md-6 col-lg-4 mb-3">
              <LearnerCard
                name={fb.name}
                location={fb.location}
                content={fb.review}
                profileImage={fb.user_image ? `https://api.test.hachion.co/userreview/${fb.user_image}` : ""}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Live Reviews */}
      <div className="training-events container">
        <div className="training-title-head">
          <div className="home-spacing">
            <h2 className="association-head">Live Reviews</h2>
          </div>
          <CardsPagination
            currentPage={livePage}
            totalCards={reviews.length}
            cardsPerPage={cardsPerPage}
            onPageChange={handleLivePageChange}
          />
        </div>
        <div className="display-flex row justify-content-center gap-0">
          {loading ? Array.from({ length: cardsPerPage }).map((_, i) => (
            <div className="skeleton-card" key={i}></div>
          )) : liveReviews.map((fb, index) => (
            <div key={fb.review_id} className="col-12 col-md-6 col-lg-4 mb-3">
              <VideoReviewCard
                name={fb.name}
                profileImage={fb.user_image ? `https://api.test.hachion.co/userreview/${fb.user_image}` : ""}
                demo_link_1={`https://www.youtube.com/watch?v=jFq396RUcqI`}
                onPlayVideo={handlePlayVideo}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Alumni Logos */}
      <div className="training-events container">
        <h3 className="it-reviews-head">Our Alumni Works At</h3>
        <div className="it-logos-grid container">
          {images.map((img, i) => (
            <img key={i} src={img} alt={`logo-${i + 1}`} className="it-logo-review" />
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="review-video-modal">
          <div className="review-video-modal-content">
            <button className="review-video-close-btn" onClick={closeModal}>✖</button>
            <iframe
              width="100%"
              height="400px"
              src={selectedVideo}
              title="Live Review Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <HomeFaq />
      <Footer />
      {showScrollButton && <StickyBar />}
    </div>
  );
};

export default ViewReviews;
