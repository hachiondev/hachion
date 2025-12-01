import React, { useState, useRef } from "react";
import styles from "./SuccessStories.module.css";
import { cn } from "../../utils";

const PlayIcon = () => (
  <svg viewBox="0 0 80 80" width="56" height="56" aria-hidden="true">
    <circle cx="40" cy="40" r="32" fill="#1fb6ff" stroke="#fff" strokeWidth="3" />
    <polygon points="34,28 54,40 34,52" fill="#fff" />
  </svg>
);

function StoryCard({
  poster,
  name,
  date,
  avatar,
  quote,
  videoSrc, // local mp4 or external url
}) {
  const [playing, setPlaying] = useState(false);
  const vidRef = useRef(null);

  const handlePlay = () => {
    const v = vidRef.current;
    if (!v) return;
    setPlaying(true);
    v.play();
  };

  return (
    <article className={styles.sscard}>
      <div className={styles.ssmedia}>
        {!playing ? (
          <>
            <img src={poster} alt={`${name} testimonial`} />
            <button className={styles.ssplay} onClick={handlePlay} aria-label="Play story">
              <PlayIcon />
            </button>
            <div className={styles.ssdim} />
          </>
        ) : (
          <video
            ref={vidRef}
            className={styles.ssvideo}
            src={videoSrc}
            poster={poster}
            controls
            playsInline
          />
        )}
      </div>

      <div className={styles.ssbody}>
        <div className={styles.ssuser}>
          <img className={styles.ssavatar} src={avatar} alt="" />
          <div>
            <div className={styles.ssname}>{name}</div>
            <div className={styles.ssdate}>{date}</div>
          </div>
        </div>
        <p className={styles.ssquote}>{quote}</p>
      </div>
    </article>
  );
}

export default function SuccessStories() {
  const stories = [
    {
      poster:
        "img1.png",
      name: "Orlando Diggs",
      date: "March 28, 2023",
      avatar: "img1.png",
      quote:
        "This course completely transformed my career. From marketing to Netflix in 8 months! This course completely transformed my career. From marketing to Netflix in 8 months! ",
      videoSrc: "/videos/story-1.mp4",
    },
    {
      poster:
        "img2.png",
      name: "Orlando Diggs",
      date: "March 28, 2023",
      avatar: "img2.png",
      quote:
        "This course completely transformed my career. From marketing to Netflix in 8 months! This course completely transformed my career. From marketing to Netflix in 8 months! ",
      videoSrc: "/videos/story-2.mp4",
    },
    {
      poster:
        "img3.png",
      name: "Orlando Diggs",
      date: "March 28, 2023",
      avatar: "img3.png",
      quote:
        "This course completely transformed my career. From marketing to Netflix in 8 months! This course completely transformed my career. From marketing to Netflix in 8 months! ",
      videoSrc: "/videos/story-3.mp4",
    },
  ];

  return (
    <section className={styles.sswrap}>
      <div className="container">
        <div className={styles.sstoppill}>
          🔴   Live Success Stories
        </div>

        <div className={styles.sshead}>
          <h2>Hear From Our Successful Graduates</h2>
          <p>Real stories from students who transformed their careers</p>
        </div>

        <div className={styles.ssgrid}>
          {stories.map((s, i) => (
            <StoryCard key={i} {...s} />
          ))}
        </div>

        <div className={styles.sscta}>
          <div className={styles.ssctatitle}>Want to Share Your Success Story?</div>
          <p>Join our alumni network and inspire the next generation of developers</p>
          <button
            className={styles.ssctabtn}
            onClick={() => console.log("Open submit story form")}
          >
            Submit Your Story
          </button>
        </div>
      </div>
    </section >
  );
}
