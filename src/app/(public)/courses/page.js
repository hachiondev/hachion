import { Suspense } from "react";
import Link from "next/link";
import { buildCanonicalUrl, SITE_ORIGIN } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/breadcrumbSchema";
import JsonLd from "@/components/common/JsonLd";
import Course from "@/components/UserPanel/CoursePage/Course";
import { fetchCourseListingInitialData, getInitialCardsPerPage } from "@/components/UserPanel/CoursePage/courseListingData";
import { slugifyCourseText, buildCourseDetailsPath } from "@/components/UserPanel/CoursePage/courseRouteUtils";

const CANONICAL_URL = buildCanonicalUrl("/courses");
const TITLE = "Best Online IT Certification Courses & Programs | Hachion";
const DESCRIPTION =
  "Transform your career with Hachion's online IT courses! Enroll now, earn a certificate, get job assistance & try our FREE demo! Join today!";

// Ported from the CRA app's src/Components/UserPanel/CoursePage/Course.jsx
// (the /courses route in src/App.js). <Helmet>/<Canonical> -> generateMetadata().
export function generateMetadata() {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: CANONICAL_URL },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: "Hachion",
      url: CANONICAL_URL,
      title: TITLE,
      description: DESCRIPTION,
      images: [`${SITE_ORIGIN}/Hachion-logo.png`],
    },
    twitter: {
      card: "summary_large_image",
      site: "@hachionofficial",
      title: TITLE,
      description: DESCRIPTION,
      images: [`${SITE_ORIGIN}/Hachion-logo.png`],
    },
  };
}

const schema = buildBreadcrumbSchema([{ name: "Courses", path: "/courses" }]);

// Forces this route to render fresh per-request instead of once at build
// time. Previously statically prerendered (with the Course subtree behind
// <Suspense> because of useSearchParams()) — but that meant the *fallback*
// (effectively empty) was what got baked into the cached static HTML
// permanently; the real category/course content only ever appeared after
// client-side JS ran. Confirmed by temporarily swapping the fallback for a
// marker string and finding the marker, not real content, in the static
// output. force-dynamic makes Next actually resolve the Suspense boundary's
// real children on every request, so the HTML a crawler (or curl) receives
// has genuine content — this was the root cause of /courses having a 0.845
// CLS and ~0 discoverable course links in Screaming Frog. The underlying
// data fetches (fetchCourseListingInitialData) still have their own
// next:{revalidate:300} cache, so this doesn't hit the backend on every
// request — only the page's own HTML render is no longer statically cached.
export const dynamic = "force-dynamic";

// Visually-hidden (not a design change — see the same technique already
// used for this page's own <h1> in Course.jsx) but present in the
// server-rendered HTML: a plain <a href> to every category and every
// course. SidebarRight only ever mounts `cardsPerPage` (~9) cards into the
// DOM at a time — the rest exist purely as client-side pagination state —
// so a crawler that doesn't run JS previously saw links to only a handful
// of the ~122 real course URLs. This block is the single source of truth
// for "every course is reachable from crawlable HTML starting at /courses"
// and is completely independent of SidebarRight's pagination/filtering,
// which is untouched.
function AllCoursesCrawlLinks({ categories, courses }) {
  const categoryLinks = (categories || [])
    .map((item) => item?.name || item?.category_name || item?.category || "")
    .filter(Boolean)
    .map((name) => ({ name, slug: slugifyCourseText(name) }))
    .filter((c) => c.slug);

  const courseLinks = (courses || [])
    .filter((course) => course?.courseCategory && course?.courseName)
    .map((course) => ({
      name: course.courseName,
      href: buildCourseDetailsPath(course.courseCategory, course.courseName),
    }))
    .filter((c) => c.href && c.href !== "/courses");

  if (categoryLinks.length === 0 && courseLinks.length === 0) return null;

  return (
    <nav
      aria-hidden="true"
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        border: 0,
      }}
    >
      {categoryLinks.map((cat) => (
        <Link key={`cat-${cat.slug}`} href={`/courses/${cat.slug}`} prefetch={false}>
          {cat.name}
        </Link>
      ))}
      {courseLinks.map((course, i) => (
        <Link key={`course-${course.href}-${i}`} href={course.href} prefetch={false}>
          {course.name}
        </Link>
      ))}
    </nav>
  );
}

export default async function CoursesPage() {
  const [{ categories, courses, discountRules }, initialCardsPerPage] = await Promise.all([
    fetchCourseListingInitialData(),
    getInitialCardsPerPage(),
  ]);
  return (
    <>
      <JsonLd data={schema} />
      <AllCoursesCrawlLinks categories={categories} courses={courses} />
      {/* useSearchParams() inside Course requires a Suspense boundary so the
          route can still be statically prerendered. */}
      <Suspense fallback={null}>
        <Course
          initialCategories={categories}
          initialCourses={courses}
          initialDiscountRules={discountRules}
          initialCardsPerPage={initialCardsPerPage}
        />
      </Suspense>
    </>
  );
}
