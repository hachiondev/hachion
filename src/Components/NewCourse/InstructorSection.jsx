import React from "react";
import styles from "./InstructorSection.module.css";
import { cn } from "../../utils";
import { useParams } from "react-router-dom";
import { useTrainerDetailsByCourse } from "../../Api/hooks/InstructorSection/useTrainerDetailsByCourse";

export default function InstructorSection({
  name = "John Mitchell",
  title = "Senior Full-Stack Developer & Technical Lead",
  stats = { years: "12+", students: "50K+", rating: "4.9" },
  bio = `With over 12 years of industry experience, John has worked at leading tech companies including Google, Microsoft, and Amazon. He specializes in full-stack web development and has mentored hundreds of developers throughout his career.`,
  creds = [
    "Senior Technical Lead at Google (5 years)",
    "Full-Stack Developer at Microsoft (4 years)",
    "Computer Science, Stanford University",
    "AWS Certified Solutions Architect",
  ],
  onLinkedIn = () => {},
  onAsk = () => {},
}) {
  
  
  const { courseName: courseNameSlug } = useParams();
const courseName = courseNameSlug
  ? decodeURIComponent(courseNameSlug)
      .replace(/[-_]+/g, " ")
      .replace(/\+\+/g, "pp")   // C++ → cpp
      .trim()
      .toLowerCase()
  : "";


  const { data: trainerList = [] } = useTrainerDetailsByCourse(courseName);

  const trainerName = trainerList[0]?.trainer_name;
  const trainerBio = trainerList[0]?.summary;
  const trainerRating = trainerList[0]?.trainerRating;
  const designation = trainerList[0]?.designation;
  const experience = trainerList[0]?.experience;
  const experienceCredentials = trainerList[0]?.experienceCredentials;

const rawExperienceCredentials = trainerList[0]?.experienceCredentials;

const experienceCredentialsArray =
  typeof rawExperienceCredentials === "string"
    ? rawExperienceCredentials
        .split("\n")              
        .map(item => item.replace(/^\*\s*/, "").trim()) 
        .filter(Boolean)          
    : [];


  
  const finalRating = Number(trainerRating || stats.rating);

  
  const fullStars = Math.floor(finalRating);
  const decimal = finalRating - fullStars;

  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < fullStars) return "★"; 
    if (i === fullStars && decimal >= 0.5) return "⯨"; 
    return "☆"; 
  }).join("");
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
  src="/InstructorDefaultImage.webp"
  alt={`${trainerName || name} headshot`}
  onError={(e) => {
    e.currentTarget.src = "/InstructorDefaultImage.webp";
  }}
/>
          </div>

          {/* Content */}
          <div className={styles.iscontent}>
            <div className={styles.istopline}>
              <h3 className={styles.isname}>{trainerName || name}</h3>
              <span className={styles.isbadge}>⭐ Top Instructor</span>
            </div>

            {/* <div className={styles.istitle}>{title}</div> */}
<div className={styles.istitle}>
  {designation || title}
</div>

            <div className={styles.isstats}>
              <div className={styles.isstat}>
                <div className={styles.isstatval}>
                  <span className={styles.isstatico}>
                    <img src="users.png" alt="logo" />
                  </span>
                  {experience ? `${experience}+` : stats.years}

                </div>
                <div className={styles.isstatlab}>Years Experience</div>
              </div>

              <div className={styles.isstat}>
                <div className={styles.isstatval}>
                  <span className={styles.isstatico}>
                    <img src="users.png" alt="logo" />
                  </span>
                  {stats.students}
                </div>
                <div className={styles.isstatlab}>Students Taught</div>
              </div>

              <div className={styles.isstat}>
                <div className={styles.isstatval}>
                  <span className={styles.isstatico}>
                    <img src="users.png" alt="logo" />
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

            <p className={styles.isbio}>{cleanTrainerBio || bio}</p>


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
