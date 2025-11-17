import React, { useState } from "react";
import styles from "./DemoClassSection.module.css";
import { cn } from "../lib/utils";

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

export default function DemoClassSection() {
  const [activeTab, setActiveTab] = useState("live");
  const [tz, setTz] = useState("IST");

  return (
    <section className={styles.dcwrap}>
      {/* Offer pill */}
      <div className={styles.dcoffer}>Free Demo Classes Available</div>

      {/* Heading */}
      <div className={styles.dchead}>
        <h2>Try Before You Enroll</h2>
        <p>
          Experience our world-class teaching methodology firsthand. Join an upcoming
          demo session or request a custom batch at your preferred time.
        </p>
      </div>

      <div className={styles.dctimezonetop}>
        {/* Timezone select */}
        <div className={styles.dctimezone}>
          <label>Time zone</label>
          <div className={styles.dcselect}>
            <select
              value={tz}
              onChange={(e) => setTz(e.target.value)}
              aria-label="Choose time zone"
            >
              <option value="IST">Indian Standard Time (IST)</option>
              <option value="UTC">UTC</option>
              <option value="PST">Pacific Time (PT)</option>
              <option value="EST">Eastern Time (ET)</option>
              <option value="CET">Central Europe (CET)</option>
            </select>
            <span className={styles.dccaret}>▾</span>
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
                <button className={styles.dcbtn}>Enroll</button>
              </div>

              <div className={styles.dcdetailrow}>
                <div>
                  <div className={cn(styles.dcdetailrow, styles.dcmuted)}>Live Class</div>
                  <div className={styles.dcdetailtime}>10:00 AM (Kolkata)</div>
                  <div className={styles.dcdetailmeta}>60 min · Seats: 40</div>
                </div>
                <button className={styles.dcbtn}>Enroll</button>
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
              <a className={styles.dclink} href="#" onClick={(e)=>e.preventDefault()}>
                Request Batch
              </a>
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
    </section>
  );
}
