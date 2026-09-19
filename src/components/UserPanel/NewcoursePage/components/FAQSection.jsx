"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./FAQSection.module.css";
import { cn } from "@/utils";
import { useParams } from "next/navigation";
import { useCourseByName } from "@/Api/hooks/CourseApi/useCourseByName";
import { useFaqsByCourse } from "@/Api/hooks/CourseApi/useFaqsByCourse";
import { toApiCourseName } from "@/components/UserPanel/CoursePage/courseRouteUtils";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

// Ported from the CRA app's
// src/Components/UserPanel/NewcoursePage/components/FAQSection.jsx.
export default function FAQSection({ initialCourse, initialFaqs }) {
  const { courseName } = useParams();

  const courseNameForApi = courseName ? toApiCourseName(courseName) : "";

  // initialCourse/initialFaqs are server-fetched props from
  // app/(public)/courses/[categoryName]/[courseName]/page.js (same data
  // already used for the page's FAQPage JSON-LD) — seeding react-query with
  // them avoids a server-rendered "Loading FAQs..." placeholder. See
  // CourseBanner.jsx for the full explanation of this pattern.
  const { data: course, isLoading: courseLoading, isError: courseError } = useCourseByName(courseNameForApi, initialCourse ? { initialData: initialCourse } : undefined);

  const [expandedTopics, setExpandedTopics] = useState({});
  const [showAll, setShowAll] = useState(false);
  const firstFaqRef = useRef(null);
  const { data: faqs = [], isLoading: loading, isError: error } = useFaqsByCourse(courseNameForApi, initialFaqs ? { initialData: initialFaqs } : undefined);

  useEffect(() => {
    // Resets local UI state when the course (an external, URL-driven
    // source) changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpandedTopics({});
    setShowAll(false);
  }, [courseNameForApi]);

  if (courseLoading || loading) {
    return (
      <section className={styles.faqwrap}>
        <div className="container">
          <p>Loading FAQs...</p>
        </div>
      </section>
    );
  }

  if (courseError || error) {
    return (
      <section className={styles.faqwrap}>
        <div className="container">
          <p className="error-text">Unable to load FAQs.</p>
        </div>
      </section>
    );
  }

  const visibleFaqs = showAll ? faqs : faqs.slice(0, 4);

  return (
    <section className={styles.faqwrap}>
      <div className="container">
        <div className={styles.faqhead}>
          <h2>{course?.courseName ? `Frequently Asked Questions in ${course.courseName}` : "Frequently Asked Questions"}</h2>

          <p>Got questions? We&apos;ve got answers</p>

          {(!faqs || faqs.length === 0) && <div style={{ textAlign: "center", color: "#000" }}>No FAQs available</div>}
        </div>

        <div className={styles.faqlist} role="list">
          {visibleFaqs.map((item, idx) => {
            const open = !!expandedTopics[idx];
            const panelId = `faq-panel-${idx}`;
            const btnId = `faq-btn-${idx}`;

            return (
              <div key={item.faq_id} className={cn(styles.faqitem, open && styles.isopen)} role="listitem" ref={idx === 0 ? firstFaqRef : null}>
                <button
                  id={btnId}
                  className={styles.faqbtn}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() =>
                    setExpandedTopics((prev) => ({
                      ...prev,
                      [idx]: !prev[idx],
                    }))
                  }
                >
                  <span className={styles.faqq}>{item.faq_title}</span>
                  {open ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                </button>

                <div id={panelId} className={styles.faqpanel} role="region" aria-labelledby={btnId} style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
                  <div className={styles.faqpanelinner}>
                    <div className={styles.faqa} dangerouslySetInnerHTML={{ __html: item.description }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {faqs.length > 4 && (
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <button
              className={styles.faqViewButton}
              onClick={() => {
                if (showAll && firstFaqRef.current) {
                  firstFaqRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                }

                setShowAll(!showAll);
                setExpandedTopics({});
              }}
            >
              {showAll ? "View Less ↑" : "View More ↓"}
            </button>
          </div>
        )}

        <div className={styles.faqactions}>
          <button className={styles.faqprimary} onClick={() => window.open("https://api.whatsapp.com/send/?phone=919490323388&text&type=phone_number&app_absent=0", "_blank")}>
            Chat with Our Team
          </button>
        </div>
      </div>
    </section>
  );
}
