import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaTimes, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import "swiper/css";
import "swiper/css/navigation";
import "./Course.css";

const WatchVideos = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const swiperRef = useRef(null);

  const videos = [
    { id: 1, url: "https://www.youtube.com/watch?v=GJQz4IsMXrw" },
    { id: 2, url: "https://www.youtube.com/watch?v=PSrZzgxH8Sg" },
    { id: 3, url: "https://www.youtube.com/watch?v=8KH8A8lGGUs" },
    { id: 4, url: "https://www.youtube.com/watch?v=bjCJ3S0BS1Q" },
  ];

  // Extract YouTube ID
  const getYouTubeId = (url) => {
    const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : null;
  };

  const handleOpenVideo = (url) => setSelectedVideo(url);
  const handleCloseVideo = () => setSelectedVideo(null);

  const goToPrev = () => {
    if (swiperRef.current) swiperRef.current.slidePrev();
  };

  const goToNext = () => {
    if (swiperRef.current) swiperRef.current.slideNext();
  };

  return (
    <div className="home-faq-banner container">
      <div className="learner-data position-relative text-center">
        <h2 className="trending-title mb-4">Watch Our Videos</h2>

        {/* ✅ Swiper Carousel */}
        <Swiper
          modules={[Navigation]}
          spaceBetween={25}
          slidesPerView={3}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {videos.map((video) => {
            const videoId = getYouTubeId(video.url);
            const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

            return (
              <SwiperSlide key={video.id}>
                <div
                  className="blog-video-card"
                  onClick={() => handleOpenVideo(video.url)}
                >
                  <img
                    src={thumbnail}
                    alt="YouTube Thumbnail"
                    className="blog-video-thumbnail"
                    loading="lazy"
                  />
                  <div className="blog-video-overlay">
                    <FaYoutube className="blog-video-icon-img" />
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* ✅ Custom Arrows */}
        <div className="custom-arrows">
          <FaAngleLeft className="custom-arrow left-arrow" onClick={goToPrev} />
          <FaAngleRight className="custom-arrow right-arrow" onClick={goToNext} />
        </div>

        {/* ✅ Video Modal */}
        {selectedVideo && (
          <div
            className="blog-video-modal-overlay"
            onClick={handleCloseVideo}
          >
            <div
              className="blog-video-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-modal" onClick={handleCloseVideo}>
                <FaTimes size={20} />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(
                  selectedVideo
                )}?autoplay=1`}
                title="Video Player"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchVideos;
