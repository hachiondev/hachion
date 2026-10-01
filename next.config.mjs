/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== "production";
// Gating CSP's allowance of a dev backend on NODE_ENV (isDev) doesn't work:
// `npm run build && npm start` is ALWAYS NODE_ENV=production, including
// when the app is deliberately pointed at a local/test backend for local
// testing - CSP would then block every fetch/axios call to it regardless
// of the API host being "correct", which is indistinguishable from the
// app just silently failing. api.hachion.co is still always allowed
// unconditionally below since other code (the visitor-tracking check-ip
// call in layout.js) is intentionally hardcoded to production regardless
// of which backend the rest of the app calls.
//
// The API host is a plain hardcoded literal here, matching every other
// call site in this codebase (no shared config module - see git history
// if that ever needs to change again) - keep this in sync by hand with
// the literal used throughout src/ if that value ever changes.
// https://api.hachion.co
//https://api.hachion.co

// Overridable at build time via NEXT_PUBLIC_API_BASE_URL (same variable as
// src/lib/apiBase.js) so a test/local build's CSP allows its own backend.
// Unset = production, exactly as before.
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.hachion.co").replace(/\/+$/, "");
if (!isDev) console.log(`[next.config] API origin for this build: ${API_BASE_URL}`);
const extraApiHost = /^https?:\/\/[^/]+/.exec(API_BASE_URL)?.[0];
// Parsed out for next/image's remotePatterns below - a plain string can't
// be compared against the protocol/hostname/port shape that config needs.
let extraApiHostUrl = null;
try {
  extraApiHostUrl = extraApiHost ? new URL(extraApiHost) : null;
} catch {
  extraApiHostUrl = null;
}

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // https://checkout.razorpay.com is Razorpay Checkout.js (loaded by
      // useDemoLivePayment for the course-details page's live-class
      // payment flow). https://www.paypal.com/https://www.paypalobjects.com
      // are PayPal's redirect-based checkout (non-India learners) - PayPal
      // itself is a full-page redirect, not an embedded script, but its
      // return/approval flow still touches paypalobjects.com assets.
      // connect.facebook.net (Meta Pixel), googletagmanager.com (GA4
      // gtag.js) and unpkg.com (web-vitals CDN) are the sitewide analytics
      // scripts ported into the root layout.js — previously absent from
      // this app entirely (found during the full-app audit). cdn.razorpay.com
      // is Razorpay Checkout.js's own risk-detection sub-script, loaded
      // internally once checkout.js runs — confirmed via an actual CSP
      // violation during enrollment-funnel testing, not assumed upfront.
      // https://www.google.com/recaptcha/ + https://www.gstatic.com/recaptcha/
      // are the enrollment popup's Google reCAPTCHA widget (EnrollmentForm.jsx,
      // react-google-recaptcha) - without these the widget's script is
      // CSP-blocked and silently fails to render, leaving only the
      // surrounding validation text visible (confirmed - this is why the
      // widget appeared "missing" even though the component was present).
      `script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://checkout.razorpay.com https://cdn.razorpay.com https://connect.facebook.net https://www.googletagmanager.com https://unpkg.com https://www.google.com https://www.gstatic.com${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      // https://i.pravatar.cc is Banner's AvatarCount placeholder learner
      // avatars. https://www.facebook.com is the Meta Pixel's <noscript>
      // fallback tracking pixel.
      // https://www.google.com is GA4's ads-audience remarketing pixel
      // (`/ads/ga-audiences`); https://*.google-analytics.com is its own
      // 1x1 image fallback path in some configurations.
      // https://i.ytimg.com serves YouTube video thumbnails (hqdefault.jpg)
      // used across CourseCurriculum/CourseBanner/VideoModal/WatchVideos/
      // InstructorProfile/EnquiryPage/UserEnrolledAssignment and blog cards
      // — confirmed via an actual CSP violation on /blogs (every video
      // thumbnail silently rendered blank), not assumed.
      // https://*.googleusercontent.com serves the Google account "picture"
      // URL the backend's OAuth2 success handler stores in the "avatar"
      // cookie (see SecurityConfig/UserController#getUserProfile) - that raw
      // Google URL is used directly as an <img>/Image src (NavbarTop,
      // UserProfile), so without this the avatar for a Google-signed-in user
      // was silently blocked by CSP after an otherwise successful login.
      `img-src 'self' data: https://i.pravatar.cc https://api.hachion.co https://www.facebook.com https://www.google.com https://*.google-analytics.com https://i.ytimg.com https://img.youtube.com https://*.googleusercontent.com${extraApiHost && extraApiHost !== "https://api.hachion.co" ? ` ${extraApiHost}` : ""}`,
      "font-src 'self' data:",
      // https://api.country.is is the public-site Topbar/Footer's geo lookup
      // (useTopBarApi) - needed regardless of which backend API_BASE_URL
      // points at. https://ipinfo.io and https://api.exchangerate-api.com
      // are the Trending/TeensEvents/LimitedDeals section's geo+currency
      // lookups (useGeoData -> geoService/currencyService). https://ipapi.co
      // is the standalone /enquiryform/[refName] landing page's own
      // location lookup (EnquiryPage.jsx) - a different geo service than the
      // ones above, found via an actual CSP violation during testing.
      // Razorpay/PayPal
      // entries are the course-details page's live-class payment flow
      // (useDemoLivePayment) - Razorpay's checkout.js calls its own API
      // domains directly; PayPal's create-order/capture-order calls go to
      // our own backend (already covered by api.hachion.co), only the
      // redirect destination itself needs allow-listing. www.facebook.com
      // (Meta Pixel beacon), chat.googleapis.com (the sitewide visitor-
      // tracking webhook) and api.hachion.co (that same script's IP/geo
      // check — intentionally hardcoded to production regardless of which
      // environment serves this app, matching CRA). GA4's gtag.js actually
      // fans its /g/collect beacon out across several possible Google
      // domains depending on consent/region (analytics.google.com itself,
      // not just subdomains of it — a wildcard *.analytics.google.com does
      // NOT match the bare domain; region-prefixed *.google-analytics.com,
      // doubleclick.net, and a plain google.com fallback) — confirmed by
      // the actual CSP violations Chrome reported in testing, not just the
      // two "obvious" hostnames. Note: GA4's ads-audience remarketing pixel
      // (`/ads/ga-audiences`) can load from a per-visitor-country Google TLD
      // (e.g. google.co.in) that isn't practical to allow-list exhaustively
      // — that one request is left CSP-blocked deliberately; it's a single
      // non-critical ads pixel that already degrades silently everywhere
      // (ad-blockers, Safari ITP, etc.), not core analytics.
      `connect-src 'self' https://api.country.is https://ipinfo.io https://ipapi.co https://api.exchangerate-api.com https://api.hachion.co https://api.razorpay.com https://lumberjack.razorpay.com https://www.facebook.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://*.g.doubleclick.net https://www.google.com${extraApiHost && extraApiHost !== "https://api.hachion.co" ? ` ${extraApiHost}` : ""}`,
      // Razorpay's Checkout.js opens its own payment UI in an iframe from
      // checkout.razorpay.com/api.razorpay.com; PayPal is a full top-level
      // redirect (not framed) but its approval page can load small
      // sub-frames from paypal.com. `blob:` is the Admin Panel's Generate
      // Certificate preview's fallback path (GenerateCertificate.jsx wraps
      // the PDF in a blob: object URL only when the backend doesn't return
      // a Certificate-Id header) - kept narrow, not the primary path. The
      // API host entries are the primary preview path: the iframe now
      // points directly at the backend's /certificate/downloadForView/{id}
      // (a different origin than this Next.js app, so 'self' doesn't cover
      // it) - confirmed via an actual CSP violation ("Refused to frame
      // 'https://api.hachion.co/...' because it violates ... frame-src")
      // that silently blocked the preview into an empty iframe with no
      // visible error to the admin.
      // https://www.google.com/recaptcha/ is where the reCAPTCHA checkbox
      // widget itself renders (an iframe, not inline content) - required
      // alongside the script-src entries above for the widget to work at
      // all, not just load its script.
      `frame-src 'self' https://checkout.razorpay.com https://api.razorpay.com https://www.paypal.com https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com https://api.hachion.co blob:${extraApiHost && extraApiHost !== "https://api.hachion.co" ? ` ${extraApiHost}` : ""}`,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig = {
  images: {
    // Enables next/image for the API's uploaded content (course/trainer
    // images, tool icons) if/when a component opts into it. Per-course and
    // per-trainer images stay plain <img> for now (arbitrary, uploaded
    // content with no guaranteed intrinsic size — see courseRouteUtils
    // migration notes), but this unblocks using next/image for them later
    // without a separate config change.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.hachion.co",
        pathname: "/**",
      },
      // Whichever host API_BASE_URL is actually pointed at (e.g. a local
      // https://api.hachion.co backend during local dev/testing) - without
      // this, next/image throws "Invalid src prop ... hostname is not
      // configured" for any image served from a non-production API host.
      ...(extraApiHostUrl && extraApiHostUrl.hostname !== "api.hachion.co"
        ? [
            {
              protocol: extraApiHostUrl.protocol.replace(":", ""),
              hostname: extraApiHostUrl.hostname,
              port: extraApiHostUrl.port || "",
              pathname: "/**",
            },
          ]
        : []),
    ],
  },
  experimental: {
    optimizePackageImports: [
      "@mui/material",
      "@mui/x-date-pickers",
      "@mui/material-nextjs",
      "react-icons",
    ],
    // Inlines the critical/above-the-fold CSS for each page directly into
    // its HTML <head> and loads the remainder non-render-blocking, instead
    // of every page waiting on every CSS chunk it references before first
    // paint.
    optimizeCss: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      // Static image/font assets under public/ aren't content-hashed like
      // _next/static (which Next.js already caches immutably by default),
      // so they get no long-lived cache header unless set explicitly here.
      {
        source: "/:all*(webp|avif|png|jpg|jpeg|svg|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
