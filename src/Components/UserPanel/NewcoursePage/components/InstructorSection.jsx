import React from "react";
import styles from "./InstructorSection.module.css";
import { cn } from "../../../../utils";
import { useParams } from "react-router-dom";
import { useTrainerDetailsByCourse } from "../../../../Api/hooks/InstructorSection/useTrainerDetailsByCourse";
import { useCourseByName } from "../../../../Api/hooks/CourseApi/useCourseByName";

export default function InstructorSection({
  name = "John Mitchell",
  title = "Senior Full-Stack Developer & Technical Lead",
  stats = { years: "12+", students: "50K+", rating: "4.9" },
  bio = `With over 12 years of industry experience...`,
  creds = [],
}) {

  /* -------------------------------
     1️⃣ Get course name FIRST
  -------------------------------- */
  const { courseName: courseNameSlug } = useParams();

  const courseName = courseNameSlug
    ? decodeURIComponent(courseNameSlug)
      .replace(/[-_]+/g, " ")
      .replace(/\+\+/g, "pp")
      .trim()
      .toLowerCase()
    : "";

  /* -------------------------------
     2️⃣ Fetch APIs
  -------------------------------- */
  const { data: courseData } = useCourseByName(courseName);
  const { data: trainerList = [] } = useTrainerDetailsByCourse(courseName);

  const defaultTrainerName =
    courseData?.defaultTrainer?.toLowerCase();

  /* -------------------------------
     3️⃣ Select correct trainer
  -------------------------------- */
  const selectedTrainer =
    trainerList.find(
      (t) =>
        t.trainer_name?.toLowerCase() === defaultTrainerName
    ) || trainerList[0];

  /* -------------------------------
     4️⃣ Use SELECTED trainer
  -------------------------------- */
  const trainerName = selectedTrainer?.trainer_name;
  const trainerBio = selectedTrainer?.summary;
  const trainerRating = selectedTrainer?.trainerRating;
  const designation = selectedTrainer?.designation;
  const experience = selectedTrainer?.experience;

  const rawExperienceCredentials =
    selectedTrainer?.experienceCredentials;

  const experienceCredentialsArray =
    typeof rawExperienceCredentials === "string"
      ? rawExperienceCredentials
        .split("\n")
        .map((item) =>
          item.replace(/^\*\s*/, "").trim()
        )
        .filter(Boolean)
      : [];


  const finalRating = Number(trainerRating || stats.rating);


  const fullStars = Math.floor(finalRating);
  const decimal = finalRating - fullStars;
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < Math.round(finalRating) ? "★" : "☆"
  ).join("");

  const cleanTrainerBio = trainerBio?.replace(/<\/?p>/g, "");

  return (
    <section className={styles.iswrap}>
      <div className="container">
        <div className={styles.ishead}>
          <h2>Meet Your Instructor</h2>
          <p>Learn from industry veterans with years of real-world experience</p>
        </div>

        <div className={styles.iscard}>
          {/* Photo */}
          <div className={styles.isphoto}>
            <img
              src="/instructordefault.png"
              alt={`${trainerName || name} headshot`}
              onError={(e) => {
                e.currentTarget.src = "/InstructorDefaultImage.webp";
              }}
            />
          </div>

          {/* Content */}
          <div className={styles.iscontent}>
            <div className={styles.istopline}>
              <span className={styles.isbadge}>⭐ Top Instructor</span>
              <h3 className={styles.isname}>{trainerName || name}</h3>
            </div>

            {/* <div className={styles.istitle}>{title}</div> */}
            <div className={styles.istitle}>
              {designation || title}
            </div>

            <div className={styles.isstats}>
              <div className={styles.isstat}>
                <div className={styles.isstatval}>
                  <span className={styles.isstatico}>
                    <img src="/users.png" alt="logo" />
                  </span>
                  {experience ? `${experience}+` : stats.years}

                </div>
                <div className={styles.isstatlab}>Years Experience</div>
              </div>

              <div className={styles.isstat}>
                <div className={styles.isstatval}>
                  <span className={styles.isstatico}>
                    <img src="/users.png" alt="logo" />
                  </span>
                  {stats.students}
                </div>
                <div className={styles.isstatlab}>Students Taught</div>
              </div>

              <div className={styles.isstat}>
                <div className={styles.isstatval}>
                  <span className={styles.isstatico}>
                    <img src="/users.png" alt="logo" />
                  </span>

                  {/* ⭐ EXACT fractional rating */}
                  {finalRating} &nbsp;&nbsp;
                  <span style={{ color: "#f5a623", fontSize: "18px" }}>
                    {stars}
                  </span>

                </div>
                <div className={styles.isstatlab}>Instructor Rating</div>
              </div>
            </div>

            <p
              className={styles.isbio}
              // style={{
              //   fontSize: "14px",
              //   lineHeight: "1.6",
              //   color: "#374151",
              // }}
            >
              {trainerBio ? (
                <span
                  dangerouslySetInnerHTML={{ __html: trainerBio }}
                />
              ) : (
                bio
              )}
            </p>
            <div className={styles.issubhead}>Experience & Credentials:</div>
            <ul className={styles.islist}>
              
              {(experienceCredentialsArray.length > 0
                ? experienceCredentialsArray
                : creds
              ).map((c, index) => (
                <li key={index}>{c}</li>
              ))}
            </ul>



            <div className={styles.isactions}>
              {/* <button
                className={cn(styles.isbtn, styles.isbtnoutline)}
                onClick={onLinkedIn}
              >
                <span className={styles.ico}>
                  <img src="LinkedIn.png" alt="LinkedIn" height={22} />
                </span>
                View LinkedIn Profile
              </button> */}

              {/* <button
                className={cn(styles.isbtn, styles.isbtnoutline)}
                onClick={onAsk}
              >
                Ask a Question
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
