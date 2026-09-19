"use client";

import dynamic from "next/dynamic";

// These 5 sections are all "use client" components that fetch their real
// content client-side via TanStack Query — server-rendering them produces
// only their own internal loading skeleton anyway (no meaningful content
// is available at SSR time), so `ssr: false` here loses nothing while
// removing their JS from the page's initial/critical bundle.
//
// Deliberately NOT applied to the Server Component sections (Association,
// Corporate, WhyChoose, LimitedDeals, MeetInstructorBanner,
// ShareKnowledgeBanner, HomeFaq): a prior attempt to next/dynamic() the
// Footer (also a case of wrapping *some* server-rendered content) hit a
// confirmed, reproducible React #418 hydration text-mismatch on this
// static-prerendered page (see app/(public)/layout.js) — ssr:false on an
// already-client-only component sidesteps that failure mode entirely,
// but doing the same for a Server Component isn't possible/safe.
//
// A fixed min-height on the loading placeholder keeps CLS at (or near)
// zero for the brief window before each chunk resolves and the
// component's own internal skeleton takes over.
const skeleton = (minHeight) =>
  function Skeleton() {
    return <div style={{ minHeight, width: "100%" }} aria-hidden="true" />;
  };

export const LazyTrending = dynamic(
  () => import("./TrendingSection/Trending"),
  { ssr: false, loading: skeleton(480) }
);

export const LazyTeensEvents = dynamic(
  () => import("./TeenSection/TeensEvents"),
  { ssr: false, loading: skeleton(480) }
);

export const LazyTrainingEvents = dynamic(
  () => import("./TrainingSection/TrainingEvents"),
  { ssr: false, loading: skeleton(540) }
);

export const LazyRecentEntries = dynamic(
  () => import("./TrendingBlogSection/RecentEntries"),
  { ssr: false, loading: skeleton(560) }
);

export const LazyLearners = dynamic(
  () => import("./LearnerSection/Learners"),
  { ssr: false, loading: skeleton(420) }
);

// Nested client islands inside otherwise-static Server Component sections
// (LimitedDeals, HomeFaq) — deferring just the interactive sub-widget
// keeps the surrounding server-rendered heading/copy/imagery untouched.
export const LazyDiscountCards = dynamic(
  () => import("./LimitedSection/components/DiscountCards"),
  { ssr: false, loading: skeleton(320) }
);

export const LazyHelpFaq = dynamic(() => import("../HelpFaq"), {
  ssr: false,
  loading: skeleton(220),
});
