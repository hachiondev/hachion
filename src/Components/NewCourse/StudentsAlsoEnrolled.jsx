import React from "react";
import styles from "./StudentsAlsoEnrolled.module.css";
import { cn } from "../../utils";


const Share = () => (
  <img src="shares.png" alt="logo" />
);
const Bookmark = () => (
  <img src="bookmark.png" alt="logo" />
);

const sampleCourses = [
  { id: 1, title: "The Advanced Web Developer Bootcamp", author: "John Smith", weeks: "4 Weeks", level: "Beginner", price: "19.99", mrp: "24.99", badge: "78% off", thumb: "Image-3.png" },
  { id: 2, title: "The Advanced Web Developer Bootcamp", author: "John Smith", weeks: "4 Weeks", level: "Beginner", price: "19.99", mrp: "24.99", badge: "78% off", thumb: "Image-4.png" },
  { id: 3, title: "The Advanced Web Developer Bootcamp", author: "John Smith", weeks: "4 Weeks", level: "Beginner", price: "19.99", mrp: "24.99", badge: "78% off", thumb: "Image-5.png" },
  { id: 4, title: "The Advanced Web Developer Bootcamp", author: "John Smith", weeks: "4 Weeks", level: "Beginner", price: "19.99", mrp: "24.99", badge: "78% off", thumb: "Image-6.png" },
  { id: 5, title: "The Advanced Web Developer Bootcamp", author: "John Smith", weeks: "4 Weeks", level: "Beginner", price: "19.99", mrp: "24.99", badge: "78% off", thumb: "Image-7.png" },
  { id: 6, title: "The Advanced Web Developer Bootcamp", author: "John Smith", weeks: "4 Weeks", level: "Beginner", price: "19.99", mrp: "24.99", badge: "78% off", thumb: "Image-8.png" },
  { id: 7, title: "The Advanced Web Developer Bootcamp", author: "John Smith", weeks: "4 Weeks", level: "Beginner", price: "19.99", mrp: "24.99", badge: "78% off", thumb: "Image-9.png" },
  { id: 8, title: "The Advanced Web Developer Bootcamp", author: "John Smith", weeks: "4 Weeks", level: "Beginner", price: "19.99", mrp: "24.99", badge: "78% off", thumb: "Image-10.png" }
];

function CourseCard({ c, onView }) {
  return (
    <article className={styles.saecard}>
      <div className={styles.saethumb}>
        <img src={c.thumb} alt={c.title} />
        <div className={styles.saeicons}>
          <button className="ico" aria-label="Share"><Share /></button>
          <button className="ico" aria-label="Bookmark"><Bookmark /></button>
        </div>
      </div>

      <div className={styles.saemeta}>
        <span className={styles.chip}>{c.weeks}</span>
        <span className={styles.chip}>{c.level}</span>
        <span className={styles.chipby}>By {c.author}</span>
        <span className={styles.offbadge}>{c.badge}</span>
      </div>

      <h3 className={styles.saetitle}>{c.title}</h3>

      <div className={styles.saepriceRow}>
        <span className={styles.price}>${c.price}</span>
        <span className={styles.mrp}>${c.mrp}</span>
        <span className={styles.timer}>11:59 Sec Left</span>
      </div>

      <button className={styles.saebtn} onClick={() => onView?.(c)}>
        View Courses
      </button>
    </article>
  );
}

export default function StudentsAlsoEnrolled({
  courses = sampleCourses,
  onViewCourse = (c) => console.log("view", c?.id),
  onExplore = () => console.log("Explore courses"),
}) {
  return (
    <section className={styles.saewrap}>
      <div className="container">
        <div className={styles.saehead}>
          <h2>Students Also Enrolled In</h2>
          <p>
            Hachion offers flexible, instructor-led online training programs that let you
            learn anytime, anywhere. Our expert instructors, practical curriculum, and
            dedicated support team ensure a rewarding learning journey, helping you achieve
            your professional goals.
          </p>
        </div>

        <div className={styles.saesgrid}>
          {courses.map((c) => (
            <CourseCard key={c.id} c={c} onView={onViewCourse} />
          ))}
        </div>

        <div className={styles.saecta}>
          <button className={styles.saectabtn} onClick={onExplore}>Explore courses</button>
        </div>
      </div>
    </section>
  );
}
