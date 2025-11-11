import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import "swiper/css";
import "swiper/css/navigation";
import "./Course.css";

const WatchVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);

  // ✅ Your official channel + uploads playlist
  const channelId = "UCJSF-XA-fkS2Z2rWLEQmrTA";
  const uploadsPlaylist = "UUJSF-XA-fkS2Z2rWLEQmrTA";

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(
          "https://api.hachion.co/api/youtube/videos?handle=@hachion&pages=3&pageSize=50&limit=12"
        );
        const data = await response.json();

        if (data && data.videos) {
          const formatted = data.videos.map((v) => ({
            id: v.videoId,
            title: v.title,
            // ✅ open inside your uploads playlist (right side = Hachion videos)
            url: `https://www.youtube.com/watch?v=${v.videoId}&list=${uploadsPlaylist}`,
            thumbnail: v.thumbnail,
          }));
          setVideos(formatted);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const getYouTubeId = (url) => {
    const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : null;
  };

  const goToPrev = () => swiperRef.current?.slidePrev();
  const goToNext = () => swiperRef.current?.slideNext();

  return (
    <div className="home-faq-banner container">
      <div className="learner-data position-relative text-center">
        <h2 className="trending-title mb-4">Watch Our Videos</h2>

        {loading ? (
          <p className="text-center">Loading videos...</p>
        ) : videos.length === 0 ? (
          <p className="text-center text-danger">No videos found.</p>
        ) : (
          <>
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
                const thumbnail =
                  video.thumbnail ||
                  (videoId
                    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                    : "");

                return (
                  <SwiperSlide key={video.id}>
                    <a
                      className="blog-video-card"
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={video.title || "Watch on YouTube"}
                    >
                      <img
                        src={thumbnail}
                        alt={video.title || "YouTube Thumbnail"}
                        className="blog-video-thumbnail"
                        loading="lazy"
                      />
                      <div className="blog-video-overlay">
                        <FaYoutube className="blog-video-icon-img" />
                      </div>
                    </a>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            <div className="custom-arrows">
              <FaAngleLeft
                className="custom-arrow left-arrow"
                onClick={goToPrev}
              />
              <FaAngleRight
                className="custom-arrow right-arrow"
                onClick={goToNext}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WatchVideos;
