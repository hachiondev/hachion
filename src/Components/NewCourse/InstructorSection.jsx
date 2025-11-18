import React from "react";
import styles from "./InstructorSection.module.css";
import { cn } from "../../utils";

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
  onLinkedIn = () => { },
  onAsk = () => { },
}) {
  return (
    <section className={styles.iswrap}>
      <div className={styles.ishead}>
        <h2>Meet Your Instructor</h2>
        <p>Learn from industry veterans with years of real-world experience</p>
      </div>

      <div className={styles.iscard}>
        {/* Photo */}
        <div className={styles.isphoto}>
          <img src="instructor.png" alt={`${name} headshot`} />
        </div>

        {/* Content */}
        <div className={styles.iscontent}>
          <div className={styles.istopline}>
            <h3 className={styles.isname}>{name}</h3>
            <span className={styles.isbadge}>
              ⭐ Top Instructor
            </span>
          </div>

          <div className={styles.istitle}>{title}</div>

          <div className={styles.isstats}>
            <div className={styles.isstat}>

              <div className={styles.isstatval}>
                <span className={styles.isstatico}>
                  <img src="users.png" alt="logo" />
                </span>
                {stats.years}</div>
              <div className={styles.isstatlab}>Years Experience</div>
            </div>
            <div className={styles.isstat}>
              
              <div className={styles.isstatval}>
                <span className={styles.isstatico}>
                  <img src="users.png" alt="logo" />
                </span>
                {stats.students}</div>
              <div className={styles.isstatlab}>Students Taught</div>
            </div>
            <div className={styles.isstat}>
              <div className={styles.isstatval}>
                <span className={styles.isstatico}>
                  <img src="users.png" alt="logo" />
                </span>
                {stats.rating}</div>
              <div className={styles.isstatlab}>Instructor Rating</div>
            </div>
          </div>

          <p className={styles.isbio}>{bio}</p>

          <div className={styles.issubhead}>Experience & Credentials:</div>
          <ul className={styles.islist}>
            {creds.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>

          <div className={styles.isactions}>
            <button className={cn(styles.isbtn, styles.isbtnoutline)} onClick={onLinkedIn}>
              <span className="ico">
                <img src="LinkedIn.png" alt="LinkedIn" height={22} />
              </span>
              View LinkedIn Profile
            </button>
            <button className={cn(styles.isbtn, styles.isbtnoutline)} onClick={onAsk}>
              Ask a Question
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
