import React, { useRef, useState } from "react";
import styles from "./FAQSection.module.css";
import { cn } from "../../../../utils";
import { useParams } from "react-router-dom";
import { useCourseByName } from "../../../../Api/hooks/CourseApi/useCourseByName";
import { useFaqsByCourse } from "../../../../Api/hooks/CourseApi/useFaqsByCourse";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

// const Chevron = ({ open }) => (
//   <svg
//     viewBox="0 0 24 24"
//     width="18"
//     height="18"
//     className={styles.faqchevron}
//     style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
//     aria-hidden="true"
//   >
//     <path
//       fill="currentColor"
//       d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"
//     />
//   </svg>
// );

export default function FAQSection({
  onChat = () => { },
}) {
  const { courseName } = useParams();

  // const rawSlug = courseName ? decodeURIComponent(courseName) : "";

  // const normalizeCourseSlug = (slug) =>
  //   slug
  //     .replace(/[-_]+/g, " ")
  //     .replace(/\s+/g, " ")
  //     .trim()
  //     .toLowerCase();

  // const courseNameForApi = rawSlug ? normalizeCourseSlug(rawSlug) : "";

  const courseNameForApi = courseName
  ? decodeURIComponent(courseName)
      .replace(/---+/g, " - ")
      .replace(/\b([a-zA-Z]{2,3})-(\d{3})\b/g, "$1@@$2")
      .replace(/[-_]+/g, " ")
      .replace(/@@/g, "-")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase()
  : "";

  const {
    data: course,
    isLoading: courseLoading,
    isError: courseError,
  } = useCourseByName(courseNameForApi);

  const [expandedTopics, setExpandedTopics] = useState({});
  const [showAll, setShowAll] = useState(false);
  const firstFaqRef = useRef(null);
const {
  data: faqs = [],
  isLoading: loading,
  isError: error,
} = useFaqsByCourse(course?.courseName || courseNameForApi);


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
          <h2>
  {course?.courseName
    ? `Frequently Asked Questions in ${course.courseName}`
    : "Frequently Asked Questions"}
</h2>

          <p>Got questions? We’ve got answers</p>

          {(!faqs || faqs.length === 0) && (
            <div style={{ textAlign: "center", color: "#000" }}>
              No FAQs available
            </div>
          )}
        </div>

        <div className={styles.faqlist} role="list">
          {visibleFaqs.map((item, idx) => {
            const open = !!expandedTopics[idx];
            const panelId = `faq-panel-${idx}`;
            const btnId = `faq-btn-${idx}`;

            return (
              <div
                key={idx}
                className={cn(styles.faqitem, open && styles.isopen)}
                role="listitem"
                ref={idx === 0 ? firstFaqRef : null}
              >
                <button
                  id={btnId}
                  className={styles.faqbtn}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() =>
                    setExpandedTopics(prev => ({
                      ...prev,
                      [idx]: !prev[idx],
                    }))
                  }
                >
                  <span className={styles.faqq}>{item.faq_title}</span>
                  {open ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                </button>

                <div
                  id={panelId}
                  className={styles.faqpanel}
                  role="region"
                  aria-labelledby={btnId}
                  style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                >
                  <div className={styles.faqpanelinner}>
                    <div
                      className={styles.faqa}
                      dangerouslySetInnerHTML={{
                        __html: item.description,
                      }}
                    />
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
          firstFaqRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
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
          <button
            className={styles.faqprimary}
            onClick={() =>
              window.open(
                "https://api.whatsapp.com/send/?phone=919490323388&text&type=phone_number&app_absent=0",
                "_blank"
              )
            }
          >
            Chat with Our Team
          </button>

        </div>
      </div>
    </section>
  );
}
