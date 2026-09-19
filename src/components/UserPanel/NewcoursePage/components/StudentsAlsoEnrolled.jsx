"use client";

import React from "react";
import styles from "./StudentsAlsoEnrolled.module.css";

// Ported from the CRA app's
// src/Components/UserPanel/NewcoursePage/components/StudentsAlsoEnrolled.jsx.
// Production's version of this section is heading + paragraph only, with no
// card grid of its own — confirmed by measuring the gap between this
// heading and "Upcoming Trainings at Hachion" (the actual TrainingEvents
// instance further down the page): a constant 131px on every course page
// checked, regardless of course/category. This component previously
// rendered its own <TrainingEvents> here too, which doubled up the filter
// bar and course cards that "Upcoming Trainings at Hachion" already shows.
export default function StudentsAlsoEnrolled() {
  return (
    <section className={styles.saewrap}>
      <div className="container">
        <div className={styles.saehead}>
          <h2 className={styles.textCenter}>Students Also Enrolled In</h2>
          <p className={styles.saePara}>
            Hachion offers flexible, instructor-led online training programs that let you learn anytime, anywhere. Our expert instructors, practical curriculum, and dedicated support team ensure a rewarding learning journey,
            helping you achieve your professional goals.
          </p>
        </div>
      </div>
    </section>
  );
}
