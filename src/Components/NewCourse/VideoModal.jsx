import React, { useRef, useEffect } from 'react';
import styles from './VideoModal.module.css';

export default function VideoModal({ videoSrc, onClose, title = 'Preview' }) {
  const videoRef = useRef(null);
useEffect(() => {
  const v = videoRef.current;

  if (v && !videoSrc.includes("youtube.com") && !videoSrc.includes("youtu.be")) {
    v.play().catch(() => {});
  }

  return () => {
    if (v && !videoSrc.includes("youtube.com") && !videoSrc.includes("youtu.be")) {
      v.pause();
      v.currentTime = 0;
    }
  };
}, [videoSrc]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.vmOverlay} onClick={handleOverlayClick}>
      <div className={styles.vmModal} role="dialog" aria-label={title}>
        <button className={styles.vmClose} onClick={onClose} aria-label="Close video">
          ×
        </button>

       <div className={styles.vmContent}>
  {videoSrc.includes("youtube.com") || videoSrc.includes("youtu.be") ? (
    <iframe
      className={styles.vmVideo}
      src={videoSrc}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  ) : (
    <video
      ref={videoRef}
      className={styles.vmVideo}
      src={videoSrc}
      controls
      playsInline
      autoPlay
    />
  )}
</div>

      </div>
    </div>
  );
}
