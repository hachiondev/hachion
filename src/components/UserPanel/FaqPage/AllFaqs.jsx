"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import "../CoursePage/Course.css";
import "../Home.css";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import FaqBanner from "@/assets/Faqbanner.webp";
import AddressIcon from "@/assets/addressicon.webp";
import ContactIcon from "@/assets/contacticon.webp";
import TimeIcon from "@/assets/timeicon.webp";
import FaqFormPopup from "@/components/UserPanel/FaqFormPopup";
import { API_BASE_URL } from "@/lib/apiBase";

const AllFaqs = () => {
  const [faqs, setFaqs] = useState([]);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAskPopup, setShowAskPopup] = useState(false);

  useEffect(() => {
    const ac = new AbortController();
    async function loadFaqs() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE_URL}/general-faq`, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setFaqs(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Unable to load FAQs right now.");
          setFaqs([]);
        }
      } finally {
        setLoading(false);
      }
    }
    loadFaqs();
    return () => ac.abort();
  }, []);

  const handleToggleExpand = (index) => {
    setExpandedTopics((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="course-top">
      <Image className="faq-banner" src={FaqBanner} alt="Faq banner" priority sizes="100vw" />

      <div className="home-faq-data container">
        <div className="view-faq-content">
          <h1 className="association-head">Frequently Asked Questions</h1>
          <p className="learner-title-tag mb-4">
            Answers to the most common questions about learning with Hachion.
          </p>

          {loading && (
            <div className="help-faq-topic container">
              <div className="help-faq-content skeleton" />
              <div className="help-faq-content skeleton" />
              <div className="help-faq-content skeleton" />
              <div className="help-faq-content skeleton" />
            </div>
          )}

          {!loading && error && (
            <div className="help-faq-topic container">
              <p className="error-text">{error}</p>
            </div>
          )}

          {!loading && !error && faqs.length === 0 && (
            <div className="help-faq-topic container">
              <p>No FAQs available.</p>
            </div>
          )}

          {!loading && !error && faqs.length > 0 && (
            <div className="help-faq-topic container">
              {faqs.map((item, index) => (
                <div key={item.faqId ?? index}>
                  <div
                    className="help-faq-content"
                    role="button"
                    tabIndex={0}
                    aria-expanded={!!expandedTopics[index]}
                    aria-controls={`all-faq-panel-${index}`}
                    onClick={() => handleToggleExpand(index)}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") && handleToggleExpand(index)
                    }
                  >
                    <h3 className="help-faq-que">{`Q${index + 1}. ${item.faqTitle || ""}`}</h3>
                    <p>
                      {expandedTopics[index] ? (
                        <MdKeyboardArrowUp className="ms-1 arrow-icon" />
                      ) : (
                        <MdKeyboardArrowDown className="ms-1 arrow-icon" />
                      )}
                    </p>
                  </div>

                  {expandedTopics[index] && (
                    <div id={`all-faq-panel-${index}`} className="help-faq-details">
                      <div className="faq-description">{item.description || ""}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="faq-side">
          <h2>Didn&rsquo;t Find What You&rsquo;re Looking For?</h2>
          <p>we&rsquo;re happy to help!</p>
          <hr className="faq-side-divide" />
          <div className="faq-contact">
            <div className="faq-part">
              <Image src={AddressIcon} alt="Address" className="icon" />
              <div>
                <h3>Address :</h3>
                <p>
                  Hyderabad, India
                  <br />
                  Hachion GP Rao Enclaves, 301, 3rd floor Road No 3, KPHB colony,
                  <br />
                  Hyderabad 500072.
                </p>
              </div>
            </div>
            <div className="faq-part">
              <Image src={ContactIcon} alt="Contact" className="icon" />
              <div>
                <h3>Contact Us :</h3>
                <p>Call us: +91-949-032-3388</p>
                <p>trainings@hachion.co</p>
              </div>
            </div>
            <div className="faq-part">
              <Image src={TimeIcon} alt="Time" className="icon" />
              <div>
                <h3>Working Hours :</h3>
                <p>(Indian timings)</p>
                <p>Mon - Fri: 9.00am - 5.00pm</p>
                <p>Sat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 9:00 am - 01:00 pm</p>
              </div>
            </div>
          </div>
          <button className="faq-button" type="button" onClick={() => setShowAskPopup(true)}>
            Ask Question
          </button>
        </div>
      </div>

      {showAskPopup && <FaqFormPopup onClose={() => setShowAskPopup(false)} />}
    </div>
  );
};

export default AllFaqs;
