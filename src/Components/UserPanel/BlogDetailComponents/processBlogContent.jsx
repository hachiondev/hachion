const processBlogContent = (html) => {
  if (!html) return "";
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  
  // Add classes to paragraphs for better styling
  const paragraphs = doc.querySelectorAll("p");
  paragraphs.forEach((p) => {
    const firstChild = p.firstChild;
    if (firstChild?.nodeName === 'STRONG' && !p.querySelector('img')) {
      p.classList.add('qa-question');
    }
  });
  
  // Wrap question-answer pairs in beautiful cards
  let content = doc.body.innerHTML;
  content = content.replace(
    /<p><strong[^>]*>(.*?)<\/strong><\/p>\s*<p>(.*?)<\/p>/gs,
    (match, question, answer) => {
      return `
        <div class="qa-card">
          <div class="qa-question">
            <span class="qa-icon">❓</span>
            <strong>${question}</strong>
          </div>
          <div class="qa-answer">
            <span class="qa-icon">💡</span>
            ${answer}
          </div>
        </div>
      `;
    }
  );
  
  return content;
};

export default processBlogContent;