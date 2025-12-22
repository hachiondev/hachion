import React from "react";
import { useNavigate } from "react-router-dom";
import TrainingEvents from "../UserPanel/TrainingEvents";
import styles from "./StudentsAlsoEnrolled.module.css"; // Import CSS module

export default function StudentsAlsoEnrolled() {
  const navigate = useNavigate();

  return (
    <section className={styles.saewrap}>
      <div className="container">

        {/* HEADER */}
        <div className={styles.saehead}>
          <h2 className={styles.textCenter}>Students Also Enrolled In</h2>
          <p>
            Hachion offers flexible, instructor-led online training programs that let you
            learn anytime, anywhere. Our expert instructors, practical curriculum, and
            dedicated support team ensure a rewarding learning journey, helping you
            achieve your professional goals.
          </p>
        </div>

        {/* TRAINING EVENTS */}
        <TrainingEvents
          limit={4}
          hideHeader={true}
          hideFilters={false}
          hideViewMore={false}
        />

        {/* ACTION ROW */}
        <div className={styles.saeActionRow}>
          {/* Optional button */}
          {/* 
          <button
            onClick={() => navigate("/coursedetails")}
            className={styles.homeStartButton}
          >
            Explore courses
          </button> 
          */}
        </div>

      </div>
    </section>
  );
}