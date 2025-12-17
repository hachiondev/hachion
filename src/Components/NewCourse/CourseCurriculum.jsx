import React, { useState, useEffect } from "react";
import styles from "./CourseCurriculum.module.css";
import { cn } from "../../utils";
import VideoModal from "./VideoModal";
import { useParams } from "react-router-dom";
import { useCurriculumAll } from "../../Api/hooks/CurriculumApi/useCurriculumAll";
import { useUserProfile } from "../../Api/hooks/CourseApi/useUserProfile";
import { useAssessmentAccess } from "../../Api/hooks/CurriculumApi/useAssessmentAccess";
import { useCourseByName } from "../../Api/hooks/CourseApi/useCourseByName";
import { useProjectsByCourseName } from "../../Api/hooks/CurriculumApi/useProjectsByCourseName";

function toEmbedUrl(url) {
  if (!url) return "";

  
  if (url.includes("watch?v=")) {
    const id = url.split("watch?v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  if (url.includes("youtu.be")) {
    const id = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  return url;
}
function extractListItems(htmlString) {
  const container = document.createElement("div");
  container.innerHTML = htmlString;
  return [...container.querySelectorAll("li")].map((li) =>
    li.innerText.trim()
  );
}

const Chevron = ({ open }) => (
  <svg
    viewBox="0 0 24 24"
    width="50"
    height="50"
    style={{
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform .2s",
      color: "rgb(123, 167, 215)",
    }}
  >
    <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
  </svg>
);

export default function CourseCurriculum() {
  const [openId, setOpenId] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  const [selectedTab, setSelectedTab] = useState({});
const { courseName: courseNameSlug } = useParams();

/// Human-readable course name
const courseName = courseNameSlug
  ? decodeURIComponent(courseNameSlug)
      .replace(/-/g, " ")
      .trim()
  : "";

  const encodedCourseName = encodeURIComponent(courseName);



  const { data: courseDetails } = useCourseByName(courseName);

  const { data: projects = [], isLoading: projectsLoading } =
  useProjectsByCourseName(courseName);


  const { data, isLoading } = useCurriculumAll(encodedCourseName);

  const curriculum = data?.curriculum || [];
  const uiCurriculum = data?.uiCurriculum || [];

  const { data: userData } = useUserProfile();
  const studentId = userData?.studentId || null;
  const email = userData?.email || null;
  const [showEnrollPrompt, setShowEnrollPrompt] = useState(false);


  const [checkParams, setCheckParams] = useState({
    studentId: null,
    courseName: null,
    batchId: null,
    assessmentFileName: null,
    enabled: false,
  });


  const {
  data: accessData,
  error: accessError,
  isError,
} = useAssessmentAccess(checkParams);

useEffect(() => {

  if (accessData?.canDownload) {
    const fileUrl = `https://api.test.hachion.co/curriculum/assessments/${checkParams.assessmentFileName}`;
    window.open(fileUrl, "_blank", "noopener,noreferrer");

    setCheckParams((prev) => ({ ...prev, enabled: false }));
    return;
  }

  if (isError && accessError) {
    const apiError =
      accessError.response?.data?.error || "";

    if (apiError.toLowerCase().includes("enroll")) {
      setShowEnrollPrompt(true);
    } else {
      alert(apiError || "Access denied");
    }

    setCheckParams((prev) => ({ ...prev, enabled: false }));
  }
}, [accessData, isError, accessError]);

const downloadPdf = () => {
  if (!email) return setShowRegisterPrompt(true);
  if (!curriculum.length) return alert("No curriculum found.");

  const matched = curriculum.find((item) => item.brochure_pdf);
  if (!matched) return alert("No brochure PDF uploaded.");

  const filename = matched.brochure_pdf.split("/").pop();
  const finalUrl = `https://api.test.hachion.co/curriculum/pdfs/${filename}`;
  window.open(finalUrl, "_blank");
};


const handleDownloadAssessment = (assessmentPdfPath) => {
  if (!email || !studentId) return setShowRegisterPrompt(true);

  const assessmentFileName = assessmentPdfPath.split("/").pop();


  setCheckParams({
    studentId,
    courseName,
    assessmentFileName,
    enabled: true,
  });
};



  if (isLoading) return <p>Loading curriculum...</p>;

  return (
    <section className={styles.ccwrap}>
      <div className="container">
        {/* HEADER */}
        <div className={styles.cchead}>
          <h2>Course Curriculum</h2>
          <p>
  {courseDetails?.aboutCourse || 
    "Master industry-level skills — unlock hands-on modules, video learning sessions, and real project work."}
</p>

          <button className={styles.ccdownload} onClick={downloadPdf}>
            <img src="Download.png" alt="Download" height={24} /> Detailed
            Syllabus
          </button>
        </div>

        {/* MAIN GRID */}
        <div className={styles.ccgrid}>
          {/* LEFT SIDE ACCORDION */}
          <div className={styles.ccgridbody}>
            {uiCurriculum.length === 0 && <p>No curriculum available.</p>}

            {uiCurriculum
              .filter((m) => m.title && m.title.trim() !== "")
              .map((m, idx) => {
                const open = openId === m.curriculum_id;

                return (
                  <div className={styles.ccacc} key={m.curriculum_id}>
                    <button
                      className={cn(
                        styles.ccacchead,
                        open && styles.ccaccheadisopen
                      )}
                      onClick={() =>
                        setOpenId(open ? null : m.curriculum_id)
                      }
                    >
                      <span className={styles.ccnum}>{idx + 1}</span>

                      <div className={styles.cctitle}>
                        <div className={styles.ccttlmain}>{m.title}</div>

                        <div className={styles.ccttlsub}>
                          {/* TOPICS TAB */}
                          <button
                            className={`${styles.cccapsul} ${
                              selectedTab[m.curriculum_id] === "topics"
                                ? styles.activeCap
                                : ""
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTab((prev) => ({
                                ...prev,
                                [m.curriculum_id]:
                                  prev[m.curriculum_id] === "topics"
                                    ? null
                                    : "topics",
                              }));
                              setOpenId(m.curriculum_id);
                            }}
                          >
                            Topics Included
                          </button>

                          {/* ASSIGNMENT TAB */}
                          {m.assessment_pdf && (
                            <button
                              className={`${styles.cccapsul} ${
                                selectedTab[m.curriculum_id] === "assignment"
                                  ? styles.activeCap
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTab((prev) => ({
                                  ...prev,
                                  [m.curriculum_id]:
                                    prev[m.curriculum_id] === "assignment"
                                      ? null
                                      : "assignment",
                                }));
                                setOpenId(m.curriculum_id);
                              }}
                            >
                              Assignment
                            </button>
                          )}
                          {m.link && (
    <button
      type="button"
      className={`${styles.cccapsul} ${
        selectedTab[m.curriculum_id] === "video"
          ? styles.activeCap
          : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedTab((prev) => ({
          ...prev,
          [m.curriculum_id]:
            prev[m.curriculum_id] === "video"
              ? null
              : "video",
        }));
        setOpenId(m.curriculum_id);
      }}
    >
      Videos
    </button>
  )}
                        </div>
                      </div>

                      <Chevron open={open} />
                    </button>

                    {/* PANEL CONTENT */}
                    <div
                      className={cn(
                        styles.ccaccpanel,
                        open && styles.ccaccpanelopen
                      )}
                    >
                      {selectedTab[m.curriculum_id] === "topics" && (
                        <>
                          {extractListItems(m.topic).map((point, i) => (
                            <div key={i} className={styles.ccrow}>
                              <span>•</span>
                              <span className={styles.ccrowtitle}>
                                {point}
                              </span>
                            </div>
                          ))}
                        </>
                      )}

                      {selectedTab[m.curriculum_id] === "assignment" &&
                        m.assessment_pdf && (
                          <button
                            className={styles.ccassess}
                            onClick={() =>
                              handleDownloadAssessment(m.assessment_pdf)
                            }
                          >
                            📄 Download Assignment
                          </button>
                        )}
                       {selectedTab[m.curriculum_id] === "video" && m.link && (
  <div style={{ padding: "10px 0" }}>
    <button
      className={styles.ccvideobtn}
      style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
      onClick={() => {
        setVideoUrl(toEmbedUrl(m.link)); 
        setShowVideo(true);
      }}
    >
      ▶ Play Video
    </button>
  </div>
)}


                    </div>
                  </div>
                );
              })}
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className={styles.ccright}>
            <div className={styles.cccard}>
               <div className={styles.cccardhead}>Hands-on Projects</div>

    <div className={styles.ccproj}>
      {projectsLoading && <p>Loading projects...</p>}

      {!projectsLoading && projects.length === 0 && (
        <p>No projects available for this course.</p>
      )}

      {projects.map((project, i) => (
        <div key={i} className={styles.ccprojrow}>
          <span className={styles.ccbadge}>{i + 1}</span>

          <div>
            <div className={styles.ccprojtitle}>
               {project.projectName}
            </div>

            <div className={styles.ccprojsub}>
              {/* <span>{project.projectName}</span> */}


              {/* description comes as HTML */}
              <div
                dangerouslySetInnerHTML={{
                  __html: project.description,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>

            <div className={styles.cccard}>
              <div className={`${styles.cccardhead} ${styles.ccstar}`}>
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

        {/* VIDEO MODAL */}
        {showVideo && (
          <VideoModal videoSrc={videoUrl} onClose={() => setShowVideo(false)} />
        )}

        {/* LOGIN PROMPT */}
        {showRegisterPrompt && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                width: "560px",
                background: "#fff",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                boxShadow: "0 10px 35px rgba(0,0,0,0.28)",
              }}
            >
              <div style={{ width: "45%", textAlign: "center" }}>
                <img
                  src={require("../../Assets/loginpopup.webp")}
                  alt="login popup"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    transform: "scaleX(-1)",
                  }}
                />
              </div>

              <div
                style={{
                  width: "55%",
                  paddingLeft: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <h3>Please Login</h3>
                <p>Login to access assignments and syllabus.</p>

                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <button
                    style={{
                      padding: "10px 22px",
                      background: "#0057ff",
                      color: "#fff",
                      borderRadius: "6px",
                      border: "none",
                    }}
                    onClick={() => {
                      localStorage.setItem(
                        "redirectAfterLogin",
                        window.location.pathname
                      );
                      window.location.href = "/login";
                    }}
                  >
                    Login
                  </button>

                  <button
                    style={{
                      padding: "10px 22px",
                      background: "#f1f1f1",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                    }}
                    onClick={() => setShowRegisterPrompt(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showEnrollPrompt && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        width: "560px",
        background: "#fff",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        boxShadow: "0 10px 35px rgba(0,0,0,0.28)",
      }}
    >
      <div style={{ width: "45%", textAlign: "center" }}>
        <img
          src={require("../../Assets/loginpopup.webp")}
          alt="enroll popup"
          style={{
            width: "100%",
            borderRadius: "8px",
            transform: "scaleX(-1)",
          }}
        />
      </div>

      <div
        style={{
          width: "55%",
          paddingLeft: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h3>Please Enroll</h3>
        <p>You must enroll any live class to access assignments.</p>

        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <button
            style={{
              padding: "10px 22px",
              background: "#0057ff",
              color: "#fff",
              borderRadius: "6px",
              border: "none",
            }}
            onClick={() => {
              window.location.href = `/checkout/${encodedCourseName}`;
            }}
          >
            Enroll Now
          </button>

          <button
            style={{
              padding: "10px 22px",
              background: "#f1f1f1",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
            onClick={() => setShowEnrollPrompt(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      </div>
    </section>
  );
}
