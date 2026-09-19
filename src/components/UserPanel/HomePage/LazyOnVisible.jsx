"use client";

import { useEffect, useRef, useState } from "react";

// Wraps one of the "use client" homepage sections (Trending, TeensEvents,
// TrainingEvents, RecentEntries, Learners — see LazyHomeSections.jsx) so it
// doesn't mount, and therefore doesn't fire its own TanStack Query fetch or
// commit its own render, until it's about to scroll into view. Previously
// all five mounted immediately after hydration regardless of scroll
// position: each one's fetch resolves at a slightly different time, and
// each resolution is its own React commit — measured via Lighthouse's
// long-tasks trace as five-plus separate ~150-300ms main-thread tasks
// stacked up in the first several seconds after load, a real contributor
// to TBT (and, since Lighthouse never scrolls, one the automated audit
// paid for in full despite the content being below the fold). Deferring
// the mount to first-intersection moves that cost to when a real visitor
// is actually about to see the section, and out of the initial-load
// measurement window entirely for anyone who doesn't scroll that far.
//
// The wrapping div keeps the same reserved `minHeight` the section's own
// `dynamic(..., { loading: skeleton(N) })` already used, so there's no
// additional CLS from this outer gate — same reserved box, just entered
// one render earlier.
export default function LazyOnVisible({ minHeight, children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible || !ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div ref={ref} style={{ minHeight, width: "100%" }}>
      {visible ? children : null}
    </div>
  );
}
