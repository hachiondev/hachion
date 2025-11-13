import React, { useEffect, useState } from 'react';
import './Course.css';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

const HelpFaqAll = () => {
  const [faqs, setFaqs] = useState([]);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ac = new AbortController();

    async function loadFaqs() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("https://api.test.hachion.co/general-faq", { signal: ac.signal });
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

  if (loading) {
    return (
      <div className="help-faq-topic container">
        <div className="help-faq-content skeleton" />
        <div className="help-faq-content skeleton" />
        <div className="help-faq-content skeleton" />
        <div className="help-faq-content skeleton" />
      </div>
    );
  }

  if (error) {
    return <div className="help-faq-topic container"><p className="error-text">{error}</p></div>;
  }

  if (!faqs.length) {
    return <div className="help-faq-topic container"><p>No FAQs available.</p></div>;
  }

  return (
    <div className="help-faq-topic container">
      {faqs.map((item, index) => (
        <div key={item.faqId ?? index}>
          <div
            className="help-faq-content"
            role="button"
            tabIndex={0}
            aria-expanded={!!expandedTopics[index]}
            aria-controls={`faq-panel-${index}`}
            onClick={() => handleToggleExpand(index)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleToggleExpand(index)}
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
            <div id={`faq-panel-${index}`} className="help-faq-details">
              <div className="faq-description">{item.description || ""}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HelpFaqAll;
