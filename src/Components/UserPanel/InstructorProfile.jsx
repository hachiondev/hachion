import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import './Course.css';
import 'swiper/css';
import 'swiper/css/navigation';
import axios from 'axios';
import InstructorCard from './InstructorCard';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const InstructorProfile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const swiperRef = useRef(null);

const goToPrev = () => {
  if (swiperRef.current) swiperRef.current.slidePrev();
};

const goToNext = () => {
  if (swiperRef.current) swiperRef.current.slideNext();
};


  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true);
        const trainerRes = await axios.get('https://api.test.hachion.co/trainers');
        setTrainers(trainerRes.data); // ✅ all trainers, no filtering
      } catch (error) {
        console.error('Error fetching trainers:', error);
        setError('Failed to fetch trainers');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const playVideo = (url) => {
    if (!url) return;
    let validUrl = url.trim();
    if (!/^https?:\/\//i.test(validUrl)) validUrl = `https://${validUrl}`;

    // --- YouTube Shorts ---
    if (/youtube\.com\/shorts\//i.test(validUrl)) {
      const m = validUrl.match(/\/shorts\/([^?&/]+)/i);
      if (m && m[1]) validUrl = `https://www.youtube.com/embed/${m[1]}`;
    }
    // --- YouTube watch?v= ---
    else if (/youtube\.com\/watch\?/i.test(validUrl)) {
      const v = new URL(validUrl).searchParams.get('v');
      if (v) validUrl = `https://www.youtube.com/embed/${v}`;
    }
    // --- YouTube short link ---
    else if (/youtu\.be\//i.test(validUrl)) {
      const m = validUrl.match(/youtu\.be\/([^?&/]+)/i);
      if (m && m[1]) validUrl = `https://www.youtube.com/embed/${m[1]}`;
    }
    // --- Google Drive ---
    if (/drive\.google\.com\/file\/d\//i.test(validUrl)) {
      const m = validUrl.match(/\/d\/(.*?)\//);
      if (m && m[1]) validUrl = `https://drive.google.com/file/d/${m[1]}/preview`;
    }

    setSelectedVideoUrl(validUrl);
    setVideoModalVisible(true);
  };

  return (
    <div className="home-faq-banner container">
      <div className="learner-data position-relative">
        <h2 className="trending-title text-center">Top-Rated Instructors</h2>
        <p className="learner-title-tag text-center mb-4">
          Gain insights from industry experts with years of experience and thousands of successful students worldwide.
        </p>
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={3}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {trainers.map((trainer) => (
            <SwiperSlide key={trainer.id}>
              <div className="trainer-card-mode">
                <div className="card-body">
                  <InstructorCard
                    name={trainer.trainer_name}
                    trainer_name={trainer.trainer_name}
                    profile={trainer.course_name}
                    summary={trainer.summary}
                    profileImage={trainer.profileImage}
                    demo_link_1={trainer.demo_link_1}
                    onPlayVideo={playVideo}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="custom-arrows">
        <FaAngleLeft className="custom-arrow left-arrow" onClick={goToPrev} />
        <FaAngleRight className="custom-arrow right-arrow" onClick={goToNext} />
        </div>

        {videoModalVisible && selectedVideoUrl && (
          <div className="video-modal-overlay" onClick={() => setVideoModalVisible(false)}>
            <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
              <iframe
                src={selectedVideoUrl}
                title="Video Preview"
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
              <button className="close-modal" onClick={() => setVideoModalVisible(false)}>✕</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorProfile;