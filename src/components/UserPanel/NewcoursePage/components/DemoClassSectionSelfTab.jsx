"use client";

import React, { useEffect, useState } from "react";
import styles from "./DemoClassSection.module.css";
import { useCheckEnrollmentForSessions } from "@/Api/hooks/CourseApi/useCheckEnrollmentForSessions";
import { useResendEnrollEmail } from "@/Api/hooks/CourseApi/useResendEnrollEmail";
import axios from "axios";

const API_BASE = `https://api.hachion.co`;

// Ported from the CRA app's
// src/Components/UserPanel/NewcoursePage/components/DemoClassSectionSelfTab.jsx.
function DemoClassSectionSelfTab({
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
  selfPacedLearning,
  isCourseLoading,
}) {
  const [notifyViaMap, setNotifyViaMap] = useState({
    email: false,
    whatsapp: false,
  });
  const [isSelfEnrolled, setIsSelfEnrolled] = useState(false);
  const [checkingSelfEnroll, setCheckingSelfEnroll] = useState(false);
  const [selfEnrollError, setSelfEnrollError] = useState("");
  useCheckEnrollmentForSessions(selectedGroup?.sessions || [], userProfile?.studentId || "", courseName || "");
  useResendEnrollEmail();

  useEffect(() => {
    if (!userProfile?.studentId || !courseName) return;
    const checkOnLoad = async () => {
      try {
        setCheckingSelfEnroll(true);
        const res = await axios.get(`${API_BASE}/enroll/is-self-paced-enrolled`, {
          params: { studentId: userProfile.studentId, courseName: courseName },
        });
        setIsSelfEnrolled(res?.data?.enrolled === true);
      } catch (err) {
        console.error("Self-paced enrollment check failed", err);
      } finally {
        setCheckingSelfEnroll(false);
      }
    };
    checkOnLoad();
  }, [userProfile?.studentId, courseName]);

  const handleNotifyChange = (type, checked) => {
    setNotifyViaMap((prev) => ({
      ...prev,
      email: type === "email" ? checked : (prev.email ?? true),
      whatsapp: type === "whatsapp" ? checked : (prev.whatsapp ?? false),
    }));
  };

  return (
    <div className={styles.dcgrid}>
      {/* LEFT: Request Custom Batch Section */}
      <div className={styles.dcrequestSection}>
        <div className={styles.dcrequestCard}>
          <div className={styles.dcrequestImage}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/self-paced.png" alt="Student" />
          </div>

          <div className={styles.dcrequestOverlay}>
            <div className={styles.dcrequestForm}>
              <div className={styles.enrollActionsCard}>
                {checkingSelfEnroll ? (
                  <button className={styles.dcbtnDisabled} disabled>
                    Checking...
                  </button>
                ) : isSelfEnrolled ? (
                  <button className={styles.dcbtnDisabled} disabled>
                    Enrolled
                  </button>
                ) : (
                  <button
                    className={styles.enrollPrimaryBtn}
                    onClick={() => {
                      if (isProfileLoading) return;
                      if (!userProfile || !userProfile.studentId) {
                        onCloseRegisterPrompt && onCloseRegisterPrompt();
                        onRequestClick?.("LOGIN_REQUIRED");
                        return;
                      }
                      onRequestClick?.("ENROLL_SELF", {
                        email: notifyViaMap.email,
                        whatsapp: notifyViaMap.whatsapp,
                      });
                    }}
                  >
                    Enroll Now
                  </button>
                )}

                {!isSelfEnrolled && (
                  <div className={styles.notificationCard}>
                    <div className={styles.notificationHeader}>
                      <span className={styles.notificationTitle}>Notify me via:</span>
                    </div>

                    <div className={styles.checkboxContainer}>
                      <label className={styles.customCheckbox}>
                        <input type="checkbox" checked={notifyViaMap.email} onChange={(e) => handleNotifyChange("email", e.target.checked)} />
                        <span className={styles.checkboxLabel}>Email</span>
                      </label>

                      <label className={styles.customCheckbox}>
                        <input type="checkbox" checked={notifyViaMap.whatsapp} onChange={(e) => handleNotifyChange("whatsapp", e.target.checked)} />
                        <span className={styles.checkboxLabel}>WhatsApp</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

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
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Dynamic Info card */}
      <aside className={styles.dcinfo}>
        <div className={styles.dcinfohead}>
          <div className={styles.dcinfoicon} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/self_paced.png" alt="self-paced" />
          </div>
          <div>
            <div className={styles.dcinfotitle}>Self-paced Learning</div>
            <div className={styles.dcinfosubdescription}>Self-Paced Learning</div>
          </div>
        </div>
        {isCourseLoading ? (
          <div className={styles.dcinfotext}>Loading self-paced learning details...</div>
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
              <div className="selfHtml" dangerouslySetInnerHTML={{ __html: selfPacedLearning }} />
            ) : (
              <p style={{ margin: 0 }}>Learn at your own pace with structured modules, recorded sessions, and hands-on projects designed for flexible learning.</p>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}

export default DemoClassSectionSelfTab;
