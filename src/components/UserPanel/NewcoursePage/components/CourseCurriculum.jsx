"use client";

import React, { useState, useEffect } from "react";
import styles from "./CourseCurriculum.module.css";
import { cn } from "@/utils";
import VideoModal from "./VideoModal";
import { useRouter } from "next/navigation";
import { useCurriculumAll } from "@/Api/hooks/CurriculumApi/useCurriculumAll";
import { openCurriculumPdf } from "@/Api/hooks/CurriculumApi/downloadCurriculumPdf";
import { useUserProfile } from "@/Api/hooks/CourseApi/useUserProfile";
import { useAuthStatus } from "@/Api/hooks/CourseApi/useAuthStatus";
import { useAssessmentAccess } from "@/Api/hooks/CurriculumApi/useAssessmentAccess";
import { useCourseByName } from "@/Api/hooks/CourseApi/useCourseByName";
import { useProjectsByCourseName } from "@/Api/hooks/CurriculumApi/useProjectsByCourseName";
import { useCourseApiName } from "@/components/UserPanel/CoursePage/CourseApiNameContext";
import { saveRedirectUrl } from "@/redirectAfterLogin";
import LoginModal from "../../Common/Loginmodal";
import loginPopupImage from "@/assets/loginpopup.webp";
import { API_BASE_URL } from "@/lib/apiBase";

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
  return [...container.querySelectorAll("li")].map((li) => li.innerText.trim());
}
const Chevron = ({ open }) => (
  <svg viewBox="0 0 24 24" width="50" height="50" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s", color: "rgb(123, 167, 215)" }}>
    <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
  </svg>
);

// Ported from the CRA app's
// src/Components/UserPanel/NewcoursePage/components/CourseCurriculum.jsx.
// useNavigate -> useRouter.
export default function CourseCurriculum({ onViewDemoClass, initialCourse, initialCurriculum }) {
  const [openId, setOpenId] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedTab, setSelectedTab] = useState({ curriculumId: null, tab: null });
  const [assessmentError, setAssessmentError] = useState({ curriculumId: null, message: "" });
  const [expandedProjects, setExpandedProjects] = useState({});
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  const courseName = useCourseApiName();
  const encodedCourseName = encodeURIComponent(courseName);
  // initialCourse/initialCurriculum are server-fetched props from
  // app/(public)/courses/[categoryName]/[courseName]/page.js — see
  // CourseBanner.jsx for why this seeds react-query instead of leaving this
  // to a client-only fetch (avoids a server-rendered "Loading
  // curriculum..." placeholder).
  const { data: courseDetails } = useCourseByName(courseName, initialCourse ? { initialData: initialCourse } : undefined);
  const { data: projects = [], isLoading: projectsLoading } = useProjectsByCourseName(courseName);
  const { data, isLoading } = useCurriculumAll(encodedCourseName, initialCurriculum ? { initialData: initialCurriculum } : undefined);
  const uiCurriculum = data?.uiCurriculum || [];
  const curriculum = data?.curriculum || [];
  const { data: userData } = useUserProfile();
  const studentId = userData?.studentId || null;
  const email = userData?.email || null;
  const { status: authStatus } = useAuthStatus();
  const [showEnrollPrompt, setShowEnrollPrompt] = useState(false);
  const [checkParams, setCheckParams] = useState({
    studentId: null,
    courseName: null,
    batchId: null,
    assessmentFileName: null,
    enabled: false,
  });
  const { data: accessData, error: accessError, isError } = useAssessmentAccess(checkParams);
  useEffect(() => {
    // Resets all local UI state when the course (an external, URL-driven
    // source) changes — legitimate prop/route sync, not a pure derivation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenId(null);
    setSelectedTab({ curriculumId: null, tab: null });
    setShowAll(false);
    setExpandedProjects({});
    setShowVideo(false);
    setVideoUrl("");
    setAssessmentError({ curriculumId: null, message: "" });
    setShowRegisterPrompt(false);
    setShowEnrollPrompt(false);
  }, [courseName]);
  useEffect(() => {
    if (accessData?.canDownload) {
      const fileUrl = `${API_BASE_URL}/curriculum/assessments/${checkParams.assessmentFileName}`;
      window.open(fileUrl, "_blank", "noopener,noreferrer");
      // Syncs from the assessment-access query result (an external source).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCheckParams((prev) => ({ ...prev, enabled: false }));
      return;
    }
    if (isError && accessError) {
      const apiError = accessError.response?.data?.error || "Access denied";
      if (apiError.toLowerCase().includes("enroll")) {
        setShowEnrollPrompt(true);
      } else {
        setAssessmentError({ curriculumId: selectedTab.curriculumId, message: apiError });
        setTimeout(() => {
          setAssessmentError({ curriculumId: null, message: "" });
        }, 6000);
      }
      setCheckParams((prev) => ({ ...prev, enabled: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessData, isError, accessError]);

  useEffect(() => {
    if (projects.length > 0) {
      const initialExpandedState = {};
      projects.forEach((_, index) => {
        initialExpandedState[index] = false;
      });
      // Syncs from the projects query result (an external source).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpandedProjects(initialExpandedState);
    }
  }, [projects]);
  const toggleProjectExpand = (projectIndex) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectIndex]: !prev[projectIndex],
    }));
  };

  const isLongDescription = (html) => {
    if (!html) return false;
    const text = html.replace(/<[^>]*>/g, "").trim();
    if (text.length < 100) return false;
    const wordCount = text.split(/\s+/).length;
    return wordCount > 15;
  };

  const downloadPdf = async () => {
    // Auth not restored yet (the button is disabled meanwhile) - not the same
    // as logged out, so don't show the login prompt.
    if (authStatus === "loading") return;
    if (authStatus !== "authenticated") {
      saveRedirectUrl();
      setShowRegisterPrompt(true);
      return;
    }
    if (!curriculum.length) {
      alert("No curriculum found.");
      return;
    }
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      const opened = await openCurriculumPdf(curriculum);
      if (!opened) {
        alert("No syllabus PDF available right now. Please try again later.");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadAssessment = (assessmentPdfPath) => {
    if (!email || !studentId) {
      saveRedirectUrl();
      setShowRegisterPrompt(true);
      return;
    }
    const assessmentFileName = assessmentPdfPath.split("/").pop();
    setCheckParams({ studentId, courseName, assessmentFileName, enabled: true });
  };
  const validCurriculum = uiCurriculum.filter((m) => m.title && m.title.trim() !== "");
  if (isLoading) return <p>Loading curriculum...</p>;
  return (
    <section className={styles.ccwrap}>
      <div className="container">
        <div className={styles.cchead}>
          <h2>{courseDetails?.courseName ? `${courseDetails.courseName} Course Curriculum` : "Course Curriculum"}</h2>

          <button className={styles.ccdownload} onClick={downloadPdf} disabled={isDownloading || authStatus === "loading"} aria-busy={isDownloading || authStatus === "loading"}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Download.png" alt="" height={24} />
            {isDownloading ? "Preparing..." : "Download Detailed Curriculum"}
          </button>
        </div>

        <div className={styles.ccgrid}>
          <div className={styles.ccgridbody}>
            {validCurriculum.length === 0 && (
              <div className={styles.noDataMessage}>
                <p>No curriculum available.</p>
              </div>
            )}

            {validCurriculum.slice(0, showAll ? uiCurriculum.length : 5).map((m, idx) => {
              const open = openId === m.curriculum_id;
              const isTopicsSelected = selectedTab.curriculumId === m.curriculum_id && selectedTab.tab === "topics";
              const isAssignmentSelected = selectedTab.curriculumId === m.curriculum_id && selectedTab.tab === "assignment";
              const isVideoSelected = selectedTab.curriculumId === m.curriculum_id && selectedTab.tab === "video";
              return (
                <div className={styles.ccacc} key={m.curriculum_id}>
                  {/* This accordion header contains its own tab-selector
                      <button>s (Topics/Assignment/Videos below) — a
                      <button> can't validly nest other <button>s in HTML,
                      which faithfully-ported from CRA (client-only, so the
                      invalid nesting was silently tolerated there) surfaces
                      here as a real SSR/hydration mismatch. A div with
                      role="button" keeps the same keyboard/click behavior
                      without nesting interactive elements. */}
                  <div
                    role="button"
                    tabIndex={0}
                    className={cn(styles.ccacchead, open && styles.ccaccheadisopen)}
                    onClick={() => {
                      if (open) {
                        setOpenId(null);
                        setSelectedTab({ curriculumId: null, tab: null });
                      } else {
                        setOpenId(m.curriculum_id);
                        setSelectedTab({ curriculumId: m.curriculum_id, tab: "topics" });
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter" && e.key !== " ") return;
                      e.preventDefault();
                      if (open) {
                        setOpenId(null);
                        setSelectedTab({ curriculumId: null, tab: null });
                      } else {
                        setOpenId(m.curriculum_id);
                        setSelectedTab({ curriculumId: m.curriculum_id, tab: "topics" });
                      }
                    }}
                  >
                    <span className={styles.ccnum}>{idx + 1}</span>

                    <div className={styles.cctitle}>
                      <div className={styles.ccttlmain}>{m.title}</div>

                      <div className={styles.ccttlsub}>
                        <button
                          className={`${styles.cccapsul} ${isTopicsSelected ? styles.activeCap : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isTopicsSelected) {
                              setSelectedTab({ curriculumId: null, tab: null });
                              setOpenId(null);
                            } else {
                              setSelectedTab({ curriculumId: m.curriculum_id, tab: "topics" });
                              setOpenId(m.curriculum_id);
                            }
                          }}
                        >
                          Topics Included
                        </button>

                        {m.assessment_pdf && (
                          <button
                            className={`${styles.cccapsul} ${isAssignmentSelected ? styles.activeCap : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isAssignmentSelected) {
                                setSelectedTab({ curriculumId: null, tab: null });
                                setOpenId(null);
                              } else {
                                setSelectedTab({ curriculumId: m.curriculum_id, tab: "assignment" });
                                setOpenId(m.curriculum_id);
                              }
                            }}
                          >
                            Assignment
                          </button>
                        )}

                        {m.link && (
                          <button
                            type="button"
                            className={`${styles.cccapsul} ${isVideoSelected ? styles.activeCap : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isVideoSelected) {
                                setSelectedTab({ curriculumId: null, tab: null });
                                setOpenId(null);
                              } else {
                                setSelectedTab({ curriculumId: m.curriculum_id, tab: "video" });
                                setOpenId(m.curriculum_id);
                              }
                            }}
                          >
                            Videos
                          </button>
                        )}
                      </div>
                    </div>

                    <Chevron open={open} />
                  </div>

                  <div className={cn(styles.ccaccpanel, open && styles.ccaccpanelopen)}>
                    {isTopicsSelected && (
                      <>
                        {extractListItems(m.topic).map((point, i) => (
                          <div key={i} className={styles.ccrow}>
                            <span>•</span>
                            <span className={styles.ccrowtitle}>{point}</span>
                          </div>
                        ))}
                      </>
                    )}

                    {isAssignmentSelected && m.assessment_pdf && (
                      <>
                        <button className={styles.ccassess} onClick={() => handleDownloadAssessment(m.assessment_pdf)}>
                          📄 Download Assignment
                        </button>

                        {assessmentError.curriculumId === m.curriculum_id && (
                          <div style={{ marginTop: "6px", fontSize: "13px", color: "#d93025", background: "#fdecea", padding: "6px 10px", borderRadius: "4px", display: "inline-block" }}>
                            {assessmentError.message}
                          </div>
                        )}
                      </>
                    )}

                    {isVideoSelected && m.link && (
                      <div className={styles.ccvideocontainer}>
                        <button
                          className={styles.ccvideobtn}
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

            {validCurriculum.length > 5 && (
              <div className={styles.viewMoreContainer}>
                <button className="home-start-button" onClick={() => setShowAll(!showAll)}>
                  {showAll ? "View Less" : "View More"}
                  <span className={styles.viewMoreArrow}>{showAll ? "↑" : "↓"}</span>
                </button>
              </div>
            )}
          </div>

          <aside className={styles.ccright}>
            <div className={styles.cccard}>
              <div className={styles.cccardhead}>Hands-on Projects</div>

              <div className={styles.ccproj}>
                {projectsLoading && <p>Loading projects...</p>}

                {!projectsLoading && projects.length === 0 && <p>No projects available for this course.</p>}

                {projects.map((project, i) => {
                  const isLong = isLongDescription(project.description || "");
                  const isExpanded = expandedProjects[i];
                  return (
                    <div key={i} className={styles.ccprojrow}>
                      <span className={styles.ccbadge}>{i + 1}</span>

                      <div className={styles.ccprojcontent}>
                        <div className={styles.ccprojtitle}>{project.projectName}</div>

                        <div className={`${styles.ccprojsub} ${!isExpanded ? styles.collapsed : styles.expanded}`} dangerouslySetInnerHTML={{ __html: project.description }} />

                        {isLong && (
                          <span
                            className={styles.readMoreLink}
                            onClick={() => toggleProjectExpand(i)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                toggleProjectExpand(i);
                              }
                            }}
                          >
                            {isExpanded ? "Read Less" : "Read More"}
                            <span className={styles.readMoreIcon}>{isExpanded ? " ▲" : " ▼"}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.cccard2}>
              <div className={`${styles.cccardhead} ${styles.ccstar}`}>✨ What Makes This Different</div>

              <ul className={styles.ccwhy}>
                <li>Industry-current curriculum updated monthly</li>
                <li>Real-world projects from actual companies</li>
                <li>1-on-1 mentorship sessions included</li>
                <li>Portfolio review by industry experts</li>
              </ul>
            </div>
          </aside>
        </div>

        {showVideo && <VideoModal videoSrc={videoUrl} onClose={() => setShowVideo(false)} />}

        {showRegisterPrompt && (
          <LoginModal
            isOpen={showRegisterPrompt}
            description="Login to access assignments and syllabus."
            onLogin={() => {
              saveRedirectUrl();
              router.push("/login");
              setShowRegisterPrompt(false);
            }}
            onClose={() => {
              setShowRegisterPrompt(false);
            }}
          />
        )}

        {showEnrollPrompt && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalImage}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={loginPopupImage.src} alt="enroll popup" className={styles.modalImg} />
              </div>

              <div className={styles.modalText}>
                <h3>Please Enroll</h3>
                <p>You must enroll in any live class to access assignments.</p>

                <div className={styles.modalButtons}>
                  <button
                    className={styles.modalLoginBtn}
                    onClick={() => {
                      setShowEnrollPrompt(false);
                      if (!email) {
                        saveRedirectUrl();
                        setShowRegisterPrompt(true);
                        return;
                      }
                      onViewDemoClass();
                    }}
                  >
                    Enroll Now
                  </button>

                  <button className={styles.modalCancelBtn} onClick={() => setShowEnrollPrompt(false)}>
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
