
import React, { useEffect, useState } from "react";
import styles from "./DemoClassSection.module.css";
import { cn } from "../../../../utils";
import { useCheckEnrollmentForSessions } from "../../../../Api/hooks/CourseApi/useCheckEnrollmentForSessions";
import { useResendEnrollEmail } from "../../../../Api/hooks/CourseApi/useResendEnrollEmail";
import axios from "axios";
const API_BASE = "https://api.test.hachion.co";


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

  const [selectedDays, setSelectedDays] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendingBatchId, setSendingBatchId] = React.useState(null);
    const [resendMessage, setResendMessage] = React.useState("");
    const [resendError, setResendError] = React.useState("");
      const [notifyViaMap, setNotifyViaMap] = useState({});
      const [isSelfEnrolled, setIsSelfEnrolled] = useState(false);
const [checkingSelfEnroll, setCheckingSelfEnroll] = useState(false);
const [selfEnrollError, setSelfEnrollError] = useState("");

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

  useEffect(() => {
  if (!userProfile?.studentId || !courseName) return;

  const checkOnLoad = async () => {
    try {
      setCheckingSelfEnroll(true);

      const res = await axios.get(
        `${API_BASE}/enroll/is-self-paced-enrolled`,
        {
          params: {
            studentId: userProfile.studentId,
            courseName: courseName,
          },
        }
      );

      setIsSelfEnrolled(res?.data?.enrolled === true);
    } catch (err) {
      console.error("Self-paced enrollment check failed", err);
    } finally {
      setCheckingSelfEnroll(false);
    }
  };

  checkOnLoad();
}, [userProfile?.studentId, courseName]);

  const checkSelfPacedEnrollment = async () => {
  if (!userProfile?.studentId || !courseName) return false;

  try {
    setCheckingSelfEnroll(true);
    setSelfEnrollError("");

    const res = await axios.get(
      `${API_BASE}/enroll/is-self-paced-enrolled`,
      {
        params: {
          studentId: userProfile.studentId,
          courseName: courseName,
        },
      }
    );

    const enrolled = res?.data?.enrolled === true;
    setIsSelfEnrolled(enrolled);
    return enrolled;
  } catch (err) {
    setSelfEnrollError("Unable to verify enrollment status");
    return false;
  } finally {
    setCheckingSelfEnroll(false);
  }
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

      onRequestClick?.("ENROLL_SELF");
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
        <input type="checkbox" defaultChecked />
        <span className={styles.checkboxLabel}>Email</span>
      </label>

      <label className={styles.customCheckbox}>
        <input type="checkbox" />
        <span className={styles.checkboxLabel}>WhatsApp</span>
      </label>
    </div>
  </div>
)}

</div>

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
