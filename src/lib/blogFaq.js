// Server-safe (no DOM) re-implementation of BlogDetails.jsx's
// extractFaqsFromContent — used only to build the FAQPage JSON-LD schema in
// generateMetadata()/the page's server component, where DOMParser isn't
// available. The client-side BlogDetails.jsx component still does its own
// DOM-based heading/course-link extraction for the actual rendered page;
// this is purely for the SSR structured-data schema so bots see it without
// running JS.
const FAQ_HEADING_RE = /faq|frequently\s*asked\s*questions/i;
const QUESTION_PREFIX_RE = /^(?:Q\s*)?\d+\s*[.):]\s*/i;
const ANSWER_PREFIX_RE = /^(?:answer|ans|a)\s*[:.]\s*/i;
const QUESTION_ENDS_WITH_RE = /\?\s*["')]*$/;
const QUESTION_NUM_PREFIX_RE = /^Q\s*\d+\s*[.):]/i;
const looksLikeQuestion = (text) => QUESTION_ENDS_WITH_RE.test(text) || QUESTION_NUM_PREFIX_RE.test(text);

const stripTags = (html = "") =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

export function extractFaqsFromHtml(html) {
  if (!html) return [];

  const headingRe = /<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi;
  const headings = [];
  let m;
  while ((m = headingRe.exec(html))) {
    headings.push({ start: m.index, end: headingRe.lastIndex, text: stripTags(m[2]) });
  }
  const faqHeadingIndex = headings.findIndex((h) => FAQ_HEADING_RE.test(h.text));
  if (faqHeadingIndex === -1) return [];

  const faqHeading = headings[faqHeadingIndex];
  const nextHeading = headings[faqHeadingIndex + 1];
  const sectionHtml = html.slice(faqHeading.end, nextHeading ? nextHeading.start : html.length);

  const paragraphs = [];
  const blockRe = /<(p|li)[^>]*>([\s\S]*?)<\/\1>/gi;
  let block;
  while ((block = blockRe.exec(sectionHtml))) {
    const text = stripTags(block[2]);
    if (text) paragraphs.push(text);
  }

  const faqs = [];
  let currentQuestion = null;
  let currentAnswerParts = [];
  const pushCurrentFaq = () => {
    if (currentQuestion && currentAnswerParts.length) {
      faqs.push({ question: currentQuestion, answer: currentAnswerParts.join(" ").trim() });
    }
  };
  for (const text of paragraphs) {
    if (looksLikeQuestion(text)) {
      pushCurrentFaq();
      currentQuestion = text.replace(QUESTION_PREFIX_RE, "").trim();
      currentAnswerParts = [];
    } else if (currentQuestion) {
      currentAnswerParts.push(text.replace(ANSWER_PREFIX_RE, "").trim());
    }
  }
  pushCurrentFaq();
  return faqs;
}
