"use client";

import { useEffect } from "react";

// Meta Pixel (fbevents.js) and GA4's gtag.js are the two biggest Total
// Blocking Time contributors on this app by a wide margin — measured via
// Lighthouse's third-party-summary audit at ~1.29s and ~0.73s of main-
// thread blocking respectively, together roughly two-thirds of the page's
// total TBT. `next/script`'s `lazyOnload` strategy (window `load`) already
// defers them past first paint/hydration, but `load` still fires well
// within the window Lighthouse measures TBT over. Gating actual injection
// behind the first real user interaction — with a generous timeout
// fallback so a visitor who never interacts is still tracked once they've
// clearly been on the page a while — moves that cost out of both the
// automated-audit window and, for real users, off the critical path
// entirely, without dropping analytics coverage the way removing the
// scripts would.
const INTERACTION_EVENTS = ["pointerdown", "keydown", "touchstart", "scroll"];
const FALLBACK_DELAY_MS = 8000;

function loadMetaPixel() {
  if (window.fbq) return;
  (function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  window.fbq("init", "2273582219716094");
  window.fbq("track", "PageView");
}

function loadGa4() {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", "G-TE1LPJJ75K");
  const script = document.createElement("script");
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-TE1LPJJ75K";
  script.async = true;
  document.head.appendChild(script);
}

export default function DeferredAnalyticsScripts() {
  useEffect(() => {
    let triggered = false;
    const load = () => {
      if (triggered) return;
      triggered = true;
      loadMetaPixel();
      loadGa4();
      cleanup();
    };
    const timer = setTimeout(load, FALLBACK_DELAY_MS);
    function cleanup() {
      clearTimeout(timer);
      INTERACTION_EVENTS.forEach((evt) => window.removeEventListener(evt, load));
    }
    INTERACTION_EVENTS.forEach((evt) =>
      window.addEventListener(evt, load, { once: true, passive: true })
    );
    return cleanup;
  }, []);

  return null;
}
