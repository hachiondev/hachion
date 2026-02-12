import { useEffect, useState } from "react";

const TableOfContents = ({ headings }) => {
  const [activeId, setActiveId] = useState('');
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0% 0% -80% 0%' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="table-of-contents-wrapper">
      <div className="toc-header">
        <h3>📚 Table of Contents</h3>
        <span className="toc-count">{headings.length} topics</span>
      </div>
      <ul className="toc-list-modern">
        {headings.map((h, index) => (
          <li key={h.id} className={`toc-item-modern ${activeId === h.id ? 'active' : ''}`}>
            <span className="toc-index-modern">{index + 1}</span>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default TableOfContents;