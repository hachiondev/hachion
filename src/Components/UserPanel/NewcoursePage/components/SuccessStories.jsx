import React from "react";
import styles from "./SuccessStories.module.css";
import VideoModal from "./VideoModal";
import { useUserReviews } from "../../../../Api/hooks/CourseApi/useUserReviews";

// --------------------- Helper Functions ----------------------
const getYouTubeId = (url) => {
  if (!url) return "";
  return url.split("v=")[1]?.split("&")[0];
};

const getThumbnail = (id) =>
  `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

const PlayIcon = () => (
  <svg viewBox="0 0 80 80" width="56" height="56" aria-hidden="true">
    <circle cx="40" cy="40" r="32" fill="#1fb6ff" stroke="#fff" strokeWidth="3" />
    <polygon points="34,28 54,40 34,52" fill="#fff" />
  </svg>
);

// --------------------- StoryCard Component ----------------------
function StoryCard({ name, date, user_image, review, videoLink }) {
  const [showModal, setShowModal] = React.useState(false);

  const videoId = getYouTubeId(videoLink);
  const thumb = getThumbnail(videoId);

  const defaultAvatar =
    "data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjY2NjIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxOCIgc3Ryb2tlPSIjYmJiIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9IiNmZmYiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjE0IiByPSI2Ii8+PHBhdGggZD0iTTIwIDIyYy04IDAtMTQgNC04IDhsOCA0IDgtNGMwLTQtNi04LTgtOCIvPjwvc3ZnPg==";

  const avatarSrc =
    user_image && user_image.trim() !== ""
      ? `https://api.test.hachion.co/uploads/test/user_review/${user_image}`
      : defaultAvatar;

  return (
    <>
      <article className={styles.sscard}>
        <div className={styles.ssmedia}>
          <img src={thumb} alt={name} className={styles.ssposter} />

          <button
            onClick={() => setShowModal(true)}
            aria-label="Play Story"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
              cursor: "pointer",
              background: "transparent",
              border: "none",
              padding: 0
            }}
          >
            <PlayIcon />
          </button>

          <div className={styles.ssdim} />
        </div>

        <div className={styles.ssbody}>
          <div className={styles.ssuser}>
            <img className={styles.ssavatar} src={avatarSrc} alt={name} />
            <div>
              <div className={styles.ssname}>{name}</div>
              <div className={styles.ssdate}>{date}</div>
            </div>
          </div>

          <p className={styles.ssquote}>{review}</p>
        </div>
      </article>

      {showModal && (
        <VideoModal
          videoSrc={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          onClose={() => setShowModal(false)}
          title={name}
        />
      )}
    </>
  );
}

// --------------------- MAIN COMPONENT ----------------------
export default function SuccessStories() {
  const { data: stories = [], isLoading, error } = useUserReviews();

  if (isLoading)
    return (
      <p style={{ textAlign: "center", padding: "20px" }}>Loading stories...</p>
    );

  if (error)
    return (
      <p style={{ textAlign: "center", padding: "20px" }}>
        Failed to load stories.
      </p>
    );

  return (
    <section className={styles.sswrap}>
      <div className="container">
        <div className={styles.sstoppill}>🔴 Live Success Stories</div>

        <div className={styles.sshead}>
          <h2>Hear From Our Successful Graduates</h2>
          <p>Real stories from students who transformed their careers</p>
        </div>

        <div className={styles.ssgrid}>
          {stories.map((item) => (
            <StoryCard key={item.review_id} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
