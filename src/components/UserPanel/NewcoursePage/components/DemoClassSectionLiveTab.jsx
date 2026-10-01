"use client";

import React, { useEffect, useState } from "react";
import styles from "./DemoClassSection.module.css";
import { cn } from "@/utils";
import { useCheckEnrollmentForSessions } from "@/Api/hooks/CourseApi/useCheckEnrollmentForSessions";
import { useRouter } from "next/navigation";
import { useResendEnrollEmail } from "@/Api/hooks/CourseApi/useResendEnrollEmail";
import { saveRedirectUrl } from "@/redirectAfterLogin";
import { useResendLiveClassEnrollEmail } from "@/Api/hooks/CourseApi/useResendLiveClassEnrollEmail";
import LoginModal from "../../Common/Loginmodal";
import axios from "axios";
import { API_BASE_URL } from "@/lib/apiBase";

// Ported from the CRA app's
// src/Components/UserPanel/NewcoursePage/components/DemoClassSectionLiveTab.jsx.
// useNavigate -> useRouter. useInstallmentStatus was imported but unused in
// the CRA original (only the inline axios.get('.../checkInstallment') call
// inside handleEnrollWithLoginCheck is actually used) — dropped the dead
// import here for the same reason.
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
  userProfile,
  courseName,
  onEnrollClick,
  enrollSuccessMessage,
  enrollErrorMessage,
  showRegisterPrompt,
  setShowRegisterPrompt,
  onCloseRegisterPrompt,
  resetLiveSubmitting,
}) {
  const { data: checkedSessions = [] } = useCheckEnrollmentForSessions(selectedGroup?.sessions || [], userProfile?.studentId || "", courseName || "");
  const sessionsToRender = userProfile?.studentId && checkedSessions.length > 0 ? checkedSessions : selectedGroup?.sessions || [];

  const router = useRouter();
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
      // Syncs from the batch-request mutation result (an external source).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSubmitting(false);
    }
  }, [isRequestBatchSuccess, requestBatchError]);
  useEffect(() => {
    // Resets on an explicit parent-triggered signal (an external source).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSubmitting(false);
  }, [resetLiveSubmitting]);
  const handleNotifyChange = (sessionId, type, checked) => {
    setNotifyViaMap((prev) => ({
      ...prev,
      [sessionId]: {
        email: type === "email" ? checked : (prev[sessionId]?.email ?? true),
        whatsapp: type === "whatsapp" ? checked : (prev[sessionId]?.whatsapp ?? true),
      },
    }));
  };
  const handleEnrollWithLoginCheck = async (sess) => {
    if (isProfileLoading) return;
    if (!userProfile || !userProfile.studentId) {
      onCloseRegisterPrompt && onCloseRegisterPrompt();
      setIsSubmitting(false);
      saveRedirectUrl();
      setShowRegisterPrompt(true);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/razorpay/checkInstallment`, {
        params: {
          studentId: userProfile.studentId,
          courseName: courseName,
          batchId: sess.batchId,
        },
      });
      const installmentStatusData = res.data;
      if (installmentStatusData?.requestStatus === "approved" && installmentStatusData?.batchId === sess.batchId) {
        const slug = courseName?.toLowerCase().replace(/\s+/g, "-");
        sessionStorage.setItem(
          `navState:/installments/${slug}`,
          JSON.stringify({
            selectedBatchData: {
              ...sess,
              schedule_course_name: courseName,
              courseName: courseName,
            },
            numSelectedInstallments: installmentStatusData.numSelectedInstallments,
          })
        );
        router.push(`/installments/${slug}`);
        return;
      }
    } catch (err) {
      console.error("Error checking installment status:", err);
    }

    onEnrollClick(sess, {
      email: notifyViaMap[sess.id]?.email ?? true,
      whatsapp: notifyViaMap[sess.id]?.whatsapp ?? true,
      requestInstallment: true,
    });
  };
  return (
    <div className={styles.dcgrid}>
      <div>
        <div className={styles.dcrequestImage}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/live-training.jpg" alt="Student" />
        </div>
        <div className={liveGroups && liveGroups.length > 0 ? styles.dcslots : ""}>
          {scheduleLoading && (
            <div className={styles.dcslot}>
              <div className={styles.dcslotdate}>Loading slots...</div>
            </div>
          )}

          {!scheduleLoading && scheduleError && (
            <div className={styles.dcslot}>
              <div className={styles.dcslotdate}>Failed to load schedule. Please try again.</div>
            </div>
          )}

          {!scheduleLoading &&
            !scheduleError &&
            liveGroups &&
            liveGroups.length > 0 &&
            liveGroups.map((g) => (
              <div
                key={g.key}
                className={cn(styles.dcslot, selectedGroupKey === g.key && styles.dcslotActive, selectedGroupKey === g.key && `${styles.dcslotActive} ${g.type === "live" ? styles["live-active"] : styles["demo-active"]}`)}
                onClick={() => setSelectedGroupKey(g.key)}
              >
                <div className={styles.dcslotdate}>{g.day}</div>

                <div className={styles.dcslotcount}>
                  <strong>
                    {g.totalSlots} {g.totalSlots === 1 ? "Slot" : "Slots"}
                  </strong>
                </div>

                <div className={cn(styles.dcslotbadge, g.type === "live" ? styles.dcslotbadgeislive : styles.dcslotbadgeisdemo)}>
                  {g.totalSlots} {g.type === "live" ? "Live Class" + (g.totalSlots === 1 ? "" : "es") : g.totalSlots === 1 ? "demo" : "demos"}
                </div>
              </div>
            ))}

          {!scheduleLoading && !scheduleError && (!liveGroups || liveGroups.length === 0) && (
            <div className={styles.noLiveSlotsContainer}>
              <div className={cn(liveGroups && liveGroups.length > 0 ? styles.dcslot : styles.noLiveSlot)}>
                <div className={styles.dcslotdate}>No live batches scheduled</div>
              </div>
              <div className={cn(liveGroups && liveGroups.length > 0 ? styles.dcempty : styles.noLiveClass)}>
                <div className={styles.dcemptyicon}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/calendar.png" alt="calendar" />
                </div>

                <p className={styles.dcemptytext}>Be the first to request a custom demo session at your preferred time</p>

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
                {enrollSuccessMessage && <p style={{ color: "green", fontSize: "14px", marginTop: "6px" }}>{enrollSuccessMessage}</p>}

                {enrollErrorMessage && <p style={{ color: "red", fontSize: "14px", marginTop: "6px" }}>{enrollErrorMessage}</p>}

                {showMessage && isRequestBatchSuccess && (
                  <p style={{ color: "#0A8754", fontSize: "14px", marginTop: "6px", lineHeight: "1.4" }}>
                    Your request has been submitted successfully.
                    <br />
                    Our team will contact you shortly with batch details.
                  </p>
                )}

                {showMessage && requestBatchError && (
                  <p style={{ color: "#D93025", fontSize: "14px", marginTop: "6px", lineHeight: "1.4" }}>
                    Unable to submit your request right now.
                    <br />
                    Please try again in a few minutes.
                  </p>
                )}

                {resendMessage && <p style={{ color: "green", fontSize: "13px" }}>{resendMessage}</p>}

                {resendError && <p style={{ color: "red", fontSize: "13px" }}>{resendError}</p>}
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
                  overflowY: selectedGroup.sessions.length > 1 ? "auto" : "hidden",
                  paddingRight: selectedGroup.sessions.length > 1 ? "8px" : "0",
                  boxSizing: "border-box",
                }}
              >
                {sessionsToRender.map((sess) => {
                  const isEnrolled = sess._isEnrolled ?? false;
                  return (
                    <div key={sess.id} className={styles.dcdetailrow}>
                      <div>
                        <div className={styles.dcmuted}>{sess.mode === "Live Demo" ? "Demo Session" : "Live Class"}</div>

                        <div className={styles.dcdetailtime}>{sess.time}</div>

                        <div className={styles.dcdetailmeta}>{sess.duration || "60 min"}</div>
                      </div>
                      {sess.mode === "Live Demo" && isEnrolled ? (
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
                              const resendFn = isLiveClass ? resendLiveClassEmail : resendDemoEmail;
                              resendFn(
                                { email: userProfile.email, batchId: sess.batchId },
                                {
                                  onSuccess: (msg) => {
                                    setSendingBatchId(null);
                                    setResendError("");
                                    setResendMessage(typeof msg === "string" ? msg : msg?.message);
                                  },
                                  onError: (err) => {
                                    setSendingBatchId(null);
                                    const backendMsg = typeof err?.response?.data === "string" ? err.response.data : err?.response?.data?.message;
                                    setResendMessage("");
                                    setResendError(backendMsg || "Failed to resend email");
                                  },
                                }
                              );
                            }}
                          >
                            {sess.resendCount >= 3 ? "Limit Reached" : sendingBatchId === sess.batchId ? "Sending..." : "Resend"}
                          </button>
                        </div>
                      ) : sess.mode === "Live Class" && isEnrolled && (Number(sess.amount) > 0 || sess._installmentsCompleted) ? (
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
                              const resendFn = isLiveClass ? resendLiveClassEmail : resendDemoEmail;
                              resendFn(
                                { email: userProfile.email, batchId: sess.batchId },
                                {
                                  onSuccess: (msg) => {
                                    setSendingBatchId(null);
                                    setResendError("");
                                    setResendMessage(typeof msg === "string" ? msg : msg?.message);
                                  },
                                  onError: (err) => {
                                    setSendingBatchId(null);
                                    const backendMsg = typeof err?.response?.data === "string" ? err.response.data : err?.response?.data?.message;
                                    setResendMessage("");
                                    setResendError(backendMsg || "Failed to resend email");
                                  },
                                }
                              );
                            }}
                          >
                            {sess.resendCount >= 3 ? "Limit Reached" : sendingBatchId === sess.batchId ? "Sending..." : "Resend"}
                          </button>
                        </div>
                      ) : (
                        <div className={styles.enrollActions}>
                          <button className={styles.dcbtn} onClick={() => handleEnrollWithLoginCheck(sess)}>
                            Enroll
                          </button>

                          <div className={styles.notifyOptions}>
                            <div className={styles.checkboxGroup}>
                              <label className={styles.notifyLabel}>
                                <input type="checkbox" checked={notifyViaMap[sess.id]?.email ?? true} onChange={(e) => handleNotifyChange(sess.id, "email", e.target.checked)} className={styles.checkboxInput} />
                                <span className={styles.checkboxText}>Email</span>
                              </label>

                              <label className={styles.notifyLabel}>
                                <input type="checkbox" checked={notifyViaMap[sess.id]?.whatsapp ?? true} onChange={(e) => handleNotifyChange(sess.id, "whatsapp", e.target.checked)} className={styles.checkboxInput} />
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/calendar.png" alt="calendar" />
              </div>

              <p className={styles.dcemptytext}>Be the first to request a custom demo session at your preferred time</p>

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

              {enrollSuccessMessage && <p style={{ color: "green", fontSize: "14px", marginTop: "6px" }}>{enrollSuccessMessage}</p>}

              {enrollErrorMessage && <p style={{ color: "red", fontSize: "14px", marginTop: "6px" }}>{enrollErrorMessage}</p>}

              {showMessage && isRequestBatchSuccess && (
                <p style={{ color: "#0A8754", fontSize: "14px", marginTop: "6px", lineHeight: "1.4" }}>
                  Your request has been submitted successfully.
                  <br />
                  Our team will contact you shortly with batch details.
                </p>
              )}

              {showMessage && requestBatchError && (
                <p style={{ color: "#D93025", fontSize: "14px", marginTop: "6px", lineHeight: "1.4" }}>
                  Unable to submit your request right now.
                  <br />
                  Please try again in a few minutes.
                </p>
              )}

              {resendMessage && <p style={{ color: "green", fontSize: "13px" }}>{resendMessage}</p>}

              {resendError && <p style={{ color: "red", fontSize: "13px" }}>{resendError}</p>}
            </div>
          </div>
        )}
      </div>

      {showRegisterPrompt && (
        <LoginModal
          isOpen={showRegisterPrompt}
          description="Before proceeding, please login into our Hachion."
          onClose={() => onCloseRegisterPrompt && onCloseRegisterPrompt()}
          onLogin={() => {
            router.push("/login");
            onCloseRegisterPrompt && onCloseRegisterPrompt();
          }}
        />
      )}

      {/* RIGHT: Dynamic Info Card */}
      <aside className={styles.dcinfo}>
        <div className={styles.dcinfohead}>
          <div className={styles.dcinfoicon} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/share.png" alt="share" />
          </div>
          <div>
            <div className={styles.dcinfotitle}>Live Training</div>
            <div className={styles.dcinfosubdescription}>Live Instructor-Led Training</div>
          </div>
        </div>

        {isCourseLoading ? (
          <div className={styles.dcinfotext}>Loading live training details...</div>
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
        text-align: left !important;
      }

      .liveTrainingHtml p,
      .liveTrainingHtml span,
      .liveTrainingHtml div {
        font-size: 14px !important;
        font-weight: 400 !important;
        line-height: 1.55 !important;
        margin: 0 0 10px !important;
        color: rgb(0 0 0) !important;
        text-align: left !important;
        overflow-wrap: break-word !important;
        word-break: break-word !important;
      }

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
        margin-bottom: 4px !important;
        color: rgb(0 0 0) !important;
      }

      .liveTrainingHtml strong,
      .liveTrainingHtml b {
        font-weight: 700 !important;
      }
    `}
            </style>

            {liveTraining && liveTraining.trim() ? (
              <div className="liveTrainingHtml" dangerouslySetInnerHTML={{ __html: liveTraining }} />
            ) : (
              <p style={{ margin: 0 }}>Live instructor-led training with real-time interaction and hands-on practice.</p>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
export default DemoClassSectionLiveTab;
