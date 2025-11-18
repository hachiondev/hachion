import React, { useState } from "react";
import styles from "./FAQSection.module.css";
import { cn } from "../../utils";

const Chevron = ({ open }) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    className={styles.faqchevron}
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    aria-hidden="true"
  >
    <path fill="currentColor" d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
  </svg>
);

const defaultFaqs = [
  {
    q: "What is the duration of the course?",
    a: "The program runs for 12 weeks. Each week includes live sessions, hands-on assignments, and optional office hours.",
  },
  {
    q: "Do I get lifetime access to course materials?",
    a: "Yes. All recordings, projects, and resources remain available to you for life, including future updates.",
  },
  {
    q: "What if I miss a live class?",
    a: "No problem—recordings are uploaded within 24 hours and you can join a backup live session the same week.",
  },
  {
    q: "Is there a job guarantee?",
    a: "We don’t guarantee a job, but we provide career support: resume reviews, mock interviews, referral network, and 1-on-1 mentorship.",
  },
  {
    q: "What is your refund policy?",
    a: "Full refund within 7 days of purchase if you haven’t completed more than 20% of the course content.",
  },
  {
    q: "Do I need any prior experience?",
    a: "No prior experience is required. We start from fundamentals and progress to advanced topics with guided projects.",
  },
  {
    q: "What kind of support do I get?",
    a: "24/7 discussion forum, weekly mentor office hours, and priority email support.",
  },
  {
    q: "Are there EMI options available?",
    a: "Yes. Flexible EMI plans are available starting from INR 1000/month with major payment providers.",
  },
];

export default function FAQSection({ faqs = defaultFaqs, onChat = () => {}, onSchedule = () => {} }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className={styles.faqwrap} aria-labelledby="faq-heading">
      <div className={styles.faqhead}>
        <h2 id="faq-heading">Frequently Asked Questions</h2>
        <p>Got questions? We’ve got answers</p>
      </div>

      <div className={styles.faqlist} role="list">
        {faqs.map((item, idx) => {
          const open = openIndex === idx;
          const panelId = `faq-panel-${idx}`;
          const btnId = `faq-btn-${idx}`;
          return (
            <div className={cn(styles.faqitem, open && styles.isopen)} role="listitem" key={idx}>
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

      <div className={styles.faqhelp}>
        <div className={styles.faqhelpsub}>Still have questions?</div>
        <div className={styles.faqactions}>
          <button className={styles.faqprimary} onClick={onChat}>Chat with Our Team</button>
          <button className={styles.faqlink} onClick={onSchedule}>Schedule a Call</button>
        </div>
      </div>
    </section>
  );
}
