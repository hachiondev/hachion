import React from "react";
import styles from "./StudentsSay.module.css";
import { cn } from "../../utils";

const Star = (p) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
    <path fill="currentColor" d="M12 17.3l6.18 3.7-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const kpi = [
  { label: "Overall Rating", value: "4.9/5" },
  { label: "Total Reviews", value: "2,847" },
  { label: "Completion Rate", value: "96%" },
];

const categories = [
  { title: "Course Content Quality", score: 4.9, bar: 92 },
  { title: "Instructor Expertise",  score: 4.8, bar: 90 },
  { title: "Learning Support",      score: 4.9, bar: 92 },
  { title: "Career Impact",         score: 4.7, bar: 88 },
];

const reviews = [
  {
    name: "Angela Yu",
    role: "Backend Developer & Instructor",
    rating: 5.0,
    text:
      "Incredible depth of content and practical examples. The projects really helped me build confidence. “Incredible depth of content and practical examples. The projects really helped me build confidence.”",
  },
  {
    name: "Angela Yu",
    role: "Backend Developer & Instructor",
    rating: 5.0,
    text:
      "Incredible depth of content and practical examples. The projects really helped me build confidence. “Incredible depth of content and practical examples.”",
  },
  {
    name: "Angela Yu",
    role: "Backend Developer & Instructor",
    rating: 5.0,
    text:
      "Incredible depth of content and practical examples. The projects really helped me build confidence. “Incredible depth of content.”",
  },
  {
    name: "Angela Yu",
    role: "Backend Developer & Instructor",
    rating: 5.0,
    text:
      "Incredible depth of content and practical examples. The projects really helped me build confidence. “Incredible depth of content and practical examples.”",
  },
];

export default function StudentsSay({ onCta = () => {} }) {
  return (
    <section className={styles.wswrap}>
      <div className={styles.wshead}>
        <h2>What Our Students Say</h2>
        <p>Real feedback from our community of learners</p>
      </div>

      {/* KPI chips */}
      <div className={styles.wskpis}>
        {kpi.map((x) => (
          <div key={x.label} className={styles.wskpi}>
            <div className={styles.wskpival}>{x.value}</div>
            <div className={styles.wskpilab}>{x.label}</div>
          </div>
        ))}
      </div>

      {/* Category cards */}
      <div className={styles.wscats}>
        {categories.map((c) => (
          <div key={c.title} className={styles.wscat}>
            <div className={styles.wscattitle}>{c.title}</div>
            <div className={styles.wscatscore}>
              ⭐ {c.score}
            </div>
            <div className={styles.wsbar}>
              <div className={styles.wsbarfill} style={{ width: `${c.bar}%` }} />
            </div>
            <div className={styles.wsresp}>2847 responses</div>
          </div>
        ))}
      </div>

      <h3 className={styles.wssubhead}>Recent Student Reviews</h3>

      {/* Reviews grid */}
      <div className={styles.wsgrid}>
        {reviews.map((r, i) => (
          <article key={i} className={styles.wscard}>
            <div className={styles.wscardhead}>
              <div>
                <div className={styles.wsname}>{r.name}</div>
                <div className={styles.wsrole}>{r.role}</div>
              </div>
              <div className={styles.wsrating}>
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} />
                ))}
                <span className={styles.wsratingnum}>{r.rating.toFixed(1)}</span>
              </div>
            </div>
            <p className={styles.wstext}>{r.text}</p>
          </article>
        ))}
      </div>

      {/* Bottom CTA panel */}
      <div className={styles.wscta}>
        <div className={styles.wsctatitle}>Join 45,000+ Satisfied Students</div>
        <p>Experience the same transformation that thousands have achieved</p>
        <button className={styles.wsctabtn} onClick={onCta}>
          Start Your Journey Today
        </button>
      </div>
    </section>
  );
}
