import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import './Course.css';
import 'swiper/css';
import 'swiper/css/navigation';
import axios from 'axios';
import TrainerCard from './TrainerCard';

const TrainerProfile = () => {
  const { courseName } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [course, setCourse] = useState(null);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
  const fetchCourseAndTrainers = async () => {
    try {
      setLoading(true);
      const courseRes = await axios.get('https://api.test.hachion.co/courses/all');
      const courseData = courseRes.data.find(
        (c) => c.courseName.toLowerCase().replace(/\s+/g, '-') === courseName
      );
      setCourse(courseData);

      if (courseData) {
        const trainerRes = await axios.get('https://api.hachion.co/trainers');
        const matchedTrainers = trainerRes.data.filter(
          (t) => t.course_name.trim().toLowerCase() === courseData.courseName.trim().toLowerCase()
        );
        setTrainers(matchedTrainers);
      }
    } catch (error) {
      console.error('Error fetching course or trainers:', error);
      setError('Failed to fetch course or trainers');
    } finally {
      setLoading(false);
    }
  };

  fetchCourseAndTrainers();
}, [courseName]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!course) return <div>Course not found</div>;

const playVideo = (url) => {
    if (!url) return;
    let validUrl = url.trim();
    if (!/^https?:\/\//i.test(validUrl)) validUrl = `https://${validUrl}`;

    // --- YouTube Shorts ---
    if (/youtube\.com\/shorts\//i.test(validUrl)) {
      const m = validUrl.match(/\/shorts\/([^?&/]+)/i);
      if (m && m[1]) {
        validUrl = `https://www.youtube.com/embed/${m[1]}`;
      }
    }
    // --- YouTube long link ---
    else if (/youtube\.com\/watch\?/i.test(validUrl)) {
      const v = new URL(validUrl).searchParams.get('v');
      if (v) validUrl = `https://www.youtube.com/embed/${v}`;
    }
    // --- YouTube short link ---
    else if (/youtu\.be\//i.test(validUrl)) {
      const m = validUrl.match(/youtu\.be\/([^?&/]+)/i);
      if (m && m[1]) validUrl = `https://www.youtube.com/embed/${m[1]}`;
    }

    // --- Google Drive (file) ---
    if (/drive\.google\.com\/file\/d\//i.test(validUrl)) {
      const m = validUrl.match(/\/d\/(.*?)\//);
      if (m && m[1]) validUrl = `https://drive.google.com/file/d/${m[1]}/preview`;
    }

    setSelectedVideoUrl(validUrl);
    setVideoModalVisible(true);
  };

  return (
    <div className='mode-container'>
      <div className="association">
        <h2 className="association-head">Best IT Expert for {course.courseName}</h2>
      </div>
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={2}
        navigation
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 2 },
        }}
      >
        {trainers.map((trainer) => (
          <SwiperSlide key={trainer.id}>
            <div className='trainer-card-mode'>
              <div className='card-body'>
                <TrainerCard
                  name={trainer.trainer_name}
                  trainer_name={trainer.trainer_name}
                  profile={trainer.course_name}
                  summary={trainer.summary}
                   profileImage={
      trainer.trainerImage
        ? `https://api.hachion.co/${trainer.trainerImage}`
        : ""
    }
                  demo_link_1={trainer.demo_link_1}
                  onPlayVideo={playVideo}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
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
  );
};

export default TrainerProfile;
