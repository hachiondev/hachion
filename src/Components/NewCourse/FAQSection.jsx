import React, { useState } from "react";
import styles from "./FAQSection.module.css";
import { cn } from "../../utils";
import { useGeneralFaqs } from "../../Api/hooks/CourseApi/useGeneralFaqs";

const Chevron = ({ open }) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    className={styles.faqchevron}
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"
    />
  </svg>
);

export default function FAQSection({
  onChat = () => {},
  onSchedule = () => {},
}) {
  const [openIndex, setOpenIndex] = useState(null);

  // ✅ ADDED: controls View More / View Less (default = show 4)
  const [showAll, setShowAll] = useState(false);

  const {
    data: faqs = [],
    isLoading,
    isError,
  } = useGeneralFaqs();

  if (isLoading) {
    return (
      <section className={styles.faqwrap}>
        <div className="container">
          <div className={styles.faqhead}>
            <h2>Frequently Asked Questions</h2>
            <p>Got questions? We’ve got answers</p>
          </div>
          <p>Loading FAQs...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className={styles.faqwrap}>
        <div className="container">
          <p className="error-text">Unable to load FAQs right now.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.faqwrap} aria-labelledby="faq-heading">
      <div className="container">
        <div className={styles.faqhead}>
          <h2 id="faq-heading">Frequently Asked Questions</h2>
          <p>Got questions? We’ve got answers</p>
        </div>

        <div className={styles.faqlist} role="list">
          {/*
            ✅ ADJUSTED:
            - Show only 4 FAQs by default
            - Show all FAQs when showAll = true
          */}
          {faqs
            .slice(0, showAll ? faqs.length : 4)
            .map((item, idx) => {
              const open = openIndex === idx;
              const panelId = `faq-panel-${idx}`;
              const btnId = `faq-btn-${idx}`;

              return (
                <div
                  key={idx}
                  className={cn(styles.faqitem, open && styles.isopen)}
                  role="listitem"
                >
                  <button
                    id={btnId}
                    className={styles.faqbtn}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : idx)}
                  >
                    <span className={styles.faqq}>{item.q}</span>
                    <Chevron open={open} />
                  </button>

                  <div
                    id={panelId}
                    className={styles.faqpanel}
                    role="region"
                    aria-labelledby={btnId}
                    style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                  >
                    <div className={styles.faqpanelinner}>
                      <p className={styles.faqa}>{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* 
          ✅ ADDED: View More / View Less button
          - Visible only if FAQs > 4
          - Same behavior as CourseCurriculum
        */}
       {faqs.length > 4 && (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      marginTop: "24px",
      marginBottom: "40px",
    }}
  >
    <button
      onClick={() => {
        setShowAll(!showAll);
        setOpenIndex(null);
      }}
      style={{
        background: "linear-gradient(135deg, #00b4db, #0083b0)", // same blue tone
        color: "#fff",
        padding: "12px 28px",
        borderRadius: "999px",
        border: "none",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
      }}
    >
      {showAll ? "View Less" : "View More"}
      <span style={{ fontSize: "18px", lineHeight: 1 }}>
        {showAll ? "↑" : "↓"}
      </span>
    </button>
  </div>
)}


        <div className={styles.faqhelp}>
          <div className={styles.faqhelpsub}>Still have questions?</div>
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

            {/* <button className={styles.faqlink} onClick={onSchedule}>
              Schedule a Call
            </button> */}
          </div>
        </div>
      </div>
    </section>
  );
}
