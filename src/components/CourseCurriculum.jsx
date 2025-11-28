import React, { useState } from "react";
import styles from "./CourseCurriculum.module.css";
import { cn } from "../lib/utils";
import VideoModal from "./VideoModal";
import LoginRequired from "./LoginRequired";


const Chevron = ({ open }) => (
  <svg
    viewBox="0 0 24 24"
    width="50"
    height="50"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s", color: "rgb(123, 167, 215)" }}
  >
    <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
  </svg>
);
const VideoIco = () => (
  <img src="play_button.png" alt="video" width="18" height="18" />
);
const FileIco = () => (
  <img src="file.png" alt="file" width="18" height="18" />
);

/* --- sample data --- */
const modules = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    meta: { sections: 5, videos: 3, assignments: 1, projects: 1 },
    items: [
      { t: "Introduction to Web Development", type: "video", meta: "30 minutes" },
      { t: "HTML5 Basics and Semantic Structure", type: "video", meta: "45 minutes" },
      { t: "Assignment 1", type: "file", meta: "5.3 MB" },
      { t: "Responsive Design with Flexbox and Grid", type: "video", meta: "30 minutes" },
      { t: "Practice Project", type: "file", meta: "5.3 MB" },
    ],
  },
  {
    id: 2,
    title: "JavaScript Mastery",
    meta: { sections: 5, videos: 3, assignments: 1, projects: 1 },
    items: [
      { t: "JS Syntax & Runtime", type: "video", meta: "40 minutes" },
      { t: "DOM & Events", type: "video", meta: "35 minutes" },
      { t: "Async (Promises/Fetch)", type: "video", meta: "45 minutes" },
    ],
  },
  {
    id: 3,
    title: "Backend Development",
    meta: { sections: 5, videos: 3, assignments: 1, projects: 1 },
    items: [
      { t: "APIs with Express", type: "video", meta: "40 minutes" },
      { t: "Auth Basics", type: "video", meta: "30 minutes" },
      { t: "Database Intro", type: "video", meta: "45 minutes" },
    ],
  },
  {
    id: 4,
    title: "React Development",
    meta: { sections: 5, videos: 3, assignments: 1, projects: 1 },
    items: [
      { t: "React Essentials", type: "video", meta: "45 minutes" },
      { t: "Hooks & State", type: "video", meta: "40 minutes" },
      { t: "Routing & Data", type: "video", meta: "35 minutes" },
    ],
  },
];

const projects = [
  "Personal Portfolio Website",
  "Interactive Todo Application",
  "Weather Dashboard with API Integration",
  "E-commerce Product Catalog",
  "Social Media Dashboard",
  "Blog Platform with CMS",
  "Real-time Chat Application",
  "Full-Stack MERN Application",
];

export default function CourseCurriculum() {
  const [openId, setOpenId] = useState(1);
  const [showVideo, setShowVideo] = useState(false);
  return (
    <section className={styles.ccwrap}>
      <div className="container">
      <div className={styles.cchead}>
        <h2>Course Curriculum</h2>
        <p>
          Master the web from scratch — real-world skills in HTML, CSS, and JavaScript.
          Learn to build responsive, interactive websites
        </p>
        <button className={styles.ccdownload}>
          <img src="Download.png" alt="Download" height={24} /> Download Detailed Syllabus
        </button>
      </div>

      <div className={styles.ccgrid}>
        {/* LEFT: Accordion */}
        <div className={styles.ccgridbody}>
          {modules.map((m, idx) => {
            const open = openId === m.id;
            return (
              <div className={styles.ccacc} key={m.id}>
                <button
                  className={cn(styles.ccacchead, open && styles.ccaccheadisopen)}
                  onClick={() => setOpenId(open ? -1 : m.id)}
                  aria-expanded={open}
                  aria-controls={`panel-${m.id}`}
                >
                  <span className={styles.ccnum}>{idx + 1}</span>
                  <div className={styles.cctitle}>
                    <div className={styles.ccttlmain}>{m.title}</div>
                    <div className={styles.ccttlsub}>
                      <span className={styles.cccapsul}>{m.meta.sections} Sections</span>
                      <span className={styles.cccapsul}>{m.meta.videos} Videos</span>
                      <span className={styles.cccapsul}>{m.meta.assignments} Assignments</span>
                      <span className={styles.cccapsul}>{m.meta.projects} Project</span>
                    </div>
                  </div>
                  <Chevron open={open} />
                </button>

                <div
                  id={`panel-${m.id}`}
                  className={cn(styles.ccaccpanel, open && styles.ccaccpanelopen)}
                  role="region"
                  aria-labelledby={`btn-${m.id}`}
                >
                  {m.items.map((it, i) => (
                    <div key={i} className={styles.ccrow} onClick={() => it.type === "video" && setShowVideo(true)}>
                      <span>
                        {it.type === "video" ? <VideoIco /> : <FileIco />}
                      </span>
                      <span className={styles.ccrowtitle}>{it.t}</span>
                      <span className={styles.ccrowmeta}>{it.meta}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: Projects + Why different */}
        <aside className={styles.ccright}>
          <div className={styles.cccard}>
            <div className={styles.cccardhead}>Hands-on Projects</div>
            <div className={styles.ccproj}>
              {projects.map((p, i) => (
                <div key={p} className={styles.ccprojrow}>
                  <span className={styles.ccbadge}>{i + 1}</span>
                  <div>
                    <div className={styles.ccprojtitle}>Project {i + 1}</div>
                    <div className={styles.ccprojsub}>{p}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.cccard}>
            <div className={cn(styles.cccardhead, styles.ccstar)}>
              ✨ What Makes This Different
            </div>
            <ul className={styles.ccwhy}>
              <li>Industry-current curriculum updated monthly</li>
              <li>Real-world projects from actual companies</li>
              <li>1-on-1 mentorship sessions included</li>
              <li>Portfolio review by industry experts</li>
            </ul>
          </div>
        </aside>
      </div>

      {showVideo && (
        // <VideoModal
        //   videoSrc={"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"}
        //   onClose={() => setShowVideo(false)}
        // />
        <LoginRequired
            title="Login Required"
            subtitle="To add items to cart please Login"
            onCancel={() => setShowVideo(false)}
            onLogin={() => {
                setShowVideo(false);
            }}
        />
      )}
      </div>

    </section>
  );
}
