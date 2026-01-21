
import React, { useEffect, useState } from "react";
import styles from "./DemoClassSection.module.css";
import { cn } from "../../../../utils";
import { useCheckEnrollmentForSessions } from "../../../../Api/hooks/CourseApi/useCheckEnrollmentForSessions";
import { useResendEnrollEmail } from "../../../../Api/hooks/CourseApi/useResendEnrollEmail";

const Chevron = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    className={styles.faqchevron}
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"
    />
  </svg>
);

function DemoClassSectionSelfTab({
  timeOptions,
  notificationOptions,
  preferredTime,
  setPreferredTime,
  notification,
  setNotification,
  timeDropdownOpen,
  setTimeDropdownOpen,
  notificationDropdownOpen,
  setNotificationDropdownOpen,
  selectedGroupKey,
  setSelectedGroupKey,
  selectedGroup,
    userProfile,
  courseName,
  isRequestBatchLoading,
  isProfileLoading,
  showMessage,
  isRequestBatchSuccess,
  requestBatchError,
  onRequestClick,
onCloseRegisterPrompt,
onEnrollClick,
  selfPacedLearning,
  isCourseLoading,
  courseError,
}) {

  const selfContent =
    selfPacedLearning && selfPacedLearning.trim().length > 0
      ? selfPacedLearning
      : `Join real-time instructor-led sessions from anywhere. This mode includes interactive classes, hands-on exercises, and live Q&A to ensure in-depth learning.

What's Included:
• 80+ hours of video content
• 15 modules with over 150 lessons
• 5 real-world projects
• Professional Certificate upon completion
• English
• Lifetime access with free updates
• No prior programming experience required`;

  // const isAnyDaySelected = () => {
  //   const checkboxes = document.querySelectorAll(".dayCheckbox");
  //   return Array.from(checkboxes).some((cb) => cb.checked);
  // };

  // const isSelfFormValid =
  //   isAnyDaySelected() &&
  //   preferredTime &&
  //   notification;

  //   const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendingBatchId, setSendingBatchId] = React.useState(null);
    const [resendMessage, setResendMessage] = React.useState("");
    const [resendError, setResendError] = React.useState("");
      const [notifyViaMap, setNotifyViaMap] = useState({});
    const { data: checkedSessions = [] } = useCheckEnrollmentForSessions(
      selectedGroup?.sessions || [],
      userProfile?.studentId || "",
      courseName || ""
    );
      const { mutate: resendEmail } = useResendEnrollEmail();

  const isSelfFormValid =
    selectedDays.length > 0 &&
    Boolean(preferredTime) &&
    Boolean(notification);
  useEffect(() => {
    if (isRequestBatchSuccess || requestBatchError) {
      setIsSubmitting(false);
      setSelectedDays([]);
      setPreferredTime("");
    }
  }, [isRequestBatchSuccess, requestBatchError]);
  useEffect(() => {
    if (!notification) {
      setNotification("Email Only");
    }
  }, [notification, setNotification]);

    const handleEnrollWithLoginCheck = (sess) => {
    if (isProfileLoading) return;

    if (!userProfile || !userProfile.studentId) {
      onCloseRegisterPrompt && onCloseRegisterPrompt();

      return onRequestClick?.("LOGIN_REQUIRED");
    }

    onEnrollClick(sess, {
      email: notifyViaMap[sess.id]?.email ?? true,
      whatsapp: notifyViaMap[sess.id]?.whatsapp ?? false,
    });
  };

    const handleNotifyChange = (sessionId, type, checked) => {
    setNotifyViaMap((prev) => ({
      ...prev,
      [sessionId]: {
        email: type === "email" ? checked : prev[sessionId]?.email ?? true,
        whatsapp: type === "whatsapp" ? checked : prev[sessionId]?.whatsapp ?? false,
      },
    }));
  };

  return (
    <div className={styles.dcgrid}>
      {/* LEFT: Request Custom Batch Section */}
      <div className={styles.dcrequestSection}>
        <div className={styles.dcrequestCard}>
          <div className={styles.dcrequestImage}>
            <img src="/request_batch_banner.png" alt="Student" />
          </div>

          <div className={styles.dcrequestOverlay}>
            <div className={styles.dcrequestForm}>
              {/* Preferred Day */}
              {/* <div className={styles.dcrequestDays}>
                <label className={styles.dcrequestLabel}>
                  Preferred Day: <span style={{ color: "red" }}>*</span>
                </label>

                <button
                                  type="button"
                                  data-mode="select"
                                  className={styles.selectAllBtn}
                                  onClick={(e) => {
                                    const btn = e.currentTarget;
                                    const mode = btn.dataset.mode || "select";
                                    const checkboxes = document.querySelectorAll(".dayCheckbox");
                
                                    if (mode === "select") {
                                      checkboxes.forEach((cb) => (cb.checked = true));
                                      btn.dataset.mode = "deselect";
                                      btn.textContent = "Deselect All";
                                    } else {
                                      checkboxes.forEach((cb) => (cb.checked = false));
                                      btn.dataset.mode = "select";
                                      btn.textContent = "Select All";
                                    }
                                  }}
                                >
                                  Select All
                                </button>
                <button
                  type="button"
                  className={styles.selectAllBtn}
                  onClick={() => {
                    const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                    setSelectedDays((prev) =>
                      prev.length === allDays.length ? [] : allDays
                    );
                  }}
                >
                  {selectedDays.length === 7 ? "Deselect All" : "Select All"}
                </button>

                <div className={styles.dcrequestCheckboxes}>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <label key={day} className={styles.dcrequestCheckbox}>
                      <input
                        type="checkbox"
                        checked={selectedDays.includes(day)}
                        onChange={(e) => {
                          setSelectedDays((prev) =>
                            e.target.checked
                              ? [...prev, day]
                              : prev.filter((d) => d !== day)
                          );
                        }}
                      />
                      <span className={styles.checkmark}></span>
                      <span>{day}</span>
                    </label>
                  ))}

                </div>
              </div> */}
{selectedGroup && selectedGroup.sessions && selectedGroup.sessions.length > 0 && (
                          <div>
                            {/* <h4>Class Details</h4> */}
              
                            <div>
                              {checkedSessions.map((sess) => (
                                <div key={sess.id} className={styles.dcdetailrow2}>
  {sess.mode === "Live Demo" && sess._isEnrolled ? (
    /* =========================
       LIVE DEMO → ENROLLED
       ========================= */
    <div className={styles.enrolledContainer}>
      <button className={styles.enrolledBadge} disabled>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="none"
          className={styles.checkIcon}
        >
          <path
            d="M13.5 4L6 11.5L2.5 8"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Enrolled
      </button>

      <button
        className={styles.resendBtn}
        disabled={sess.resendCount >= 3 || sendingBatchId === sess.batchId}
        onClick={() => {
          setSendingBatchId(sess.batchId);
          resendEmail(
            {
              email: userProfile.email,
              batchId: sess.batchId,
            },
            {
              onSuccess: (msg) => {
                setSendingBatchId(null);
                setResendError("");
                setResendMessage(typeof msg === "string" ? msg : msg?.message);
              },
              onError: (err) => {
                setSendingBatchId(null);
                const backendMsg =
                  typeof err?.response?.data === "string"
                    ? err.response.data
                    : err?.response?.data?.message;
                setResendMessage("");
                setResendError(backendMsg || "Failed to resend email");
              },
            }
          );
        }}
      >
        {sess.resendCount >= 3 ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
            </svg>
            Limit Reached
          </>
        ) : sendingBatchId === sess.batchId ? (
          <>
            <svg className={styles.spinner} width="14" height="14" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </svg>
            Sending...
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M2 12l5 5L22 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 12v7a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Resend Email
          </>
        )}
      </button>
    </div>
  ) : sess.mode === "Live Class" && Number(sess.amount) > 0 ? (
    /* =========================
       LIVE CLASS → PAID → ENROLLED
       ========================= */
    <div className={styles.enrolledContainer}>
      <button className={styles.enrolledBadge} disabled>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="none"
          className={styles.checkIcon}
        >
          <path
            d="M13.5 4L6 11.5L2.5 8"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Enrolled
      </button>
      
      <button
        className={styles.resendBtn}
        disabled={sess.resendCount >= 3 || sendingBatchId === sess.batchId}
        onClick={() => {
          setSendingBatchId(sess.batchId);
          resendEmail(
            {
              email: userProfile.email,
              batchId: sess.batchId,
            },
            {
              onSuccess: (msg) => {
                setSendingBatchId(null);
                setResendError("");
                setResendMessage(typeof msg === "string" ? msg : msg?.message);
              },
              onError: (err) => {
                setSendingBatchId(null);
                const backendMsg =
                  typeof err?.response?.data === "string"
                    ? err.response.data
                    : err?.response?.data?.message;
                setResendMessage("");
                setResendError(backendMsg || "Failed to resend email");
              },
            }
          );
        }}
      >
        {sess.resendCount >= 3 ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
            </svg>
            Limit Reached
          </>
        ) : sendingBatchId === sess.batchId ? (
          <>
            <svg className={styles.spinner} width="14" height="14" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </svg>
            Sending...
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M2 12l5 5L22 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 12v7a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Resend Email
          </>
        )}
      </button>
    </div>
  ) : (
    /* =========================
       LIVE CLASS → NOT PAID → ENROLL
       ========================= */
    <div className={styles.enrollActionsCard}>
      <button
        className={styles.enrollPrimaryBtn}
        onClick={() => handleEnrollWithLoginCheck(sess)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Enroll Now
      </button>

      {/* Notification Options */}
      <div className={styles.notificationCard}>
        <div className={styles.notificationHeader}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className={styles.notificationTitle}>Notify me via:</span>
        </div>

        <div className={styles.checkboxContainer}>
          <label className={styles.customCheckbox}>
            <input
              type="checkbox"
              checked={notifyViaMap[sess.id]?.email ?? true}
              onChange={(e) =>
                handleNotifyChange(sess.id, "email", e.target.checked)
              }
              className={styles.checkboxInput}
            />
            
            <span className={styles.checkboxLabel}>
              
              Email
            </span>
          </label>

          <label className={styles.customCheckbox}>
            <input
              type="checkbox"
              checked={notifyViaMap[sess.id]?.whatsapp ?? false}
              onChange={(e) =>
                handleNotifyChange(sess.id, "whatsapp", e.target.checked)
              }
              className={styles.checkboxInput}
            />
            
            <span className={styles.checkboxLabel}>
              WhatsApp
            </span>
          </label>
        </div>
      </div>
    </div>
  )}
</div>
                              ))}
              
              
              
                            </div>
                          </div>
 )} 
              {/* Preferred Time + Notification */}
              {/* <div className={styles.dcrequestRow}>
                <div className={styles.dcrequestField}>
                  <label className={styles.dcrequestLabel}>
                    Preferred Time: <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className={styles.dcrequestSelectWrapper}>
                    <div
                      className={styles.dcrequestSelectTrigger}
                      onClick={() =>
                        setTimeDropdownOpen(!timeDropdownOpen)
                      }
                    >
                      <span
                        style={{
                          color: preferredTime ? "#000" : "#999",
                        }}
                      >
                        {preferredTime === ""
                          ? "Select preferred time"
                          : preferredTime}
                      </span>

                      <span
                        className={cn(
                          styles.dcrequestCaret,
                          timeDropdownOpen &&
                          styles.dcrequestCaretOpen
                        )}
                      >
                        <Chevron />
                      </span>
                    </div>

                    {timeDropdownOpen && (
                      <>
                        <div
                          className={styles.dcrequestSelectOverlay}
                          onClick={() => setTimeDropdownOpen(false)}
                        />
                        <div className={styles.dcrequestSelectMenu}>
                          {timeOptions.map((option) => (
                            <div
                              key={option.value}
                              className={cn(
                                styles.dcrequestSelectOption,
                                preferredTime === option.value &&
                                styles.dcrequestSelectOptionActive
                              )}
                              onClick={() => {
                                setPreferredTime((prev) =>
                                  prev === option.value
                                    ? ""
                                    : option.value
                                );
                                setTimeDropdownOpen(false);
                              }}
                            >
                              {option.label}
                              {preferredTime === option.value && (
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                >
                                  <path
                                    d="M13.5 4L6 11.5L2.5 8"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

              
                <div className={styles.dcrequestField}>
                  <label className={styles.dcrequestLabel}>
                    Notification: <span style={{ color: "red" }}>*</span>
                  </label>

                  <div className={styles.dcrequestSelectWrapper}>
                    <div
                      className={styles.dcrequestSelectTrigger}
                      onClick={() =>
                        setNotificationDropdownOpen(
                          !notificationDropdownOpen
                        )
                      }
                    >
                      <span
                        style={{
                          color: notification ? "#000" : "#999",
                        }}
                      >
                        {notification === ""
                          ? "Choose notification"
                          : notification}
                      </span>

                      <span
                        className={cn(
                          styles.dcrequestCaret,
                          notificationDropdownOpen &&
                          styles.dcrequestCaretOpen
                        )}
                      >
                        <Chevron />
                      </span>
                    </div>

                    {notificationDropdownOpen && (
                      <>
                        <div
                          className={styles.dcrequestSelectOverlay}
                          onClick={() =>
                            setNotificationDropdownOpen(false)
                          }
                        />

                        <div className={styles.dcrequestSelectMenu}>
                          
                          <div
                            className={
                              styles.dcrequestSelectOption
                            }
                            onClick={() => {
                              setNotification("");
                              setNotificationDropdownOpen(false);
                            }}
                          />

                          {notificationOptions.map((option) => (
                            <div
                              key={option.value}
                              className={cn(
                                styles.dcrequestSelectOption,
                                notification === option.label &&
                                styles.dcrequestSelectOptionActive
                              )}
                              onClick={() => {
                                setNotification((prev) =>
                                  prev === option.label
                                    ? ""
                                    : option.label
                                );
                                setNotificationDropdownOpen(false);
                              }}
                            >
                              {option.label}

                              {notification === option.label && (
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                >
                                  <path
                                    d="M13.5 4L6 11.5L2.5 8"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div> */}

              {/* Request Batch button + messages */}
              {/* <button
                onClick={() => {
                  if (isSubmitting || isRequestBatchLoading) return;

                  setIsSubmitting(true);
                  onRequestClick();
                }}
                disabled={
                  isSubmitting ||
                  isRequestBatchLoading ||
                  isProfileLoading ||
                  !isSelfFormValid
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "15px",
                  fontWeight: "600",
                  backgroundColor:
                    isSubmitting || isRequestBatchLoading || isProfileLoading || !isSelfFormValid
                      ? "#C4C4C4"
                      : "#2a7cf7",
                  color: "#fff",
                  cursor:
                    isSubmitting || isRequestBatchLoading || isProfileLoading || !isSelfFormValid
                      ? "not-allowed"
                      : "pointer",
                  transition: "background-color 0.2s ease",
                }}
              >
                {isSubmitting || isRequestBatchLoading ? "Submitting..." : "Request Batch"}
              </button> */}


              {showMessage && isRequestBatchSuccess && (
                <p
                  style={{
                    color: "#0A8754",
                    fontSize: "14px",
                    marginTop: "6px",
                    lineHeight: "1.4",
                  }}
                >
                  Your request has been submitted successfully.
                  <br />
                  Our team will contact you shortly with batch
                  details.
                </p>
              )}

              {showMessage && requestBatchError && (
                <p
                  style={{
                    color: "#D93025",
                    fontSize: "14px",
                    marginTop: "6px",
                    lineHeight: "1.4",
                  }}
                >
                  Unable to submit your request right now.
                  <br />
                  Please try again in a few minutes.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Dynamic Info card */}
      <aside className={styles.dcinfo}>
        <div className={styles.dcinfohead}>
          <div className={styles.dcinfoicon} aria-hidden="true">
            <img src="/self_paced.png" alt="self-paced" />
          </div>
          <div>
            <div className={styles.dcinfotitle}>
              Self-paced Learning
            </div>
            <div className={styles.dcinfosubdescription}>
              Self-Paced Learning
            </div>
          </div>
        </div>
        {isCourseLoading ? (
          <div
            className={styles.dcinfotext}
          // style={{
          //   fontSize: "14px",
          //   color: "#374151",
          //   lineHeight: "1.5",
          // }}
          >
            Loading self-paced learning details...
          </div>
        ) : (
          <div className={styles.dcinfotext}>
            <style>
              {`
      .selfHtml h1,
      .selfHtml h2,
      .selfHtml h3,
      .selfHtml h4,
      .selfHtml h5,
      .selfHtml h6 {
        font-size: 16px !important;
        font-weight: 700 !important;
        margin: 12px 0 8px !important;
        line-height: 1.3 !important;
      }

      .selfHtml p,
      .selfHtml span,
      .selfHtml div {
        font-size: 14px !important;
        font-weight: 400 !important;
        line-height: 1.55 !important;
        margin: 0 0 10px !important;
      }

      .selfHtml ul,
      .selfHtml ol {
        padding-left: 18px !important;
        margin: 6px 0 10px !important;
      }

      .selfHtml li {
        font-size: 14px !important;
        font-weight: 400 !important;
        line-height: 1.4 !important;
        margin-bottom: 4px !important;
      }

      .selfHtml strong,
      .selfHtml b {
        font-weight: 700 !important;
      }
    `}
            </style>

            {selfPacedLearning && selfPacedLearning.trim() ? (
              <div
                className="selfHtml"
                dangerouslySetInnerHTML={{ __html: selfPacedLearning }}
              />
            ) : (
              <p style={{ margin: 0 }}>
                Learn at your own pace with structured modules, recorded sessions,
                and hands-on projects designed for flexible learning.
              </p>
            )}
          </div>

        )}

      </aside>
    </div>
  );
}

export default DemoClassSectionSelfTab;
