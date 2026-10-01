import { Poppins } from "next/font/google";
import Script from "next/script";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { SITE_ORIGIN } from "@/lib/seo";
import DeferredAnalyticsScripts from "@/components/common/DeferredAnalyticsScripts";
import { API_BASE_URL } from "@/lib/apiBase";

// The CRA site loads Poppins (weights 300-700) from Google Fonts and every
// component CSS file ported from it already declares
// `font-family: 'Poppins', sans-serif` — but nothing here actually loaded
// the font, so every one of those rules was silently falling back to the
// browser's default sans-serif (Arial/Helvetica) sitewide.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// og:/twitter: fallback tags + google-site-verification, ported from CRA's
// public/index.html <head> — previously absent from this app entirely, so
// social-media crawlers (which don't execute JS and never see a page's own
// generateMetadata() override) had nothing to fall back to.
const SOCIAL_IMAGE = `${SITE_ORIGIN}/industry-recognized-it-certifications-social.jpg`;

export const metadata = {
  title: "Hachion Admin Panel",
  description: "Hachion administration dashboard for managing courses, students, jobs, and site content.",
  verification: {
    google: "dBOgAzEozfJineBPRfC5EDrqhdJbxrqUdTnNi5xcG4k",
  },
  openGraph: {
    type: "website",
    siteName: "Hachion",
    title: "Hachion: Your Learning Partner",
    description: "Transform your career with Hachion's Online IT Courses.",
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    site: "@hachionofficial",
    title: "Hachion: Your Learning Partner",
    description: "Transform your career with Hachion's Online IT Courses.",
    images: [SOCIAL_IMAGE],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      {/* The API origin (API_BASE_URL) is called from many components
          across every page (course data, reviews, geo lookups, etc.) —
          preconnecting lets the TLS/TCP handshake happen in parallel with
          the initial HTML instead of only starting once the first fetch
          call actually fires. */}
      <link rel="preconnect" href={API_BASE_URL} crossOrigin="anonymous" />
      <link rel="dns-prefetch" href={API_BASE_URL} />
      <body>
        {/* Meta Pixel + GA4 — ported from CRA's public/index.html, now
            loaded by DeferredAnalyticsScripts on first user interaction
            (with a timeout fallback) instead of next/script's `lazyOnload`
            (window `load`): Lighthouse's third-party-summary audit measured
            these two as the single largest Total Blocking Time contributors
            on this page (~1.29s and ~0.73s of main-thread blocking
            respectively, together roughly two-thirds of total TBT) — `load`
            still fires well inside the window TBT is measured over, while
            gating on interaction moves that cost off the critical path
            entirely for real users without dropping tracking coverage. The
            <noscript> fallback still fires for JS-disabled clients
            regardless of load timing. */}
        <DeferredAnalyticsScripts />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2273582219716094&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <main>{children}</main>
        {/* lazyOnload: this bundle is only needed for data-bs-toggle/-target
            driven components (almost entirely admin-panel dropdowns/modals,
            all click-triggered — by the time a user can click anything,
            lazyOnload's window-`load`-triggered fetch has long since
            finished). Public pages don't use Bootstrap's JS plugins at all
            (their interactivity is React-driven), so this is safe there too. */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="lazyOnload"
        />

        {/* IP/visitor-tracking webhook — ported verbatim from CRA's
            public/index.html. lazyOnload matches the original's own
            requestIdleCallback-gated, load-event-triggered deferral (this
            was never meant to compete with anything else for priority).
            The check-ip call intentionally hits production (api.hachion.co)
            regardless of which environment is running this app — matches
            CRA's own hardcoded choice, not this app's configurable
            API_BASE_URL. */}
        <Script id="visitor-tracking" strategy="lazyOnload">
          {`async function getUserDetails() {
            let shouldSkipTracking = false;
            try {
              const isDev = window.location.hostname === "localhost";
              const res = await fetch("https://api.hachion.co/api/check-ip", {
                method: "POST",
                headers: isDev ? { "X-Forwarded-For": "152.57.170.218" } : {}
              });
              if (res.status === 403) shouldSkipTracking = true;
            } catch (error) {
              console.error("IP check failed", error);
            }

            if (shouldSkipTracking) {
              return;
            }

            let ip = 'Unknown', country = 'Unknown', location = 'Unknown';
            try {
              const res = await fetch('https://ipinfo.io/json?token=82aafc3ab8d25b');
              const data = await res.json();
              country = data.country || 'Unknown';
              ip = data.ip || 'Unknown';
              location = (data.city || 'Unknown') + ', ' + (data.region || 'Unknown');
            } catch (err) {
              console.error("IP info failed", err);
            }

            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const isMobile = /Mobi|Android/i.test(navigator.userAgent);
            const deviceType = isMobile ? "Mobile" : "Desktop";
            const os = getOS();
            const pageUrl = window.location.href;
            const referrer = document.referrer || "Direct Visit";

            const payload = { ip, country, location, timezone, deviceType, os, pageUrl, referrer, timestamp: new Date().toISOString() };

            try {
              await fetch(
                'https://chat.googleapis.com/v1/spaces/AAQAHyjBBRU/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=qGzEPAwWY31czsPPpSugSpneD4pEqnWKEnPu-LTqFTA',
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ text: formatMessage(payload) })
                }
              );
            } catch (error) {
              console.warn("Google Chat webhook failed:", error);
            }
          }

          function getOS() {
            const ua = navigator.userAgent;
            if (ua.includes("Windows NT")) return "Windows";
            if (ua.includes("Mac OS X")) return "macOS";
            if (ua.includes("Linux")) return "Linux";
            if (/Android/.test(ua)) return "Android";
            if (/iPhone|iPad/.test(ua)) return "iOS";
            return "Unknown";
          }

          function formatMessage(data) {
            const dateObj = new Date(data.timestamp);
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, timeZone: data.timezone };
            const formattedDate = dateObj.toLocaleString('en-US', options);
            return "\\uD83C\\uDF10 New Visitor Info\\n\\nIP: " + data.ip + "\\nCountry: " + data.country + "\\nLocation: " + data.location + "\\nTimezone: " + data.timezone + "\\nDevice: " + data.deviceType + "\\nOS: " + data.os + "\\nVisited Page: " + data.pageUrl + "\\nReferral Source: " + data.referrer + "\\nVisited at: " + formattedDate;
          }

          window.addEventListener('load', () => {
            if ('requestIdleCallback' in window) {
              requestIdleCallback(() => getUserDetails(), { timeout: 5000 });
            } else {
              setTimeout(getUserDetails, 4000);
            }
          });`}
        </Script>

        {/* Web Vitals reporting — ported verbatim from CRA's
            public/index.html. Posts to a relative /analytics path exactly
            as CRA did; whatever server-side rewrite/proxy handles that path
            in production applies identically here. */}
        <Script src="https://unpkg.com/web-vitals@3" strategy="lazyOnload" />
        <Script id="web-vitals-report" strategy="lazyOnload">
          {`window.addEventListener("load", function () {
            if (window.webVitals) {
              window.webVitals.getCLS(sendToServer);
              window.webVitals.getFID(sendToServer);
              window.webVitals.getLCP(sendToServer);
              window.webVitals.getINP(sendToServer);
            }
          });

          function sendToServer(metric) {
            fetch('/analytics', {
              method: 'POST',
              body: JSON.stringify(metric),
              headers: { 'Content-Type': 'application/json' }
            }).catch(function (err) { console.warn("Analytics error:", err); });
          }`}
        </Script>
      </body>
    </html>
  );
}
