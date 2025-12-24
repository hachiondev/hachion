// src/Components/.../CrashTab.jsx
import React from "react";
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
  requestBatchError,
  onRequestClick,
  crashCourse,      // 🔹 NEW
  isCourseLoading,  // 🔹 NEW
  courseError,      // 🔹 optional, not used but available
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

  return (
    <div className={styles.dcgrid}>
      <div>
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
              <div className={styles.dcslot}>
                <div className={styles.dcslotdate}>
                  No crash batches scheduled
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
            <div className={styles.dcinfosubdescription}>Learning Mode</div>
          </div>
        </div>

        {isCourseLoading ? (
          <div className={styles.dcinfotext}>Loading crash course details...</div>
        ) : (
          <div
            className={styles.dcinfotext}
            style={{ whiteSpace: "pre-line" }} // preserve line breaks from backend
          >
            {crashContent}
          </div>
        )}
      </aside>
    </div>
  );
}

export default DemoClassSectionCrashTab;
