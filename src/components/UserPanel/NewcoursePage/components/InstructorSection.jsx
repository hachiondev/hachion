"use client";

import React from "react";
import styles from "./InstructorSection.module.css";
import { useTrainerDetailsByCourse } from "@/Api/hooks/InstructorSection/useTrainerDetailsByCourse";
import { useCourseByName } from "@/Api/hooks/CourseApi/useCourseByName";
import { useCourseApiName } from "@/components/UserPanel/CoursePage/CourseApiNameContext";
import { API_BASE_URL } from "@/lib/apiBase";

// Ported from the CRA app's
// src/Components/UserPanel/NewcoursePage/components/InstructorSection.jsx.
export default function InstructorSection({
  name = "John Mitchell",
  title = "Senior Full-Stack Developer & Technical Lead",
  stats = { years: "12+", students: "50K+", rating: "4.9" },
  bio = `With over 12 years of industry experience...`,
}) {
  const courseName = useCourseApiName();

  const { data: courseData } = useCourseByName(courseName);
  const { data: trainerList = [] } = useTrainerDetailsByCourse(courseName);
  const defaultTrainerName = courseData?.defaultTrainer?.toLowerCase();

  const selectedTrainer = trainerList.find((t) => t.trainer_name?.toLowerCase() === defaultTrainerName) || trainerList[0];

  const trainerName = selectedTrainer?.trainer_name;
  const trainerBio = selectedTrainer?.summary;
  const trainerRating = selectedTrainer?.trainerRating;
  const designation = selectedTrainer?.designation;
  const experience = selectedTrainer?.experience;
  const finalRating = Number(trainerRating || stats.rating);
  const stars = Array.from({ length: 5 }, (_, i) => (i < Math.round(finalRating) ? "★" : "☆")).join("");
  const trainerImagePath = selectedTrainer?.trainerImage;
  const trainerImageSrc = trainerImagePath ? `${API_BASE_URL}/${trainerImagePath}` : "/defaulttrainer.jpg";
  return (
    <section className={styles.iswrap}>
      <div className="container">
        <div className={styles.ishead}>
          <h2>{courseData?.courseName ? `Meet Your ${courseData.courseName} Instructor` : "Meet Your Instructor"}</h2>
          <p>Learn from industry veterans with years of real-world experience</p>
        </div>

        <div className={styles.iscard}>
          <div className={styles.istoprow}>
            <div className={styles.iscontent}>
              <div className={styles.istopline}>
                <div className={styles.isinfo}>
                  <div className={styles.isnamesection}>
                    <h3 className={styles.isname}>{trainerName || name}</h3>

                    <span className={styles.isbadge}>⭐ Top Instructor</span>
                  </div>

                  <div className={styles.istitle}>{designation || title}</div>

                  <div className={styles.isstats}>
                    <div className={styles.isstat}>
                      <div className={styles.isstatval}>
                        <span className={styles.isstatico}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/users.png" alt="icon" />
                        </span>
                        {experience ? `${experience}+` : stats.years}
                      </div>
                      <div className={styles.isstatlab}>Years Experience</div>
                    </div>

                    <div className={styles.isstat}>
                      <div className={styles.isstatval}>
                        <span className={styles.isstatico}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/users.png" alt="icon" />
                        </span>
                        {stats.students}
                      </div>
                      <div className={styles.isstatlab}>Students Taught</div>
                    </div>

                    <div className={styles.isstat}>
                      <div className={styles.isstatval}>
                        <span className={styles.isstatico}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/users.png" alt="icon" />
                        </span>
                        {finalRating}
                        <span style={{ color: "#f5a623", fontSize: "18px", marginLeft: "6px" }}>{stars}</span>
                      </div>
                      <div className={styles.isstatlab}>Instructor Rating</div>
                    </div>
                  </div>
                </div>
                <div className={styles.isphoto}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={trainerImageSrc}
                    alt={`${trainerName || name} headshot`}
                    loading="lazy"
                    onError={(e) => {
                      console.error("Trainer image failed:", trainerImageSrc);
                      e.currentTarget.src = "/defaulttrainer.jpg";
                    }}
                  />
                </div>
              </div>
              <p className={styles.isbio}>{trainerBio ? <span dangerouslySetInnerHTML={{ __html: trainerBio }} /> : bio}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
