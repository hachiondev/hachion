// src/Components/.../CrashTab.jsx
import React, { useEffect } from "react";
import styles from "./DemoClassSection.module.css";
import { cn } from "../../../../utils";

function DemoClassSectionCrashTab({
  scheduleLoading,
  scheduleError,
  crashGroups,
  selectedCrashDay,
  setSelectedCrashDay,
  selectedCrashGroup,
  isRequestBatchLoading,
  isProfileLoading,
  showMessage,
  isRequestBatchSuccess,
  enrollSuccessMessage,
  enrollErrorMessage,
  resendMessage,
  resendError,
  requestBatchError,
  onRequestClick,
  crashCourse,      
  isCourseLoading,  
  courseError,      
  resetLiveSubmitting,
}) {
  // No parsing — direct backend content with fallback
  const crashContent =
    crashCourse && crashCourse.trim().length > 0
      ? crashCourse
      : `Join real-time instructor-led sessions from anywhere. This mode includes interactive classes, hands-on exercises, and live Q&A to ensure in-depth learning.

What's Included:
• 80+ hours of video content
• 15 modules with over 150 lessons
• 5 real-world projects
• Professional Certificate upon completion
• English
• Lifetime access with free updates
• No prior programming experience required`;
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useEffect(() => {
    if (isRequestBatchSuccess || requestBatchError) {
      setIsSubmitting(false);
    }
  }, [isRequestBatchSuccess, requestBatchError]);

  useEffect(() => {
    setIsSubmitting(false);
  }, [resetLiveSubmitting]);

  return (
    <div className={styles.dcgrid}>
      <div>
        <div className={styles.dcrequestImage}>
                              <img src="/crash-course.png" alt="Student" />
                            </div>
        <div className={styles.dcslots}>
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
            crashGroups &&
            crashGroups.length > 0 &&
            crashGroups.map((g) => (
              <div
                key={g.day}
                className={cn(
                  styles.dcslot,
                  selectedCrashDay === g.day && styles.dcslotActive
                )}
                onClick={() => setSelectedCrashDay(g.day)}
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
                    styles.dcslotbadgeislive
                  )}
                >
                  {g.totalSlots} Crash
                </div>
              </div>
            ))}

          {!scheduleLoading &&
            !scheduleError &&
            (!crashGroups || crashGroups.length === 0) && (
              <div className={styles.noLiveSlotsContainer}>
                <div className={cn(crashGroups && crashGroups.length > 0 ? styles.dcslot : styles.noLiveSlot)}>
                  <div className={styles.dcslotdate}>
                    No crash batches scheduled
                  </div>
                </div>
                <div
                  className={cn(
                    crashGroups && crashGroups.length > 0 ? styles.dcempty : styles.noLiveClass
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

    setIsSubmitting(true);
    onRequestClick();
  }}
>
  {isSubmitting || isRequestBatchLoading
    ? "Submitting..."
    : "Request Batch"}
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

        {selectedCrashGroup && (
          <div className={styles.dcdetails}>
            <div className={styles.dcdetailscol}>
              <h4>Class Details</h4>

              {selectedCrashGroup.sessions.map((sess) => (
                <div key={sess.id} className={styles.dcdetailrow}>
                  <div>
                    <div
                      className={cn(
                        styles.dcdetailrow,
                        styles.dcmuted
                      )}
                    >
                      Crash Course
                    </div>
                    <div className={styles.dcdetailtime}>{sess.time}</div>
                    <div className={styles.dcdetailmeta}>
                      {sess.duration || "60 min"}
                    </div>
                  </div>

                  <button
                    className={styles.dcbtn}
                    onClick={() => {
                      // parent controls enroll modal
                    }}
                  >
                    Enroll
                  </button>
                </div>
              ))}
            </div>

            <div className={cn(styles.dcdetailscol, styles.dcempty)}>
              <div className={styles.dcemptyicon} aria-hidden="true">
                <img src="/calendar.png" alt="calendar" />
              </div>

              <p className={styles.dcemptytext}>
                Be the first to request a custom demo session at your preferred
                time
              </p>

              <button
                className={styles.dclink}
                onClick={onRequestClick}
                disabled={isRequestBatchLoading || isProfileLoading}
              >
                {isRequestBatchLoading ? "Submitting..." : "Request Batch"}
              </button>

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
            </div>
          </div>
        )}
      </div>

      <aside className={styles.dcinfo}>
        <div className={styles.dcinfohead}>
          <div className={styles.dcinfoicon} aria-hidden="true">
            <img src="/crash.png" alt="crash" />
          </div>
          <div>
            <div className={styles.dcinfotitle}>Crash Course</div>
            <div className={styles.dcinfosubdescription}>Fast Track Batch</div>
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
    Loading crash course details...
  </div>
) : (
 <div className={styles.dcinfotext}>
  <style>
    {`
      .crashHtml h1,
      .crashHtml h2,
      .crashHtml h3,
      .crashHtml h4,
      .crashHtml h5,
      .crashHtml h6 {
        font-size: 16px !important;
        font-weight: 700 !important;
        margin: 12px 0 8px !important;
        line-height: 1.3 !important;
      }

      .crashHtml p,
      .crashHtml span,
      .crashHtml div {
        font-size: 14px !important;
        font-weight: 400 !important;
        line-height: 1.55 !important;
        margin: 0 0 10px !important;
      }

      .crashHtml ul,
      .crashHtml ol {
        padding-left: 18px !important;
        margin: 6px 0 10px !important;
      }

      .crashHtml li {
        font-size: 14px !important;
        font-weight: 400 !important;
        line-height: 1.4 !important;
        margin-bottom: 4px !important;
      }

      .crashHtml strong,
      .crashHtml b {
        font-weight: 700 !important;
      }
    `}
  </style>

  {crashCourse && crashCourse.trim() ? (
    <div
      className="crashHtml"
      dangerouslySetInnerHTML={{ __html: crashCourse }}
    />
  ) : (
    <p style={{ margin: 0 }}>
      Join real-time instructor-led sessions from anywhere. This mode includes
      interactive classes, hands-on exercises, and live Q&amp;A to ensure
      in-depth learning.
    </p>
  )}
</div>

)}

      </aside>
    </div>
  );
}

export default DemoClassSectionCrashTab;
