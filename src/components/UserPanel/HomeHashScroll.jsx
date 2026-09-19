"use client";

import { useEffect } from "react";

// Ported from Home.jsx's useEffect(() => {...}, [location]) in the CRA app.
// react-router's useLocation() is gone under the App Router, and hash
// fragments never reach the server or next/navigation's hooks (they're
// query-string only), so this reads window.location.hash directly on
// mount — the scenario this exists for is an external/cross-page link to
// "/#upcoming-events" landing on a fresh page load.
export default function HomeHashScroll() {
  useEffect(() => {
    if (window.location.hash === "#upcoming-events") {
      const element = document.getElementById("upcoming-events");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return null;
}
