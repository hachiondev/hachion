import React, { useEffect, useState } from "react";
import styles from "./DemoClassSection.module.css";
import { cn } from "../../utils";

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

function DemoClassSectionMentoringTab({
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

  isRequestBatchLoading,
  isProfileLoading,
  showMessage,
  isRequestBatchSuccess,
  requestBatchError,
  onRequestClick,
  mentoringMode,
  isCourseLoading,
  courseError,
}) {

  const mentoringContent =
    mentoringMode && mentoringMode.trim().length > 0
      ? mentoringMode
      : `Get personalized one-on-one guidance from industry experts. Customized learning paths tailored to your goals and schedule.

What's Included:
• 80+ hours of video content
• 15 modules with over 150 lessons
• 5 real-world projects
• Professional Certificate upon completion
• English
• Lifetime access with free updates
• No prior programming experience required`;
  const isAnyDaySelected = () => {
    const checkboxes = document.querySelectorAll(".dayCheckbox");
    return Array.from(checkboxes).some((cb) => cb.checked);
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMentoringFormValid =
    isAnyDaySelected() &&
    preferredTime &&
    notification;

  useEffect(() => {
    if (isRequestBatchSuccess || requestBatchError) {
      setIsSubmitting(false);
    }
  }, [isRequestBatchSuccess, requestBatchError]);

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
              <div className={styles.dcrequestDays}>
                <label className={styles.dcrequestLabel}>Preferred Day: <span style={{ color: "red" }}>*</span></label>

                {/* SELECT / DESELECT ALL */}
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
                <div className={styles.dcrequestCheckboxes}>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => (
                      <label key={day} className={styles.dcrequestCheckbox}>
                        <input type="checkbox" className="dayCheckbox" />
                        <span className={styles.checkmark}></span>
                        <span>{day}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Preferred Time + Notification */}
              <div className={styles.dcrequestRow}>
                {/* Preferred Time */}
                <div className={styles.dcrequestField}>
                  <label className={styles.dcrequestLabel}>
                    Preferred Time: <span style={{ color: "red" }}>*</span>
                  </label>

                  <div className={styles.dcrequestSelectWrapper}>
                    <div
                      className={styles.dcrequestSelectTrigger}
                      onClick={() => setTimeDropdownOpen(!timeDropdownOpen)}
                    >
                      <span
                        style={{
                          color: preferredTime ? "#000" : "#999",
                        }}
                      >
                        {preferredTime || "Select preferred time"}
                      </span>

                      <span
                        className={cn(
                          styles.dcrequestCaret,
                          timeDropdownOpen && styles.dcrequestCaretOpen
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
                                setPreferredTime(
                                  preferredTime === option.value ? "" : option.value
                                );
                                setTimeDropdownOpen(false);
                              }}
                            >
                              {option.label}

                              {preferredTime === option.value && (
                                <svg width="16" height="16" viewBox="0 0 16 16">
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

                {/* Notification */}
                <div className={styles.dcrequestField}>
                  <label className={styles.dcrequestLabel}>Notification: <span style={{ color: "red" }}>*</span></label>

                  <div className={styles.dcrequestSelectWrapper}>
                    <div
                      className={styles.dcrequestSelectTrigger}
                      onClick={() =>
                        setNotificationDropdownOpen(!notificationDropdownOpen)
                      }
                    >
                      <span
                        style={{
                          color: notification ? "#000" : "#999",
                        }}
                      >
                        {notification || "Choose notification"}
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
                          {/* Clear Option */}
                          <div
                            className={styles.dcrequestSelectOption}
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
                                setNotification(
                                  notification === option.label ? "" : option.label
                                );
                                setNotificationDropdownOpen(false);
                              }}
                            >
                              {option.label}

                              {notification === option.label && (
                                <svg width="16" height="16" viewBox="0 0 16 16">
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
              </div>

              {/* Request Batch button */}

              <button
                onClick={() => {
                  if (isSubmitting || isRequestBatchLoading) return;

                  setIsSubmitting(true);
                  onRequestClick();
                }}
                disabled={
                  isSubmitting ||
                  isRequestBatchLoading ||
                  isProfileLoading ||
                  !isMentoringFormValid
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom:"14px",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "15px",
                  fontWeight: "600",
                  backgroundColor:
                    isSubmitting || isRequestBatchLoading || isProfileLoading || !isMentoringFormValid
                      ? "#C4C4C4"
                      : "#2a7cf7",
                  color: "#fff",
                  cursor:
                    isSubmitting || isRequestBatchLoading || isProfileLoading || !isMentoringFormValid
                      ? "not-allowed"
                      : "pointer",
                  transition: "background-color 0.2s ease",
                }}
              >
                {isSubmitting || isRequestBatchLoading ? "Submitting..." : "Request Batch"}
              </button>

              {/* Messages */}
              {showMessage && isRequestBatchSuccess && (
                <p style={{ color: "#0A8754", fontSize: "14px", marginTop: "6px" }}>
                  Your request has been submitted successfully.
                  <br />
                  Our team will contact you shortly with batch details.
                </p>
              )}

              {showMessage && requestBatchError && (
                <p style={{ color: "#D93025", fontSize: "14px", marginTop: "6px" }}>
                  Unable to submit your request right now.
                  <br />
                  Please try again in a few minutes.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Dynamic Info Card */}
      <aside className={styles.dcinfo}>
        <div className={styles.dcinfohead}>
          <div className={styles.dcinfoicon} aria-hidden="true">
            <img src="/monitor.png" alt="monitor" />
          </div>
          <div>
            <div className={styles.dcinfotitle}>Mentoring Mode</div>
            <div className={styles.dcinfosubdescription}>Learning Mode</div>
          </div>
        </div>

        {isCourseLoading ? (
          <div className={styles.dcinfotext}>Loading mentoring details...</div>
        ) : (
          <div
            className={styles.dcinfotext}
            style={{ whiteSpace: "pre-line" }}
          >
            {mentoringContent}
          </div>
        )}
      </aside>
    </div>
  );
}

export default DemoClassSectionMentoringTab;
