import React, { useState, useEffect } from "react";
import styles from "./CourseCurriculum.module.css";
import { cn } from "../../../../utils";
import VideoModal from "./VideoModal";
import { useNavigate, useParams } from "react-router-dom";
import { useCurriculumAll } from "../../../../Api/hooks/CurriculumApi/useCurriculumAll";
import { useUserProfile } from "../../../../Api/hooks/CourseApi/useUserProfile";
import { useAssessmentAccess } from "../../../../Api/hooks/CurriculumApi/useAssessmentAccess";
import { useCourseByName } from "../../../../Api/hooks/CourseApi/useCourseByName";
import { useProjectsByCourseName } from "../../../../Api/hooks/CurriculumApi/useProjectsByCourseName";
import { saveRedirectUrl } from "../../../../redirectAfterLogin";
import LoginModal from "../../Common/Loginmodal";

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

export default function CourseCurriculum({ onViewDemoClass }) {
  const [openId, setOpenId] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  const [selectedTab, setSelectedTab] = useState({
    curriculumId: null,
    tab: null,
  });
  const [assessmentError, setAssessmentError] = useState({
    curriculumId: null,
    message: "",
  });
  const [expandedProjects, setExpandedProjects] = useState({});
  const navigation = useNavigate()

  const { courseName: courseNameSlug } = useParams();
  const [showAll, setShowAll] = useState(false);

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
  // Close any opened curriculum accordion
  setOpenId(null);

  // Reset selected tab (Topics / Assignment / Video)
  setSelectedTab({ curriculumId: null, tab: null });

  // Reset View More button
  setShowAll(false);

  // Reset expanded project descriptions (Read More)
  setExpandedProjects({});

  // Close video modal
  setShowVideo(false);
  setVideoUrl("");

  // Clear assessment errors
  setAssessmentError({ curriculumId: null, message: "" });

  // Close any prompts
  setShowRegisterPrompt(false);
  setShowEnrollPrompt(false);

}, [courseName]);

  useEffect(() => {
    if (accessData?.canDownload) {
      const fileUrl = `https://api.test.hachion.co/curriculum/assessments/${checkParams.assessmentFileName}`;
      window.open(fileUrl, "_blank", "noopener,noreferrer");

      setCheckParams((prev) => ({ ...prev, enabled: false }));
      return;
    }
    if (isError && accessError) {
      const apiError =
        accessError.response?.data?.error || "Access denied";
      if (apiError.toLowerCase().includes("enroll")) {
        setShowEnrollPrompt(true);
      } else {
        setAssessmentError({
          curriculumId: selectedTab.curriculumId,
          message: apiError,
        });
        setTimeout(() => {
          setAssessmentError({ curriculumId: null, message: "" });
        }, 6000);
      }

      setCheckParams((prev) => ({ ...prev, enabled: false }));
    }
  }, [accessData, isError, accessError]);

  // Initialize expandedProjects when projects are loaded
  useEffect(() => {
    if (projects.length > 0) {
      const initialExpandedState = {};
      projects.forEach((_, index) => {
        initialExpandedState[index] = false;
      });
      setExpandedProjects(initialExpandedState);
    }
  }, [projects]);

  const toggleProjectExpand = (projectIndex) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectIndex]: !prev[projectIndex]
    }));
  };

  // Simpler function to check if description is long
  const isLongDescription = (html) => {
    if (!html) return false;
    const text = html.replace(/<[^>]*>/g, '').trim();
    if (text.length < 100) return false;
    const wordCount = text.split(/\s+/).length;
    return wordCount > 15;
  };

  // 🔥 UPDATED: Added saveRedirectUrl
  const downloadPdf = () => {
    if (!email) {
      saveRedirectUrl(); // 🔥 Save URL before login prompt
      setShowRegisterPrompt(true);
      return;
    }

    if (!curriculum.length) {
      alert("No curriculum found.");
      return;
    }

    // 1️⃣ Try brochure PDF first
    const brochureItem = curriculum.find(
      (item) => item.brochure_pdf && item.brochure_pdf.trim() !== ""
    );

    if (brochureItem) {
      const filename = brochureItem.brochure_pdf.split("/").pop();
      const url = `https://api.test.hachion.co/uploads/test/curriculum/pdfs/brochurepdf/${filename}`;
      window.open(url, "_blank");
      return;
    }

    // 2️⃣ Fallback → curriculum PDF
    const curriculumItem = curriculum.find(
      (item) => item.curriculum_pdf && item.curriculum_pdf.trim() !== ""
    );

    if (curriculumItem) {
      const filename = curriculumItem.curriculum_pdf.split("/").pop();
      const url = `https://api.test.hachion.co/uploads/test/curriculum/pdfs/${filename}`;
      window.open(url, "_blank");
      return;
    }

    // 3️⃣ Nothing available
    alert("No syllabus PDF available.");
  };

  // 🔥 UPDATED: Added saveRedirectUrl
  const handleDownloadAssessment = (assessmentPdfPath) => {
    if (!email || !studentId) {
      saveRedirectUrl(); // 🔥 Save URL before login prompt
      setShowRegisterPrompt(true);
      return;
    }
    const assessmentFileName = assessmentPdfPath.split("/").pop();

    setCheckParams({
      studentId,
      courseName,
      assessmentFileName,
      enabled: true,
    });
  };

  const validCurriculum = uiCurriculum.filter(
    (m) => m.title && m.title.trim() !== ""
  );

  if (isLoading) return <p>Loading curriculum...</p>;

  return (
    <section className={styles.ccwrap}>
      <div className="container">
        {/* HEADER */}
        <div className={styles.cchead}>
          {/* <h2>Course Curriculum</h2> */}
          <h2>
            {courseDetails?.courseName
              ? `${courseDetails.courseName} Course Curriculum`
              : "Course Curriculum"}
          </h2>



          {/* <p>
            {courseDetails?.aboutCourse ||
              "Master industry-level skills — unlock hands-on modules, video learning sessions, and real project work."}
          </p> */}

          <button className={styles.ccdownload} onClick={downloadPdf}>
            <img src="/Download.png" alt="Download" height={24} />Download Detailed Curriculum
          </button>
        </div>

        {/* MAIN GRID */}
        <div className={styles.ccgrid}>
          {/* LEFT SIDE ACCORDION */}
          <div className={styles.ccgridbody}>
            {(uiCurriculum.length === 0 ||
              uiCurriculum.filter((m) => m.title && m.title.trim() !== "").length === 0) && (
                <div className={styles.noDataMessage}>
                  <p>No curriculum available.</p>
                </div>
              )}

            {uiCurriculum
              .filter((m) => m.title && m.title.trim() !== "")
              .slice(0, showAll ? uiCurriculum.length : 5)
              .map((m, idx) => {
                const open = openId === m.curriculum_id;
                const isTopicsSelected = selectedTab.curriculumId === m.curriculum_id && selectedTab.tab === "topics";
                const isAssignmentSelected = selectedTab.curriculumId === m.curriculum_id && selectedTab.tab === "assignment";
                const isVideoSelected = selectedTab.curriculumId === m.curriculum_id && selectedTab.tab === "video";

                return (
                  <div className={styles.ccacc} key={m.curriculum_id}>
                    <button
                      className={cn(
                        styles.ccacchead,
                        open && styles.ccaccheadisopen
                      )}
                      onClick={() => {
                        if (open) {
                          setOpenId(null);
                          setSelectedTab({ curriculumId: null, tab: null });
                        } else {
                          setOpenId(m.curriculum_id);
                          setSelectedTab({
                            curriculumId: m.curriculum_id,
                            tab: "topics",
                          });
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
                                setSelectedTab({
                                  curriculumId: m.curriculum_id,
                                  tab: "topics",
                                });
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
                                  setSelectedTab({
                                    curriculumId: m.curriculum_id,
                                    tab: "assignment",
                                  });
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
                                  setSelectedTab({
                                    curriculumId: m.curriculum_id,
                                    tab: "video",
                                  });
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
                    </button>

                    <div
                      className={cn(
                        styles.ccaccpanel,
                        open && styles.ccaccpanelopen
                      )}
                    >
                      {isTopicsSelected && (
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

                      {isAssignmentSelected && m.assessment_pdf && (
                        <>
                          <button
                            className={styles.ccassess}
                            onClick={() =>
                              handleDownloadAssessment(m.assessment_pdf)
                            }
                          >
                            📄 Download Assignment
                          </button>

                          {assessmentError.curriculumId === m.curriculum_id && (
                            <div
                              style={{
                                marginTop: "6px",
                                fontSize: "13px",
                                color: "#d93025",
                                background: "#fdecea",
                                padding: "6px 10px",
                                borderRadius: "4px",
                                display: "inline-block",
                              }}
                            >
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

            {/* View More / View Less Button */}
            {uiCurriculum.filter((m) => m.title && m.title.trim() !== "").length > 5 && (
              <div className={styles.viewMoreContainer}>
                <button
                  className="home-start-button"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "View Less" : "View More"}
                  <span className={styles.viewMoreArrow}>
                    {showAll ? "↑" : "↓"}
                  </span>
                </button>
              </div>
            )}
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

                {projects.map((project, i) => {
                  const isLong = isLongDescription(project.description || "");
                  const isExpanded = expandedProjects[i];

                  return (
                    <div key={i} className={styles.ccprojrow}>
                      <span className={styles.ccbadge}>{i + 1}</span>

                      <div className={styles.ccprojcontent}>
                        <div className={styles.ccprojtitle}>
                          {project.projectName}
                        </div>

                        <div
                          className={`${styles.ccprojsub} ${!isExpanded ? styles.collapsed : styles.expanded}`}
                          dangerouslySetInnerHTML={{
                            __html: project.description,
                          }}
                        />

                        {isLong && (
                          <span
                            className={styles.readMoreLink}
                            onClick={() => toggleProjectExpand(i)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                toggleProjectExpand(i);
                              }
                            }}
                          >
                            {isExpanded ? "Read Less" : "Read More"}
                            <span className={styles.readMoreIcon}>
                              {isExpanded ? " ▲" : " ▼"}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.cccard2}>
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

        {/* LOGIN PROMPT MODAL */}
        {showRegisterPrompt && (
          // <div className={styles.modalOverlay}>
          //   <div className={styles.modalContent}>
          //     <div className={styles.modalImage}>
          //       <img
          //         src={require("../../../../Assets/loginpopup.webp")}
          //         alt="login popup"
          //         className={styles.modalImg}
          //       />
          //     </div>

          //     <div className={styles.modalText}>
          //       <h3>Please Login</h3>
          //       <p>Login to access assignments and syllabus.</p>

          //       <div className={styles.modalButtons}>
          //         <button
          //           className={styles.modalLoginBtn}
          //           onClick={() => {
          //             saveRedirectUrl(); // 🔥 Save URL before navigating
          //             navigation("/login");
          //           }}
          //         >
          //           Login
          //         </button>

          //         <button
          //           className={styles.modalCancelBtn}
          //           onClick={() => setShowRegisterPrompt(false)}
          //         >
          //           Cancel
          //         </button>
          //       </div>
          //     </div>
          //   </div>
          // </div>
          <LoginModal isOpen={showRegisterPrompt} description="Login to access assignments and syllabus." onLogin={() => {
            // 🔥 Save current URL before redirecting to login
            saveRedirectUrl();
            navigation("/login");
            setShowRegisterPrompt(false);
          }}
            onClose={() => {
              setShowRegisterPrompt(false)
            }}
          />
        )}

        {/* ENROLL PROMPT MODAL */}
        {showEnrollPrompt && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalImage}>
                <img
                  src={require("../../../../Assets/loginpopup.webp")}
                  alt="enroll popup"
                  className={styles.modalImg}
                />
              </div>

              <div className={styles.modalText}>
                <h3>Please Enroll</h3>
                <p>You must enroll in any live class to access assignments.</p>

                <div className={styles.modalButtons}>
                  <button
                    className={styles.modalLoginBtn}
                    onClick={() => {
                      setShowEnrollPrompt(false);
                      // 🔥 Check if user is logged in before redirecting
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

                  <button
                    className={styles.modalCancelBtn}
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