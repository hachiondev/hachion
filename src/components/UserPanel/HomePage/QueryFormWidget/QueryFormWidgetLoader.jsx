"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const QueryFormWidget = dynamic(() => import("./QueryFormWidget"), { ssr: false });

// Defers mounting the widget (and its code-split chunk) until the browser is
// idle, so it never competes with the page's own critical rendering work.
export default function QueryFormWidgetLoader() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(() => setShouldLoad(true), { timeout: 5000 });
      return () => cancelIdleCallback(id);
    }
    const timer = setTimeout(() => setShouldLoad(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) return null;
  return <QueryFormWidget />;
}
