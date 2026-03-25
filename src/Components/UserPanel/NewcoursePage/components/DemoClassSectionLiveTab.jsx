import React, { useEffect, useState } from "react";
import styles from "./DemoClassSection.module.css";
import { cn } from "../../../../utils";
import { useCheckEnrollmentForSessions } from "../../../../Api/hooks/CourseApi/useCheckEnrollmentForSessions";
import { useNavigate } from "react-router-dom";
import { useResendEnrollEmail } from "../../../../Api/hooks/CourseApi/useResendEnrollEmail";
import { saveRedirectUrl } from "../../../../redirectAfterLogin";
import { useResendLiveClassEnrollEmail } from "../../../../Api/hooks/CourseApi/useResendLiveClassEnrollEmail";
import LoginModal from "../../Common/Loginmodal";
import { useInstallmentStatus } from "../../../../Api/hooks/CourseApi/useInstallmentStatus";
import axios from "axios";


function DemoClassSectionLiveTab({
  scheduleLoading,
  scheduleError,
  liveGroups,
  selectedGroupKey,
  setSelectedGroupKey,
  selectedGroup,
  isRequestBatchLoading,
  isProfileLoading,
  showMessage,
  isRequestBatchSuccess,
  requestBatchError,
  onRequestClick,
  liveTraining,
  isCourseLoading,
  courseError,
  userProfile,
  courseName,
  onEnrollClick,
  enrollSuccessMessage,
  enrollErrorMessage,
  showRegisterPrompt,
  setShowRegisterPrompt,
  onCloseRegisterPrompt,
  enrollingSessionId,
  onResendClick,
  resetLiveSubmitting
}) {

  const liveContent =
    liveTraining && liveTraining.trim().length > 0
      ? liveTraining
      : `Join real-time instructor-led sessions from anywhere. This mode includes interactive classes, hands-on exercises, and live Q&A to ensure in-depth learning.

What's Included:
• 80+ hours of video content
• 15 modules with over 150 lessons
• 5 real-world projects
• Professional Certificate upon completion
• English
• Lifetime access with free updates
• No prior programming experience required`;

  const { data: checkedSessions = [] } = useCheckEnrollmentForSessions(
    selectedGroup?.sessions || [],
    userProfile?.studentId || "",
    courseName || ""
  );

  const sessionsToRender =
    userProfile?.studentId && checkedSessions.length > 0
      ? checkedSessions
      : selectedGroup?.sessions || [];

  // const { data: installmentStatusData, isLoading: installmentStatusLoading } =
  //   useInstallmentStatus(userProfile?.studentId, courseName);


  const { data: installmentStatusData, isLoading: installmentStatusLoading } =
  useInstallmentStatus(
    userProfile?.studentId,
    courseName,
    selectedGroup?.batchId
  );

  const navigate = useNavigate();
  const { mutate: resendDemoEmail } = useResendEnrollEmail();
  const { mutate: resendLiveClassEmail } = useResendLiveClassEnrollEmail();

  const [sendingBatchId, setSendingBatchId] = React.useState(null);
  const [resendMessage, setResendMessage] = React.useState("");
  const [resendError, setResendError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [notifyViaMap, setNotifyViaMap] = useState({});

  useEffect(() => {
    if (!resendMessage && !resendError) return;

    const t = setTimeout(() => {
      setResendMessage("");
      setResendError("");
    }, 10000);

    return () => clearTimeout(t);
  }, [resendMessage, resendError]);

  useEffect(() => {
    if (isRequestBatchSuccess || requestBatchError) {
      setIsSubmitting(false);
    }
  }, [isRequestBatchSuccess, requestBatchError]);

  useEffect(() => {
    setIsSubmitting(false);
  }, [resetLiveSubmitting]);

  const handleNotifyChange = (sessionId, type, checked) => {
    setNotifyViaMap((prev) => ({
      ...prev,
      [sessionId]: {
        email: type === "email" ? checked : prev[sessionId]?.email ?? true,
        whatsapp: type === "whatsapp" ? checked : prev[sessionId]?.whatsapp ?? false,
      },
    }));
  };
  const handleEnrollWithLoginCheck = async (sess) => {
  console.log("CLICK Enroll for sess:", sess);

  if (isProfileLoading) return;

  if (!userProfile || !userProfile.studentId) {
    onCloseRegisterPrompt && onCloseRegisterPrompt();
    setIsSubmitting(false);

    saveRedirectUrl();
    setShowRegisterPrompt(true);
    return;
  }

  try {
    console.log("Calling checkInstallment API with:", {
      studentId: userProfile.studentId,
      courseName,
      batchId: sess.batchId,
    });

    const res = await axios.get(
      "https://api.test.hachion.co/razorpay/checkInstallment",
      {
        params: {
          studentId: userProfile.studentId,
          courseName: courseName,
          batchId: sess.batchId, // ✅ IMPORTANT: pass batchId
        },
      }
    );

    const installmentStatusData = res.data;

    console.log("Installment API response:", installmentStatusData);
    console.log("Clicked sess.batchId:", sess.batchId);

    if (
      installmentStatusData?.requestStatus === "approved" &&
      installmentStatusData?.batchId === sess.batchId
    ) {
      const slug = courseName?.toLowerCase().replace(/\s+/g, "-");

      navigate(`/installments/${slug}`, {
        state: {
          selectedBatchData: {
            ...sess,
            schedule_course_name: courseName,
            courseName: courseName,
          },
          numSelectedInstallments:
            installmentStatusData.numSelectedInstallments,
        },
      });

      return; // ⛔ stop normal enroll flow
    }
  } catch (err) {
    console.error("Error checking installment status:", err);
    // If API fails, just continue normal enroll flow
  }

  // ✅ Else → continue EXISTING flow (NewEnrollNow)
  onEnrollClick(sess, {
    email: notifyViaMap[sess.id]?.email ?? true,
    whatsapp: notifyViaMap[sess.id]?.whatsapp ?? false,
    requestInstallment: true,
  });
};



  return (
    <div className={styles.dcgrid}>
      <div>
        <div className={styles.dcrequestImage}>
          <img src="/live-training.jpg" alt="Student" />
        </div>
        <div
          className={
            liveGroups && liveGroups.length > 0
              ? styles.dcslots
              : ""
          }
        >

          {scheduleLoading && (
            <div className={styles.dcslot}>
              <div className={styles.dcslotdate}>Loading slots...</div>
            </div>
          )}

          {!scheduleLoading && scheduleError && (
            <div className={styles.dcslot}>
              <div className={styles.dcslotdate}>
                Failed to load schedule. Please try again.
              </div>
            </div>
          )}

          {!scheduleLoading &&
            !scheduleError &&
            liveGroups &&
            liveGroups.length > 0 &&
            liveGroups.map((g) => (
              <div
                key={g.key}
                className={cn(
                  styles.dcslot,
                  selectedGroupKey === g.key && styles.dcslotActive,
                  selectedGroupKey === g.key && `${styles.dcslotActive} ${g.type === "live" ? styles['live-active'] : styles['demo-active']}`
                )}
                onClick={() => setSelectedGroupKey(g.key)}
              >
                <div className={styles.dcslotdate}>{g.day}</div>

                <div className={styles.dcslotcount}>
                  <strong>
                    {g.totalSlots} {g.totalSlots === 1 ? "Slot" : "Slots"}
                  </strong>
                </div>

                <div
                  className={cn(
                    styles.dcslotbadge,
                    g.type === "live"
                      ? styles.dcslotbadgeislive
                      : styles.dcslotbadgeisdemo
                  )}
                >
                  {g.totalSlots}{" "}
                  {g.type === "live"
                    ? "Live Class" + (g.totalSlots === 1 ? "" : "es")
                    : g.totalSlots === 1
                      ? "demo"
                      : "demos"}
                </div>
              </div>
            ))}

          {!scheduleLoading &&
            !scheduleError &&
            (!liveGroups || liveGroups.length === 0) && (
              <div className={styles.noLiveSlotsContainer}>
                <div className={cn(liveGroups && liveGroups.length > 0 ? styles.dcslot : styles.noLiveSlot)}>
                  <div className={styles.dcslotdate}>
                    No live batches scheduled
                  </div>
                </div>
                <div
                  className={cn(
                    liveGroups && liveGroups.length > 0 ? styles.dcempty : styles.noLiveClass
                  )}
                >
                  <div className={styles.dcemptyicon}>
                    <img src="/calendar.png" alt="calendar" />
                  </div>

                  <p className={styles.dcemptytext}>
                    Be the first to request a custom demo session at your preferred
                    time
                  </p>

                  <button
                    className={styles.dclink}
                    disabled={isSubmitting || isRequestBatchLoading || isProfileLoading}
                    onClick={() => {
                      if (isSubmitting || isRequestBatchLoading) return;


                      if (!userProfile || !userProfile.studentId) {

                        saveRedirectUrl();

                        setShowRegisterPrompt(true);
                        return;
                      }

                      setIsSubmitting(true);
                      onRequestClick();
                    }}
                  >
                    {isSubmitting || isRequestBatchLoading ? "Submitting..." : "Request Batch"}
                  </button>
                  {enrollSuccessMessage && (
                    <p style={{ color: "green", fontSize: "14px", marginTop: "6px" }}>
                      {enrollSuccessMessage}
                    </p>
                  )}

                  {enrollErrorMessage && (
                    <p style={{ color: "red", fontSize: "14px", marginTop: "6px" }}>
                      {enrollErrorMessage}
                    </p>
                  )}

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
                      Our team will contact you shortly with batch details.
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

                  {resendMessage && (
                    <p style={{ color: "green", fontSize: "13px" }}>
                      {resendMessage}
                    </p>
                  )}

                  {resendError && (
                    <p style={{ color: "red", fontSize: "13px" }}>
                      {resendError}
                    </p>
                  )}
                </div>
              </div>
            )}
        </div>

        {selectedGroup && (
          <div className={styles.dcdetails}>
            <div className={styles.dcdetailscol}>
              <h4>Class Details</h4>

              <div
                style={{
                  maxHeight: "240px",
                  overflowY:
                    selectedGroup.sessions.length > 1 ? "auto" : "hidden",
                  paddingRight:
                    selectedGroup.sessions.length > 1 ? "8px" : "0",
                  boxSizing: "border-box",
                }}
              >
                {sessionsToRender.map((sess) => {
                  const isEnrolled = sess._isEnrolled ?? false;

                  return (

                    <div key={sess.id} className={styles.dcdetailrow}>
                      <div>
                        <div className={styles.dcmuted}>
                          {sess.mode === "Live Demo" ? "Demo Session" : "Live Class"}
                        </div>


                        <div className={styles.dcdetailtime}>{sess.time}</div>

                       <div className={styles.dcdetailmeta}>
  {sess.duration || "60 min"}
</div>
                      </div>
                      {sess.mode === "Live Demo" && isEnrolled ? (
                        /* =========================
                           LIVE DEMO → OLD BEHAVIOR
                           ========================= */
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

                          <button
                            className={styles.dcbtnDisabled}
                            disabled
                          >
                            Enrolled
                          </button>

                          <button
                            className={styles.dclink}
                            disabled={sess.resendCount >= 3 || sendingBatchId === sess.batchId}
                            onClick={() => {
                              setSendingBatchId(sess.batchId);
                              const isLiveClass = sess.mode === "Live Class";

                              const resendFn = isLiveClass
                                ? resendLiveClassEmail
                                : resendDemoEmail;

                              resendFn(
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
                            {sess.resendCount >= 3
                              ? "Limit Reached"
                              : sendingBatchId === sess.batchId
                                ? "Sending..."
                                : "Resend"}
                          </button>
                        </div>
                      ) : sess.mode === "Live Class" && isEnrolled && (Number(sess.amount) > 0 || sess._installmentsCompleted)

                        ? (
                          /* =========================
                             LIVE CLASS → PAID → ENROLLED
                             ========================= */
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <button className={styles.dcbtnDisabled} disabled>
                              Enrolled
                            </button>
                            <button
                              className={styles.dclink}
                              disabled={sess.resendCount >= 3 || sendingBatchId === sess.batchId}
                              onClick={() => {
                                setSendingBatchId(sess.batchId);
                                const isLiveClass = sess.mode === "Live Class";

                                const resendFn = isLiveClass
                                  ? resendLiveClassEmail
                                  : resendDemoEmail;

                                resendFn(
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
                              {sess.resendCount >= 3
                                ? "Limit Reached"
                                : sendingBatchId === sess.batchId
                                  ? "Sending..."
                                  : "Resend"}
                            </button>

                          </div>
                        ) : (

                          /* =========================
                             LIVE CLASS → NOT PAID → ENROLL
                             ========================= */
                          <div className={styles.enrollActions}>
                            <button
                              className={styles.dcbtn}
                              onClick={() => handleEnrollWithLoginCheck(sess)}
                            >
                              Enroll
                            </button>


                            {/* 🔔 Email / WhatsApp */}
                            <div className={styles.notifyOptions}>

                              <div className={styles.checkboxGroup}>
                                <label className={styles.notifyLabel}>
                                  <input
                                    type="checkbox"
                                    checked={notifyViaMap[sess.id]?.email ?? true}
                                    onChange={(e) =>
                                      handleNotifyChange(sess.id, "email", e.target.checked)
                                    }
                                    className={styles.checkboxInput}
                                  />
                                  <span className={styles.checkboxText}>Email</span>
                                </label>

                                <label className={styles.notifyLabel}>
                                  <input
                                    type="checkbox"
                                    checked={notifyViaMap[sess.id]?.whatsapp ?? false}
                                    onChange={(e) =>
                                      handleNotifyChange(sess.id, "whatsapp", e.target.checked)
                                    }
                                    className={styles.checkboxInput}
                                  />
                                  <span className={styles.checkboxText}>WhatsApp</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        )}


                    </div>
                  );
                })}




              </div>
            </div>

            <div className={cn(styles.dcempty)}>
              <div className={styles.dcemptyicon}>
                <img src="/calendar.png" alt="calendar" />
              </div>

              <p className={styles.dcemptytext}>
                Be the first to request a custom demo session at your preferred
                time
              </p>

              <button
                className={styles.dclink}
                disabled={isSubmitting || isRequestBatchLoading || isProfileLoading}
                onClick={() => {
                  if (isSubmitting || isRequestBatchLoading) return;

                  setIsSubmitting(true);
                  onRequestClick();
                }}
              >
                {isSubmitting || isRequestBatchLoading ? "Submitting..." : "Request Batch"}
              </button>


              {enrollSuccessMessage && (
                <p style={{ color: "green", fontSize: "14px", marginTop: "6px" }}>
                  {enrollSuccessMessage}
                </p>
              )}

              {enrollErrorMessage && (
                <p style={{ color: "red", fontSize: "14px", marginTop: "6px" }}>
                  {enrollErrorMessage}
                </p>
              )}

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
                  Our team will contact you shortly with batch details.
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

              {resendMessage && (
                <p style={{ color: "green", fontSize: "13px" }}>
                  {resendMessage}
                </p>
              )}

              {resendError && (
                <p style={{ color: "red", fontSize: "13px" }}>
                  {resendError}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {showRegisterPrompt && (
        <>
          {/* <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.55)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "520px",
              background: "#fff",
              borderRadius: "12px",
              display: "flex",
              padding: "20px",
              boxShadow: "0 10px 35px rgba(0,0,0,0.28)",
            }}
          >
            <div
              style={{
                width: "42%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={require("../../../../Assets/loginpopup.webp")}
                alt="login popup"
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  objectFit: "cover",
                  transform: "scaleX(-1)"
                }}
              />

            </div>

            <div
              style={{
                width: "58%",
                paddingLeft: "14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "20px",
                  color: "#222",
                  marginBottom: "6px",
                }}
              >
                Please Login
              </h3>

              <p
                style={{
                  fontSize: "14px",
                  marginBottom: "20px",
                  color: "#555",
                  lineHeight: "1.4",
                }}
              >
                Before proceeding, please login into our Hachion.
              </p>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  style={{
                    padding: "8px 14px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#2563eb",
                    color: "#fff",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate("/login");
                    onCloseRegisterPrompt && onCloseRegisterPrompt();
                  }}
                >
                  Login
                </button>

                <button
                  style={{
                    padding: "8px 14px",
                    background: "#f1f5f9",
                    color: "#333",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                  onClick={() => onCloseRegisterPrompt && onCloseRegisterPrompt()}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div> */}
          <LoginModal
            isOpen={showRegisterPrompt}
            description="Before proceeding, please login into our Hachion."
            onClose={() => onCloseRegisterPrompt && onCloseRegisterPrompt()}
            onLogin={() => {
              navigate("/login");
              onCloseRegisterPrompt && onCloseRegisterPrompt();
            }}
          />
        </>
      )}

      {/* RIGHT: Dynamic Info Card */}
      <aside className={styles.dcinfo}>
        <div className={styles.dcinfohead}>
          <div className={styles.dcinfoicon} aria-hidden="true">
            <img src="/share.png" alt="share" />
          </div>
          <div>
            <div className={styles.dcinfotitle}>Live Training</div>
            <div className={styles.dcinfosubdescription}>Live Instructor-Led Training</div>
          </div>
        </div>

        {/* {isCourseLoading ? (
  <div className={styles.dcinfotext}>
    Loading live training details...
  </div>
) : (
  <div className={styles.dcinfotext}>
    {liveTraining && liveTraining.trim() ? (
      <div
        dangerouslySetInnerHTML={{ __html: liveTraining }}
      />
    ) : (
      <p>
        Live instructor-led training with real-time interaction and hands-on
        practice.
      </p>
    )}
  </div>
)} */}

        {isCourseLoading ? (
          <div
            className={styles.dcinfotext}
          >
            Loading live training details...
          </div>
        ) : (
          <div className={styles.dcinfotext}>
            <style>
              {`
      .liveTrainingHtml h1,
      .liveTrainingHtml h2,
      .liveTrainingHtml h3,
      .liveTrainingHtml h4,
      .liveTrainingHtml h5,
      .liveTrainingHtml h6 {
        font-size: 16px !important;
        font-weight: 700 !important;
        margin: 12px 0 8px !important;
        line-height: 1.3 !important;
        color: rgb(0 0 0) !important;
      }

      .liveTrainingHtml p,
      .liveTrainingHtml span,
      .liveTrainingHtml div {
        font-size: 14px !important;
        font-weight: 400 !important;
        line-height: 1.55 !important;
        margin: 0 0 10px !important;
        color: rgb(0 0 0) !important;
      }

      /* ✅ ONLY CHANGE: reduce bullet spacing */
      .liveTrainingHtml ul,
      .liveTrainingHtml ol {
        padding-left: 18px !important;
        margin: 6px 0 10px !important;
        color: rgb(0 0 0) !important;
      }

      .liveTrainingHtml li {
        font-size: 14px !important;
        font-weight: 400 !important;
        line-height: 1.4 !important;
        margin-bottom: 4px !important;   /* 👈 reduced space */
        color: rgb(0 0 0) !important;
      }

      .liveTrainingHtml strong,
      .liveTrainingHtml b {
        font-weight: 700 !important;
      }
    `}
            </style>

            {liveTraining && liveTraining.trim() ? (
              <div
                className="liveTrainingHtml"
                dangerouslySetInnerHTML={{ __html: liveTraining }}
              />
            ) : (
              <p style={{ margin: 0 }}>
                Live instructor-led training with real-time interaction and hands-on practice.
              </p>
            )}
          </div>

        )}

      </aside>
    </div>
  );
}

export default DemoClassSectionLiveTab;