import React, { useState } from "react";
import styles from "./DemoClassSection.module.css";
import { cn } from "../lib/utils";
import RequestCustomBatch from "./RequestCustomBatch";
import EnrollNotification from "./EnrollNotification";

const tabs = [
  { key: "live", label: "Live Training" },
  { key: "crash", label: "Crash Course (Fast Track)" },
  { key: "mentoring", label: "Mentoring Mode" },
  { key: "self", label: "Self-Paced Learning" },
];

const defaultSlots = [
  { id: 1, day: "Mon, Apr 21", slots: 2, badge: "1 demo", type: "demo" },
  { id: 2, day: "Wed, Apr 21", slots: 2, badge: "2 Live", type: "live" },
  { id: 3, day: "Mon, Apr 21", slots: 2, badge: "1 Demo", type: "demo" },
  { id: 4, day: "Sat, Apr 21", slots: 3, badge: "1 Live", type: "live" },
  { id: 5, day: "Wed, Apr 21", slots: 2, badge: "2 demo", type: "demo" },
  { id: 6, day: "Mon, Apr 21", slots: 2, badge: "1 Demo", type: "demo" },
  { id: 7, day: "Sat, Apr 21", slots: 3, badge: "1 Demo", type: "demo" },
  { id: 8, day: "Sat, Apr 21", slots: 3, badge: "1 Demo", type: "demo" },
];

const defaultSlots2 = [
  { id: 1, day: "Mon, Apr 22", slots: 12, badge: "1 demo", type: "demo" },
  { id: 2, day: "Wed, Apr 22", slots: 22, badge: "2 Live", type: "live" },
  { id: 3, day: "Mon, Apr 22", slots: 20, badge: "1 Demo", type: "demo" },
  { id: 4, day: "Sat, Apr 22", slots: 30, badge: "1 Live", type: "live" },
  { id: 5, day: "Wed, Apr 22", slots: 13, badge: "2 demo", type: "demo" },
  { id: 6, day: "Mon, Apr 22", slots: 12, badge: "1 Demo", type: "demo" },
  { id: 7, day: "Sat, Apr 22", slots: 30, badge: "1 Demo", type: "demo" },
  { id: 8, day: "Sat, Apr 22", slots: 33, badge: "1 Demo", type: "demo" },
];

const defaultSlots3 = [
  { id: 1, day: "Mon, Apr 23", slots: 23, badge: "1 demo", type: "demo" },
  { id: 2, day: "Wed, Apr 23", slots: 26, badge: "2 Live", type: "live" },
  { id: 3, day: "Mon, Apr 23", slots: 23, badge: "1 Demo", type: "demo" },
  { id: 4, day: "Sat, Apr 23", slots: 23, badge: "1 Live", type: "live" },
  { id: 5, day: "Wed, Apr 23", slots: 12, badge: "2 demo", type: "demo" },
  { id: 6, day: "Mon, Apr 23", slots: 24, badge: "1 Demo", type: "demo" },
  { id: 7, day: "Sat, Apr 23", slots: 35, badge: "1 Demo", type: "demo" },
  { id: 8, day: "Sat, Apr 23", slots: 32, badge: "1 Demo", type: "demo" },
];

const Chevron = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    className={styles.faqchevron}
    aria-hidden="true"
  >
    <path fill="currentColor" d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
  </svg>
);

export default function DemoClassSection() {
  const [activeTab, setActiveTab] = useState("live");
  const [tz, setTz] = useState("IST");
  const [showRequestBatch, setShowRequestBatch] = useState(false);
  const [enrollNow, setEnrollNow] = useState(false);
  const [tzDropdownOpen, setTzDropdownOpen] = useState(false);
  const [preferredTime, setPreferredTime] = useState("10:00 AM - 12:00 PM");
  const [notification, setNotification] = useState("WhatsApp / Email");
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  const timezones = [
    { value: "IST", label: "Indian Standard Time (IST)" },
    { value: "UTC", label: "UTC" },
    { value: "PST", label: "Pacific Time (PT)" },
    { value: "EST", label: "Eastern Time (ET)" },
    { value: "CET", label: "Central Europe (CET)" },
  ];

  const timeOptions = [
    { value: "10:00 AM - 12:00 PM", label: "10:00 AM - 12:00 PM" },
    { value: "02:00 PM - 04:00 PM", label: "02:00 PM - 04:00 PM" },
    { value: "06:00 PM - 08:00 PM", label: "06:00 PM - 08:00 PM" },
  ];

  const notificationOptions = [
    { value: "WhatsApp / Email", label: "WhatsApp / Email" },
    { value: "Email Only", label: "Email Only" },
    { value: "WhatsApp Only", label: "WhatsApp Only" },
  ];

  const handleEnroll = (method) => {
    setEnrollNow(false);
  }
  return (
    <section className={styles.dcwrap}>
      <div className="container">
        {/* Happy Hours banner */}
        <div className={styles.offerBanner}>
          <div className={styles.offerLeft}>
            <div className={styles.offerIcon} aria-hidden="true">
              <img src="Offer.png" alt="Offer" />
            </div>
            <div className={styles.offerText}>
              <div className={styles.offerTitle}>Happy Hours Offer!</div>
              <div className={styles.offerSubtitle}>Get 50% Discount on <strong>Web Developer Bootcamp</strong></div>
            </div>
          </div>

          <div className={styles.offerCountdown}>
            {/* <span className={styles.endsLabel}>Ends in</span> */}
            <div className={styles.countPill}>Ends in <span className={styles.hrLabel}><strong>01 hr</strong></span> mins: 02 sec</div>
          </div>
        </div>

        {/* Heading + timezone (new layout) */}
        <div className={styles.dchead}>
          <div className={styles.dcheadText}>
            <h2>Try Before You Enroll</h2>
            <p>
              Experience our world-class teaching methodology firsthand. Join an upcoming
              demo session or request a custom batch at your preferred time.
            </p>
          </div>

          {/* Timezone select (moved into header) */}
          <div className={styles.dctimezone}>
            <label>Time zone</label>
            <div className={styles.dcselect}>
              <div
                className={styles.dcselectTrigger}
                onClick={() => setTzDropdownOpen(!tzDropdownOpen)}
              >
                <span>{timezones.find(t => t.value === tz)?.label}</span>
                <span className={cn(styles.dccaret, tzDropdownOpen && styles.dccaretOpen)}>
                  <Chevron />
                </span>
              </div>

              {tzDropdownOpen && (
                <>
                  <div
                    className={styles.dcselectOverlay}
                    onClick={() => setTzDropdownOpen(false)}
                  />
                  <div className={styles.dcselectMenu}>
                    {timezones.map((timezone) => (
                      <div
                        key={timezone.value}
                        className={cn(
                          styles.dcselectOption,
                          tz === timezone.value && styles.dcselectOptionActive
                        )}
                        onClick={() => {
                          setTz(timezone.value);
                          setTzDropdownOpen(false);
                        }}
                      >
                        {timezone.label}
                        {tz === timezone.value && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

        {/* Tabs */}
        <div className={styles.dctabs}>
          {tabs.map((t) => (
            <button
              key={t.key}
              className={cn(styles.dctab, activeTab === t.key && styles.dctabisactive)}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "live" && (
          <div className={styles.dcgrid}>
            {/* Left: Slots + Class details */}
            <div>
              <div className={styles.dcslots}>
                {defaultSlots.map((s) => (
                  <div key={s.id} className={styles.dcslot}>
                    <div className={styles.dcslotdate}>{s.day}</div>
                    <div className={styles.dcslotcount}>
                      <strong>{s.slots} Slots</strong>
                    </div>
                    <div
                      className={cn(styles.dcslotbadge, s.type === "live" ? styles.dcslotbadgeislive : styles.dcslotbadgeisdemo)}
                    >
                      {s.badge}
                    </div>
                  </div>
                ))}
              </div>

              {/* Class details */}
              <div className={styles.dcdetails}>
                <div className={styles.dcdetailscol}>
                  <h4>Class Details</h4>
                  <div className={styles.dcdetailrow}>
                    <div>
                      <div className={cn(styles.dcdetailrow, styles.dcmuted)}>Demo Session</div>
                      <div className={styles.dcdetailtime}>04:00 PM (Kolkata)</div>
                      <div className={styles.dcdetailmeta}>30 min · Seats: 100</div>
                    </div>
                    <button className={styles.dcbtn} onClick={() => setEnrollNow(true)}>Enroll</button>
                  </div>

                  <div className={styles.dcdetailrow}>
                    <div>
                      <div className={cn(styles.dcdetailrow, styles.dcmuted)}>Live Class</div>
                      <div className={styles.dcdetailtime}>10:00 AM (Kolkata)</div>
                      <div className={styles.dcdetailmeta}>60 min · Seats: 40</div>
                    </div>
                    <button className={styles.dcbtn} onClick={() => setEnrollNow(true)}>Enroll</button>
                  </div>
                </div>

                <div className={cn(styles.dcdetailscol, styles.dcempty)}>
                  <div className={styles.dcemptyicon} aria-hidden="true">
                    <img src="calendar.png" alt="calendar" />
                  </div>
                  <div className={styles.dcemptytitle}>No Demo Classes Scheduled Yet</div>
                  <p className={styles.dcemptytext}>
                    Be the first to request a custom demo session at your preferred time
                  </p>
                  <button
                    className={styles.dclink}
                    onClick={() => setShowRequestBatch(true)}
                  >
                    Request Batch
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Mode info card */}
            <aside className={styles.dcinfo}>
              <div className={styles.dcinfohead}>
                <div className={styles.dcinfoicon} aria-hidden="true">
                  <img src="share.png" alt="share" />
                </div>
                <div>
                  <div className={styles.dcinfotitle}>Live Training</div>
                  <div className={styles.dcinfosubdescription}>Learning Mode</div>
                </div>
              </div>

              <p className={styles.dcinfotext}>
                Join real-time instructor-led sessions from anywhere. This mode includes
                interactive classes, hands-on exercises, and live Q&amp;A to ensure in-depth learning.
              </p>

              <div className={styles.dcinfolist}>
                <h4>What's Included:</h4>
                {[
                  "80+ hours of video content",
                  "15 modules with over 150 lessons",
                  "5 real-world projects",
                  "Professional Certificate upon completion",
                  "English",
                  "Lifetime access with free updates",
                  "No prior programming experience required",
                ].map((x) => (
                  <div key={x}>• {x}</div>
                ))}
              </div>
            </aside>
          </div>
        )}

        {activeTab === "crash" && (
          <div className={styles.dcgrid}>
            {/* Left: Slots + Class details */}
            <div>
              <div className={styles.dcslots}>
                {defaultSlots2.map((s) => (
                  <div key={s.id} className={styles.dcslot}>
                    <div className={styles.dcslotdate}>{s.day}</div>
                    <div className={styles.dcslotcount}>
                      <strong>{s.slots} Slots</strong>
                    </div>
                    <div
                      className={cn(styles.dcslotbadge, s.type === "live" ? styles.dcslotbadgeislive : styles.dcslotbadgeisdemo)}
                    >
                      {s.badge}
                    </div>
                  </div>
                ))}
              </div>

              {/* Class details */}
              <div className={styles.dcdetails}>
                <div className={styles.dcdetailscol}>
                  <h4>Class Details</h4>
                  <div className={styles.dcdetailrow}>
                    <div>
                      <div className={cn(styles.dcdetailrow, styles.dcmuted)}>Demo Session</div>
                      <div className={styles.dcdetailtime}>04:00 PM (Kolkata)</div>
                      <div className={styles.dcdetailmeta}>30 min · Seats: 100</div>
                    </div>
                    <button className={styles.dcbtn} onClick={() => setEnrollNow(true)}>Enroll</button>
                  </div>

                  <div className={styles.dcdetailrow}>
                    <div>
                      <div className={cn(styles.dcdetailrow, styles.dcmuted)}>Live Class</div>
                      <div className={styles.dcdetailtime}>10:00 AM (Kolkata)</div>
                      <div className={styles.dcdetailmeta}>60 min · Seats: 40</div>
                    </div>
                    <button className={styles.dcbtn} onClick={() => setEnrollNow(true)}>Enroll</button>
                  </div>
                </div>

                <div className={cn(styles.dcdetailscol, styles.dcempty)}>
                  <div className={styles.dcemptyicon} aria-hidden="true">
                    <img src="calendar.png" alt="calendar" />
                  </div>
                  <div className={styles.dcemptytitle}>No Demo Classes Scheduled Yet</div>
                  <p className={styles.dcemptytext}>
                    Be the first to request a custom demo session at your preferred time
                  </p>
                  <button
                    className={styles.dclink}
                    onClick={() => setShowRequestBatch(true)}
                  >
                    Request Batch
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Mode info card */}
            <aside className={styles.dcinfo}>
              <div className={styles.dcinfohead}>
                <div className={styles.dcinfoicon} aria-hidden="true">
                  <img src="crash.png" alt="crash" />
                </div>
                <div>
                  <div className={styles.dcinfotitle}>Crash Course</div>
                  <div className={styles.dcinfosubdescription}>Learning Mode</div>
                </div>
              </div>

              <p className={styles.dcinfotext}>
                Join real-time instructor-led sessions from anywhere. This mode includes
                interactive classes, hands-on exercises, and live Q&amp;A to ensure in-depth learning.
              </p>

              <div className={styles.dcinfolist}>
                <h4>What's Included:</h4>
                {[
                  "80+ hours of video content",
                  "15 modules with over 150 lessons",
                  "5 real-world projects",
                  "Professional Certificate upon completion",
                  "English",
                  "Lifetime access with free updates",
                  "No prior programming experience required",
                ].map((x) => (
                  <div key={x}>• {x}</div>
                ))}
              </div>
            </aside>
          </div>
        )}


        {activeTab === "mentoring" && (
          <div className={styles.dcgrid}>
            {/* Left: Request Custom Batch Section */}
            <div className={styles.dcrequestSection}>
              <div className={styles.dcrequestCard}>
                <div className={styles.dcrequestImage}>
                  <img src="request_batch_banner.png" alt="Student" />
                </div>

                <div className={styles.dcrequestOverlay}>
                  <div className={styles.dcrequestForm}>
                    <div className={styles.dcrequestDays}>
                      <label className={styles.dcrequestLabel}>Preferred Day:</label>
                      <div className={styles.dcrequestCheckboxes}>
                        <label className={styles.dcrequestCheckbox}>
                          <input type="checkbox" defaultChecked />
                          <span className={styles.checkmark}></span>
                          <span>Mon</span>
                        </label>
                        <label className={styles.dcrequestCheckbox}>
                          <input type="checkbox" defaultChecked />
                          <span className={styles.checkmark}></span>
                          <span>Tue</span>
                        </label>
                        <label className={styles.dcrequestCheckbox}>
                          <input type="checkbox" defaultChecked />
                          <span className={styles.checkmark}></span>
                          <span>Wed</span>
                        </label>
                        <label className={styles.dcrequestCheckbox}>
                          <input type="checkbox" defaultChecked />
                          <span className={styles.checkmark}></span>
                          <span>Thu</span>
                        </label>
                        <label className={styles.dcrequestCheckbox}>
                          <input type="checkbox" defaultChecked />
                          <span className={styles.checkmark}></span>
                          <span>Fri</span>
                        </label>
                        <label className={styles.dcrequestCheckbox}>
                          <input type="checkbox" defaultChecked />
                          <span className={styles.checkmark}></span>
                          <span>Sat</span>
                        </label>
                        <label className={styles.dcrequestCheckbox}>
                          <input type="checkbox" defaultChecked />
                          <span className={styles.checkmark}></span>
                          <span>Sun</span>
                        </label>
                      </div>
                    </div>

                    <div className={styles.dcrequestRow}>
                      <div className={styles.dcrequestField}>
                        <label className={styles.dcrequestLabel}>Preferred Time:</label>
                        <div className={styles.dcrequestSelectWrapper}>
                          <div
                            className={styles.dcrequestSelectTrigger}
                            onClick={() => setTimeDropdownOpen(!timeDropdownOpen)}
                          >
                            <span>{preferredTime}</span>
                            <span className={cn(styles.dcrequestCaret, timeDropdownOpen && styles.dcrequestCaretOpen)}>
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
                                      preferredTime === option.value && styles.dcrequestSelectOptionActive
                                    )}
                                    onClick={() => {
                                      setPreferredTime(option.value);
                                      setTimeDropdownOpen(false);
                                    }}
                                  >
                                    {option.label}
                                    {preferredTime === option.value && (
                                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                        <label className={styles.dcrequestLabel}>Notification:</label>
                        <div className={styles.dcrequestSelectWrapper}>
                          <div
                            className={styles.dcrequestSelectTrigger}
                            onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                          >
                            <span>{notification}</span>
                            <span className={cn(styles.dcrequestCaret, notificationDropdownOpen && styles.dcrequestCaretOpen)}>
                              <Chevron />
                            </span>
                          </div>

                          {notificationDropdownOpen && (
                            <>
                              <div
                                className={styles.dcrequestSelectOverlay}
                                onClick={() => setNotificationDropdownOpen(false)}
                              />
                              <div className={styles.dcrequestSelectMenu}>
                                {notificationOptions.map((option) => (
                                  <div
                                    key={option.value}
                                    className={cn(
                                      styles.dcrequestSelectOption,
                                      notification === option.value && styles.dcrequestSelectOptionActive
                                    )}
                                    onClick={() => {
                                      setNotification(option.value);
                                      setNotificationDropdownOpen(false);
                                    }}
                                  >
                                    {option.label}
                                    {notification === option.value && (
                                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

                    <button
                      className={styles.dcrequestBtn}
                      onClick={() => setShowRequestBatch(true)}
                    >
                      Request Batch
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Mode info card */}
            <aside className={styles.dcinfo}>
              <div className={styles.dcinfohead}>
                <div className={styles.dcinfoicon} aria-hidden="true">
                  <img src="monitor.png" alt="monitor" />
                </div>
                <div>
                  <div className={styles.dcinfotitle}>Mentoring Mode</div>
                  <div className={styles.dcinfosubdescription}>Learning Mode</div>
                </div>
              </div>

              <p className={styles.dcinfotext}>
                Get personalized one-on-one guidance from industry experts. Customized learning paths tailored to your goals and schedule.
              </p>

              <div className={styles.dcinfolist}>
                <h4>What's Included:</h4>
                {[
                  "80+ hours of video content",
                  "15 modules with over 150 lessons",
                  "5 real-world projects",
                  "Professional Certificate upon completion",
                  "English",
                  "Lifetime access with free updates",
                  "No prior programming experience required",
                ].map((x) => (
                  <div key={x}>• {x}</div>
                ))}
              </div>
            </aside>
          </div>
        )}


        {activeTab === "self" && (
          <div className={styles.dcgrid}>
            {/* Left: Slots + Class details */}
            <div className={styles.dcrequestSection}>
              <div className={styles.dcrequestCard}>
                <div className={styles.dcrequestImage}>
                  <img src="request_batch_banner.png" alt="Student" />
                </div>

                <div className={styles.dcrequestOverlay}>
                  <div className={styles.dcrequestForm}>
                    <div className={styles.dcrequestDays}>
                      <label className={styles.dcrequestLabel}>Preferred Day:</label>
                      <div className={styles.dcrequestCheckboxes}>
                        <label className={styles.dcrequestCheckbox}>
                          <input type="checkbox" defaultChecked />
                          <span className={styles.checkmark}></span>
                          <span>Mon</span>
                        </label>
                        <label className={styles.dcrequestCheckbox}>
                          <input type="checkbox" defaultChecked />
                          <span className={styles.checkmark}></span>
                          <span>Tue</span>
                        </label>
                        <label className={styles.dcrequestCheckbox}>
                          <input type="checkbox" defaultChecked />
                          <span className={styles.checkmark}></span>
                          <span>Wed</span>
                        </label>
                        <label className={styles.dcrequestCheckbox}>
                          <input type="checkbox" defaultChecked />
                          <span className={styles.checkmark}></span>
                          <span>Thu</span>
                        </label>
                        <label className={styles.dcrequestCheckbox}>
                          <input type="checkbox" defaultChecked />
                          <span className={styles.checkmark}></span>
                          <span>Fri</span>
                        </label>
                        <label className={styles.dcrequestCheckbox}>
                          <input type="checkbox" defaultChecked />
                          <span className={styles.checkmark}></span>
                          <span>Sat</span>
                        </label>
                        <label className={styles.dcrequestCheckbox}>
                          <input type="checkbox" defaultChecked />
                          <span className={styles.checkmark}></span>
                          <span>Sun</span>
                        </label>
                      </div>
                    </div>

                    <div className={styles.dcrequestRow}>
                      <div className={styles.dcrequestField}>
                        <label className={styles.dcrequestLabel}>Preferred Time:</label>
                        <div className={styles.dcrequestSelectWrapper}>
                          <div
                            className={styles.dcrequestSelectTrigger}
                            onClick={() => setTimeDropdownOpen(!timeDropdownOpen)}
                          >
                            <span>{preferredTime}</span>
                            <span className={cn(styles.dcrequestCaret, timeDropdownOpen && styles.dcrequestCaretOpen)}>
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
                                      preferredTime === option.value && styles.dcrequestSelectOptionActive
                                    )}
                                    onClick={() => {
                                      setPreferredTime(option.value);
                                      setTimeDropdownOpen(false);
                                    }}
                                  >
                                    {option.label}
                                    {preferredTime === option.value && (
                                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                        <label className={styles.dcrequestLabel}>Notification:</label>
                        <div className={styles.dcrequestSelectWrapper}>
                          <div
                            className={styles.dcrequestSelectTrigger}
                            onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                          >
                            <span>{notification}</span>
                            <span className={cn(styles.dcrequestCaret, notificationDropdownOpen && styles.dcrequestCaretOpen)}>
                              <Chevron />
                            </span>
                          </div>

                          {notificationDropdownOpen && (
                            <>
                              <div
                                className={styles.dcrequestSelectOverlay}
                                onClick={() => setNotificationDropdownOpen(false)}
                              />
                              <div className={styles.dcrequestSelectMenu}>
                                {notificationOptions.map((option) => (
                                  <div
                                    key={option.value}
                                    className={cn(
                                      styles.dcrequestSelectOption,
                                      notification === option.value && styles.dcrequestSelectOptionActive
                                    )}
                                    onClick={() => {
                                      setNotification(option.value);
                                      setNotificationDropdownOpen(false);
                                    }}
                                  >
                                    {option.label}
                                    {notification === option.value && (
                                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

                    <button
                      className={styles.dcrequestBtn}
                      onClick={() => setShowRequestBatch(true)}
                    >
                      Request Batch
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Mode info card */}
            <aside className={styles.dcinfo}>
              <div className={styles.dcinfohead}>
                <div className={styles.dcinfoicon} aria-hidden="true">
                  <img src="self_paced.png" alt="self-paced" />
                </div>
                <div>
                  <div className={styles.dcinfotitle}>Self-paced Learning</div>
                  <div className={styles.dcinfosubdescription}>Learning Mode</div>
                </div>
              </div>

              <p className={styles.dcinfotext}>
                Join real-time instructor-led sessions from anywhere. This mode includes
                interactive classes, hands-on exercises, and live Q&amp;A to ensure in-depth learning.
              </p>

              <div className={styles.dcinfolist}>
                <h4>What's Included:</h4>
                {[
                  "80+ hours of video content",
                  "15 modules with over 150 lessons",
                  "5 real-world projects",
                  "Professional Certificate upon completion",
                  "English",
                  "Lifetime access with free updates",
                  "No prior programming experience required",
                ].map((x) => (
                  <div key={x}>• {x}</div>
                ))}
              </div>
            </aside>
          </div>
        )}


        {showRequestBatch && (
          <RequestCustomBatch
            onClose={() => setShowRequestBatch(false)}
            onSubmit={(formData) => {
              console.log("Custom batch request submitted:", formData);
              setShowRequestBatch(false);
              // Add your API call or notification here
            }}
          />
        )}

      </div>

      {enrollNow && (
        <EnrollNotification
          open={enrollNow}
          onClose={() => setEnrollNow(false)}
          onEnroll={handleEnroll}
        />
      )}
    </section>
  );
}
